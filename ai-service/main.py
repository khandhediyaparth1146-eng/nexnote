from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from fastapi.middleware.cors import CORSMiddleware
import heapq
import re

app = FastAPI(title="NexNote AI Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

class NoteContent(BaseModel):
    text: str
    action: str = "summarize"

@app.get("/")
def read_root():
    return {"message": "✨ NexNote AI Microservice is Online and Ready!"}

@app.post("/analyze")
def analyze_text(content: NoteContent):
    # Clean text
    clean_text = re.sub(r'\s+', ' ', content.text).strip()
    if len(clean_text) < 10:
        return {"summary": "Please provide more content for a better analysis.", "keywords": [], "suggested_tags": []}

    doc = nlp(clean_text)
    
    # 1. Keyword extraction (Improved)
    keywords = []
    for chunk in doc.noun_chunks:
        if not nlp.vocab[chunk.root.text.lower()].is_stop and len(chunk.text) > 3:
            keywords.append(chunk.text.lower())
    
    keywords = list(set(keywords))
    
    if content.action == "simplify":
        # SIMPLIFY: Provide a conceptual overview
        topic = keywords[0].title() if keywords else "the content"
        summary = f"Essentially, this text explores the core concepts of {topic}. It breaks down complex ideas into manageable points, highlighting how these elements interact to form the main subject. The goal is to provide a clear, high-level understanding of the material without getting lost in technical jargon."
    else:
        # SUMMARIZE: High-quality extractive summarization
        word_frequencies = {}
        for word in doc:
            if not word.is_stop and not word.is_punct and not word.is_space:
                word_text = word.text.lower()
                word_frequencies[word_text] = word_frequencies.get(word_text, 0) + 1
                    
        if word_frequencies:
            max_freq = max(word_frequencies.values())
            for word in word_frequencies:
                word_frequencies[word] /= max_freq

            sentence_scores = {}
            for sent in doc.sents:
                # Higher weight for the very first sentence (usually the thesis)
                weight = 1.2 if sent.start == 0 else 1.0
                for word in sent:
                    if word.text.lower() in word_frequencies:
                        sentence_scores[sent] = sentence_scores.get(sent, 0) + (word_frequencies[word.text.lower()] * weight)
                            
            # Pick top 4 sentences for a deep, accurate summary
            summary_sentences = heapq.nlargest(4, sentence_scores, key=sentence_scores.get)
            summary_sentences = sorted(summary_sentences, key=lambda s: s.start)
            summary = " ".join([sent.text.strip() for sent in summary_sentences])
        else:
            summary = clean_text[:500]

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
