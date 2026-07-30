from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import extract_action_items, extract_key_decisions, extract_questions
from core.rag_engine import build_rag_chain, ask_question, load_rag_chain
from core.vector_store import delete_user_vector_store


load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/signed/process_video")
async def get_item(user_email: str, url: str):
    # Process the input audio file
    processed_audio_path = process_input(url)

    # Transcribe the audio file
    transcript = transcribe_all(processed_audio_path)

    # Generate a title for the transcript
    title = generate_title(transcript)

    # Generate a summary of the transcript
    summary = summarize(transcript)

    # Extract action items, key decisions, and questions from the summary
    action_items = extract_action_items(summary)
    key_decisions = extract_key_decisions(summary)
    questions = extract_questions(summary)

    # Build the RAG chain
    rag_chain = build_rag_chain(transcript, title, user_email)

    # Ask questions
    answer = ask_question(rag_chain, questions)

    return {"title": title, "summary": summary, "action_items": action_items, "key_decisions": key_decisions, "questions": questions, "answer": answer}


@app.get("/signed/ask_question")
async def ask_question_endpoint(user_email: str, title: str, question: str):
    # Load the RAG chain for the given title and user_email
    rag_chain = load_rag_chain(title, user_email)

    # Ask the question using the RAG chain
    answer = ask_question(rag_chain, question)

    return {"answer": answer}


@app.get("/unsigned/process_video")
async def get_item_unsigned(url: str):
    # Process the input audio file
    processed_audio_path = process_input(url)

    # Transcribe the audio file
    transcript = transcribe_all(processed_audio_path)

    # Generate a title for the transcript
    title = generate_title(transcript)

    # Generate a summary of the transcript
    summary = summarize(transcript)

    # Extract action items, key decisions, and questions from the summary
    action_items = extract_action_items(summary)
    key_decisions = extract_key_decisions(summary)
    questions = extract_questions(summary)

    return {"title": title, "summary": summary, "action_items": action_items, "key_decisions": key_decisions, "questions": questions}



    












@app.delete("/delete_user")
async def delete_vector_store(user_email: str):

    deleted = delete_user_vector_store(user_email)

    return {
        "success": True,
        "deleted_chunks": deleted
    }
    
