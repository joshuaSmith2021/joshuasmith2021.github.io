import json
import os
import re

import requests
from tika import parser

import tools

def parse_dashboard(path):
    raw = parser.from_file(path)
    cases = re.search(r'(\d+ ){8}\d+', raw['content']).group().split()
    percentages = re.search(r'([\d.]+% ){8}[\d.]+%', raw['content']).group().split()
    zipped = list(zip(cases, percentages))

    categories = ('Symptomatic Cases', 'Exposures to Positive Cases', 'Positive Cases')
    headers = ('Staff', 'Students', 'Total')

    result = {}

    for i in range(3):
        key = categories[i]
        result[key] = {x: {'cases': None, 'percent': None} for x in headers}

        for j, pair in enumerate(zipped[i*3:i*3 + 3]):
            count, percent = pair
            result[key][headers[j]]['cases'] = int(count)
            result[key][headers[j]]['percent'] = percent

    return result


if __name__ == '__main__':
    links = tools.get_covid_pdfs()

    pattern = r'\d+\.\d+'
    dates = [re.search(pattern, x) for x in links if re.search(pattern, x) and x != '12.14']

    existing_files = os.listdir('..\data')

    for link in links:
        date = re.search(r'\d+\.\d+', link)

        if date is None:
            continue
        elif f'{date.group()}.json' in existing_files:
            pass

        try:
            request = requests.get(link)
            with tools.PDFFile(request) as pdf:
                parsed = parse_dashboard(pdf.file_name)
                print(date.group(), '\n', parsed)
                with open(f'..\data\{date.group()}.json', 'w') as f:
                    f.write(json.dumps(parsed))

        except AttributeError:
            # Not a dashboard file, just pass
            pass

    with open('..\data\index.json', 'w') as f:
        f.write(json.dumps([f'{x.group()}.json' for x in dates]))

