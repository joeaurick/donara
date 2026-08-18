# Donara

### Full-Stack Restaurant & Point of Sale Platform

Donara is a full-stack web application I built independently to manage a food business through a public-facing website, content management system, and point-of-sale platform.

The project combines customer-facing web experiences with operational tools for managing products, orders, transactions, reviews, business information, SEO, and cashier workflows.

> **Status:** Personal project / independently built

---

## Overview

Donara was built as a practical full-stack application rather than a simple landing page.

The system is organized into several major areas:

- Public business website
- Admin CMS
- Point of Sale (POS)
- Product management
- Gallery management
- Review management
- Homepage content management
- SEO management
- Transaction history
- Sales reporting
- Receipt generation and printing
- QRIS payment workflow
- POS user management
- Supabase-backed data and authentication

The goal was to build a system that connects the customer-facing website with the operational side of a small food business.

---

## Main Features

### Public Website

The public website provides a customer-facing experience for the Donara brand.

Features include:

- Responsive navigation
- Hero section
- About section
- Product/menu section
- Product cards
- Gallery
- Customer reviews
- Contact information
- WhatsApp ordering links
- Call-to-action sections
- Structured data for search engines

---

### Admin CMS

The admin dashboard allows business content to be managed without modifying the public website directly.

Admin features include:

- Business information management
- Homepage content management
- Product management
- Product creation and editing
- Gallery management
- Customer review management
- SEO management
- SEO preview and scoring
- Protected admin routes

The admin interface is organized into reusable components and protected application areas.

---

### Point of Sale

Donara also includes a dedicated Point of Sale system.

POS features include:

- POS authentication
- Product grid
- Shopping cart
- Product/package selection
- Checkout workflow
- Payment processing
- QRIS payment workflow
- QRIS proof upload
- Pending orders
- Transaction history
- Transaction detail
- Sales dashboard
- Sales charts
- Payment charts
- Business reports
- Receipt generation
- Receipt printing
- POS user management

The POS interface also includes mobile-oriented components such as a mobile cart sheet and mobile bottom navigation.

---

## Architecture

The application uses the Next.js App Router and separates public pages, protected administration, POS functionality, API routes, reusable components, and data-access utilities.

```text
app/
├── admin/
│   ├── login/
│   └── (protected)/
│       ├── business/
│       ├── gallery/
│       ├── homepage/
│       ├── products/
│       ├── reviews/
│       └── seo/
│
├── api/
│   └── pos/
│       └── users/
│
├── components/
│   ├── admin/
│   └── ...
│
├── pos/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── dashboard/
│   ├── history/
│   ├── hooks/
│   ├── lib/
│   ├── report/
│   ├── settings/
│   └── login/
│
├── globals.css
├── layout.tsx
├── page.tsx
├── robots.ts
└── sitemap.ts

lib/
├── auth/
├── supabase/
├── business.ts
├── exportExcel.ts
├── exportPdf.ts
├── exportWhatsapp.ts
├── gallery.ts
├── getSeo.ts
├── homepage.ts
├── invoice.ts
└── seo.ts

types/
├── business.ts
└── homepage.ts
