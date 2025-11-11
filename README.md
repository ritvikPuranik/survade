# Survade

AI-powered gamified survey experience platform with mobile-first design and notebook-style page flipping animations.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations (notebook page flips)
- **React Router** for navigation

### Backend
- **Express.js** with TypeScript
- **Supabase** for database (PostgreSQL) and authentication
- **Google Gemini API** for AI-powered UX generation

### Deployment
- **Vercel** (monorepo deployment)

## Features

- **Google SSO** authentication via Supabase Auth
- **2 free surveys per account** with quota tracking
- **AI-powered survey creation**:
  - Define survey objective, theme/tone, and questions
  - AI analyzes and generates optimized UX
  - Preview and edit generated surveys
- **Gamified filling experience**:
  - Notebook-style page flip animations
  - Theme-based personalization
  - Immediate response feedback
- **Public sharing** via shareable links and QR codes
- **Response tracking** with CSV export
- **Mobile-first UI** with responsive design

## Project Structure

```
survade/
├── packages/
│   ├── frontend/          # React + Vite application
│   └── backend/           # Express API server
├── package.json           # Workspace root
├── tsconfig.json         # Base TypeScript config
└── vercel.json           # Vercel deployment config
```

## Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Cloud account (for Gemini API)

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - Google Gemini API key
- `VITE_SUPABASE_URL` - Frontend Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Frontend Supabase key

### Installation

```bash
# Install dependencies
npm install

# Start development servers (frontend + backend)
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

### Build

```bash
# Build all packages
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

## Development

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## Deployment

This project is configured for Vercel deployment. Connect your GitHub repository to Vercel, and it will automatically deploy on push to main.

## License

MIT
