import re

with open(r'd:\Github Repos\Beton-Website-folder\src\applications.html', 'r', encoding='utf-8') as f:
    content = f.read()

res_start = content.find('<!-- RESIDENTIAL SECTION -->')
com_start = content.find('<!-- COMMERCIAL / OFFICE SECTION -->')
hos_start = content.find('<!-- HOSPITALITY SECTION -->')
ret_start = content.find('<section class="border-b border-[var(--border-neutral)] scroll-mt-40 bg-[#FEFEFE]" id="retail">')
off_start = content.find('<section class="border-b border-[var(--border-neutral)] scroll-mt-40 bg-white" id="office">')
hea_start = content.find('<section class="border-b border-[var(--border-neutral)] scroll-mt-40 bg-[#FEFEFE]" id="healthcare">')
cta_start = content.find('<!-- CTA SECTION -->')

res_sec = content[res_start:com_start]
com_sec = content[com_start:hos_start]
hos_sec = content[hos_start:ret_start]
ret_sec = content[ret_start:off_start]
off_sec = content[off_start:hea_start]
hea_sec = content[hea_start:cta_start]

hos_sec = hos_sec.replace('03 / Experience', '05 / Experience')
off_sec = off_sec.replace('05 / Productivity', '03 / Productivity')

tab_nav_start = content.find('<nav class="sticky top-20 z-40')
tab_nav_end = content.find('</nav>', tab_nav_start) + 6
tab_nav = content[tab_nav_start:tab_nav_end]

new_tab_nav = """<nav class="sticky top-20 z-40 bg-[#FEFEFE]/95 backdrop-blur-md border-b border-[var(--border-neutral)] flex px-8 lg:px-16 overflow-x-auto no-scrollbar">
<a class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 border-transparent hover:border-[#EF7F1A] transition-all whitespace-nowrap" href="#residential" id="tab-res">01 Residential</a>
<a class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 border-transparent hover:border-[#EF7F1A] transition-all whitespace-nowrap" href="#commercial" id="tab-com">02 Commercial</a>
<a class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 border-transparent hover:border-[#EF7F1A] transition-all whitespace-nowrap" href="#office" id="tab-off">03 Office</a>
<a class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 border-transparent hover:border-[#EF7F1A] transition-all whitespace-nowrap" href="#retail" id="tab-ret">04 Retail</a>
<a class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 border-transparent hover:border-[#EF7F1A] transition-all whitespace-nowrap" href="#hospitality" id="tab-hos">05 Hospitality</a>
<a class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 border-transparent hover:border-[#EF7F1A] transition-all whitespace-nowrap" href="#healthcare" id="tab-hea">06 Healthcare</a>
</nav>"""

new_content = content[:tab_nav_start] + new_tab_nav + content[tab_nav_end:res_start] + res_sec + com_sec + off_sec + ret_sec + hos_sec + hea_sec + content[cta_start:]

with open(r'd:\Github Repos\Beton-Website-folder\src\applications.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
