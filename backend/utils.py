from fuzzywuzzy import fuzz
import pymupdf
from difflib import SequenceMatcher

def get_references_from_response(json_response):
    sources = []
    for texts in json_response['citations']:
        file_source = texts['file_source']
        text = texts['text']
        page_no = texts['page_no']
        sources.append({
            "text" : text,
            "page_no" : page_no,
            "source" : file_source
        })
    return sources

def plot_sources_on_pdf(temp_dir,json_response):
    image_paths = []
    page_objs = {}
    coords = []
    for i, texts in enumerate(json_response['citations']):
        text = texts['text']
        page_no = texts['page_no'] - 1
        file_source = texts['file_source']
        doc = pymupdf.open(file_source)
        if page_no not in page_objs:
            page = doc[page_no]
            page_objs[page_no] = page
        else:
            page = page_objs[page_no]
        for block in doc[page_no].get_text("blocks"):
            x1, y1, x2, y2, actual, block_no, block_type = block
            if fuzz.ratio(text.lower(), actual.lower()) >= 50:
                page.draw_rect([x1, y1, x2, y2], color=(1, 0, 0), width=2)  # Red rectangle
                coords.append((x1, y1, x2, y2))
                print(actual)
        
    for page_no, page in page_objs.items():
        pix = page.get_pixmap()
        output_image_path = f"{temp_dir}/output_page_{page_no + 1}.png"
        pix.save(output_image_path)
        image_paths.append(output_image_path)
    return image_paths

       