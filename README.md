# ShuleLoop

School management system for Kenyan secondary schools, built around the real 8-4-4 / KCSE structure. Multi-tenant SaaS — each school gets its own account; Digistar Tech operates a platform admin console to approve and manage onboarded schools.

Built by [Digistar Tech](https://github.com/bennah995), piloted with Maono School.

## Features

- **Attendance** — mark present/absent per class/date, notify parents on absence
- **KCSE Grading** — real subject structure (5 compulsory + Physics + 2 humanities + 1 technical), auto-computed grades and points on the standard A–E scale
- **Report Cards** — individual and bulk-class PDF generation, with teacher + principal comments and class ranking
- **Awards** — top 3 overall and top scorer per subject, per class, downloadable as PDF
- **Admissions** — sequential admission numbers, continuing from a school's existing numbering
- **Student Management** — add students, promote a class forward, graduate Form 4 leavers
- **Staff Management** — add teacher accounts with one-time temp passwords, activate/deactivate
- **Terms** — one active term per school, set by the principal
- **Platform Admin Console** — Digistar-internal area to review school signups, approve/reject, suspend/reactivate, view platform-wide stats

## Tech stack

- Next.js 16 (App Router, JavaScript)
- PostgreSQL
- Tailwind CSS
- `pdfkit` for PDF generation
- JWT (`jose` in middleware, `jsonwebtoken` in routes) for auth, `bcrypt` for password hashing

## Local setup

```bash
npm install
```

Create `.env.local`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/shuleloop_dev
JWT_SECRET=<random 32-byte hex string>
```

Run all migrations in `db/` against your database (in the order they were added — see commit history), then seed base data:
```bash
node db/seed.js
node db/seed-subjects.js
node db/seed-terms.js
node db/seed-platform-admin.js   # edit the email/password inside first
```

```bash
npm run dev
```

## Roles

- **Platform Admin** (`/admin/login`) — Digistar Tech only, manages schools
- **Principal** (`/login`) — full access to their school
- **Teacher** (`/login`) — attendance, grading, comments for their classes

## Deployment

Hosted on Vercel, database on Neon. Environment variables (`DATABASE_URL`, `JWT_SECRET`) are set in the Vercel project dashboard.