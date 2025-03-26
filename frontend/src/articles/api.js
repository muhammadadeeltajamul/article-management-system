const API_URL = `${import.meta.env.VITE_API_URL}/articles/`

export const getArticles = async (pageNum=1, pageSize=10) => {
  const response = await fetch(`${API_URL}?page_num=${pageNum}&page_size=${pageSize}`);
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};

export const getArticleById = async (id) => {
  const response = await fetch(`${API_URL}${id}/`);
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};

export const createArticle = async (article) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};

export const updateArticle = async (id, article) => {
  const response = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};

export const deleteArticle = async (id) => {
  const response = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};

export const getArticleSummary = async (id) => {
  const response = await fetch(`${API_URL}${id}/summarize/`);
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};

export const createArticleEmbed = async(id) => {
  const response = await fetch(`${API_URL}${id}/embed/`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
  })
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
}

export const searchArticles = async (query) => {
  const response = await fetch(`${API_URL}search/?query=${query}`);
  if (response.status !== 200) {
    throw response.status;
  }
  return response.json();
};
