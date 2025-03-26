import os

from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
DB_NAME = "article-management-system"
COLLECTION_NAME = "articles"
PINECONE_INDEX_NAME = COLLECTION_NAME

PINECONE = PINECONE_INDEX = None
if PINECONE_API_KEY:
    PINECONE = Pinecone(api_key=PINECONE_API_KEY)

    if PINECONE_INDEX_NAME not in [idx.name for idx in PINECONE.list_indexes()]:
        PINECONE.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=1536,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )

    PINECONE_INDEX = PINECONE.Index(PINECONE_INDEX_NAME)
