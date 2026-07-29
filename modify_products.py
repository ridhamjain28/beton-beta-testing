import re

with open('src/products.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the products grid content with a single dynamic container
html = re.sub(
    r'<div class="products-grid">.*?</div>\s*<!-- Empty State -->',
    '''<div class="products-grid" id="products-container"></div>\n\n<!-- Loading State -->\n<div id="products-loading" style="text-align: center; padding: 4rem; width: 100%; color: var(--color-text-muted);">\n  <div class="spinner"></div>\n  <p>Loading products...</p>\n</div>\n\n<!-- Empty State -->''',
    html,
    flags=re.DOTALL
)

# Add supabase client and initialization
script_tag = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n    <script src="supabase-client.js"></script>\n'
html = html.replace('<script src="assets/js/main.js"></script>', script_tag + '    <script src="assets/js/main.js"></script>')

# We need to inject the fetch logic into the bottom of products.html, right before </body>
fetch_logic = '''
    <script>
        async function loadProducts() {
            const container = document.getElementById('products-container');
            const loading = document.getElementById('products-loading');
            
            try {
                const { data: products, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('ref');
                
                if (error) throw error;
                
                loading.style.display = 'none';
                
                if (products.length === 0) {
                    // let existing empty state handle it
                    return;
                }
                
                products.forEach(p => {
                    const card = document.createElement('a');
                    card.href = 'product-details.html?ref=' + p.ref;
                    card.className = 'product-card';
                    card.setAttribute('data-category', p.category.toLowerCase().replace(/ /g, '-'));
                    if (p.optics) card.setAttribute('data-optics', p.optics.toLowerCase());
                    if (p.ip_rating) card.setAttribute('data-ip', p.ip_rating.toLowerCase());
                    
                    card.innerHTML = `
                        <div class="product-image-container">
                            <img src="${p.image_url || 'assets/images/products/sys-01.webp'}" alt="${p.name}" class="product-image" loading="lazy">
                        </div>
                        <div class="product-info">
                            <div class="product-meta">
                                <span class="product-ref">${p.ref}</span>
                                <span class="product-category">${p.category}</span>
                            </div>
                            <h3 class="product-name">${p.name}</h3>
                        </div>
                    `;
                    container.appendChild(card);
                });
                
                // Re-run filter logic if any filters were pre-selected
                if (typeof filterProducts === 'function') filterProducts();
                
            } catch (err) {
                console.error('Error loading products:', err);
                loading.innerHTML = '<p style="color: red;">Error loading products. Please try again later.</p>';
            }
        }
        
        document.addEventListener('DOMContentLoaded', loadProducts);
    </script>
'''
html = html.replace('</body>', fetch_logic + '\n</body>')

with open('src/products.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("products.html updated for Supabase")
