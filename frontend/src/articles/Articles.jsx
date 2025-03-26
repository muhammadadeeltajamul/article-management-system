import React, { useState, useEffect } from 'react';
import { RequestStatus } from '../constants';
import { createArticleEmbed, getArticles, getArticleSummary } from './api';
import CreateArticle from './CreateArticle';
import SearchArticles from './SearchArticles';

const Articles = () => {
  const [data, setData] = useState({
    status: RequestStatus.INITIAL,
    pagination: {
      page_num: 0,
      page_size: 5,
    },
    articles: [],
  });
  const [alert, setAlert] = useState({ text: '', isVisible: false });

  const fetchArticles = async() => {
    setData({ ...data, status: RequestStatus.IN_PROGRESS });
    try {
      const responseData = await getArticles(data.pagination.page_num + 1, data.pagination.page_size);
      setData({
        status: RequestStatus.SUCCESSFUL,
        pagination: responseData.pagination,
        articles: [...data.articles, ...responseData.articles],
      });
    } catch (errors) {
      console.error(errors);
      setData({ ...data, status: RequestStatus.FAILED });
    }
  };

  const onClickSummary = async(event, articleId) => {
    event.preventDefault();
    const summary = await getArticleSummary(articleId);
    setAlert({ text: summary, isVisible: true });
  };

  const onClickEmbed = async(event, articleId) => {
    event.preventDefault();
    await createArticleEmbed(articleId);
  }
  useEffect(() => {
    if (data.status !== RequestStatus.SUCCESSFUL) {
      fetchArticles();
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold my-8 text-center">Articles</h1>
      <CreateArticle />
      <SearchArticles />
      {
        data.articles.map((article) => (
          <div key={`article-${article.id}`} className="flex flex-col w-full bg-white p-4 border rounded-lg shadow hover:bg-gray-100">
            <a href={`/${article.id}`} className="block">
              <h2 className="text-lg font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-600 truncate">{article.content}</p>
              <button
                className="mt-4 self-end bg-gray-400 text-white py-1 px-2 rounded-lg hover:bg-gray-700"
                onClick={(e) => onClickSummary(e, article.id)}
              >
                Summarize
              </button>
              <button
                className="mt-4 ml-8 self-end bg-gray-400 text-white py-1 px-2 rounded-lg hover:bg-gray-700"
                onClick={(e) => onClickEmbed(e, article.id)}
              >
                Embed
              </button>
            </a>
          </div>
        ))
      }
      {
        (data?.pagination?.page_num < data?.pagination?.total_pages)
        && (data.status === RequestStatus.SUCCESSFUL)
        && (
          <div className="flex justify-center mt-8">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={fetchArticles}
            >
              Load more
            </button>
          </div>
        )
      }
      {
        data.status === RequestStatus.IN_PROGRESS && (
          <div className="flex justify-center items-center pt-16">
            <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )
      }
      {
        data.status === RequestStatus.FAILED && (
          <p>
             Error loading
          </p>
        )
      }
      {
        alert.isVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center mx-32">
              <h2 className='text-xl font-bold mb-4'>Summary</h2>
              <p className="text-md text-left px-8">{alert.text}</p>
              <button
                onClick={() => setAlert({ ...alert, isVisible: false })} 
                className="mt-8 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Articles;
