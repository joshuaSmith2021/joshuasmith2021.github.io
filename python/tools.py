import os
from uuid import uuid4

from bs4 import BeautifulSoup, SoupStrainer
import requests

class PDFFile:
    def __init__(self, request):
        self.content = request.content

    def __enter__(self):
        self.file_name = str(uuid4()).split('-')[0]

        with open(self.file_name, 'wb') as f:
            f.write(self.content)

        return self

    def __exit__(self, type, value, traceback):
        os.remove(self.file_name)


def get_covid_pdfs():
    url = 'https://www.rocklinusd.org/COVID-19-Resources/Current-Status-of-RUSD/Weekly-COVID-Exposures/'
    request = requests.get(url)
    html = request.text

    strainer = SoupStrainer('table')
    soup = BeautifulSoup(html, 'lxml', parse_only=strainer)

    hrefs = soup.find_all('a', href=True)
    links = [f'https://www.rocklinusd.org/{x["href"]}' for x in hrefs]

    return links


if __name__ == '__main__':
    links = get_covid_pdfs()
    latest = links[0]

    request = requests.get(latest)
    with PDFFile(request) as pdf:
        parse_dashboard(pdf.file_name)

