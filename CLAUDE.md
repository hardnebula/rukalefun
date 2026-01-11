# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ruka Lefún** is a comprehensive event management system for an event center in Villarrica, Chile. The application has two main areas:
- **Public website**: Homepage, spaces, gallery, reservations, and contact
- **Admin portal**: Complete management dashboard for bookings, quotes, gallery, staff, resources, and more

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Backend**: Convex (real-time serverless backend)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Calendar**: React Big Calendar
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **AI Features**: OpenAI API (for shopping list generation)

## Essential Commands

### Development
```bash
npm run dev              # Start Next.js dev server (port 3000)
npx convex dev          # Start Convex in development mode (required!)
```
**Important**: You need BOTH commands running simultaneously for development. Open two terminal windows.

### Build & Production
```bash
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Convex Deployment
```bash
npx convex deploy       # Deploy Convex functions to production
npx convex dashboard    # Open Convex dashboard
npx convex data         # View/query database directly
```

## Architecture Overview

### File Structure

```
app/
├── (public)/           # Public-facing pages (route group)
│   ├── page.tsx        # Homepage
│   ├── espacios/       # Spaces page
│   ├── galeria/        # Gallery
│   ├── reservas/       # Public reservation form
│   └── contacto/       # Contact page
├── admin/              # Admin portal (protected)
│   ├── layout.tsx      # Admin layout with sidebar
│   ├── page.tsx        # Dashboard
│   ├── login/          # Admin login
│   ├── calendario/     # Calendar view of all bookings
│   ├── reservas/       # Booking management
│   ├── cotizaciones/   # Quote requests
│   ├── galeria/        # Gallery management
│   ├── espacios/       # Space management
│   ├── listas-compras/ # Shopping lists with AI generation
│   └── mesas/          # Table/seating management
├── layout.tsx          # Root layout
└── globals.css         # Global styles

components/
├── admin/              # Admin-specific components
│   ├── AdminGuard.tsx  # Auth wrapper component
│   ├── AIEventAssistant.tsx
│   └── QuoteGenerator.tsx
├── layout/             # Layout components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AdminSidebar.tsx
│   └── WhatsAppButton.tsx
├── providers/          # React context providers
│   └── ConvexProvider.tsx
├── seo/                # SEO components
└── ui/                 # shadcn/ui components

convex/                 # Backend (26+ files)
├── schema.ts           # Database schema (20+ tables)
├── bookings.ts         # Booking queries & mutations
├── quotes.ts           # Quote queries & mutations
├── gallery.ts
├── spaces.ts
├── auth.ts             # Admin authentication
├── shoppingLists.ts
├── aiShoppingLists.ts  # AI-powered shopping list generation
└── ...                 # Other domain modules

lib/
├── utils.ts            # Utility functions (cn helper)
├── auth.ts             # Client-side auth utilities
├── pdfExport.ts        # PDF generation functions
└── images.ts           # Image handling utilities
```

### Route Groups

Next.js route groups are used to organize routes without affecting URLs:
- `app/(public)/` - Public pages (no auth required)
- `app/admin/` - Admin pages (requires authentication)

### Convex Backend Architecture

Convex is a **real-time serverless backend** that replaces traditional REST APIs and databases. Key concepts:

#### Queries vs Mutations
- **Queries**: Read-only operations, automatically reactive
- **Mutations**: Write operations (create, update, delete)

#### Common Patterns

**Querying data:**
```typescript
export const getAllBookings = query({
  handler: async (ctx) => {
    return await ctx.db.query("bookings").collect();
  },
});
```

**With arguments:**
```typescript
export const getBooking = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

**Creating records:**
```typescript
export const createBooking = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("bookings", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});
```

**Updating records:**
```typescript
export const updateBooking = mutation({
  args: { id: v.id("bookings"), /* ... */ },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
```

**Data enrichment pattern:**
Many queries fetch related data and merge it:
```typescript
const bookings = await ctx.db.query("bookings").collect();
return await Promise.all(
  bookings.map(async (booking) => {
    const space = booking.spaceId ? await ctx.db.get(booking.spaceId) : null;
    return { ...booking, space };
  })
);
```

#### Using Convex in React

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query
const bookings = useQuery(api.bookings.getAllBookings);

