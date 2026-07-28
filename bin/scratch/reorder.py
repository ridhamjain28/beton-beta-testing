import re
with open(r'd:\Github Repos\Beton-Website-folder\src\applications.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define regex patterns for each section
res_pattern = re.compile(r'(<!-- RESIDENTIAL SECTION -->.*?)(?=<!-- COMMERCIAL)', re.DOTALL)
com_pattern = re.compile(r'(<!-- COMMERCIAL / OFFICE SECTION -->.*?)(?=<!-- HOSPITALITY)', re.DOTALL)
hos_pattern = re.compile(r'(<!-- HOSPITALITY SECTION -->\s*<section.*id="hospitality".*?</section>\s*)', re.DOTALL)
ret_pattern = re.compile(r'(<section.*id="retail".*?</section>\s*)', re.DOTALL)
off_pattern = re.compile(r'(<section.*id="office".*?</section>\s*)', re.DOTALL)
hea_pattern = re.compile(r'(<section.*id="healthcare".*?</section>\s*)', re.DOTALL)

# Extract sections
res_sec = res_pattern.search(content).group(1)
com_sec = com_pattern.search(content).group(1)
hos_sec = hos_pattern.search(content).group(1)
ret_sec = ret_pattern.search(content).group(1)
off_sec = off_pattern.search(content).group(1)
hea_sec = hea_pattern.search(content).group(1)

# Combined sections block
all_sections_pattern = re.compile(r'<!-- RESIDENTIAL SECTION -->.*?(?=<!-- CTA SECTION -->)', re.DOTALL)

new_sections_block = res_sec + com_sec + "<!-- OFFICE SECTION -->\n" + off_sec + "<!-- RETAIL SECTION -->\n" + ret_sec + hos_sec + hea_sec

new_content = all_sections_pattern.sub(new_sections_block, content)

with open(r'd:\Github Repos\Beton-Website-folder\src\applications.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated sections successfully")
