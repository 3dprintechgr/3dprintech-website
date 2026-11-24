# 3D Printech — Cloudflare Pages

Bilingual (Greek/English) responsive portfolio and custom 3D-print request site.

## Included
- Dark / Tech landing page
- Portfolio showcase (illustrative CSS artwork to be replaced with real product photos)
- Greek / English language toggle
- Custom order form with STL, 3MF, OBJ, STEP, image and PDF attachments (8 MB combined cap)
- General contact form
- Cloudflare Pages Function at `/api/submit` sends submissions and attachments through Resend

## Deploy to Cloudflare Pages (Free)
1. Create a free Cloudflare account.
2. Upload this folder to a GitHub repository (or use Wrangler Direct Upload; Git integration is easiest for Functions).
3. In Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
4. Select the repository. Framework preset: **None**. Build command: leave empty. Build output directory: `/` (the repository root). Deploy.
5. In the Pages project → Settings → Variables and Secrets, add:
   - `RESEND_API_KEY` (secret): API key from Resend.
   - `ORDER_TO_EMAIL`: email address that receives enquiries.
   - `FROM_EMAIL`: a sender address verified in Resend, e.g. `3D Printech <orders@yourdomain.gr>`.
6. Redeploy after adding variables.

## Email setup
The forms are not fake/demo forms: the Pages Function sends submissions to Resend. To activate them you must create a Resend account, verify a sender domain/address as required by Resend, and add the three environment variables above. The website hosting remains on Cloudflare Pages Free; Resend has its own free-tier limits and policies, which may change.

## Connect your existing domain
- Pages project → Custom domains → Set up a domain → enter `3dprintech.gr` and follow Cloudflare's instructions.
- For an apex/root domain (`3dprintech.gr`), Cloudflare requires the domain to be added as a Cloudflare zone and its authoritative nameservers changed to Cloudflare.
- Before changing nameservers, copy/check all existing DNS records, especially MX, SPF, DKIM and DMARC if you use email on this domain. Recreate/confirm them in Cloudflare DNS before switching to avoid interrupting email.
- Add `www.3dprintech.gr` as a second custom domain if desired; set a redirect from www to the root (or vice versa).
- If you do not want to change nameservers, use a subdomain such as `www.3dprintech.gr` with a CNAME to your `project.pages.dev` hostname, after adding it under Pages → Custom domains. The root/apex domain cannot be connected this way unless it is a Cloudflare zone.

## Before launch
- Replace illustrative portfolio artwork with photos of your actual prints.
- Receiving email configured in the instructions: `3dprintech.gr@gmail.com`.
- Verify `3dprintech.gr` in Resend (or use another sender domain you control) before setting `FROM_EMAIL`; do not use the Gmail address as the sender unless Resend explicitly verifies it.
- Add your privacy policy and business contact details before collecting customer information. The current consent text is a placeholder, not legal advice.
- Test the forms and attachments after deployment.
