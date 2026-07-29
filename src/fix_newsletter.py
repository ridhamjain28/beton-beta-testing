import os

directory = 'd:/Github Repos/Beton-Website-folder/src'

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        bad_code = """.then(responses => responses[0].json())
            .then(response => response.json())"""
            
        good_code = """.then(responses => responses[0])
            .then(response => response.json())"""
            
        if bad_code in content:
            content = content.replace(bad_code, good_code)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {filename}")
