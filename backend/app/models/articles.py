from pydantic import BaseModel


class Article(BaseModel):
    title: str
    content: str


class DBArticle(Article):
    id: str


class ArticlesList(BaseModel):
    pagination: dict
    articles: list[DBArticle]
