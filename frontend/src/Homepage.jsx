import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Article from './articles/Article';
import Articles from './articles/Articles';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Articles />} />
          <Route path="/:id" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Homepage;
