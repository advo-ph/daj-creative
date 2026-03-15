# Setup

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 10+

## Quick Start

```bash
# 1. Clone and install
cd dajcreatives
npm install --legacy-peer-deps

# 2. Create the database
createdb dajcreative

# 3. Configure environment
cp apps/api/.env.example apps/api/.env
# Edit .env — at minimum set JWT_SECRET to a real random string

# 4. Run migrations
npm -w @dajcreative/api run migrate

# 5. Seed initial data (categories, products, materials, portfolio)
# NOTE: update the password hash in seed.sql first!
# Generate one with: node -e "require('bcryptjs').hash('yourpassword', 10).then(console.log)"
npm -w @dajcreative/api run seed

# 6. Start dev servers
npm run dev:web    # Frontend → http://localhost:5173
npm run dev:api    # API      → http://localhost:3001
```

## Project Structure

```
dajcreatives/
├── CLAUDE.md                    ← Claude Code agent instructions
├── GEMINI.md                    ← Gemini agent instructions
├── package.json                 ← npm workspace root
├── docs/                        ← project documentation
├── .claude/commands/            ← Claude Code slash commands
├── apps/
│   ├── web/                     ← React 19 + Vite + Tailwind CSS v4
│   │   ├── src/
│   │   │   ├── components/      ← Nav, Hero, Pillars, Editorial, etc.
│   │   │   ├── hooks/           ← useScrollReveal, useCursor
│   │   │   ├── index.css        ← full design system (one file)
│   │   │   ├── App.jsx          ← component composition
│   │   │   └── main.jsx         ← entry point
│   │   ├── index.html
│   │   └── vite.config.js
│   └── api/                     ← Express 5 + TypeScript + pg
│       ├── migrations/          ← sequential SQL files
│       ├── src/
│       │   ├── db/              ← DAL modules (one per entity)
│       │   ├── routes/          ← API route handlers
│       │   ├── utils/           ← db, env, migrate, validate
│       │   ├── middleware/      ← JWT auth
│       │   └── index.ts         ← Express app entry
│       ├── seed.sql             ← initial data
│       └── .env.example
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start frontend dev server (:5173) |
| `npm run dev:api` | Start API dev server with hot reload (:3001) |
| `npm run build:web` | Production build frontend |
| `npm run build:api` | TypeScript compile API |
| `npm -w @dajcreative/api run migrate` | Run pending migrations |
| `npm -w @dajcreative/api run seed` | Seed database with initial data |
