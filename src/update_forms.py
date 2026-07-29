import os
import re

directory = 'd:/Github Repos/Beton-Website-folder/src'

supabase_scripts = """<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-client.js"></script>"""

newsletter_old = """            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            })"""
newsletter_new = """            // Send to Web3Forms
            const web3Promise = fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            });

            // Send to Supabase
            const supabasePromise = typeof supabase !== 'undefined' 
                ? supabase.from('inquiries').insert([{ 
                    name: 'Newsletter Subscriber', 
                    email: emailInput.value, 
                    message: 'Newsletter Subscription' 
                  }])
                : Promise.resolve();

            Promise.all([web3Promise, supabasePromise])
            .then(responses => responses[0].json())"""

contact_old = """            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })"""

contact_new = """            const web3Promise = fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const supabasePromise = typeof supabase !== 'undefined'
                ? supabase.from('inquiries').insert([{
                    name: form.name.value,
                    email: form.email.value,
                    message: form.message.value
                }])
                : Promise.resolve();

            Promise.all([web3Promise, supabasePromise])
            .then(async (responses) => {
                const response = responses[0];"""

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        modified = False

        # Add supabase scripts if not present
        if "supabase-client.js" not in content and filename not in ['admin.html']:
            # Find the last <script> or before </body>
            content = content.replace("</body>", f"{supabase_scripts}\n</body>")
            modified = True

        # Update newsletter
        if newsletter_old in content:
            content = content.replace(newsletter_old, newsletter_new)
            modified = True

        # Update contact form
        if filename == 'contact.html' and contact_old in content:
            content = content.replace(contact_old, contact_new)
            # Fix the .then(async (response) => { to handle the array
            content = content.replace(".then(async (response) => {", "") # Handled in contact_new
            modified = True
            
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename}")
