# Interactive Edu

A curriculum-based learning platform designed to help learners study official syllabuses across countries and education levels.

## Planned capabilities

- Country-specific curriculum selection
- Official syllabus sources, version history, and update checks
- Lessons and learning objectives
- Quizzes, progress tracking, and learning streaks
- AI-assisted tutoring
- Career pathways
- A separate educational video library

## Current backend

- Node.js built-in HTTP server
- SQLite database
- Python standard-library `sqlite3` access (avoids native Node SQLite packages on Termux)

## Development status

The backend foundation and initial syllabus database tables are being built. Automatic syllabus checks must verify changes against trusted official sources; detected changes should be reviewed before publishing. This project must not claim a syllabus is current unless its source and version have been verified.

## Local development

The current development setup uses Termux on Android. Keep local databases, credentials, environment files, and generated data out of Git.
