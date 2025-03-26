import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { RequestStatus } from '../constants';
import { deleteArticle, getArticleById, updateArticle } from './api';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(RequestStatus.INITIAL);
  const [data, setData] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const fetchArticle = async() => {
      setStatus(RequestStatus.IN_PROGRESS);
      try {
        const article = await getArticleById(id);
        setData(article);
        setStatus(RequestStatus.SUCCESSFUL);
      } catch(error) {
        console.error(error);
        setStatus(RequestStatus.FAILED);
      }
    };
    if (status == RequestStatus.INITIAL) {
      fetchArticle();
    }
  }, [])

  const onClickSaveEdit = async() => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      await updateArticle(id, data);
      setIsEditing(false);
      setErrors("");
    } catch(error) {
      console.error(error);
      setErrors("Error updating article");
    }
  };

  const onClickDelete = async() => {
    try {
      await deleteArticle(id);
      setErrors("");
      navigate("/");
    } catch(error) {
      console.error(error);
      setErrors("Error deleting article");
    }
  };

  return (
    <div className="p-6 w-full mx-auto rounded-lg">
      <div className="mb-16">
        <a
          href="/"
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Articles List
        </a>
      </div>
      {status === RequestStatus.SUCCESSFUL && (
        <>
          {isEditing ? (
            <input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="mb-2 text-xl font-bold"
            />
            ) : (
            <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
          )}

          {isEditing ? (
            <textarea
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              className="w-full h-32 p-2"
            />
            ) : (
              <p className='my-4'>{data.content}</p>
          )}
          {errors !== "" && (
            <p className="mt-1 text-sm text-red-500">{errors}</p>
          )}
          <div className="flex">
            <button
              onClick={onClickSaveEdit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            {
              !isEditing && (
                <button
                  onClick={onClickDelete}
                  className="mt-4 ml-auto mr-16 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>    
              )
            }
          </div>
        </>
      )}
      {status === RequestStatus.IN_PROGRESS && (
        <div className="flex justify-center items-center pt-16">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {status === RequestStatus.FAILED && (
        <p>Unable to load article. It doesn't exist</p>
      )}
    </div>
  );
}

export default Article;