// Mutation
const createBooking = useMutation(api.bookings.createBooking);
await createBooking({ /* args */ });
```

### Database Schema (convex/schema.ts)

20+ tables including:
- `spaces` - Event spaces with capacity, pricing
- `bookings` - Event reservations with status, payments
- `quoteRequests` - Client quote requests
- `generatedQuotes` - Generated quotes from templates
- `quoteTemplates` - Reusable quote templates
- `gallery` - Image gallery with categories
- `staff` - Staff/waiters with roles and rates
- `staffAssignments` - Staff assigned to specific events
- `resources` - Inventory (furniture, A/V, decorations)
- `eventTasks` - Checklist per event
- `eventTimeline` - Event schedule/timeline
- `tables` - Physical tables in the venue
- `tableAssignments` - Guest seating assignments
- `ingredients` - Ingredient catalog with costs
- `dishIngredients` - Recipe mapping (dish → ingredients)
- `shoppingLists` - Shopping lists per event
- `shoppingListItems` - Individual items in shopping lists
- `aiShoppingListGenerations` - AI generation history
- `meetings` - Client meeting scheduling
- `admins` - Admin users
- `sessions` - Admin sessions

All tables use Convex IDs (e.g., `v.id("bookings")`) for relationships.

### Authentication

**Current Implementation**: Basic localStorage-based sessions
- Admin credentials stored in `admins` table
- Sessions tracked in `sessions` table
- Client-side auth utilities in `lib/auth.ts`
- `AdminGuard` component protects admin routes

**Auth Flow**:
1. Login at `/admin/login`
2. Session ID stored in localStorage
3. `AdminGuard` verifies session on protected pages
4. Session expires after configured time

### AI Features

**Shopping List Generation** (`convex/aiShoppingLists.ts`):
- Uses OpenAI to analyze event menus
- Maps dishes to ingredients automatically
- Calculates quantities based on guest count
- Generates shopping lists with cost estimates
- Includes audit/verification step

## Key Domain Concepts

### Booking Flow
1. **Quote Request** - Client submits initial request
2. **Generated Quote** - Admin creates quote from template
3. **Booking** - Quote converts to confirmed booking
4. **Shopping List** - AI generates ingredient list from menu
5. **Staff Assignment** - Assign waiters/staff to event
6. **Event Timeline** - Create schedule of activities
7. **Table Assignment** - Assign guests to tables

### Quote System
- **Templates** (`quoteTemplates`) - Pre-configured packages
- **Generated Quotes** (`generatedQuotes`) - Instances created from templates
- Templates include: services, menu, pricing, terms
- Quotes can be converted to bookings
- PDFs generated with jsPDF

## Common Development Tasks

### Adding a new Convex table
1. Update `convex/schema.ts` with new table definition
2. Add indexes if needed
3. Create corresponding `convex/[tableName].ts` with queries/mutations
4. Convex will auto-generate TypeScript types

### Creating a new admin page
1. Create file in `app/admin/[page-name]/page.tsx`
2. Add to `AdminSidebar.tsx` navigation
3. Will automatically be protected by `AdminGuard`

### Adding a new UI component
- Use shadcn/ui: `npx shadcn-ui@latest add [component]`
- Components added to `components/ui/`
- Use `cn()` from `lib/utils.ts` for className merging

### Working with dates
- Stored as ISO strings (`YYYY-MM-DD`) in database
- Use `date-fns` for formatting and manipulation
- Time stored as `HH:MM` strings

### PDF Generation
- See `lib/pdfExport.ts` for examples
- Uses jsPDF + jsPDF-AutoTable
- Includes logo, headers, tables with custom styling

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://[your-deployment].convex.cloud
OPENAI_API_KEY=sk-...  # For AI features
```

The `NEXT_PUBLIC_CONVEX_URL` is generated when running `npx convex dev`.

## Important Notes

### Convex Development
- **Always run `npx convex dev` during development** - it watches for changes and pushes to your dev deployment
- Schema changes are applied automatically
- Use `npx convex dashboard` to view/edit data directly
- Convex functions run server-side but are called client-side like local functions

### Real-time Updates
- All `useQuery` hooks automatically update when data changes
- No need to manually refetch or manage cache
- Changes from any client propagate instantly to all others

### Type Safety
- Convex auto-generates TypeScript types in `convex/_generated/`
- Never edit files in `_generated/` - they're regenerated on each change
- Use `api.moduleName.functionName` for type-safe function references

### State Management
- No Redux/Zustand needed - Convex handles global state
- Use React state for UI-only state
- Use Convex queries for any data from database

### Deployment Workflow
1. `npm run build` - Build Next.js
2. `npx convex deploy` - Deploy backend functions
3. Deploy Next.js to Vercel/your host
4. Ensure production env vars are set

## Debugging

### Convex Issues
- Check Convex dashboard: `npx convex dashboard`
- View logs in real-time during `npx convex dev`
- Use `console.log()` in Convex functions - logs appear in terminal

### Auth Issues
- Check localStorage for `adminSession` key
- Verify session hasn't expired in `sessions` table
- Check `AdminGuard.tsx` for auth logic

### Build Errors
- Ensure `npx convex dev` completed successfully before building
- Check that all Convex imports use `@/convex/_generated/api`
- Verify types are generated in `convex/_generated/`

## Additional Documentation

See project-specific docs in repository:
- `SISTEMA_RESERVAS.md` - Booking system details
- `SISTEMA_PERSONAL.md` - Staff management system
- `PORTAL_ADMIN_COMPLETO.md` - Complete admin portal guide
- `INSTRUCCIONES_SEED.md` - Database seeding instructions
- `AUTENTICACION_ADMIN.md` - Authentication implementation details

## Color Palette

Inspired by Chilean nature:
- Primary: `#2D5016` (Forest Green)
- Accent: `#4A7C30` (Moss Green)
- Info: `#0A5F8C` (Lake Blue)
- Detail: `#87CEEB` (Sky Blue)
- Warm: `#8B6F47` (Wood Brown)
- Neutral: `#757575` (Stone Gray)
