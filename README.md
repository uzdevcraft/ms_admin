# Magic Store Admin Panel

Admin dashboard for **Magic Store** — a cross-border marketplace for buying and shipping products from abroad.

## Tech stack

- React 19 + TypeScript + Vite
- [Mantine](https://mantine.dev/) UI
- [TanStack React Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- [Axios](https://axios-http.com/) (mock API with localStorage persistence)
- CSS Modules + `clsx`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Admin authentication

Only 3 admin accounts can sign in. Edit credentials manually in:

```
src/config/admins.ts
```

Default accounts:

| Username        | Password          | Role              |
|-----------------|-------------------|-------------------|
| `admin_super`   | `MagicStore2024!` | Super Admin       |
| `admin_ops`     | `Ops@Magic2024`   | Operations Admin  |
| `admin_support` | `Support#MS2024`  | Support Admin     |

## Pages

- **Dashboard** — overview stats
- **Users** — customer CRUD
- **Products** — international product CRUD
- **Categories** — product category CRUD
- **Orders** — cross-border order CRUD

## Data layer

The app uses a mock REST API backed by `localStorage`. When you connect a real backend, replace the mock adapter in `src/api/` with your API base URL.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
