from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

def compute_similarity_matrix(texts):
    if len(texts) < 2:
        return []
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts)
    sim_matrix = cosine_similarity(tfidf_matrix)
    return sim_matrix.tolist()

@app.route('/api/similarity', methods=['POST'])
def similarity():
    files = request.files.getlist('files')
    # Debug print to verify file reception
    print("FILES RECEIVED:", len(files), [f.filename for f in files])
    file_contents = []
    file_names = []
    for f in files:
        if f and f.filename:
            content = f.read().decode('utf-8', errors='ignore')
            file_contents.append(content)
            file_names.append(f.filename)

    text1 = request.form.get('text1', '').strip()
    text2 = request.form.get('text2', '').strip()
    try:
        threshold = float(request.form.get('threshold', 0.7))
    except ValueError:
        threshold = 0.7

    text_similarity = None
    text_plagiarism = None
    if text1 and text2:
        sim_matrix = compute_similarity_matrix([text1, text2])
        text_similarity = sim_matrix[0][1]
        text_plagiarism = text_similarity >= threshold

    file_similarity_matrix = []
    if len(file_contents) > 1:
        file_similarity_matrix = compute_similarity_matrix(file_contents)

    return jsonify({
        'text_similarity': text_similarity,
        'text_plagiarism': text_plagiarism,
        'file_similarity_matrix': file_similarity_matrix,
        'file_names': file_names,
        'threshold': threshold
    })

if __name__ == "__main__":
    app.run(debug=True)