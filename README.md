# Remp Frontend

A real estate media delivery platform frontend built with React + TypeScript. Photography companies manage property listings and media assets; real estate agents curate and showcase media to buyer clients.

---

## Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Framework     | React 19 + TypeScript (Vite) |
| Routing       | React Router v6              |
| UI Components | shadcn/ui                    |
| Styling       | Tailwind CSS v4              |
| Server State  | TanStack Query (React Query) |
| Client State  | Zustand                      |
| HTTP Client   | Axios                        |
| Forms         | React Hook Form + Zod        |

---

## Prerequisites

- Node.js 20+
- npm 10+
- Remp backend running at `http://localhost:5096`

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/remp-frontend.git
cd remp-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:5096
```

---

## Project Structure

```
src/
├── api/                  # Axios service functions per resource
│   ├── auth.api.ts
│   ├── listings.api.ts
│   ├── media.api.ts
│   ├── agents.api.ts
│   ├── users.api.ts
│   ├── selection.api.ts
│   └── publish.api.ts
│
├── components/           # Shared UI components
│   ├── layout/           # RootLayout, Sidebar, Topbar
│   ├── guards/           # ProtectedRoute, RoleGuard
│   └── ui/               # shadcn/ui re-exports
│
├── features/             # Feature-scoped components and hooks
│   ├── auth/
│   ├── listings/
│   ├── media/
│   ├── agents/
│   ├── selection/
│   └── publish/
│
├── hooks/                # Shared custom hooks
├── lib/                  # Axios instance, TanStack Query client
├── pages/                # Route-level page components
├── store/                # Zustand stores (auth)
├── types/                # TypeScript interfaces and enums
└── utils/                # Formatters, enum label maps, helpers
```

---

## User Roles

| Role  | Value                | Access                                                                |
| ----- | -------------------- | --------------------------------------------------------------------- |
| Admin | `PhotographyCompany` | Full access — listings, media, agents, status management              |
| Agent | `Agent`              | Assigned listings only — media browsing, selection, contacts, preview |

Role is returned from `POST /auth/login` and stored in Zustand. `<RoleGuard>` wraps Admin-only routes.

---

## Pages

| Page             | Route                     | Role          |
| ---------------- | ------------------------- | ------------- |
| Login            | `/login`                  | Public        |
| Dashboard        | `/dashboard`              | Admin + Agent |
| Create Listing   | `/listings/new`           | Admin         |
| Listing Detail   | `/listings/:id`           | Admin + Agent |
| Edit Listing     | `/listings/:id/edit`      | Admin         |
| Media Gallery    | `/listings/:id/media`     | Admin + Agent |
| Agent Selection  | `/listings/:id/selection` | Agent         |
| Preview          | `/listings/:id/preview`   | Admin + Agent |
| Agent Management | `/agents`                 | Admin         |
| Profile          | `/profile`                | Admin + Agent |

---

## Authentication

JWT token returned from the login endpoint is stored in Zustand and persisted to `sessionStorage`. The Axios instance attaches it automatically via a request interceptor. A 401 response triggers a logout and redirect to `/login`.

> **Note:** Do not store the token in `localStorage`. Use `sessionStorage` or an in-memory store only.

---

## Build Phases

The project is structured across 12 incremental phases:

| Phase | Scope                                                                    |
| ----- | ------------------------------------------------------------------------ |
| 1     | Project setup — Vite, Tailwind, shadcn/ui, routing shell, Axios, Zustand |
| 2     | Types and API service layer                                              |
| 3     | Auth — login, logout, JWT handling                                       |
| 4     | Dashboard — listing list, filters, pagination                            |
| 5     | Create and edit listing forms                                            |
| 6     | Listing detail page — tabs, status transitions, agent assignment         |
| 7     | Media management — upload, gallery, cover image, download                |
| 8     | Agent selection — media picking (max 10), contacts                       |
| 9     | Preview and publish — showcase page, shareable URL                       |
| 10    | Agent management                                                         |
| 11    | Profile and password change                                              |
| 12    | Polish — skeletons, toasts, error boundaries, empty states               |

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking
```

---

## Backend

This frontend connects to the [Remp Backend](https://github.com/your-org/remp-backend) — an ASP.NET Core 8 REST API.

Base URL: `http://localhost:5096`

Ensure CORS is configured in `Program.cs` to allow `http://localhost:5173` during development.

---

## Contributing

This project follows a branch-per-phase Git strategy.

```bash
# Branch naming
git checkout -b phase/1-project-setup
git checkout -b phase/3-auth
git checkout -b feat/listing-status-badge

# Commit style (Conventional Commits)
feat: add listing status filter tabs
fix: correct JWT expiry redirect logic
chore: configure tailwind and shadcn
```

Pull requests should target `main` and include a short description of what was built and any manual testing steps.
