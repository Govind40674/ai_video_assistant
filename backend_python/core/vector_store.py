import uuid

from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


from core.config.mongo import collection


EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
INDEX_NAME = "embedding_index"


def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"}
    )


def build_vector_store(transcript: str,
                       title: str,
                       user_email: str):

    print("Building Vector Store...")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_text(transcript)

    document_id = str(uuid.uuid4())

    docs = []

    for i, chunk in enumerate(chunks):

        docs.append(
            Document(
                page_content=chunk,
                metadata={
                    "document_id": document_id,
                    "user_email": user_email,
                    "title": title,
                    "chunk_index": i,
                },
            )
        )

    embeddings = get_embeddings()

    vector_store = MongoDBAtlasVectorSearch.from_documents(
        documents=docs,
        embedding=embeddings,
        collection=collection,
        index_name=INDEX_NAME,
    )

    return vector_store


def load_vector_store():

    embeddings = get_embeddings()

    vector_store = MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=embeddings,
        index_name=INDEX_NAME,
    )

    return vector_store


def get_retriever(vector_store,
                  title: str,
                  user_email: str,
                  k: int = 4):

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": k,
            "pre_filter": {
                "title": title,
                "user_email": user_email,
            },
        },
    )

    return retriever







def delete_user_vector_store(user_email: str):
    """
    Delete every embedding belonging to a user.
    """

    result = collection.delete_many(
        {
            "user_email": user_email
        }
    )

    print(
        f"Deleted {result.deleted_count} embedding chunks for {user_email}"
    )

    return result.deleted_count