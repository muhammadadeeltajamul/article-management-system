from bson import ObjectId

import openai

from app.config import COLLECTION_NAME, OPENAI_API_KEY, PINECONE_INDEX
from app.database import db
from app.utils import dict_to_db_article, get_or_raise_404


COLLECTION = db[COLLECTION_NAME]


async def create_article(article):
    new_article = await COLLECTION.insert_one({ 'title': article.title, 'content': article.content })
    article = await get_or_raise_404(COLLECTION, str(new_article.inserted_id))
    return dict_to_db_article(article)


async def get_all_articles(page_num=1, page_size=10):
    skip = (page_num - 1) * page_size
    articles = await COLLECTION.find().skip(skip).limit(page_size).to_list(page_size)
    total_count = await COLLECTION.count_documents({})
    return {
        "pagination": {
            "page_num": page_num,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": (total_count + (page_size - 1)) // page_size,
        },
        "articles": [dict_to_db_article(article) for article in articles]
    }


async def get_article(article_id: str):
    article = await get_or_raise_404(COLLECTION, article_id)
    return dict_to_db_article(article)


async def update_article(article_id, article_data):
    update_result = await COLLECTION.update_one({"_id": ObjectId(article_id)}, {"$set": article_data.dict()})
    if update_result.matched_count:
        article = await get_or_raise_404(COLLECTION, article_id)
        return dict_to_db_article(article)
    return None


async def delete_article(article_id):
    delete_result = await COLLECTION.delete_one({"_id": ObjectId(article_id)})
    return delete_result.deleted_count > 0


async def get_article_summary(article_id):
    article = await get_or_raise_404(COLLECTION, article_id)
    article = dict_to_db_article(article)
    if not OPENAI_API_KEY:
        return article.content
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant that summarizes content."},
            {"role": "user", "content": f"Summarize the following content: \"{article['content']}\""}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content.strip()


def get_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding


async def embed_article(article_id: str):
    article = await get_article(article_id)
    embedding = get_embedding(article.content)
    PINECONE_INDEX.upsert(vectors=[{"id": article_id, "values": embedding}])
    return


async def search_articles(query, count=5):
    query_embedding = get_embedding(query)
    results = PINECONE_INDEX.query(
        vector=query_embedding,
        top_k=count,
        include_values=False
    )
    ids = [
        ObjectId(match["id"])
        for match in results["matches"]
    ]
    articles = await COLLECTION.find({"_id": {"$in": ids}}).to_list(None)
    return [dict_to_db_article(article) for article in articles]
