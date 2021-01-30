import os
import re

html_files = [x for x in os.listdir('..') if x.endswith('.html')]

def check(html):
    return html != ''


def update(x):
    print(x)


while True:
    new_navbar = input('Input navbar html:\n')

    if check(new_navbar):
        # update
        for f in html_files:
            current = open(f'..\{f}').read()
            match = re.search(r'<!-- NAVBAR -->.*<!-- END NAVBAR -->', current, re.DOTALL)
            new = re.sub(match.group(), f'<!-- NAVBAR -->\n{new_navbar}\n  <!-- END NAVBAR -->', current)
            print(new)

        print('Update complete.')
        break

    print('Invalid html. ', end='')

