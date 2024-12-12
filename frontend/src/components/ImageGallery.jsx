import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;
const ImageGallery = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clientPaths, setClientPaths] = useState([]);

  useEffect(() => {
    const processedPaths = photos.map((photo) => {
      const serverPath = photo;
      const clientPath = serverPath.replace("public", "");
      return clientPath;
    });
    setClientPaths(processedPaths);
  }, [photos]); // Only recalculate paths when photos change

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <div className="image-gallery">
        <img
          src={`${apiUrl}${clientPaths[currentIndex]}`}
          alt={`Фото ${currentIndex + 1}`}
          className="main-image"
        />
        <button className="nav-button prev-button" onClick={handlePrevious}>
          <span className="material-icons">chevron_left</span>
        </button>
        <button className="nav-button next-button" onClick={handleNext}>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <div className="thumbnails">
        {photos.map((photo, index) => {
          const clientPath = clientPaths[index]; // Use pre-processed paths
          return (
            <img
              key={index}
              src={`${apiUrl}${clientPath}`}
              alt={`Мініатюра ${index + 1}`}
              className={`thumbnail ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleThumbnailClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
};
export default ImageGallery;
