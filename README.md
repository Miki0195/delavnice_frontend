# Delavnice.net Frontend

React + TypeScript + Tailwind CSS frontend for the Delavnice.net platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts     # Axios instance
│   ├── workshops.ts  # Workshop API
│   └── contact.ts    # Contact form API
├── components/       # React components
│   ├── layout/       # Layout components (Header, Footer)
│   ├── home/         # Home page components
│   └── ui/           # Reusable UI components
├── pages/            # Page components
│   ├── Domov.tsx     # Home page
│   ├── OPlatformi.tsx
│   ├── PreventivnaZnanost.tsx
│   └── Kontakt.tsx
├── types/            # TypeScript type definitions
└── App.tsx           # Main app component with routing
```

## Features

- **Home Page (Domov)**:
  - Hero section with rotating headline and search
  - Advanced filters sidebar (region, category, activity type, features, price, rating)
  - Workshop grid/list view toggle
  - Sorting options
  - Pagination with "Load More"

- **Contact Form (Kontakt)**:
  - Form with validation
  - Integration with Django backend

- **Responsive Design**:
  - Mobile-first approach
  - Tailwind CSS for styling

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **TanStack Query (React Query)** for data fetching
- **Axios** for HTTP requests
- **Lucide React** for icons

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:8000/api`)
