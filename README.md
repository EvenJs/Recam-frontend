# Remp — Real Estate Media Delivery Platform

Remp is a streamlined platform that enables real estate agents to efficiently showcase and share off-market properties through professionally packaged media assets.

Photography companies upload and manage property media (photos, floor plans, videos, VR tours). Real estate agents then curate the best assets, add contact information, and publish a shareable buyer-facing preview page — all without public listings.

---

## How it works

```
Photography Company (Admin)
  → Creates property listing
  → Uploads media assets
  → Assigns agent to listing
  → Updates listing status

Real Estate Agent
  → Views assigned listings
  → Selects display photos (max 10)
  → Sets hero/cover image
  → Adds agent contact info
  → Publishes shareable buyer link

Buyer
  → Opens shared link (no login required)
  → Views property showcase page
```

---

## Tech Stack

| Layer                 | Technology                               |
| --------------------- | ---------------------------------------- |
| Framework             | React 19 + TypeScript (Vite)             |
| Routing               | React Router v6                          |
| UI Components         | shadcn/ui (Nova - Lucide / Geist preset) |
| Styling               | Tailwind CSS v4                          |
| Server State          | TanStack Query (React Query)             |
| Client State          | Zustand (persisted to sessionStorage)    |
| HTTP Client           | Axios                                    |
| Forms                 | React Hook Form + Zod                    |
| Testing — Unit        | Vitest + React Testing Library           |
| Testing — Integration | Vitest + MSW (Mock Service Worker)       |
| Testing — E2E         | Playwright                               |

---

## Prerequisites

- Node.js 20+
- npm 10+
- Remp backend (ASP.NET Core 8) running at `http://localhost:5096`

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-org/remp-frontend.git
cd remp-frontend

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Backend required:** The frontend connects to the Remp backend API. Make sure the backend is running at `http://localhost:5096` before starting the frontend. CORS must be configured in the backend `Program.cs` to allow `http://localhost:5173`.

---

## Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:5096
```

---

## Default Credentials

| Role                        | Email                  | Password                  |
| --------------------------- | ---------------------- | ------------------------- |
| Admin (Photography Company) | `admin@remp.com`       | `Admin@123!`              |
| Agent                       | Created via Staff page | Sent by email on creation |

---

## Project Structure

```
src/
├── api/                      # Axios service functions per resource
│   ├── auth.api.ts
│   ├── listings.api.ts
│   ├── media.api.ts
│   ├── agents.api.ts
│   ├── users.api.ts
│   ├── selection.api.ts
│   └── publish.api.ts
│
├── components/
│   ├── common/               # EmptyState, ErrorState, ErrorBoundary
│   ├── guards/               # ProtectedRoute, RoleGuard
│   ├── layout/               # AdminLayout, AgentLayout
│   └── ui/                   # shadcn/ui components (do not edit)
│
├── features/                 # Feature-scoped components and hooks
│   ├── auth/                 # ChangePasswordForm
│   ├── listings/             # ListingCard, ListingForm, StatusBadge
│   │                         # AdminDashboard, AgentDashboard
│   ├── media/                # MediaCard, MediaGallery, MediaUploader
│   ├── agents/               # CreateAgentDialog, useAgents
│   ├── selection/            # SelectionGrid, ContactForm, ContactList
│   │                         # ContactCard, AgentContactsSection
│   └── publish/              # CoverImageSelector, PhotoSelector
│                             # PropertyDetailsModal, PropertyDescription
│                             # AgentContactForm
│
├── hooks/                    # useAuth, useDebounce
├── lib/                      # axios.ts, queryClient.ts, utils.ts
├── pages/                    # Route-level page components
├── store/                    # authStore.ts (Zustand)
├── types/                    # enums.ts, models.ts, dto.ts, api.ts
├── utils/                    # enumMaps.ts
└── test/                     # All tests
    ├── e2e/                  # Playwright E2E tests
    │   ├── helpers/
    │   ├── auth.spec.ts
    │   ├── admin.spec.ts
    │   ├── listing-detail.spec.ts
    │   ├── preview.spec.ts
    │   └── profile.spec.ts
    ├── mocks/                # MSW handlers and server
    ├── setup.ts
    ├── authStore.test.ts
    ├── enumMaps.test.ts
    ├── listingSchema.test.ts
    ├── StatusBadge.test.tsx
    ├── ListingCard.test.tsx
    ├── useAuth.test.tsx
    ├── useListings.test.tsx
    ├── auth.api.test.ts
    ├── listings.api.test.ts
    └── media.api.test.ts
