import os
import requests
from pydub import AudioSegment

# -------------------------
# Configuration
# -------------------------

SARVAM_PIECE_SECONDS = 25

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

SARVAM_STT_TRANSLATE_URL = "https://api.sarvam.ai/speech-to-text-translate"

SARVAM_MODEL = os.getenv("SARVAM_STT_MODEL", "saaras:v2.5")


# -------------------------
# Send one piece to Sarvam
# -------------------------

def _send_to_sarvam(piece_path: str) -> str:

    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }

    with open(piece_path, "rb") as f:

        files = {
            "file": (
                os.path.basename(piece_path),
                f,
                "audio/wav"
            )
        }

        data = {
            "model": SARVAM_MODEL,
            "with_diarization": "false"
        }

        response = requests.post(
            SARVAM_STT_TRANSLATE_URL,
            headers=headers,
            files=files,
            data=data,
            timeout=120,
        )

    if not response.ok:
        print(response.text)
        response.raise_for_status()

    response_json = response.json()

    transcript = response_json.get("transcript", "")

    return transcript


# -------------------------
# Sarvam Transcription
# -------------------------

def transcribe_chunk(chunk_path: str) -> str:

    if not SARVAM_API_KEY:
        raise RuntimeError("SARVAM_API_KEY not found.")

    print("\nUsing Sarvam Speech-to-Text...\n")

    audio = AudioSegment.from_wav(chunk_path)

    piece_ms = SARVAM_PIECE_SECONDS * 1000

    total_pieces = (len(audio) + piece_ms - 1) // piece_ms

    full_text = ""

    for i, start in enumerate(range(0, len(audio), piece_ms)):

        piece = audio[start:start + piece_ms]

        piece_path = f"{chunk_path}_piece_{i}.wav"

        piece.export(piece_path, format="wav")

        try:

            print(f"Uploading piece {i + 1}/{total_pieces} to Sarvam...")

            transcript = _send_to_sarvam(piece_path)

            full_text += transcript + " "

        finally:

            if os.path.exists(piece_path):
                os.remove(piece_path)

    print("\nSarvam transcription completed.\n")

    return full_text.strip()


# -------------------------
# Transcribe all chunks
# -------------------------

def transcribe_all(chunks: list) -> str:

    full_transcript = ""

    total_chunks = len(chunks)

    for index, chunk in enumerate(chunks):

        print(f"\nProcessing chunk {index + 1}/{total_chunks}")

        try:

            transcript = transcribe_chunk(chunk)

            full_transcript += transcript + " "

        finally:

            if os.path.exists(chunk):
                os.remove(chunk)
                print(f"Deleted chunk: {chunk}")

    print("\nTranscription Complete.\n")

    return full_transcript.strip()















# import os

#  import whisper
# import requests
# from pydub import AudioSegment

# # -------------------------
# # Configuration
# # -------------------------

# SARVAM_PIECE_SECONDS = 25

# WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")

# SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
# SARVAM_STT_TRANSLATE_URL = "https://api.sarvam.ai/speech-to-text-translate"
# SARVAM_MODEL = os.getenv("SARVAM_STT_MODEL", "saaras:v2.5")

# _model = None


# # -------------------------
# # Load Whisper only once
# # -------------------------

# def load_model():
#     global _model

#     if _model is None:
#         print(f"Loading Whisper model: {WHISPER_MODEL}...")
#         _model = whisper.load_model(WHISPER_MODEL)
#         print("Whisper model loaded.")

#     return _model


# # -------------------------
# # Detect language
# # -------------------------

# def detect_language(chunk_path: str) -> str:

#     model = load_model()

#     audio = whisper.load_audio(chunk_path)
#     audio = whisper.pad_or_trim(audio)

#     mel = whisper.log_mel_spectrogram(audio).to(model.device)

#     _, probs = model.detect_language(mel)

#     detected_language = max(probs, key=probs.get)

#     print(f"\nDetected language: {detected_language}")

