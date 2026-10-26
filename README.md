# Gyamfi Learning Hub

A curriculum-aware learning platform designed to help learners explore subjects, study consistently, prepare for exams, and discover career pathways.

Repository: https://github.com/gyamfiphilemon816-netizen/interactive-edu

## Stack

- HTML5, CSS3, and vanilla JavaScript for the responsive web interface
- Node.js for local development and server-side API routes
- Vercel for hosting the static interface and serverless API
- SQLite for local development data; use a hosted database for a multi-user production deployment
- GitHub as the source of truth

## Current implementation

- Responsive learning dashboard for mobile and desktop
- Country curriculum selector with transparent messaging when curriculum content has not yet been verified
- Subject discovery cards for Chemistry, Biology, and Core Mathematics
- Local-device study-minute tracking, daily goal, lesson selection, and weekly activity streak display
- Navigation entry points for subjects, educational videos, AI study buddy, and career pathways
- Node.js health endpoint at `/api/health`
- Local Node.js development server in `server.js`
- Basic security response headers configured in `vercel.json`

**Progress data is currently stored in the browser on that device.** It is not yet synced between devices or accounts. The course cards are starter interface content, not a complete or officially verified syllabus.

## Education roadmap

- Primary 1–6, JHS, SHS, and university-level learning
- Start with Ghana and WASSCE preparation, then expand country by country
- Link each syllabus to an authoritative education authority and its official source
- Record source URLs, checked dates, content versions, and review status
- Review syllabus changes before publishing them to learners
- Add accounts, persistent progress, assessments, and a hosted database
- Add an AI tutor through a server-side provider integration; never expose secret API keys in browser code
- Build a separate educational video library
- Add career pathways that remain independent of the selected curriculum country

## Run locally in Termux

Install Node.js if needed, then from the repository directory:

```sh
node server.js
```

Open `http://localhost:3000` in the browser. The API health endpoint is `http://localhost:3000/api/health`.

Check JavaScript syntax:

```sh
npm run check
```

## Important deployment notes

- Vercel serves `index.html`, `styles.css`, and `app.js` as static assets and runs `api/health.js` as a Node.js function.
- The standalone `server.js` is for local development; Vercel uses the function in `api/`.
- SQLite files and local databases are not a suitable shared database for serverless production. Move multi-user data to a managed database before launch.
- Do not commit credentials, tokens, local database files, or private learner data.
- Never describe placeholder lessons as official syllabus content. Each published syllabus needs a verifiable source and review status.

## Status

The initial dashboard and health endpoint have been committed. Accounts, hosted persistence, real syllabus ingestion/review, quizzes, AI provider integration, and production monitoring remain future implementation steps.
