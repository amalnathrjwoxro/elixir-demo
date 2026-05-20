# Elixir Anfield – Premium 3 BHK Flats in Thrissur

This is the official website for Elixir Anfield, a premium residential project in Thrissur.

## Deployment

The site is deployed on Vercel and automatically updates whenever changes are pushed to the main branch.

**Live Site:** [Your Vercel URL will be here after deployment]

The contact form sends email through the Vercel serverless endpoint at `/api/send`.
Set `BREVO_API_KEY` in the Vercel project environment variables before deploying.

## Development

To run locally:
1. Install the server dependency from the project root: `npm install`
2. Add `BREVO_API_KEY` to `server/.env`
3. Start the local email server from `server/`: `node server.js`
4. Open `index.html` in your browser

## Project Structure

- `index.html` - Main website file
- `api/send.js` - Vercel serverless email endpoint
- `vercel.json` - Vercel deployment configuration
