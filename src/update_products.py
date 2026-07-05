import re

with open("d:/Github Repos/Beton-Website/src/products.html", "r", encoding="utf-8") as f:
    html = f.read()

new_main = """<main class="px-8 lg:px-16 py-12">
<nav class="mb-12 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#003D82]/50">
<a class="hover:text-[#FF6B35] transition-colors" href="index.html" id="breadcrumb-home">Home</a><iconify-icon class="text-[8px]" icon="lucide:chevron-right"></iconify-icon><span class="text-[#003D82]">Architectural Products</span>
</nav>
<div class="flex flex-col lg:flex-row gap-16">
<aside class="lg:w-64 flex-shrink-0 space-y-12">
<div class="space-y-6">
<h4 class="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[var(--border-neutral)] pb-2">Categories</h4>
<ul class="space-y-3" id="category-filters">
<li class="flex items-center justify-between group cursor-pointer category-filter" data-category="all">
<span class="text-xs uppercase tracking-wider font-medium text-[#FF6B35] cat-text">All Products</span>
<span class="text-[10px] text-[#003D82]/30">18</span>
</li>
<li class="flex items-center justify-between group cursor-pointer hover:text-[#FF6B35] transition-colors category-filter" data-category="indoor">
<span class="text-xs uppercase tracking-wider font-medium text-[#003D82]/60 cat-text">Indoor Lighting</span>
<span class="text-[10px] text-[#003D82]/30">9</span>
</li>
<li class="flex items-center justify-between group cursor-pointer hover:text-[#FF6B35] transition-colors category-filter" data-category="outdoor">
<span class="text-xs uppercase tracking-wider font-medium text-[#003D82]/60 cat-text">Outdoor Lighting</span>
<span class="text-[10px] text-[#003D82]/30">3</span>
</li>
<li class="flex items-center justify-between group cursor-pointer hover:text-[#FF6B35] transition-colors category-filter" data-category="magnetic">
<span class="text-xs uppercase tracking-wider font-medium text-[#003D82]/60 cat-text">Magnetic Systems</span>
<span class="text-[10px] text-[#003D82]/30">3</span>
</li>
<li class="flex items-center justify-between group cursor-pointer hover:text-[#FF6B35] transition-colors category-filter" data-category="strip">
<span class="text-xs uppercase tracking-wider font-medium text-[#003D82]/60 cat-text">Strip & Profiles</span>
<span class="text-[10px] text-[#003D82]/30">3</span>
</li>
</ul>
</div>
<div class="space-y-6">
<h4 class="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[var(--border-neutral)] pb-2">Optics & Beam</h4>
<div class="space-y-2">
<label class="flex items-center gap-3 cursor-pointer group optics-filter" data-optics="narrow">
<input type="checkbox" class="hidden" />
<div class="w-3 h-3 border border-[var(--border-neutral)] flex items-center justify-center group-hover:border-[#FF6B35]">
<div class="w-1.5 h-1.5 indicator bg-[#FF6B35] hidden"></div>
</div>
<span class="text-[10px] uppercase tracking-widest text-[#003D82]/60 filter-text">Narrow (15°-24°)</span>
</label>
<label class="flex items-center gap-3 cursor-pointer group optics-filter" data-optics="medium">
<input type="checkbox" class="hidden" />
<div class="w-3 h-3 border border-[var(--border-neutral)] flex items-center justify-center group-hover:border-[#FF6B35]">
<div class="w-1.5 h-1.5 indicator bg-[#FF6B35] hidden"></div>
</div>
<span class="text-[10px] uppercase tracking-widest text-[#003D82]/60 filter-text">Medium (36°)</span>
</label>
<label class="flex items-center gap-3 cursor-pointer group optics-filter" data-optics="wide">
<input type="checkbox" class="hidden" />
<div class="w-3 h-3 border border-[var(--border-neutral)] flex items-center justify-center group-hover:border-[#FF6B35]">
<div class="w-1.5 h-1.5 indicator bg-[#FF6B35] hidden"></div>
</div>
<span class="text-[10px] uppercase tracking-widest text-[#003D82]/60 filter-text">Wide (60°+)</span>
</label>
</div>
</div>
<div class="space-y-6">
<h4 class="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[var(--border-neutral)] pb-2">IP Rating</h4>
<div class="flex flex-wrap gap-2">
<button class="px-3 py-1 border border-[var(--border-neutral)] text-[9px] uppercase tracking-widest font-bold text-[#003D82]/50 hover:border-[#003D82] transition-colors ip-filter" data-ip="IP20">IP20</button>
<button class="px-3 py-1 border border-[var(--border-neutral)] text-[9px] uppercase tracking-widest font-bold text-[#003D82]/50 hover:border-[#003D82] transition-colors ip-filter" data-ip="IP44">IP44</button>
<button class="px-3 py-1 border border-[var(--border-neutral)] text-[9px] uppercase tracking-widest font-bold text-[#003D82]/50 hover:border-[#003D82] transition-colors ip-filter" data-ip="IP65">IP65</button>
<button class="px-3 py-1 border border-[var(--border-neutral)] text-[9px] uppercase tracking-widest font-bold text-[#003D82]/50 hover:border-[#003D82] transition-colors ip-filter" data-ip="IP67">IP67</button>
</div>
</div>
<div class="p-6 bg-[#003D82] text-white space-y-4">
<h5 class="text-[10px] uppercase tracking-[0.2em] font-bold">Need Technical Support?</h5>
<p class="text-[10px] leading-relaxed opacity-60">Our engineers are available for specification assistance and IES file requests.</p>
<a class="block text-center border border-[#FF6B35] text-[#FF6B35] py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-[#FF6B35] hover:text-white transition-all" href="contact.html" id="sidebar-inquiry-btn">Request Consultation</a>
</div>
</aside>
<div class="flex-1">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8" id="product-grid">

<!-- PRODUCT 1 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="medium" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Apex Downlight" class="w-full h-auto image-grayscale group-hover:scale-110 object-contain" loading="lazy" src="assets/images/products/sys-01.webp"/>
<div class="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 border border-[var(--border-neutral)] text-[8px] uppercase tracking-widest font-bold">IP20</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. B-204</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Indoor Lighting</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Apex Recessed Downlight</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">A deep-recessed luminaire featuring precision optics for high-visual comfort architectural integration.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Wattage</span><span>12W - 20W</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Lumen</span><span>1100 lm</span></div>
</div>
</div>
</a>

<!-- PRODUCT 2 -->
<a class="group block product-card" href="product-details.html" data-category="magnetic" data-optics="narrow" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Mag-Track" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-1.webp"/>
<div class="absolute top-4 right-4 bg-[#FF6B35] text-white px-2 py-1 text-[8px] uppercase tracking-widest font-bold">New</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. M-992</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Magnetic Systems</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Mag-Track Linear Pro</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Modular 48V magnetic track system with tool-free positioning and seamless lighting modules.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">CCT</span><span>2700K - 4000K</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">CRI</span><span>90+</span></div>
</div>
</div>
</a>

<!-- PRODUCT 3 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="narrow" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Zenith" class="w-full h-auto image-grayscale group-hover:scale-110 object-contain" loading="lazy" src="assets/images/products/sys-01.png"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. S-441</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Surface Luminaire</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Zenith Surface 150</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">A minimalist surface-mounted cylinder with integrated high-output drivers and anti-glare louvers.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Optics</span><span>15° / 24° / 36°</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Finish</span><span>Black / White</span></div>
</div>
</div>
</a>

<!-- PRODUCT 4 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="wide" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Flux Driver" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-4.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. P-102</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Accessories</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Flux Dali-2 Driver</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Universal DALI-2 dimmable driver for precise control and flicker-free architectural performance.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Control</span><span>DALI-2 / PUSH</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Voltage</span><span>220-240V</span></div>
</div>
</div>
</a>

<!-- PRODUCT 5 -->
<a class="group block product-card" href="product-details.html" data-category="strip" data-optics="medium" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Linear Profile" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-2.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. L-550</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Strip & Profiles</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Matrix 20 Profile</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Slim architectural extrusion for continuous linear lighting with uniform opal diffusers.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Length</span><span>Custom Max 3m</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Mount</span><span>Recessed</span></div>
</div>
</div>
</a>

<!-- PRODUCT 6 -->
<a class="group block product-card" href="product-details.html" data-category="outdoor" data-optics="wide" data-ip="IP67">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Outdoor Flood" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/innova.png"/>
<div class="absolute top-4 right-4 bg-[#003D82] text-white px-2 py-1 text-[8px] uppercase tracking-widest font-bold">IP67</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. W-881</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Outdoor Lighting</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Titan Flood Washer</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Robust IP67 wall washer with asymmetric optics for facade illumination and landscape detailing.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Body</span><span>CNC Aluminum</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Output</span><span>3200 lm</span></div>
</div>
</div>
</a>

<!-- PRODUCT 7 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="medium" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Apex Downlight" class="w-full h-auto image-grayscale group-hover:scale-110 object-contain" loading="lazy" src="assets/images/products/sys-01.webp"/>
<div class="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 border border-[var(--border-neutral)] text-[8px] uppercase tracking-widest font-bold">IP20</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. B-205</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Indoor Lighting</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Apex Recessed Round</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">A deep-recessed luminaire featuring precision optics for high-visual comfort architectural integration.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Wattage</span><span>12W - 20W</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Lumen</span><span>1100 lm</span></div>
</div>
</div>
</a>

<!-- PRODUCT 8 -->
<a class="group block product-card" href="product-details.html" data-category="magnetic" data-optics="narrow" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Mag-Track" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-1.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. M-993</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Magnetic Systems</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Mag-Track Spot Pro</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Modular 48V magnetic track system with tool-free positioning and seamless lighting modules.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">CCT</span><span>2700K - 4000K</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">CRI</span><span>90+</span></div>
</div>
</div>
</a>

<!-- PRODUCT 9 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="narrow" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Zenith" class="w-full h-auto image-grayscale group-hover:scale-110 object-contain" loading="lazy" src="assets/images/products/sys-01.png"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. S-442</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Surface Luminaire</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Zenith Surface 200</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">A minimalist surface-mounted cylinder with integrated high-output drivers and anti-glare louvers.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Optics</span><span>15° / 24° / 36°</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Finish</span><span>Black / White</span></div>
</div>
</div>
</a>

<!-- PRODUCT 10 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="wide" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Flux Driver" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-4.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. P-103</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Accessories</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Flux Dali-2 Mini</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Universal DALI-2 dimmable driver for precise control and flicker-free architectural performance.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Control</span><span>DALI-2 / PUSH</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Voltage</span><span>220-240V</span></div>
</div>
</div>
</a>

<!-- PRODUCT 11 -->
<a class="group block product-card" href="product-details.html" data-category="strip" data-optics="medium" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Linear Profile" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-2.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. L-551</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Strip & Profiles</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Matrix 40 Profile</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Slim architectural extrusion for continuous linear lighting with uniform opal diffusers.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Length</span><span>Custom Max 3m</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Mount</span><span>Recessed</span></div>
</div>
</div>
</a>

<!-- PRODUCT 12 -->
<a class="group block product-card" href="product-details.html" data-category="outdoor" data-optics="wide" data-ip="IP67">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Outdoor Flood" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/innova.png"/>
<div class="absolute top-4 right-4 bg-[#003D82] text-white px-2 py-1 text-[8px] uppercase tracking-widest font-bold">IP67</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. W-882</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Outdoor Lighting</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Titan Mini Washer</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Robust IP67 wall washer with asymmetric optics for facade illumination and landscape detailing.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Body</span><span>CNC Aluminum</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Output</span><span>3200 lm</span></div>
</div>
</div>
</a>

<!-- PRODUCT 13 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="medium" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Apex Downlight" class="w-full h-auto image-grayscale group-hover:scale-110 object-contain" loading="lazy" src="assets/images/products/sys-01.webp"/>
<div class="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 border border-[var(--border-neutral)] text-[8px] uppercase tracking-widest font-bold">IP20</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. B-206</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Indoor Lighting</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Apex Recessed Trimless</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">A deep-recessed luminaire featuring precision optics for high-visual comfort architectural integration.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Wattage</span><span>12W - 20W</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Lumen</span><span>1100 lm</span></div>
</div>
</div>
</a>

<!-- PRODUCT 14 -->
<a class="group block product-card" href="product-details.html" data-category="magnetic" data-optics="narrow" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Mag-Track" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-1.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. M-994</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Magnetic Systems</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Mag-Track Linear Mini</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Modular 48V magnetic track system with tool-free positioning and seamless lighting modules.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">CCT</span><span>2700K - 4000K</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">CRI</span><span>90+</span></div>
</div>
</div>
</a>

<!-- PRODUCT 15 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="narrow" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Zenith" class="w-full h-auto image-grayscale group-hover:scale-110 object-contain" loading="lazy" src="assets/images/products/sys-01.png"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. S-443</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Surface Luminaire</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Zenith Surface 300</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">A minimalist surface-mounted cylinder with integrated high-output drivers and anti-glare louvers.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Optics</span><span>15° / 24° / 36°</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Finish</span><span>Black / White</span></div>
</div>
</div>
</a>

<!-- PRODUCT 16 -->
<a class="group block product-card" href="product-details.html" data-category="indoor" data-optics="wide" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Flux Driver" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-4.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. P-104</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Accessories</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Flux Dali-2 Pro</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Universal DALI-2 dimmable driver for precise control and flicker-free architectural performance.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Control</span><span>DALI-2 / PUSH</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Voltage</span><span>220-240V</span></div>
</div>
</div>
</a>

<!-- PRODUCT 17 -->
<a class="group block product-card" href="product-details.html" data-category="strip" data-optics="medium" data-ip="IP20">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Linear Profile" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/render-2.webp"/>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. L-552</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Strip & Profiles</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Matrix 60 Profile</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Slim architectural extrusion for continuous linear lighting with uniform opal diffusers.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Length</span><span>Custom Max 3m</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Mount</span><span>Recessed</span></div>
</div>
</div>
</a>

<!-- PRODUCT 18 -->
<a class="group block product-card" href="product-details.html" data-category="outdoor" data-optics="wide" data-ip="IP67">
<div class="aspect-square bg-white border border-[var(--border-neutral)] mb-6 flex items-center justify-center p-12 overflow-hidden relative">
<img alt="Outdoor Flood" class="w-full h-auto image-grayscale group-hover:scale-110 object-cover" loading="lazy" src="assets/images/products/innova.png"/>
<div class="absolute top-4 right-4 bg-[#003D82] text-white px-2 py-1 text-[8px] uppercase tracking-widest font-bold">IP67</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-baseline"><span class="text-[10px] text-[#FF6B35] font-mono tracking-widest">Ref. W-883</span><span class="text-[8px] uppercase tracking-widest text-[#003D82]/40">Outdoor Lighting</span></div>
<h3 class="text-lg font-serif uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">Titan Flood Max</h3>
<p class="text-[11px] leading-relaxed text-[#003D82]/60 line-clamp-2">Robust IP67 wall washer with asymmetric optics for facade illumination and landscape detailing.</p>
<div class="pt-4 flex gap-4 text-[9px] uppercase tracking-widest font-semibold border-t border-[var(--border-neutral)]">
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Body</span><span>CNC Aluminum</span></div>
<div class="flex flex-col gap-1"><span class="text-[8px] font-normal text-[#003D82]/40">Output</span><span>3200 lm</span></div>
</div>
</div>
</a>

</div>
<div class="mt-24 border-t border-[var(--border-neutral)] pt-12 flex justify-between items-center" id="pagination-container">
<div class="flex gap-4">
<button class="w-10 h-10 border border-[#003D82] flex items-center justify-center text-[10px] font-bold bg-[#003D82] text-white pagination-btn" data-page="1">01</button>
<button class="w-10 h-10 border border-[var(--border-neutral)] flex items-center justify-center text-[10px] font-bold hover:border-[#003D82] transition-colors text-[#003D82]/50 pagination-btn" data-page="2">02</button>
<button class="w-10 h-10 border border-[var(--border-neutral)] flex items-center justify-center text-[10px] font-bold hover:border-[#003D82] transition-colors text-[#003D82]/50 pagination-btn" data-page="3">03</button>
</div>
<button class="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold group" id="next-page-btn">
Next Archive <iconify-icon class="group-hover:translate-x-2 transition-transform" icon="lucide:arrow-right"></iconify-icon>
</button>
</div>
</div>
</div>
</main>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const products = Array.from(document.querySelectorAll('.product-card'));
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const opticsFilters = document.querySelectorAll('.optics-filter');
    const ipFilters = document.querySelectorAll('.ip-filter');
    const nextPageBtn = document.getElementById('next-page-btn');
    
    let currentPage = 1;
    const itemsPerPage = 6;
    let activeCategory = 'all';
    let activeOptics = [];
    let activeIP = [];

    function updateFilters() {
        const filtered = products.filter(p => {
            const cat = p.dataset.category;
            const optics = p.dataset.optics;
            const ip = p.dataset.ip;
            
            const matchCat = activeCategory === 'all' || cat === activeCategory;
            const matchOptics = activeOptics.length === 0 || activeOptics.includes(optics);
            const matchIP = activeIP.length === 0 || activeIP.includes(ip);
            
            return matchCat && matchOptics && matchIP;
        });

        products.forEach(p => p.style.display = 'none');

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        filtered.slice(start, end).forEach(p => p.style.display = 'block');

        paginationBtns.forEach(btn => {
            const page = parseInt(btn.dataset.page);
            if (page > totalPages) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'flex';
                if (page === currentPage) {
                    btn.classList.replace('border-[var(--border-neutral)]', 'border-[#003D82]');
                    btn.classList.add('bg-[#003D82]', 'text-white');
                    btn.classList.remove('text-[#003D82]/50');
                } else {
                    btn.classList.replace('border-[#003D82]', 'border-[var(--border-neutral)]');
                    btn.classList.remove('bg-[#003D82]', 'text-white');
                    btn.classList.add('text-[#003D82]/50');
                }
            }
        });
        
        if (currentPage >= totalPages) {
            nextPageBtn.style.display = 'none';
        } else {
            nextPageBtn.style.display = 'flex';
        }
    }

    paginationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            updateFilters();
        });
    });
    
    nextPageBtn.addEventListener('click', () => {
        const filtered = products.filter(p => {
            const cat = p.dataset.category;
            const optics = p.dataset.optics;
            const ip = p.dataset.ip;
            return (activeCategory === 'all' || cat === activeCategory) &&
                   (activeOptics.length === 0 || activeOptics.includes(optics)) &&
                   (activeIP.length === 0 || activeIP.includes(ip));
        });
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateFilters();
        }
    });

    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => {
                const text = f.querySelector('.cat-text');
                text.classList.remove('text-[#FF6B35]');
                text.classList.add('text-[#003D82]/60');
            });
            const activeText = filter.querySelector('.cat-text');
            activeText.classList.remove('text-[#003D82]/60');
            activeText.classList.add('text-[#FF6B35]');
            
            activeCategory = filter.dataset.category;
            currentPage = 1;
            updateFilters();
        });
    });

    opticsFilters.forEach(filter => {
        const checkbox = filter.querySelector('input');
        filter.addEventListener('click', (e) => {
            e.preventDefault(); 
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                activeOptics.push(filter.dataset.optics);
                filter.querySelector('.indicator').classList.remove('hidden');
                filter.querySelector('.filter-text').classList.remove('text-[#003D82]/60');
                filter.querySelector('.filter-text').classList.add('text-[#FF6B35]');
            } else {
                activeOptics = activeOptics.filter(o => o !== filter.dataset.optics);
                filter.querySelector('.indicator').classList.add('hidden');
                filter.querySelector('.filter-text').classList.add('text-[#003D82]/60');
                filter.querySelector('.filter-text').classList.remove('text-[#FF6B35]');
            }
            currentPage = 1;
            updateFilters();
        });
    });

    ipFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const ip = filter.dataset.ip;
            if (activeIP.includes(ip)) {
                activeIP = activeIP.filter(i => i !== ip);
                filter.classList.add('border-[var(--border-neutral)]', 'text-[#003D82]/50');
                filter.classList.remove('border-[#003D82]', 'text-[#003D82]');
            } else {
                activeIP.push(ip);
                filter.classList.remove('border-[var(--border-neutral)]', 'text-[#003D82]/50');
                filter.classList.add('border-[#003D82]', 'text-[#003D82]');
            }
            currentPage = 1;
            updateFilters();
        });
    });

    updateFilters();
});
</script>
<footer class="py-24 px-8 lg:px-16 bg-[#003D82] text-[#Fdfbf9]">"""

pattern = r"<main.*?</main>\s*<footer class=\"py-24 px-8 lg:px-16 bg-\[#003D82\] text-\[#Fdfbf9\]\">"
res = re.sub(pattern, new_main, html, flags=re.DOTALL)

with open("d:/Github Repos/Beton-Website/src/products.html", "w", encoding="utf-8") as f:
    f.write(res)
print("Updated successfully")
