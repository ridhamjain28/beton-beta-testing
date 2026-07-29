import re

with open('src/product-details.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Instead of regex, let's just find the index of "const PRODUCTS_DB" and the index of "</script>" after it
start_idx = html.find('const PRODUCTS_DB = {')
if start_idx != -1:
    end_idx = html.find('</script>', start_idx)
    
    script_start = html.rfind('<script>', 0, start_idx)
    
    new_script = '''<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-client.js"></script>
<script>
// Supabase integration for Product Details
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productRef = urlParams.get('ref') || 'B-204'; // Default fallback
    
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('ref', productRef)
            .single();
            
        if (error) throw error;
        if (!data) throw new Error("Product not found");
        
        const product = data;
        
        // Update Meta Title
        document.title = `${product.name} | BETON LIGHTING`;
        
        // Update DOM Elements
        const elements = {
            ref: document.querySelector('.product-detail-ref'),
            name: document.querySelector('.product-detail-name'),
            category: document.querySelector('.product-detail-category'),
            desc: document.querySelector('.product-detail-desc'),
            image: document.querySelector('.product-detail-image'),
            specsList: document.querySelector('.product-specs-list'),
            delivery: document.querySelector('[data-product-delivery]'),
            origin: document.querySelector('[data-product-origin]'),
            warranty: document.querySelector('[data-product-warranty]')
        };
        
        if (elements.ref) elements.ref.textContent = product.ref;
        if (elements.name) elements.name.textContent = product.name;
        if (elements.category) elements.category.textContent = product.category;
        if (elements.desc) elements.desc.textContent = product.long_description || product.short_description || '';
        
        if (elements.image) {
            elements.image.src = product.image_url || 'assets/images/products/sys-01.webp';
            elements.image.alt = product.name;
        }
        
        // Populate Specifications
        if (elements.specsList && product.specifications) {
            elements.specsList.innerHTML = '';
            for (const [key, value] of Object.entries(product.specifications)) {
                if (!value) continue;
                const div = document.createElement('div');
                div.className = 'py-4 border-b border-[#EF7F1A]/20 flex flex-col md:flex-row md:items-center justify-between group hover:border-[#EF7F1A] transition-colors';
                div.innerHTML = `
                    <span class="text-xs font-semibold text-[#FEFEFE]/70 group-hover:text-[#EF7F1A] transition-colors uppercase tracking-widest mb-1 md:mb-0">${key}</span>
                    <span class="text-sm text-white font-light md:text-right">${value}</span>
                `;
                elements.specsList.appendChild(div);
            }
        }
        
        if (elements.delivery) elements.delivery.textContent = product.delivery || '3-4 Weeks';
        if (elements.origin) elements.origin.textContent = product.origin || 'Surat, Gujarat';
        if (elements.warranty) elements.warranty.textContent = product.warranty || '5 Years Limited';
        
    } catch (err) {
        console.error('Error fetching product:', err);
        const nameEl = document.querySelector('.product-detail-name');
        if (nameEl) nameEl.textContent = 'Product Not Found';
    }
});
</script>'''

    html = html[:script_start] + new_script + html[end_idx + 9:]
    with open('src/product-details.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("product-details.html updated")
else:
    print("Could not find PRODUCTS_DB")
