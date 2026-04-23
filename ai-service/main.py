from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from fastapi.middleware.cors import CORSMiddleware
import heapq

app = FastAPI(title="NexNote AI Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "NexNote AI Microservice"}

@app.post("/analyze")
def analyze_text(content: NoteContent):
    doc = nlp(content.text)
    
    # Keyword extraction
    keywords = list(set([token.text.lower() for token in doc if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop and len(token.text) > 2]))
    
    if content.action == "simplify":
        # SIMPLIFY logic: Focus on the "what" in conversational tone
        main_topic = keywords[0].title() if keywords else "the topic"
        summary = f"Essentially, this content explores {main_topic}. It breaks down the core concepts into understandable parts, focusing on the most important details while keeping the explanation clear and straightforward."
    else:
        # SUMMARIZE logic: Extractive points
        word_frequencies = {}
        for word in doc:
            if not word.is_stop and not word.is_punct:
                word_text = word.text.lower()
                word_frequencies[word_text] = word_frequencies.get(word_text, 0) + 1
                    
        max_freq = max(word_frequencies.values()) if word_frequencies else 1
        for word in word_frequencies:
            word_frequencies[word] /= max_freq

        sentence_scores = {}
        for sent in doc.sents:
            for word in sent:
                if word.text.lower() in word_frequencies:
                    sentence_scores[sent] = sentence_scores.get(sent, 0) + word_frequencies[word.text.lower()]
                            
        # Top 3 sentences for a complete summary
        summary_sentences = heapq.nlargest(3, sentence_scores, key=sentence_scores.get)
        summary_sentences = sorted(summary_sentences, key=lambda s: s.start)
        summary = " ".join([sent.text.strip() for sent in summary_sentences])

    # Ensure full output is returned
    if not summary.strip():
        summary = content.text[:2000]

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