```

---

## User Roles

| Role  | Value                | Layout      | Access                                                    |
| ----- | -------------------- | ----------- | --------------------------------------------------------- |
| Admin | `PhotographyCompany` | Blue topbar | Full access — listings, media, agents, status management  |
| Agent | `Agent`              | Sidebar     | Assigned listings — selection, contacts, preview, publish |

Role is returned from `POST /auth/login` and stored in Zustand. `RoleGuard` wraps role-specific routes.

---

## Routes

| Route                   | Role          | Description                                          |
| ----------------------- | ------------- | ---------------------------------------------------- |
| `/login`                | Public        | Login page                                           |
| `/p/:token`             | Public        | Buyer-facing property showcase (no auth)             |
| `/dashboard`            | Admin + Agent | Listing list (table for Admin, cards for Agent)      |
| `/listings/new`         | Admin         | Create listing form                                  |
| `/listings/:id`         | Admin         | Listing detail — media, selection, contacts tabs     |
| `/listings/:id/edit`    | Admin         | Edit listing form                                    |
| `/listings/:id/preview` | Admin + Agent | Preview editor — cover, photos, description, publish |
| `/agents`               | Admin         | Staff management                                     |
| `/profile`              | Admin + Agent | Profile settings and password change                 |

---

## Authentication

- JWT token stored in Zustand, persisted to `sessionStorage`
- Axios request interceptor attaches `Authorization: Bearer <token>` to every request
- 401 response on any protected endpoint triggers automatic logout and redirect to `/login`
- Login endpoint 401 shows "Invalid email or password" without redirecting

> Do not store the token in `localStorage` — `sessionStorage` clears on tab close for security.

---

## Media Upload

The backend validates file extensions per media type:

| Media Type  | Allowed Extensions      |
| ----------- | ----------------------- |
| Photography | `.jpg`, `.jpeg`, `.png` |
| Videography | `.mp4`, `.mov`          |
| Floor Plan  | `.pdf`                  |
| VR Tour     | `.gltf`                 |

Only Photography supports multiple files per upload. All other types accept one file at a time.

---

## Scripts

```bash
# Development
npm run dev           # Start dev server at http://localhost:5173
npm run build         # Production build
npm run preview       # Preview production build locally

# Code quality
npm run lint          # ESLint
npm run typecheck     # TypeScript type checking (tsc --noEmit)

# Testing
npm run test          # Run unit + integration tests (watch mode)
npm run test:run      # Run unit + integration tests (single run)
npm run e2e           # Run Playwright E2E tests
npm run e2e:ui        # Run Playwright with visual UI
npm run e2e:report    # Open last Playwright test report
```

---

## Testing

The project has three layers of tests:

**Unit tests** — component rendering, hook behaviour, schema validation, store state

```bash
npm run test:run
```

**Integration tests** — API service functions tested against MSW mock server

```bash
npm run test:run
```

**E2E tests** — full user flows in a real browser (requires backend running)

```bash
# Make sure backend is running first
dotnet run

# Then run E2E tests
npm run e2e
```

E2E tests run on both desktop Chromium and mobile (Pixel 5) viewports.

---

## Backend

This frontend connects to the **Remp Backend** — an ASP.NET Core 8 REST API.

Repository: `https://github.com/your-org/remp-backend`

Base URL: `http://localhost:5096`

**Required backend configuration:**

```csharp
// Program.cs — add CORS for local development
builder.Services.AddCors(options => {
  options.AddPolicy("DevPolicy", policy =>
    policy.WithOrigins("http://localhost:5173")
          .AllowAnyHeader()
          .AllowAnyMethod());
});

app.UseCors("DevPolicy");
```

---

## Contributing

Branch naming convention:

```bash
phase/1-project-setup
phase/7-media-management
feat/listing-status-badge
fix/jwt-401-redirect
```

Commit style (Conventional Commits):

```bash
feat: add media type selector to uploader
fix: send plain integer body for status update
chore: update shadcn components
test: add E2E tests for admin flow
```

Pull requests target `main` and include a description of what was built and any manual testing steps.