#     return detected_language


# # -------------------------
# # Whisper Transcribe
# # -------------------------

# def transcribe_chunk_whisper(chunk_path: str) -> str:

#     print("Using Whisper Transcribe...")

#     model = load_model()

#     result = model.transcribe(
#         chunk_path,
#         task="transcribe",
#         fp16=False,
#         verbose=True,
#     )

#     print("Whisper transcription finished.")

#     return result["text"]


# # -------------------------
# # Whisper Translate
# # -------------------------

# def translate_chunk_whisper(chunk_path: str) -> str:

#     print("Using Whisper Translate...")

#     model = load_model()

#     result = model.transcribe(
#         chunk_path,
#         task="translate",
#         fp16=False,
#         verbose=True,
#     )

#     print("Whisper translation finished.")

#     return result["text"]


# # -------------------------
# # Send one piece to Sarvam
# # -------------------------

# def _send_to_sarvam(piece_path: str) -> str:

#     headers = {
#         "api-subscription-key": SARVAM_API_KEY
#     }

#     with open(piece_path, "rb") as f:

#         files = {
#             "file": (
#                 os.path.basename(piece_path),
#                 f,
#                 "audio/wav"
#             )
#         }

#         data = {
#             "model": SARVAM_MODEL,
#             "with_diarization": "false"
#         }

#         response = requests.post(
#             SARVAM_STT_TRANSLATE_URL,
#             headers=headers,
#             files=files,
#             data=data,
#             timeout=120,
#         )

#     if not response.ok:
#         print(response.text)
#         response.raise_for_status()

#     return response.json().get("transcript", "")


# # -------------------------
# # Sarvam
# # -------------------------

# def transcribe_chunk_sarvam(chunk_path: str) -> str:

#     if not SARVAM_API_KEY:
#         raise RuntimeError("SARVAM_API_KEY not found.")

#     audio = AudioSegment.from_wav(chunk_path)

#     piece_ms = SARVAM_PIECE_SECONDS * 1000

#     full_text = ""

#     total_pieces = (len(audio) + piece_ms - 1) // piece_ms

#     for i, start in enumerate(range(0, len(audio), piece_ms)):

#         piece = audio[start:start + piece_ms]

#         piece_path = f"{chunk_path}_sv_{i}.wav"

#         piece.export(piece_path, format="wav")

#         try:

#             print(f"Sending piece {i + 1}/{total_pieces} to Sarvam...")

#             full_text += _send_to_sarvam(piece_path) + " "

#         finally:

#             if os.path.exists(piece_path):
#                 os.remove(piece_path)

#     return full_text.strip()


# # -------------------------
# # Decide engine
# # -------------------------

# def transcribe_chunk(chunk_path: str) -> str:

#     language = detect_language(chunk_path)

#     # Hindi -> Sarvam
#     if language == "hi":

#         print("\nHindi detected.")
#         print("Routing to Sarvam...\n")

#         return transcribe_chunk_sarvam(chunk_path)

#     # English -> Whisper Transcribe
#     elif language == "en":

#         print("\nEnglish detected.")
#         print("Routing to Whisper Transcribe...\n")

#         return transcribe_chunk_whisper(chunk_path)

#     # Every other language -> Whisper Translate
#     else:

#         print(f"\n{language} detected.")
#         print("Routing to Whisper Translate...\n")

#         return translate_chunk_whisper(chunk_path)


# # -------------------------
# # Transcribe all chunks
# # -------------------------

# def transcribe_all(chunks: list) -> str:

#     full_transcript = ""

#     for i, chunk in enumerate(chunks):

#         print(f"\nProcessing chunk {i + 1}/{len(chunks)}")

#         try:

#             text = transcribe_chunk(chunk)

#             full_transcript += text + " "

#         finally:

#             if os.path.exists(chunk):
#                 os.remove(chunk)
#                 print(f"Deleted chunk: {chunk}")

#     print("\nTranscription complete.")

#     return full_transcript.strip()