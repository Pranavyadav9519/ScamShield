# ScamShield

An AI-powered fraud detection and scam protection application built with Next.js, Prisma, and Google Gemini.

## Features

- **Verify Now** — Paste any suspicious message, URL, or phone number and get an instant AI risk score with detailed analysis
- **Caller Lookup** — Check if a phone number is a known scammer using AI + community reports
- **Evidence Vault** — Securely store and manage evidence of scam attempts
- **Panic Mode** — Set up trusted contacts to alert in emergency situations
- **Dashboard** — Overview of your protection activity and recent scans

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite via Prisma ORM
- **AI**: Google Gemini 1.5 Flash API
- **Auth**: JWT-based authentication with bcrypt password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup

1. Clone the repo and install dependencies
   ```bash
   git clone https://github.com/Pranavyadav9519/ScamShield.git
   cd ScamShield
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values.

3. Setup the database
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the dev server
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ScamShield/
├── app/
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Login & register
│   │   ├── evaluate-risk/ # AI risk analysis (Gemini)
│   │   ├── evidence/      # Evidence CRUD
│   │   ├── caller-lookup/ # Phone number lookup
│   │   ├── contacts/      # Trusted contacts
│   │   └── dashboard/     # Stats aggregation
│   └── (dashboard)/       # Protected frontend pages
├── components/            # Reusable UI components
├── context/               # React context providers
├── lib/                   # Utilities (prisma, gemini, auth)
└── prisma/                # Database schema
```
