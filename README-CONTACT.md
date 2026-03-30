Contact form serverless setup (Vercel)

This project includes a serverless function at `api/contact.js` that sends form submissions as email using SMTP (nodemailer).

How it works
- The front-end form (in `index.html`) POSTs JSON to `/api/contact`.
- The serverless function validates the fields and uses nodemailer to send an email to the address you configure.

Environment variables (set these in Vercel or your hosting provider):
- SMTP_HOST (e.g., smtp.sendgrid.net or smtp.gmail.com)
- SMTP_PORT (usually 587 for TLS or 465 for SSL)
- SMTP_USER (SMTP username or API key user)
- SMTP_PASS (SMTP password or API key)
- CONTACT_TO_EMAIL (the recipient address that will receive messages)

Deploy to Vercel (recommended):
1. Install Vercel CLI: `npm i -g vercel` (optional but handy).
2. From the project root run: `vercel` and follow the prompts to deploy.
3. In the Vercel dashboard, open your project settings and add the environment variables above.

If you prefer Netlify:
- You can move `api/contact.js` into `netlify/functions/contact.js` and adapt the handler to Netlify's function format, or use a small Express endpoint hosted elsewhere.

Notes & security
- Use an API key provider like SendGrid for better deliverability (set SMTP_USER to `apikey` and SMTP_PASS to the SendGrid API key).
- Consider adding reCAPTCHA to the form to reduce spam.
- The serverless function includes basic validation. For production, add rate-limiting and logging.

Local testing
- Install dependencies: `npm install` (nodemailer is now listed in package.json).
- You can run Vercel dev: `vercel dev` to test the `/api/contact` endpoint locally (requires Vercel CLI).

Local SMTP test
- Set env vars in PowerShell and run the included SMTP test script to verify credentials:

```powershell
$env:SMTP_HOST="smtp.sendgrid.net";
$env:SMTP_PORT="587";
$env:SMTP_USER="apikey";
$env:SMTP_PASS="<your_sendgrid_api_key>";
$env:CONTACT_TO_EMAIL="you@example.com";
node test-smtp.js
```

If the script prints a message id, your SMTP credentials are valid. If it errors, check the printed error for details. You can also enable DEBUG_CONTACT=true in environment variables to see server function errors.

If you want, I can scaffold a Netlify-compatible function or implement SendGrid-specific code that uses the SendGrid API directly. Tell me which provider you prefer and I can adjust the handler accordingly.
