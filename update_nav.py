import os
import re
import glob

html_files = glob.glob('d:/Github Repos/Beton-Website-folder/src/*.html')

for filepath in html_files:
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The links look like:
    # Desktop: <a class="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-[#EF7F1A] transition-colors..." href="...">
    # Mobile: <a class="text-lg uppercase tracking-[0.2em] font-medium hover:text-[#EF7F1A] transition-colors..." href="...">

    # First, remove text-[#EF7F1A] and italic from all nav links so we can start clean
    content = re.sub(
        r'class="text-\[10px\] uppercase tracking-\[0\.2em\] font-medium hover:text-\[#EF7F1A\] transition-colors[^"]*"', 
        r'class="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-[#EF7F1A] transition-colors"', 
        content
    )
    content = re.sub(
        r'class="text-lg uppercase tracking-\[0\.2em\] font-medium hover:text-\[#EF7F1A\] transition-colors[^"]*"',
        r'class="text-lg uppercase tracking-[0.2em] font-medium hover:text-[#EF7F1A] transition-colors"',
        content
    )

    # Add text-[#EF7F1A] italic to the links that match the current filename
    desktop_regex = r'(class="text-\[10px\] uppercase tracking-\[0\.2em\] font-medium hover:text-\[#EF7F1A\] transition-colors)(" href="' + re.escape(filename) + r'")'
    content = re.sub(desktop_regex, r'\1 text-[#EF7F1A] italic\2', content)

    mobile_regex = r'(class="text-lg uppercase tracking-\[0\.2em\] font-medium hover:text-\[#EF7F1A\] transition-colors)(" href="' + re.escape(filename) + r'")'
    content = re.sub(mobile_regex, r'\1 text-[#EF7F1A] italic\2', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML navigation links updated.")
