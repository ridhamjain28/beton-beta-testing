-- Inquiries Table Setup
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

-- Products Insert
INSERT INTO products (ref, name, category, subcategory, badge, ip_rating, optics, short_description, long_description, image_url, specifications, delivery, origin, warranty) VALUES
('B-204', 'Apex Recessed Downlight', 'Indoor Downlights', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/sys-01.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('M-992', 'Mag-Track Linear Pro', 'Magnetic Track Systems', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-1.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('S-441', 'Zenith Surface 150', 'Surface Cylinders', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/sys-01.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('P-102', 'Flux Dali-2 Driver', 'Control Gear', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-4.webp', NULL, '2-3 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('L-550', 'Matrix 20 Profile', 'Linear Profiles', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-2.webp', NULL, '2-3 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('W-881', 'Titan Flood Washer', 'Outdoor Luminaires', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/innova.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('B-205', 'Apex Recessed Round', 'Indoor Downlights', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/sys-01.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('M-993', 'Mag-Track Spot Pro', 'Magnetic Track Systems', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-1.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('S-442', 'Zenith Surface 200', 'Surface Cylinders', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/sys-01.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('P-103', 'Flux Dali-2 Mini', 'Control Gear', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-4.webp', NULL, '2-3 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('L-551', 'Matrix 40 Profile', 'Linear Profiles', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-2.webp', NULL, '2-3 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('W-882', 'Titan Mini Washer', 'Outdoor Lighting', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/innova.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('B-206', 'Apex Recessed Trimless', 'Indoor Downlights', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/sys-01.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('M-994', 'Mag-Track Linear Mini', 'Magnetic Track Systems', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-1.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('S-443', 'Zenith Surface 300', 'Surface Cylinders', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/sys-01.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('P-104', 'Flux Dali-2 Pro', 'Control Gear', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-4.webp', NULL, '2-3 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('L-552', 'Matrix 60 Profile', 'Linear Profiles', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/render-2.webp', NULL, '2-3 Weeks', 'Surat, Gujarat', '5 Years Limited'),
('W-883', 'Titan Flood Max', 'Outdoor Lighting', NULL, NULL, NULL, NULL, NULL, NULL, 'assets/images/products/innova.webp', NULL, '3-4 Weeks', 'Surat, Gujarat', '5 Years Limited')
ON CONFLICT (ref) DO NOTHING;

-- Documents Table Setup (for 3D Flipbook PDF Management)
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
DROP POLICY IF EXISTS "Allow public select documents" ON documents;
DROP POLICY IF EXISTS "Allow admin manage documents" ON documents;
DROP POLICY IF EXISTS "Allow public all documents" ON documents;
CREATE POLICY "Allow public all documents" ON documents FOR ALL USING (true) WITH CHECK (true);

-- Insert default documents if not existing
INSERT INTO documents (title, file_url, category, is_visible) VALUES
('BETON Price List', 'assets/docs/beton-price-list.pdf', 'Price List', true),
('BETON Product Catalogue', 'assets/docs/BETON_Catalogue.pdf', 'Catalogue', true)
ON CONFLICT DO NOTHING;

