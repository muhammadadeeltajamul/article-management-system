from bson import ObjectId
from fastapi import HTTPException
from app.models.articles import DBArticle


async def get_or_raise_404(collection, article_id: str):
    article = await collection.find_one({"_id": ObjectId(article_id)})
    if not article:
        raise HTTPException(status_code=404, detail="Article Not Found")
    return article


def dict_to_db_article(dictionary):
    return DBArticle(
        id=str(dictionary["_id"]),
        title=dictionary.get('title', ''),
        content=dictionary.get('content', dictionary.get('description', ''))
    )
