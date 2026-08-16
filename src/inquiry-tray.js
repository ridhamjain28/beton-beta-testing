/**
 * Beton Lighting Inquiry Selection & Floating Tray System
 * Manages round blue product checkboxes across products grid & details page,
 * renders bottom-right floating inquiry pill with quick popover preview,
 * and populates contact questionnaire step 3.
 */

const INQUIRY_STORAGE_KEY = 'beton_inquiry_products';

// Inject custom seamless scrollbar CSS for floating tray
if (typeof document !== 'undefined' && !document.getElementById('inquiry-tray-custom-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'inquiry-tray-custom-styles';
    styleEl.innerHTML = `
        .inquiry-tray-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
        }
        .inquiry-tray-scrollbar::-webkit-scrollbar {
            width: 5px;
        }
        .inquiry-tray-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .inquiry-tray-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.35);
            border-radius: 9999px;
        }
        .inquiry-tray-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #EF7F1A;
        }
    `;
    document.head.appendChild(styleEl);
}

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

    // If no items selected and popover is closed, hide tray completely so it does not block buttons
    if (count === 0 && !_popoverOpen) {
        tray.style.display = 'none';
        return;
    } else {
        tray.style.display = '';
    }

    if (!_popoverOpen) {
        // COMPACT COLLAPSED FLOATING BAR STATE
        tray.className = 'fixed bottom-5 right-4 z-[100] max-w-[calc(100vw-32px)] w-auto bg-[#134095] text-white px-3 py-2 rounded-full shadow-2xl border border-white/20 flex items-center justify-between sm:justify-start gap-2.5 transition-all duration-300 transform translate-y-0 opacity-100 overflow-hidden';
        tray.innerHTML = `
            <a href="contact.html#step-3" class="flex items-center gap-2 group text-left min-w-0 flex-1 overflow-hidden">
                <span class="w-6 h-6 rounded-full bg-[#EF7F1A] text-white text-xs font-bold flex items-center justify-center shadow-inner flex-shrink-0">${count}</span>
                <div class="flex flex-col text-left min-w-0 flex-1 overflow-hidden leading-tight pr-1">
                    <span class="text-[8px] uppercase tracking-wider text-[#EF7F1A] font-bold truncate">Inquiry Tray</span>
                    <span class="text-[11px] sm:text-xs font-semibold truncate text-white/90">${label}</span>
                </div>
            </a>
            
            <button type="button" onclick="toggleInquiryPopover(event)" class="p-1.5 rounded-full bg-white/10 hover:bg-[#EF7F1A] text-white transition-all flex items-center justify-center flex-shrink-0" title="Expand Inquiry Tray">
                <iconify-icon icon="heroicons:chevron-up-20-solid" class="text-sm sm:text-base block"></iconify-icon>
            </button>
        `;
    } else {
        // COMPACT EXPANDED FLOATING CARD STATE
        let itemsHTML = '';
        if (count === 0) {
            itemsHTML = `<div class="p-3 text-center text-xs text-gray-300 italic">Your inquiry tray is currently empty.</div>`;
        } else {
            itemsHTML = list.map(item => `
                <div class="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/10 gap-2">
                    <div class="flex flex-col text-left overflow-hidden min-w-0 flex-1">
                        <span class="text-[8px] font-mono text-[#EF7F1A] font-bold uppercase">${item.ref}</span>
                        <span class="text-[11px] sm:text-xs font-semibold text-white truncate">${item.name}</span>
                    </div>
                    <button type="button" onclick="event.stopPropagation(); removeInquiryProductByRef('${item.ref}')" class="text-white/60 hover:text-red-400 p-1 rounded transition-colors flex-shrink-0" title="Remove fixture">
                        <iconify-icon icon="heroicons:x-mark-20-solid" class="text-base block"></iconify-icon>
                    </button>
                </div>
            `).join('');
            
            // Add More Products button below selected items
            itemsHTML += `
                <a href="products.html" class="flex items-center justify-center gap-1.5 py-1.5 px-3 mt-1.5 text-[9px] sm:text-[10px] uppercase font-bold text-[#EF7F1A] hover:text-white hover:bg-[#EF7F1A]/20 transition-all rounded-lg border border-dashed border-[#EF7F1A]/50 w-full text-center">
                    <iconify-icon icon="heroicons:plus-20-solid" class="text-xs"></iconify-icon>
                    <span>Add more products</span>
                </a>
            `;
        }

        tray.className = 'fixed bottom-16 right-3 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-24px)] sm:w-72 max-w-xs bg-[#134095] text-white p-3 sm:p-3.5 rounded-xl shadow-2xl border border-white/20 flex flex-col gap-2.5 transition-all duration-300 transform translate-y-0 opacity-100 overflow-hidden';
        tray.innerHTML = `
            <!-- Header with Badge & Chevron Down -->
            <div class="flex justify-between items-center pb-2 border-b border-white/15">
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full ${count > 0 ? 'bg-[#EF7F1A]' : 'bg-gray-500'} text-white text-[10px] font-bold flex items-center justify-center shadow-inner">${count}</span>
                    <span class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">Inquiry Tray</span>
                </div>
                <button type="button" onclick="toggleInquiryPopover(event)" class="p-1 rounded-full bg-white/10 hover:bg-[#EF7F1A] text-white transition-all flex items-center justify-center" title="Collapse Inquiry Tray">
                    <iconify-icon icon="heroicons:chevron-down-20-solid" class="text-base block"></iconify-icon>
                </button>
            </div>

            <!-- Scrollable Items List -->
            <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1 inquiry-tray-scrollbar">
                ${itemsHTML}
            </div>

            <!-- Footer Actions -->
            ${count > 0 ? `
            <div class="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                <button type="button" onclick="clearInquiryShortlist()" class="text-[9px] sm:text-[10px] uppercase font-bold text-red-300 hover:text-red-100 hover:underline px-1.5 py-1 flex-shrink-0">Clear All</button>
                <a href="contact.html#step-3" class="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#EF7F1A] text-white py-1.5 px-3 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#134095] transition-colors whitespace-nowrap">
                    <span>Proceed to Quote</span>
                    <iconify-icon icon="heroicons:arrow-right-20-solid" class="text-xs"></iconify-icon>
                </a>
            </div>
            ` : ''}
        `;
    }

    // Update circular checkboxes on page to use SOLID BRAND BLUE when checked
    document.querySelectorAll('.inquiry-checkbox').forEach(cb => {
        const ref = cb.dataset.productRef;
        if (ref) {
            cb.checked = isInquirySelected(ref);
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
                <iconify-icon icon="heroicons:check-20-solid" class="text-lg text-white"></iconify-icon>
                <span>REMOVE FROM QUOTE</span>
            `;
        } else {
            ctaAddBtn.className = 'w-full flex items-center justify-center gap-3 bg-white text-[#134095] py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#134095]/5 transition-all rounded-lg border-2 border-[#134095]';
            ctaAddBtn.innerHTML = `
                <iconify-icon icon="heroicons:plus-20-solid" class="text-lg text-[#134095]"></iconify-icon>
                <span>ADD TO QUOTE</span>
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
                            <option value="3000K Warm White" ${item.cct.includes('3000')||!item.cct?'selected':''}>3000K Warm White</option>
                            <option value="4000K Neutral White" ${item.cct.includes('4000')?'selected':''}>4000K Neutral White</option>
                            <option value="5000K Daylight" ${item.cct.includes('5000')?'selected':''}>5000K Daylight</option>
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

