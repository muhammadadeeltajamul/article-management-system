from fastapi import APIRouter, HTTPException
from app.models.articles import Article, ArticlesList, DBArticle
from app.routes.articles_utils import (
    create_article,
    delete_article,
    embed_article,
    get_all_articles,
    get_article,
    get_article_summary,
    search_articles,
    update_article,
)


router = APIRouter(prefix="/articles", tags=["Articles"])


@router.get("/", response_model=ArticlesList)
async def get_articles_view(page_num: int=1, page_size: int=10):
    return await get_all_articles(page_num=page_num, page_size=page_size)


@router.get("/search/", response_model=list[DBArticle])
async def search_articles_view(query: str, count: int = 5):
    return await search_articles(query, count)


@router.get("/{article_id}/", response_model=DBArticle)
async def get_article_view(article_id: str):
    article = await get_article(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/", response_model=DBArticle)
async def create_article_view(article: Article):
    return await create_article(article)


@router.put("/{article_id}/", response_model=DBArticle)
async def update_article_view(article_id: str, article: Article):
    updated_article = await update_article(article_id, article)
    if not updated_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return updated_article


@router.delete("/{article_id}/", response_model=dict)
async def delete_article_view(article_id: str):
    success = await delete_article(article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}


@router.get("/{article_id}/summarize/", response_model=str)
async def get_summary_view(article_id: str):
    return await get_article_summary(article_id)


@router.post("/{article_id}/embed/", response_model=dict)
async def embed_article_view(article_id: str):
    await embed_article(article_id)
    return {"message": "Embedding stored success"}
