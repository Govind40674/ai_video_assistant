from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import (
    extract_action_items,
    extract_key_decisions,
    extract_questions,
)
from core.rag_engine import (
    build_rag_chain,
    ask_question,
    load_rag_chain,
)
from core.vector_store import delete_user_vector_store

import traceback
import shutil
import uuid
import os

load_dotenv()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        os.getenv("REACT_URL"),
        os.getenv("NODE_URL"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/signed/process_video")
async def process_video(
    user_email: str = Form(...),
    file: UploadFile = File(...)
):
    file_path = None

    try:

        extension = os.path.splitext(file.filename)[1]

        filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            UPLOAD_DIR,
            filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("User:", user_email)
        print("Uploaded File:", file_path)

        processed_audio_path = process_input(file_path)

        transcript = transcribe_all(processed_audio_path)

        title = generate_title(transcript)

        summary = summarize(transcript)

        action_items = extract_action_items(summary)

        key_decisions = extract_key_decisions(summary)

        questions = extract_questions(summary)

        rag_chain = build_rag_chain(
            transcript,
            title,
            user_email,
        )

        answer = ask_question(
            rag_chain,
            questions,
        )

        return {
            "title": title,
            "summary": summary,
            "action_items": action_items,
            "key_decisions": key_decisions,
            "questions": questions,
            "answer": answer,
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:

        if file_path and os.path.exists(file_path):
            os.remove(file_path)


@app.post("/unsigned/process_video")
async def process_unsigned(
    file: UploadFile = File(...)
):
    file_path = None

    try:

        extension = os.path.splitext(file.filename)[1]

        filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            UPLOAD_DIR,
            filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        processed_audio_path = process_input(file_path)

        transcript = transcribe_all(processed_audio_path)

        title = generate_title(transcript)

        summary = summarize(transcript)

        action_items = extract_action_items(summary)

        key_decisions = extract_key_decisions(summary)

        questions = extract_questions(summary)

        return {
            "title": title,
            "summary": summary,
            "action_items": action_items,
            "key_decisions": key_decisions,
            "questions": questions,
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:

        if file_path and os.path.exists(file_path):
            os.remove(file_path)


@app.get("/signed/ask_question")
async def ask_question_endpoint(
    user_email: str,
    title: str,
    question: str,
):
    try:

        rag_chain = load_rag_chain(
            title,
            user_email,
        )

        answer = ask_question(
            rag_chain,
            question,
        )

        return {
            "answer": answer
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@app.delete("/delete_user")
async def delete_vector_store(
    user_email: str
):
    try:

        deleted = delete_user_vector_store(
            user_email
        )

        return {
            "success": True,
            "deleted_chunks": deleted,
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )