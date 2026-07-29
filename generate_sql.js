const fs = require('fs');

const productsHtml = fs.readFileSync('src/product-details.html', 'utf8');
const match = productsHtml.match(/const PRODUCTS_DB = (\{[\s\S]*?\n\s*\});/);
if (match) {
  let db;
  eval('db = ' + match[1]);
  let sql = '-- Inquiries Table Setup\n';
  sql += 'CREATE TABLE IF NOT EXISTS inquiries (\n';
  sql += '  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n';
  sql += '  created_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,\n';
  sql += '  name text NOT NULL,\n';
  sql += '  email text NOT NULL,\n';
  sql += '  subject text,\n';
  sql += '  message text NOT NULL,\n';
  sql += '  type text DEFAULT \'contact\'\n';
  sql += ');\n\n';
  sql += 'ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;\n';
  sql += 'CREATE POLICY "Allow public insert" ON inquiries FOR INSERT WITH CHECK (true);\n';
  sql += 'CREATE POLICY "Allow admin read" ON inquiries FOR SELECT USING (auth.role() = \'authenticated\');\n\n';
  
  sql += '-- Products Insert\n';
  sql += 'INSERT INTO products (ref, name, category, subcategory, badge, ip_rating, optics, short_description, long_description, image_url, specifications, delivery, origin, warranty) VALUES\n';
  const values = [];
  for (const [ref, p] of Object.entries(db)) {
    const esc = (s) => s ? "'" + s.replace(/'/g, "''") + "'" : "NULL";
    const jsonEsc = (j) => j ? "'" + JSON.stringify(j).replace(/'/g, "''") + "'::jsonb" : "NULL";
    values.push(`(${esc(ref)}, ${esc(p.name)}, ${esc(p.category)}, ${esc(p.subcategory)}, ${esc(p.badge)}, ${esc(p.ipRating)}, ${esc(p.optics)}, ${esc(p.shortDesc)}, ${esc(p.longDesc)}, ${esc(p.image)}, ${jsonEsc(p.specifications)}, ${esc(p.delivery)}, ${esc(p.origin)}, ${esc(p.warranty)})`);
  }
  sql += values.join(',\n') + '\nON CONFLICT (ref) DO NOTHING;\n';
  
  fs.writeFileSync('setup.sql', sql);
  console.log('setup.sql generated successfully.');
} else {
  console.error('Could not parse PRODUCTS_DB');
}
