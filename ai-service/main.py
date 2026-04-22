from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NexNote AI Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Note: Load spacy model (assuming user will run `python -m spacy download en_core_web_sm`)
# For the sake of MVP completeness, we'll try to load, or fallback
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

class NoteContent(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "✨ NexNote AI Microservice is Online and Ready!"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "NexNote AI Microservice"}

@app.post("/analyze")
def analyze_text(content: NoteContent):
    doc = nlp(content.text)
    
    # 1. Genuine Keyword Extraction
    # Extract nouns and proper nouns, ignore stop words
    keywords = list(set([token.text.lower() for token in doc if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop and len(token.text) > 2]))
    
    # 2. Genuine Extractive Summarization
    word_frequencies = {}
    for word in doc:
        if not word.is_stop and not word.is_punct:
            word_text = word.text.lower()
            if word_text not in word_frequencies:
                word_frequencies[word_text] = 1
            else:
                word_frequencies[word_text] += 1
                
    max_frequency = max(word_frequencies.values()) if word_frequencies else 1
    for word in word_frequencies.keys():
        word_frequencies[word] = word_frequencies[word] / max_frequency

    sentence_scores = {}
    for sent in doc.sents:
        for word in sent:
            if word.text.lower() in word_frequencies.keys():
                if len(sent.text.split(' ')) < 40: # Avoid overly long sentences
                    if sent not in sentence_scores.keys():
                        sentence_scores[sent] = word_frequencies[word.text.lower()]
                    else:
                        sentence_scores[sent] += word_frequencies[word.text.lower()]
                        
    import heapq
    # Pick top 3 most relevant sentences
    summary_sentences = heapq.nlargest(3, sentence_scores, key=sentence_scores.get)
    # Order them as they appear in the original text
    summary_sentences = sorted(summary_sentences, key=lambda s: s.start)
    
    summary = " ".join([sent.text.strip() for sent in summary_sentences])
    
    # Fallback if text is too short
    if not summary.strip():
        summary = content.text[:200] + ("..." if len(content.text) > 200 else "")

    return {
        "keywords": keywords[:10],
        "suggested_tags": keywords[:3],
        "summary": summary
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
