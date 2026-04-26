# Feria Americana

[![View Live](https://img.shields.io/badge/View%20Live-App-blue?style=for-the-badge)](https://feria-americana.vercel.app/)

This is a modern e-commerce web application for a second-hand clothing fair, built with [Next.js](https://nextjs.org) and [Supabase](https://supabase.com). It features a responsive product catalog, shopping cart, and order submission with email notifications.

---

## 🚀 Functionality

- **Product Catalog:** Browse a grid of second-hand clothing items, filter by availability, and view product details.
- **Responsive UI:** The product grid adapts to all screen sizes for a seamless mobile and desktop experience.
- **Shopping Cart:** Add items to your cart, review your selection, and proceed to checkout.
- **Order Submission:** Submit your order with contact details; products are marked as sold and both buyer and admin receive email confirmations.
- **Admin/Owner Integration:** Products and their statuses are managed via Supabase, with easy seeding from CSV.

---

## 🛠 Frameworks & Libraries

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, SSR, API routes)
- **Database & Auth:** [Supabase](https://supabase.com/) (Postgres, Row Level Security, REST API)
- **UI Library:** [Tailwind CSS](https://tailwindcss.com/) (utility-first styling), [shadcn/ui](https://ui.shadcn.com/) (customizable React components)
- **Component Libraries:** 
  - [Radix UI](https://www.radix-ui.com/) (primitives, accessibility)
  - [Lucide React](https://lucide.dev/) (icon set)
- **Image Processing:** [sharp](https://sharp.pixelplumbing.com/), [imagemin](https://github.com/imagemin/imagemin), [heic-convert](https://www.npmjs.com/package/heic-convert)
- **CSV Parsing:** [PapaParse](https://www.papaparse.com/)
- **Email:** [Nodemailer](https://nodemailer.com/) (order notifications)
- **Virtualized Lists:** [react-window](https://react-window.vercel.app/) (efficient product grid rendering)
- **Other Utilities:** 
  - [clsx](https://github.com/lukeed/clsx), [class-variance-authority](https://cva.style/) (conditional class names)
  - [dotenv](https://github.com/motdotla/dotenv) (environment variables)

---

## 📦 Project Structure

- `src/app/` — Main Next.js app directory (pages, layouts, API routes, cart context)
- `src/components/` — UI and product grid components
- `src/components/ui/` — Reusable UI primitives (Button, Card, Badge, Input)
- `src/lib/` — Supabase client, seeding scripts, utility functions, SQL schema
- `feeding-data.csv` — Source data for products

---

## 🗄 Database

- **Supabase Table:** `products`
  - Fields: `id`, `title`, `color`, `description`, `brand`, `size`, `price`, `other`, `status`, `buyer`, `image`
  - Row Level Security enabled (open for development)
- **Seeding:** Run `npx tsx src/lib/seedSupabaseProducts.ts` to import products from `feeding-data.csv`.

---

## 🖥️ UI/UX

- **shadcn/ui** components for consistent, accessible design
- **Tailwind CSS** for rapid, utility-first styling
- **Responsive grid** with `react-window` for performance
- **Dark mode** support via CSS variables

---

## 📧 Order Flow

- User adds products to cart and submits order with name, email, and phone.
- API endpoint `/api/send-order`:
  - Marks products as sold in Supabase
  - Sends confirmation emails to both admin and buyer using Nodemailer
  - Revalidates homepage to update product statuses

---

## ⚙️ Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Create `.env.local` with:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     EMAIL_SENDER=your-email@gmail.com
     GOOGLE_APP_PASSWORD=your-app-password
     EMAIL_RECIPIENT=admin-email@example.com
     ```
3. **Set up Supabase:**
   - Run the SQL in `src/lib/supabaseSchema.sql` in your Supabase SQL editor.
   - Seed products:
     ```bash
     npx tsx src/lib/seedSupabaseProducts.ts
     ```
4. **Start the dev server:**
   ```bash
   npm run dev
   ```

---

## 📝 Notable Packages

- `@supabase/supabase-js`, `@supabase/ssr`
- `next`, `react`, `react-dom`
- `tailwindcss`, `tw-animate-css`
- `@radix-ui/react-slot`, `lucide-react`
- `nodemailer`, `papaparse`, `sharp`, `imagemin`, `heic-convert`
- `react-window`, `clsx`, `class-variance-authority`

---

## 📚 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
