# Rabaul Hotel - Frontend

This is the frontend application for Rabaul Hotel, built with [Next.js](https://nextjs.org/).

## Getting Started

First, create a `.env.local` file in the root directory and add your API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-boss-api.com
```

Then, install dependencies and run the development server:

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app` - Next.js app router pages and layouts
- `src/components` - Reusable React components
- `src/lib` - Utility functions and API client

## API Integration

This project uses the `apiRequest` utility function from `src/lib/api.ts` to make HTTP requests to the backend API.

### Making API Calls

```typescript
import { apiRequest } from '@/lib/api';

// GET request
const data = await apiRequest('/endpoint');

// POST request with data
const result = await apiRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' })
});
```

### Available API Functions

Predefined API functions are available in `src/lib/api.ts`. Add more as needed.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the API (required)

## Deployment

This application can be deployed to any static hosting service that supports Next.js, such as Vercel, Netlify, or AWS Amplify.

For Vercel deployment:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Set up environment variables in the Vercel dashboard
4. Deploy!
