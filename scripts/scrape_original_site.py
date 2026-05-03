#!/usr/bin/env python3
import json, re, time
from pathlib import Path
from urllib.parse import urljoin, urlparse, quote
import requests
from bs4 import BeautifulSoup

BASE='https://www.knights-motorcycles.co.uk/'
OUT=Path('data/original-site')
IMG_OUT=Path('public/images/original-stock')
OUT.mkdir(parents=True, exist_ok=True)
IMG_OUT.mkdir(parents=True, exist_ok=True)
S=requests.Session()
S.headers.update({'User-Agent':'Mozilla/5.0 OpenClaw site migration audit'})

def slugify(s):
    s=s.lower().replace('&','and')
    s=re.sub(r'[^a-z0-9]+','-',s).strip('-')
    return s[:90]

def clean(t):
    return re.sub(r'\s+',' ',(t or '').strip())

def parse_price(text):
    m=re.search(r'£\s*([0-9,]+)', text)
    return int(m.group(1).replace(',','')) if m else None

def parse_mileage(text):
    m=re.search(r'Mileage:\s*([0-9,]+)\s*miles', text, re.I)
    if not m: m=re.search(r'([0-9,]+)\s*(?:miles|mi)\b', text, re.I)
    return int(m.group(1).replace(',','')) if m else None

def parse_year(text):
    m=re.search(r'Year:\s*((?:19|20)\d{2})', text, re.I)
    if not m: m=re.search(r'\b((?:19|20)\d{2})\b', text)
    return int(m.group(1)) if m else None

def download_image(url, bike_slug, idx):
    ext=Path(urlparse(url).path).suffix or '.webp'
    if ext.lower() not in ['.jpg','.jpeg','.png','.webp','.gif']:
        ext='.webp'
    dest=IMG_OUT / f'{bike_slug}-{idx:02d}{ext.lower()}'
    if dest.exists() and dest.stat().st_size>1000:
        return '/' + str(dest.relative_to('public'))
    try:
        r=S.get(url, timeout=30)
        r.raise_for_status()
        dest.write_bytes(r.content)
        return '/' + str(dest.relative_to('public'))
    except Exception as e:
        print('image_error', url, e)
        return url

home=S.get(BASE, timeout=30)
home.raise_for_status()
home_soup=BeautifulSoup(home.text,'html.parser')
links=[]
for a in home_soup.find_all('a', href=True):
    href=a['href']
    label=clean(a.get_text(' ', strip=True))
    if 'On Sale/' in href or '/On%20Sale/' in href:
        full=urljoin(BASE, href)
        if full not in [x['url'] for x in links]:
            links.append({'label':label,'url':full})

bikes=[]
for n, link in enumerate(links,1):
    print(f'fetch {n}/{len(links)} {link["url"]}')
    r=S.get(link['url'], timeout=30)
    r.raise_for_status()
    soup=BeautifulSoup(r.text,'html.parser')
    title=clean((soup.title.string if soup.title else '') or link['label'].split('•')[0])
    slug=slugify(title)
    page_text=soup.get_text('\n', strip=True)
    # specs: consecutive table-ish text is hard, so collect rows if table exists plus regex fallback
    specs={}
    for tr in soup.find_all('tr'):
        cells=[clean(c.get_text(' ', strip=True)) for c in tr.find_all(['th','td'])]
        if len(cells)>=2:
            specs[cells[0]]=cells[1]
    for key in ['Year','Colour','Manufacturer','Model','Condition','Location','Previous Owners (excl. current)','Type','Color']:
        if key not in specs:
            m=re.search(rf'{re.escape(key)}\n([^\n]+)', page_text, re.I)
            if m: specs[key]=clean(m.group(1))
    status='SOLD' if re.search(r'\bSOLD\b', link['label'], re.I) else 'AVAILABLE'
    price=parse_price(link['label']) or parse_price(page_text)
    year=parse_year(link['label']) or parse_year(page_text)
    mileage=parse_mileage(link['label']) or parse_mileage(page_text)
    typem=re.search(r'Type:\s*([^•]+)', link['label'], re.I)
    colorm=re.search(r'Color:\s*([^•]+)', link['label'], re.I)
    style=clean(typem.group(1)) if typem else specs.get('Type','Motorcycle')
    colour=clean(colorm.group(1)) if colorm else specs.get('Colour') or specs.get('Color')
    imgs=[]
    seen=set()
    for idx,img in enumerate(soup.find_all('img'),1):
        src=img.get('src') or img.get('data-src')
        if not src: continue
        full=urljoin(link['url'], src)
        if full in seen: continue
        seen.add(full)
        if 'ebayimg.com' in full or '/images/' in full:
            imgs.append({'source':full,'local':download_image(full, slug, len(imgs)+1),'alt':img.get('alt') or title})
    # Split into sections roughly
    lines=[x.strip() for x in page_text.split('\n') if x.strip()]
    # remove nav/search noise
    noise={'Knights-Motorcycles','Search','CTRL + K','Enter to select','to navigate','ESC to close'}
    content=[x for x in lines if x not in noise]
    summary=''
    if title in content:
        i=content.index(title)
        # often title repeats, take after second occurrence/contact
        snippet=[]
        for line in content[i+1:]:
            if line in ['Contact seller','Add to Watchlist','Key Specifications','Specification','Details']:
                continue
            snippet.append(line)
            if len(' '.join(snippet))>450: break
        summary=' '.join(snippet)
    bikes.append({
        'slug':slug,
        'title':title,
        'status':status,
        'price':price,
        'year':year,
        'mileage':mileage,
        'type':style,
        'colour':colour,
        'sourceUrl':link['url'],
        'listingText':link['label'],
        'specs':specs,
        'summary':summary,
        'images':imgs,
        'rawText':page_text,
    })
    (OUT / f'{slug}.txt').write_text(page_text, encoding='utf-8')
    time.sleep(0.2)

result={'source':BASE,'scrapedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),'count':len(bikes),'bikes':bikes}
(OUT/'bikes.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
print('done', len(bikes), 'bikes', 'images', sum(len(b['images']) for b in bikes))
