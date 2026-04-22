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

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "NexNote AI Microservice"}

@app.post("/analyze")
def analyze_text(content: NoteContent):
    doc = nlp(content.text)
    # Simple NLP tasks: Keyword extraction via Named Entities
    entities = list(set([ent.text for ent in doc.ents if len(ent.text) > 2]))
    
    # Mock summary logic for MVP
    summary = f"Summary of {len(content.text.split())} words note: {content.text[:100]}..."
    
    return {
        "keywords": entities[:10],
        "suggested_tags": ["AI-Generated", "Technology"] if "quantum" in content.text.lower() else ["General"],
        "summary": summary
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
