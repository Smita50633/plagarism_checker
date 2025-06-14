import os
import re
import math
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

def extract_text(input_data):
    if isinstance(input_data, str) and os.path.isfile(input_data):
        ext = os.path.splitext(input_data)[1].lower()
        if ext == '.txt':
            try:
                with open(input_data, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    print(f"Extracted from {input_data}: {repr(content[:200])}")  # Show first 200 chars
                    return content
            except Exception as e:
                print(f"Failed to read {input_data}: {e}")
                return ""
        elif ext == '.docx':
            try:
                from docx import Document
                doc = Document(input_data)
                content = '\n'.join([para.text for para in doc.paragraphs])
                print(f"Extracted from {input_data}: {repr(content[:200])}")
                return content
            except Exception as e:
                print(f"Failed to read {input_data} as DOCX: {e}")
                return ""
        elif ext == '.pdf':
            try:
                import PyPDF2
                with open(input_data, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    content = '\n'.join([page.extract_text() or "" for page in reader.pages])
                    print(f"Extracted from {input_data}: {repr(content[:200])}")
                    return content
            except Exception as e:
                print(f"Failed to read {input_data} as PDF: {e}")
                return ""
        else:
            print(f"Unsupported file type: {ext}")
            return ""
    # Otherwise, assume it's raw text
    print(f"Treating input as raw text: {repr(str(input_data)[:200])}")
    return str(input_data)

def findFileSimilarity(input1, input2):
    text1 = extract_text(input1)
    text2 = extract_text(input2)

    print("Final extracted Text1 (first 200 chars):", repr(text1[:200]))
    print("Final extracted Text2 (first 200 chars):", repr(text2[:200]))

    if not text1.strip() and not text2.strip():
        print("Both files are empty after extraction!")
        return 100.0
    if not text1.strip() or not text2.strip():
        print("One of the files is empty after extraction!")
        return 0.0

    text1_lc = text1.lower()
    text2_lc = text2.lower()

    en_stops = set(stopwords.words('english'))
    stemmer = PorterStemmer()

    wordList1 = [stemmer.stem(word) for word in re.sub(r"[^\w]", " ", text1_lc).split() if word not in en_stops]
    wordList2 = [stemmer.stem(word) for word in re.sub(r"[^\w]", " ", text2_lc).split() if word not in en_stops]

    print("wordList1 (first 20):", wordList1[:20])
    print("wordList2 (first 20):", wordList2[:20])

    if not wordList1 or not wordList2:
        print("One of the word lists is empty after preprocessing!")
        return 0.0

    universalSetOfUniqueWords = list(set(wordList1 + wordList2))
    tf1 = [wordList1.count(word) for word in universalSetOfUniqueWords]
    tf2 = [wordList2.count(word) for word in universalSetOfUniqueWords]

    dotProduct = sum(q * d for q, d in zip(tf1, tf2))
    mag1 = math.sqrt(sum(q ** 2 for q in tf1))
    mag2 = math.sqrt(sum(d ** 2 for d in tf2))

    denominator = mag1 * mag2
    if denominator == 0:
        print("Denominator is zero, returning 0 similarity.")
        return 0.0
    else:
        similarity = (dotProduct / denominator) * 100
        print(f"Similarity: {similarity}")
        return round(similarity, 2)

# Example usage:
# findFileSimilarity("file1.txt", "file2.txt")
# findFileSimilarity("file1.docx", "file2.pdf")
# findFileSimilarity("This is a test", "Completely different test")