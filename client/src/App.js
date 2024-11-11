import React, { useState, useEffect } from "react";
import './App.css';
import axios from "./api";
import ImageList from "./components/ImageList";
import UploadForm from "./components/UploadForm";

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);


  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/images");
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("");
    }
  };
  


  const handleUpload = async (file) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setImages((prevImages) => [...prevImages, response.data]);


    } catch (error) {
      console.error('Error uploading image:', error);
      setError("Error uploading image.");
    }
  };

  return (
    <div>
      <h1>Image Upload Service</h1>
      <UploadForm onUpload={handleUpload} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <ImageList images={images} />
      )}
    </div>
  );
};

export default App;
