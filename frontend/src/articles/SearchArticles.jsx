import React, { useState } from 'react';
import { RequestStatus } from '../constants';
import { searchArticles } from './api';

const SearchArticles = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState({ status: RequestStatus.INITIAL, articles: [] });

  const onClickSearch = async() => {
    setData({ ...data, status: RequestStatus.IN_PROGRESS });
    try {
      const results = await searchArticles(query);
      setData({ articles: results, status: RequestStatus.SUCCESSFUL });
    } catch (errors) {
      console.error(errors);
      setData({ articles: [], status: RequestStatus.FAILED });
    }
  };
  return (
    <div className="w-full p-4 mx-32">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-100 border p-2 rounded mr-2"
      />
      <button onClick={onClickSearch} className="bg-blue-500 text-white p-2 rounded">
        Search
      </button>
      {data.status === RequestStatus.IN_PROGRESS && (
        <div className="flex justify-center items-center pt-16">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {data.status === RequestStatus.FAILED && (
        <div className="text-red-500">Error searching</div>
      )}
      {data.status === RequestStatus.SUCCESSFUL && (
        <div>
          {data.articles.map(article => {
            <a
              key={`search-article-${article.id}`}
              className="bg-white p-4 border rounded-lg shadow hover:bg-gray-100"
              href={`/${article.id}`}
            >
              {article.title}
            </a>
          })}
        </div>
      )}
    </div>
  )
};

export default SearchArticles;
