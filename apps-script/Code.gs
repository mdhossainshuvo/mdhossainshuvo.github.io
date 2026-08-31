const APPLICATION_FOLDER_ID = '1xlaI5ICyCLlBBIHUFYmsGwFWry1rmL6D';
const MAX_CV_SIZE_BYTES = 10 * 1024 * 1024;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Research Group Application')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitApplication(form) {
  // A filled honeypot field is likely a bot. Return a normal success response without saving.
  if (String(form.website || '').trim()) return { success: true };

  const name = requiredText_(form.fullName, 'Please enter your name.', 120);
  const email = requiredText_(form.email, 'Please enter your email address.', 254);
  const level = requiredText_(form.level, 'Please select your current or intended level.', 80);
  const interests = requiredText_(form.interests, 'Please describe your research interests.', 1200);
  const message = String(form.message || '').trim().slice(0, 4000);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const cv = form.cv;
  if (!cv || typeof cv.getBytes !== 'function') {
    throw new Error('Please attach your CV as a PDF.');
  }
  const originalName = String(cv.getName() || 'cv.pdf');
  const contentType = String(cv.getContentType() || '').toLowerCase();
  if (!/\.pdf$/i.test(originalName) || (contentType && contentType !== 'application/pdf' && contentType !== 'application/octet-stream')) {
    throw new Error('Please upload a PDF file.');
  }
  const bytes = cv.getBytes();
  if (!bytes.length || bytes.length > MAX_CV_SIZE_BYTES) {
    throw new Error('Your PDF must be smaller than 10 MB.');
  }
  if (bytes.length < 4 || bytes[0] !== 37 || bytes[1] !== 80 || bytes[2] !== 68 || bytes[3] !== 70) {
    throw new Error('The uploaded file does not appear to be a valid PDF.');
  }

  const emailKey = 'application:' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase())
  );
  const submissionCache = CacheService.getScriptCache();
  if (submissionCache.get(emailKey)) {
    throw new Error('An application from this email was received recently. Please try again later if needed.');
  }
  const folder = DriveApp.getFolderById(APPLICATION_FOLDER_ID);
  const submittedAt = new Date();
  const stamp = Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const safeName = name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'Applicant';
  const baseName = stamp + '_' + safeName;
  const savedCv = folder.createFile(cv.copyBlob().setName(baseName + '_CV.pdf'));
  const details = [
    'Research Group Application',
    'Submitted: ' + submittedAt.toISOString(),
    'Name: ' + name,
    'Email: ' + email,
    'Level: ' + level,
    'Research interests: ' + interests,
    'Message: ' + (message || '(not provided)'),
    'CV file: ' + savedCv.getName()
  ].join('\n');
  folder.createFile(baseName + '_Application.txt', details, MimeType.PLAIN_TEXT);
  submissionCache.put(emailKey, 'submitted', 3600);

  return { success: true, message: 'Thank you. Your application has been submitted.' };
}

function requiredText_(value, errorMessage, maxLength) {
  const text = String(value || '').trim();
  if (!text) throw new Error(errorMessage);
  if (text.length > maxLength) throw new Error('One of the fields is longer than allowed.');
  return text;
}
