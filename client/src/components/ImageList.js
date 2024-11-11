
import React, { useEffect, useState } from 'react';
import axios from '../api';

const ImageList = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/images/');
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };


  
  const handleDownload = async (imageId, format) => {
    try {
      const response = await axios.get(`/api/images/download/${imageId}/${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${imageId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };



return (
    <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px',marginTop:'20px' }}>IMAGE GALLERY</h2>

      <div className="image-list">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            
            <img 
              src={`data:${image.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(image.imageData)))}`} 
              alt={image.fileName} 
              className="image-thumbnail-small"
            />


            <button onClick={() => handleDownload(image.id, 'jpg')}>Download as JPG</button>
            <hr />
            <button onClick={() => handleDownload(image.id, 'pdf')}>Download as PDF</button>
            <hr />
            <button onClick={() => handleDownload(image.id, 'svg')}>Download as SVG</button>
          </div>
        ))}
      </div>
    </div>
  );

};

export default ImageList;
