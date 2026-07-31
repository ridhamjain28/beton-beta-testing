/**
 * Beton Lighting Inquiry Selection & Floating Tray System
 * Manages round blue product checkboxes across products grid & details page,
 * renders bottom-right floating inquiry pill with quick popover preview,
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

function clearInquiryShortlist() {
    localStorage.removeItem(INQUIRY_STORAGE_KEY);
    updateInquiryTrayUI();
}
window.clearInquiryShortlist = clearInquiryShortlist;

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
window.toggleInquiryProduct = toggleInquiryProduct;

function isInquirySelected(ref) {
    const list = getInquiryProducts();
    return list.some(p => p.ref === ref);
}
window.isInquirySelected = isInquirySelected;

let _popoverOpen = false;

function toggleInquiryPopover(e) {
    if (e) e.stopPropagation();
    _popoverOpen = !_popoverOpen;
    updateInquiryTrayUI();
}
window.toggleInquiryPopover = toggleInquiryPopover;

function updateInquiryTrayUI() {
    const list = getInquiryProducts();
    let tray = document.getElementById('beton-floating-inquiry-tray');

    if (!tray) {
        tray = document.createElement('div');
        tray.id = 'beton-floating-inquiry-tray';
        document.body.appendChild(tray);
    }

    const count = list.length;
    const lastItem = count > 0 ? list[count - 1] : null;
    const label = count > 0 ? (count > 1 ? `${lastItem.name} +${count - 1} more` : lastItem.name) : 'No items selected';

    if (!_popoverOpen) {
        // COLLAPSED FLOATING BAR STATE
        tray.className = 'fixed bottom-6 right-6 z-[100] bg-[#134095] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-2 transition-all duration-300 transform translate-y-0 opacity-100';
        tray.innerHTML = `
            <a href="contact.html#step-3" class="flex items-center gap-3 group text-left">
                <span class="w-7 h-7 rounded-full ${count > 0 ? 'bg-[#EF7F1A]' : 'bg-gray-500'} text-white text-xs font-bold flex items-center justify-center shadow-inner">${count}</span>
                <div class="flex flex-col text-left">
                    <span class="text-[9px] uppercase tracking-widest text-[#EF7F1A] font-bold">Inquiry Tray</span>
                    <span class="text-xs font-semibold max-w-[140px] sm:max-w-[170px] truncate text-white/90">${label}</span>
                </div>
            </a>
            
            <button type="button" onclick="toggleInquiryPopover(event)" class="ml-1 p-2 rounded-full bg-white/10 hover:bg-[#EF7F1A] text-white transition-all flex items-center justify-center" title="Expand Inquiry Tray">
                <iconify-icon icon="heroicons:chevron-up-20-solid" class="text-base block"></iconify-icon>
            </button>
        `;
    } else {
        // EXPANDED FLOATING CARD STATE (Morphs floating bar into expanded card with Chevron Down button)
        let itemsHTML = '';
        if (count === 0) {
            itemsHTML = `<div class="p-4 text-center text-xs text-gray-300 italic">Your inquiry tray is currently empty.<br>Browse products and click "+ ADD TO QUOTE".</div>`;
        } else {
            itemsHTML = list.map(item => `
                <div class="flex items-center justify-between p-2.5 bg-white/10 rounded-lg border border-white/10 gap-3">
                    <div class="flex flex-col text-left overflow-hidden">
                        <span class="text-[9px] font-mono text-[#EF7F1A] font-bold uppercase">${item.ref}</span>
                        <span class="text-xs font-semibold text-white truncate">${item.name}</span>
                    </div>
                    <button type="button" onclick="event.stopPropagation(); removeInquiryProductByRef('${item.ref}')" class="text-white/60 hover:text-red-400 p-1 rounded transition-colors" title="Remove fixture">
                        <iconify-icon icon="heroicons:x-mark-20-solid" class="text-base block"></iconify-icon>
                    </button>
                </div>
            `).join('');
        }

        tray.className = 'fixed bottom-6 right-6 z-[100] w-72 sm:w-80 bg-[#134095] text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-3 transition-all duration-300 transform translate-y-0 opacity-100';
        tray.innerHTML = `
            <!-- Header with Badge & Chevron Down (NO X BUTTON) -->
            <div class="flex justify-between items-center pb-2.5 border-b border-white/15">
                <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full ${count > 0 ? 'bg-[#EF7F1A]' : 'bg-gray-500'} text-white text-xs font-bold flex items-center justify-center shadow-inner">${count}</span>
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Inquiry Tray (${count})</span>
                </div>
                <button type="button" onclick="toggleInquiryPopover(event)" class="p-1.5 rounded-full bg-white/10 hover:bg-[#EF7F1A] text-white transition-all flex items-center justify-center" title="Collapse Inquiry Tray">
                    <iconify-icon icon="heroicons:chevron-down-20-solid" class="text-lg block"></iconify-icon>
                </button>
            </div>

            <!-- Scrollable Items List -->
            <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
                ${itemsHTML}
            </div>

            <!-- Footer Actions -->
            ${count > 0 ? `
            <div class="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                <button type="button" onclick="clearInquiryShortlist()" class="text-[10px] uppercase font-bold text-red-300 hover:text-red-100 hover:underline px-2 py-1">Clear All</button>
                <a href="contact.html#step-3" class="flex-1 inline-flex items-center justify-center gap-2 bg-[#EF7F1A] text-white py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#134095] transition-colors">
                    <span>Proceed to Quote</span>
                    <iconify-icon icon="heroicons:arrow-right-20-solid" class="text-sm"></iconify-icon>
                </a>
            </div>
            ` : ''}
        `;
    }

    // Update circular checkboxes on page to use SOLID BRAND BLUE when checked
    document.querySelectorAll('.inquiry-checkbox').forEach(cb => {
        const ref = cb.dataset.productRef;
        const parent = cb.parentElement;
        const svg = parent ? parent.querySelector('svg') : null;
        if (ref && isInquirySelected(ref)) {
            cb.checked = true;
            if (parent) {
                parent.classList.add('bg-[#134095]', 'border-[#134095]', 'text-white');
                parent.classList.remove('bg-white');
            }
            if (svg) svg.classList.remove('hidden');
        } else {
            cb.checked = false;
            if (parent) {
                parent.classList.remove('bg-[#134095]', 'border-[#134095]', 'text-white');
                parent.classList.add('bg-white');
            }
            if (svg) svg.classList.add('hidden');
        }
    });

    // Update Product Details CTA button if present
    const ctaAddBtn = document.getElementById('cta-add-to-inquiry');
    const detailsCb = document.getElementById('details-inquiry-checkbox');
    if (ctaAddBtn && detailsCb && detailsCb.dataset.productRef) {
        const activeRef = detailsCb.dataset.productRef;
        const isSelected = isInquirySelected(activeRef);
        
        if (isSelected) {
            ctaAddBtn.className = 'w-full flex items-center justify-center gap-3 bg-[#134095] text-white py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#0f3278] transition-all rounded-lg border-2 border-[#134095] shadow-md';
            ctaAddBtn.innerHTML = `
                <iconify-icon icon="heroicons:check-circle-20-solid" class="text-lg text-white"></iconify-icon>
                <span>REMOVE FROM QUOTE</span>
            `;
        } else {
            ctaAddBtn.className = 'w-full flex items-center justify-center gap-3 bg-white text-[#134095] py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#134095]/5 transition-all rounded-lg border-2 border-[#134095]';
            ctaAddBtn.innerHTML = `
                <iconify-icon icon="heroicons:plus-circle-20-solid" class="text-lg text-[#134095]"></iconify-icon>
                <span>+ ADD TO QUOTE</span>
            `;
        }
    }

    // Populate Contact Page Step 3 if present
    const contactListContainer = document.getElementById('selected-inquiry-products-list');
    if (contactListContainer) {
        if (list.length === 0) {
            contactListContainer.innerHTML = '<p class="text-xs text-gray-500 italic">No products selected for inquiry. Browse products to add.</p>';
        } else {
            contactListContainer.innerHTML = '';
            list.forEach((item) => {
                const div = document.createElement('div');
                div.className = 'p-4 border border-[#134095]/15 rounded-lg bg-[#F5F7FA] flex flex-col md:flex-row justify-between items-start md:items-center gap-4';
                div.innerHTML = `
                    <div>
                        <span class="text-[9px] font-mono text-[#EF7F1A] tracking-widest uppercase block font-bold">${item.ref}</span>
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
                        <button type="button" class="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors" onclick="removeInquiryProductByRef('${item.ref}')" title="Remove item">
                            <iconify-icon icon="heroicons:x-mark-20-solid" class="text-base block"></iconify-icon>
                        </button>
                    </div>
                `;
                contactListContainer.appendChild(div);
            });
        }
    }
}
window.updateInquiryTrayUI = updateInquiryTrayUI;

function updateProductSpec(ref, key, val) {
    let list = getInquiryProducts();
    const item = list.find(p => p.ref === ref);
    if (item) {
        item[key] = val;
        saveInquiryProducts(list);
    }
}
window.updateProductSpec = updateProductSpec;

function removeInquiryProductByRef(ref) {
    let list = getInquiryProducts().filter(p => p.ref !== ref);
    saveInquiryProducts(list);
}
window.removeInquiryProductByRef = removeInquiryProductByRef;

// Global click listener to close popover when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    updateInquiryTrayUI();

    document.addEventListener('click', e => {
        const tray = document.getElementById('beton-floating-inquiry-tray');
        if (tray && !tray.contains(e.target) && _popoverOpen) {
            _popoverOpen = false;
            updateInquiryTrayUI();
        }
    });
});

