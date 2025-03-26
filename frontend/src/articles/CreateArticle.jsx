import React, { useState } from 'react';
import { createArticle } from './api';

const CreateArticle = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', errors: {} });
  const formElements = [
    { key: 'title', text: 'Title'},
    { key: 'content', text: 'Content'},
  ]

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const errors = {}
    if (formData.title.trim() === '') {errors.title = 'Title cannot be empty'}
    if (formData.content.trim() === '') {errors.content = 'Content cannot be empty'}
    if (Object.keys(errors).length !== 0) {
      setFormData({...formData, errors});
      return;
    }
    await createArticle({ title: formData.title, content: formData.content });
    event.target.submit();
  };

  return (
    <div className="w-full mx-auto mt-8 p-4">
      <div className="flex justify-end">
        <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            Add Article
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={onFormSubmit}
          className="w-full my-4 p-16 bg-gray-100 rounded-lg shadow-lg"
        >
          {
            formElements.map(elem => (
              <div className="mb-4" key={`form-${elem.key}`}>
                <label className="block font-semibold">{elem.text}</label>
                <textarea
                  value={formData[elem.key]}
                  onChange={(e) => setFormData({ ...formData, [elem.key]: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                {formData.errors?.[elem.key] && (
                  <p className="mt-1 text-sm text-red-500">{formData.errors[elem.key]}</p>
                )}
              </div>
            ))
          }
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      )}
    </div>
  )
}

export default CreateArticle;
