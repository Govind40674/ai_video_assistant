from langchain_huggingface import HuggingFaceEmbeddings

print("Loading...")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

print("Loaded successfully!")