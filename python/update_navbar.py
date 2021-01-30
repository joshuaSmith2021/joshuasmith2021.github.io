import os
import re
import sys

html_files = [x for x in os.listdir('..') if x.endswith('.html')]

def check(html):
    return html != ''


new_navbar = sys.stdin.read()

if check(new_navbar):
    # update
    for f in html_files:
        current = open(f'..\{f}').read()
        match = re.search(r'<!-- NAVBAR -->.*<!-- END NAVBAR -->', current, re.DOTALL)
        new = re.sub(match.group(), f'<!-- NAVBAR -->\n  {new_navbar}\n  <!-- END NAVBAR -->', current)

        with open(f'..\{f}', 'w') as file_:
            file_.write(new)

    print('Update complete.')
else:
    print('Invalid html.')

# Empty navbar file
with open('navbar.html', 'w') as file_:
    file_.write('')

