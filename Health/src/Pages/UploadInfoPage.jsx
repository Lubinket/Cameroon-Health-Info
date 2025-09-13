import React, { useState } from 'react';
import { Upload, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Header from "../components/Header";

function UploadInfoPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [details, setDetails] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Added error and success states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    "events",
    "screenings", 
    "vaccinations",
    "donations"
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Updated handleSubmit with backend integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    if (selectedFile) formData.append('image', selectedFile);
    formData.append('date', dateTime);
    formData.append('details', details);
    formData.append('category', selectedCategory);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/create/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSuccess('Post created successfully!');
      navigate('/homepage');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="hi"> 
      <div>
        <Header/>
      </div>

      <div className="min-h-screen bg-white p-6 mt-24">
        <div className="max-w-2xl mx-auto">
          {/* Error and Success Messages */}
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}
          
          {/* Wrapped in form element */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                style={{ focusBorderColor: '#57B9FF' }}
                placeholder="Enter title for your upload..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div
                className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#90D5FF' }}>
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#90D5FF' }}>
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Date and Time Field */}
            <div>
              <label htmlFor="datetime" className="block text-lg font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="datetime"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors pr-12"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Details Field */}
            <div>
              <label htmlFor="details" className="block text-lg font-medium text-gray-700 mb-2">
                Details
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors resize-vertical"
                placeholder="Share more details about what you're uploading..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: '#57B9FF',
                  boxShadow: '0 4px 15px rgba(87, 185, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4AABF0';
                  e.target.style.boxShadow = '0 6px 20px rgba(87, 185, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#57B9FF';
                  e.target.style.boxShadow = '0 4px 15px rgba(87, 185, 255, 0.3)';
                }}
              >
                Submit Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadInfoPage;