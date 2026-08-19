# Supabase Setup & Architecture Guide

This document outlines the complete Supabase configuration, database schemas, storage buckets, Row Level Security (RLS) policies, and API client integration for the Beton Lighting website. If this codebase is downloaded, zipped, or moved to another environment or AI session, this guide serves as the single source of truth for the Supabase backend.

---

## 1. Project Configuration & Client Setup

- **Client File**: [`src/supabase-client.js`](file:///d:/Github%20Repos/Beton-Website-folder/src/supabase-client.js)
- **Supabase URL & Anon Key**: Defined inside `src/supabase-client.js`.
- **Primary Storage Bucket**: `product-images` (public access enabled).

---

## 2. Database Tables & Schemas

### A. `inquiries` Table
Stores contact form submissions and newsletter signups.

```sql
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  type text DEFAULT 'contact'
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');
```

---

### B. `products` Table
Stores lighting products for catalog display and search.

```sql
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ref text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  badge text,
  ip_rating text,
  optics text,
  short_description text,
  long_description text,
  image_url text NOT NULL,
  specifications text,
  delivery text DEFAULT '3-4 Weeks',
  origin text DEFAULT 'Surat, Gujarat',
  warranty text DEFAULT '5 Years Limited',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
```

---

### C. `documents` Table
Stores digital PDF resources (Price Lists, Product Catalogues, Brand Books) for the interactive 3D Flipbook viewer.

```sql
CREATE TABLE IF NOT EXISTS documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  file_url text NOT NULL,
  category text DEFAULT 'Catalogue',
  pages_count integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Allow admin manage documents" ON documents FOR ALL USING (auth.role() = 'authenticated');
```

---

## 3. Supabase Storage Buckets

1. **Bucket Name**: `product-images`
   - **Public Access**: Enabled (Public Read).
   - **Allowed File Types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `application/pdf`.
   - **Usage**: Used for storing product preview images, application renders, and uploaded digital PDF catalogues.

---

## 4. Admin Dashboard Integration (`adminadmin.html`)

The admin portal at `src/adminadmin.html` connects directly to Supabase via `@supabase/supabase-js` (or `supabase-client.js` module):
- **Products Tab**: Allows full CRUD operations on lighting fixtures and uploading product image assets.
- **Documents Tab**: Allows uploading new PDF catalogues/price lists to the `product-images` storage bucket, creating matching `documents` records, toggling visibility, and deleting outdated files.
- **Inquiries Tab**: Views submitted customer messages and newsletter signups.
