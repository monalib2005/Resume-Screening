# analyze_resume.py

import sys
import io
import re
import json
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import spacy

nlp = spacy.load("en_core_web_sm")

def extract_name(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return "Not found"
def extract_text(pdf_stream):
    reader = PyPDF2.PdfReader(pdf_stream)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ''
    return text

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else "Not found"

# def extract_name(text):
#     lines = text.strip().split('\n')
#     for line in lines:
#         if len(line.split()) in [2, 3] and line[0].isupper():
#             return line.strip()
#     return "Not found"

def calculate_match_score(resume_text, job_description):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text.lower(), job_description.lower()])
    score = cosine_similarity(vectors[0], vectors[1])[0][0]
    return round(score * 100, 2)

def main():
    resume_path = sys.argv[1]
    job_description = sys.argv[2]

    with open(resume_path, 'rb') as f:
        stream = io.BytesIO(f.read())
        resume_text = extract_text(stream)
        name = extract_name(resume_text)
        email = extract_email(resume_text)
        score = calculate_match_score(resume_text, job_description)

        result = {
            "name": name,
            "email": email,
            "match_score": score
        }
        print(json.dumps(result))

if __name__ == "__main__":
    main()
