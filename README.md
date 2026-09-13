# Sanya Electronics Frontend

Responsive React frontend for the Sanya Electronics product catalogue, showroom statistics, sales targets, arrears tracking, and role-based administration.

Built with React 18, Vite, React Router, Tailwind CSS, Axios, and Lucide icons.

## Features

- Responsive storefront for electronics products.
- Product search, filtering, categories, pricing, specifications, and details.
- Showroom dashboard with sales targets, arrears, and showroom comparison.
- Year and month-based sales target history.
- Officer and System Admin authentication flows.
- System Admin-only product management and password management.
- Mobile-first layouts, touch-friendly controls, lazy-loaded images, and error fallback UI.

## Requirements

- Node.js 18 or newer.
- npm 9 or newer.
- The Sanya Electronics backend running locally or hosted remotely.

## Installation

```bash
git clone <your-repository-url>
cd react
npm install
```

Create a local environment file:

```bash
copy .env.example .env
```

On macOS/Linux, use:

```bash
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to the backend URL:

```env
VITE_API_URL=http://localhost:5000
```

Do not commit `.env`. Only `.env.example` belongs in GitHub.

## Development

Start the Vite development server:

```bash
npm run dev
```

The terminal will show the local development URL, normally `http://localhost:5173`.

The frontend expects the backend API to be available at the value configured in `VITE_API_URL`.

## Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the production bundle locally:

```bash
npm run preview
```

For hosting platforms such as Vercel or Netlify:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api-domain.example.com`

The backend must allow the deployed frontend origin in its `ALLOWED_ORIGINS` setting and must support HTTPS credentials.

## Authentication

Click **Admin Login** to open the primary verification gate. After successful verification, select either:

- **Officer**: access to Home, Products, and Statistics. Officers cannot add, edit, or delete products.
- **System Admin**: full access, including product management and password management.

Authentication uses HTTP-only session cookies issued by the backend. Passwords are never stored in this frontend repository.

## Project Structure

```text
src/
  components/             Shared UI components
  context/                Authentication and application context
  features/products/      Product API, pages, forms, cards, and filters
  features/showrooms/     Showroom API helpers
  pages/                  Home, statistics, showroom, and admin pages
  routes/                 Application route guards and routes
  services/               Axios and authentication API clients
  App.jsx                 Application shell and navigation
  main.jsx                React entry point and error boundary
```

## Backend

The backend is in the sibling `backend` directory. Start it separately:

```bash
cd ../backend
npm install
npm start
```

See [backend/deployment-check.md](../backend/deployment-check.md) for production environment variables, HTTPS, health checks, and deployment requirements.

## Security Notes

- Never commit `.env` files, database URLs, passwords, or JWT secrets.
- Use a production HTTPS backend URL in `VITE_API_URL`.
- Rotate initial credentials after deployment.
- Keep the frontend and backend CORS origins explicitly configured.
- Frontend visibility controls are not the security boundary; authorization is enforced by backend middleware.

## License

Add the project license here before publishing if this repository will be distributed publicly.
