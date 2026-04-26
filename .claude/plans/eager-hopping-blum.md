# Higher-Effort Features Implementation Plan

## Context
All quick wins, medium-priority, and lower-effort features are done. These 2 higher-effort features add product comparison and user accounts with order history — both using in-memory mock persistence (consistent with the existing cart/review pattern).

---

## Feature 1: Product Comparison

### Cookie helper (`lib/comparison-cookies.ts`)
Follow `lib/wishlist-cookies.ts` pattern. Cookie name: `sumud_comparison`. Store `{ slugs: string[] }`. Max 3 products.

### Server action (`app/comparison/actions.ts`)
- `addToComparison(slug)` — reads cookie, adds slug (max 3, reject if full), writes back.
- `removeFromComparison(slug)` — reads cookie, removes slug, writes back.
- `clearComparison()` — clears cookie.

### Context (`app/comparison/comparison-context.tsx`)
Follow wishlist context pattern. `useOptimistic` with ADD/REMOVE/CLEAR actions. Expose `items`, `isComparing(slug)`, `isFull` (items.length >= 3), `dispatch`.

### Layout integration (`app/layout.tsx`)
- Wrap with `<ComparisonProvider>` inside the existing provider chain.
- Read initial state from comparison cookie.

### Compare button (`components/compare-button.tsx`)
- Client component: `GitCompareArrows` (or `ArrowLeftRight`) icon from lucide.
- Props: `slug`, `productName`, `className`.
- `e.preventDefault(); e.stopPropagation()` for use inside product card links.
- Toast on add/remove. Disabled state when comparison is full and product isn't in list.

### Product card integration (`components/product-card.tsx`)
- Add `CompareButton` in the image container, positioned bottom-left, `opacity-0 group-hover:opacity-100`.

### Floating comparison bar (`components/comparison-bar.tsx`)
- Fixed bottom bar that appears when 1+ products are in comparison.
- Shows thumbnails of compared products with remove buttons.
- "Compare Now" button (disabled until 2+ products) linking to `/comparison`.
- "Clear All" button.

### Comparison page (`app/comparison/page.tsx`)
- Side-by-side table comparing 2-3 products.
- Rows: Image, Name, Price, Gender, Series, Scent Profile, Top Notes, Heart Notes, Base Notes, Rating.
- Uses `Table` from `components/ui/table.tsx`.
- Fetches products by slug from commerce API + perfume-data.ts.
- Empty state when no products selected, with link to browse products.
- "Add to Cart" button per product column.

---

## Feature 2: User Accounts & Order History

Since the app uses a mock commerce layer, auth will be in-memory too — simple email/password with a session cookie. No real security needed for a demo.

### Auth storage (`lib/auth.ts`)
- In-memory `users` Map and `sessions` Map.
- `User` type: `{ id, name, email, passwordHash }`.
- `Session` type: `{ userId, createdAt }`.
- Functions: `createUser(name, email, password)`, `authenticateUser(email, password)`, `createSession(userId)`, `getSession(sessionId)`, `deleteSession(sessionId)`, `getUserById(id)`.
- Use simple hashing (btoa/atob for demo — not production-grade, but this is a mock).
- Session cookie: `sumud_session`, httpOnly, secure, sameSite lax.
- Seed 1 demo user: `demo@sumud.com` / `demo123`.

### Order storage (extend `lib/commerce.ts`)
- Add in-memory `orders` Map keyed by order ID.
- Add `customerOrders` Map keyed by user ID (array of order IDs).
- Seed 2 demo orders for the demo user.
- Implement `orderGet({ id })` — return full order data.
- Add `orderBrowse({ userId })` — return user's orders.
- Add `orderCreate({ userId, cartId })` — convert cart to order.

### Server actions (`app/(auth)/actions.ts`)
- `loginAction(prevState, formData)` — validate email/password, create session, set cookie, redirect.
- `registerAction(prevState, formData)` — create user, create session, set cookie, redirect.
- `logoutAction()` — delete session, clear cookie, redirect to home.

### Login page (`app/(auth)/login/page.tsx`)
- Form with email + password inputs, submit button.
- Uses `useActionState` with `loginAction`.
- Link to register page.
- Styled consistently with other pages (dark hero or clean form layout).

### Register page (`app/(auth)/register/page.tsx`)
- Form with name, email, password, confirm password inputs.
- Uses `useActionState` with `registerAction`.
- Link to login page.

### Account page (`app/account/page.tsx`)
- Protected — reads session cookie, redirects to login if not authenticated.
- Shows user info (name, email).
- Logout button.
- Recent orders section.

### Orders page (`app/account/orders/page.tsx`)
- Protected page showing full order history.
- Order cards with: order ID, date, status, item count, total.
- Click to expand or link to order detail.

### Header auth UI (`app/layout.tsx`)
- Add a `UserButton` client component next to `CartButton`.
- If logged in: shows user icon with dropdown (Account, Orders, Logout).
- If not logged in: shows "Sign In" link.
- Read session from cookie server-side, pass `user` to a thin wrapper.

### Navbar update (`app/navbar.tsx`)
- No changes needed — account access is via the header icon, not nav links.

---

## Implementation Order
1. **Product comparison** — self-contained, follows existing patterns closely
2. **Auth system** — lib/auth.ts + actions + login/register pages
3. **Order system** — extend commerce.ts + account/orders pages
4. **Header integration** — UserButton component

## Verification
- `npx biome check --write` on all files
- `bun dev` — verify:
  - Compare buttons appear on product cards
  - Floating bar shows selected products
  - Comparison page shows side-by-side table
  - Login/register forms work with demo credentials
  - Account page shows user info and orders
  - Logout clears session
  - Protected pages redirect to login
