/**
 * Beton Lighting Inquiry Selection & Floating Tray System
 * Manages round blue product checkboxes across products grid & details page,
 * renders bottom-right floating inquiry pill when products > 0,
 * and populates contact questionnaire step 3.
 */

const INQUIRY_STORAGE_KEY = 'beton_inquiry_products';

function getInquiryProducts() {
    try {
        return JSON.parse(localStorage.getItem(INQUIRY_STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function saveInquiryProducts(products) {
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(products));
    updateInquiryTrayUI();
}

function toggleInquiryProduct(product) {
    let list = getInquiryProducts();
    const index = list.findIndex(p => p.ref === product.ref);
    if (index > -1) {
        list.splice(index, 1);
    } else {
        list.push({
            ref: product.ref,
            name: product.name,
            cct: product.cct || '3000K Warm White',
            wattage: product.wattage || '12W'
        });
    }
    saveInquiryProducts(list);
}

function isInquirySelected(ref) {
    const list = getInquiryProducts();
    return list.some(p => p.ref === ref);
}

function updateInquiryTrayUI() {
    const list = getInquiryProducts();
    let tray = document.getElementById('beton-floating-inquiry-tray');

    if (!tray) {
        tray = document.createElement('div');
        tray.id = 'beton-floating-inquiry-tray';
        tray.className = 'fixed bottom-6 right-6 z-[100] transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none';
        document.body.appendChild(tray);
    }

    if (list.length > 0) {
        const lastName = list[list.length - 1].name;
        const extraCount = list.length - 1;
        const label = extraCount > 0 ? `${lastName} +${extraCount} more` : lastName;

        tray.innerHTML = `
            <a href="contact.html#step-3" class="flex items-center gap-4 bg-[#134095] text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-[#0f3278] transition-all border border-white/20 group">
                <span class="w-6 h-6 rounded-full bg-[#EF7F1A] text-white text-[11px] font-bold flex items-center justify-center">${list.length}</span>
                <div class="flex flex-col text-left">
                    <span class="text-[9px] uppercase tracking-widest text-[#EF7F1A] font-bold">Inquiry Tray</span>
                    <span class="text-xs font-semibold max-w-[160px] truncate">${label}</span>
                </div>
                <span class="text-[10px] uppercase tracking-widest font-semibold bg-white/10 px-3 py-1 rounded-full group-hover:bg-[#EF7F1A] transition-colors">Proceed →</span>
            </a>
        `;
        tray.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        tray.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    } else {
        tray.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        tray.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }

    // Update checkboxes on page
    document.querySelectorAll('.inquiry-checkbox').forEach(cb => {
        const ref = cb.dataset.productRef;
        if (ref && isInquirySelected(ref)) {
            cb.checked = true;
            cb.parentElement.classList.add('bg-[#134095]', 'border-[#134095]', 'text-white');
        } else {
            cb.checked = false;
            cb.parentElement.classList.remove('bg-[#134095]', 'border-[#134095]', 'text-white');
        }
    });

    // Populate Contact Page Step 3 if present
    const contactListContainer = document.getElementById('selected-inquiry-products-list');
    if (contactListContainer) {
        if (list.length === 0) {
            contactListContainer.innerHTML = '<p class="text-xs text-gray-500 italic">No products selected for inquiry. Browse products to add.</p>';
        } else {
            contactListContainer.innerHTML = '';
            list.forEach((item, idx) => {
                const div = document.createElement('div');
                div.className = 'p-4 border border-[#134095]/15 rounded-lg bg-[#F5F7FA] flex flex-col md:flex-row justify-between items-start md:items-center gap-4';
                div.innerHTML = `
                    <div>
                        <span class="text-[9px] font-mono text-[#EF7F1A] tracking-widest uppercase block">${item.ref}</span>
                        <h4 class="text-sm font-bold text-[#134095]">${item.name}</h4>
                    </div>
                    <div class="flex gap-3 items-center">
                        <select class="text-xs border border-gray-300 rounded px-2.5 py-1 bg-white" onchange="updateProductSpec('${item.ref}', 'cct', this.value)">
                            <option value="2700K Extra Warm" ${item.cct.includes('2700')?'selected':''}>2700K Extra Warm</option>
                            <option value="3000K Warm White" ${item.cct.includes('3000')?'selected':''}>3000K Warm White</option>
                            <option value="4000K Neutral White" ${item.cct.includes('4000')?'selected':''}>4000K Neutral White</option>
                            <option value="6500K Cool White" ${item.cct.includes('6500')?'selected':''}>6500K Cool White</option>
                        </select>
                        <select class="text-xs border border-gray-300 rounded px-2.5 py-1 bg-white" onchange="updateProductSpec('${item.ref}', 'wattage', this.value)">
                            <option value="7W" ${item.wattage==='7W'?'selected':''}>7W</option>
                            <option value="12W" ${item.wattage==='12W'?'selected':''}>12W</option>
                            <option value="18W" ${item.wattage==='18W'?'selected':''}>18W</option>
                            <option value="24W" ${item.wattage==='24W'?'selected':''}>24W</option>
                        </select>
                        <button type="button" class="text-red-500 text-xs px-2 py-1 font-bold hover:bg-red-50 rounded" onclick="removeInquiryProductByRef('${item.ref}')">✕</button>
                    </div>
                `;
                contactListContainer.appendChild(div);
            });
        }
    }
}

function updateProductSpec(ref, key, val) {
    let list = getInquiryProducts();
    const item = list.find(p => p.ref === ref);
    if (item) {
        item[key] = val;
        saveInquiryProducts(list);
    }
}

function removeInquiryProductByRef(ref) {
    let list = getInquiryProducts().filter(p => p.ref !== ref);
    saveInquiryProducts(list);
}

// Global click delegation for same page navigation
document.addEventListener('DOMContentLoaded', () => {
    updateInquiryTrayUI();

    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.href) {
            const targetUrl = new URL(link.href, window.location.origin);
            if (targetUrl.pathname === window.location.pathname && targetUrl.origin === window.location.origin && !targetUrl.hash) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
});
