# Research Group Application Form

The site is published with GitHub Pages, so it cannot write directly to a private Google Drive folder. The application form runs as a Google Apps Script web app. The Join the Group button opens the form directly in a new tab; no form popup is used on the website.

## Form behavior

- Collects name, email, applicant level, research interests, an optional message, and a required PDF CV.
- Accepts PDF CVs up to 10 MB and checks the file signature.
- Saves the CV and a plain-text copy of the application details in the Drive folder configured in `Code.gs`.
- Keeps the folder private according to its existing Drive permissions. The public form does not expose Drive links.
- Uses a hidden honeypot and limits repeated submissions from the same email address for one hour.

## Deploy from your Google account

1. Open [script.google.com](https://script.google.com/) and create a new standalone Apps Script project.
2. Replace the default `Code.gs` with `apps-script/Code.gs` from this repository.
3. Add an HTML file named `Index` and paste in `apps-script/Index.html`.
4. Save, then select **Deploy → New deployment → Web app**.
5. Set **Execute as** to **Me** so Drive writes happen under your account. For public visitors, set access to **Anyone** if your account permits it. Google Workspace administrators can restrict this option.
6. Deploy and accept the requested Drive authorization. Copy the deployed URL ending in `/exec`.
7. In `js/application-config.js`, replace `PASTE_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL. The Join the Group button will then open the Drive-backed form directly. Commit and push the website changes to GitHub Pages.

The Join the Group button remains unavailable until the deployed `/exec` URL is added to the config file. The Drive folder ID is already configured in `Code.gs` as `1xlaI5ICyCLlBBIHUFYmsGwFWry1rmL6D`.
