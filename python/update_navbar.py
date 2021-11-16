import os
import re

html_files = [x for x in os.listdir('..') if x.endswith('.html')]

def check(html):
    return html != ''


new_navbar = open('navbar.html').read()

if check(new_navbar):
    # update
    for f in html_files:
        current = open(f'..\{f}').read()
        match = re.search(r'<!-- NAVBAR -->.*<!-- END NAVBAR -->', current, re.DOTALL)
        new = None
        try:
            new = re.sub(match.group(), f'<!-- NAVBAR -->\n    {new_navbar}\n    <!-- END NAVBAR -->', current)
        except AttributeError:
            continue

        with open(f'..\{f}', 'w') as file_:
            file_.write(new)

    print('Update complete.')
else:
    print('Invalid html.')

# Empty navbar file
with open('navbar.html', 'w') as file_:
    file_.write('')

