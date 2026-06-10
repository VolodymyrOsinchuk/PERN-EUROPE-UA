import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;

const ImageGallery = ({ photos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Guard against undefined photos and undefined entries
    const processedUrls = (photos || []).map((photo) => {
      if (!photo) return "";
      if (photo.startsWith("http")) return photo;
      return `${apiUrl}/uploads/adv/${photo.replace(/^public\/uploads\/adv\//, "")}`;
    });
    setImageUrls(processedUrls);
  }, [photos]); // Only recalculate urls when photos change

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  if (!imageUrls.length) return null;

  return (
    <div className="image-gallery-container">
      <div className="image-gallery">
        <img
          src={imageUrls[currentIndex]}
          alt={`Фото ${currentIndex + 1}`}
          className="main-image"
        />
        {imageUrls.length > 1 && (
          <>
            <button className="nav-button prev-button" onClick={handlePrevious}>
              <span className="material-icons">chevron_left</span>
            </button>
            <button className="nav-button next-button" onClick={handleNext}>
              <span className="material-icons">chevron_right</span>
            </button>
          </>
        )}
      </div>
      {imageUrls.length > 1 && (
        <div className="thumbnails">
          {imageUrls.map((url, index) => {
            return (
              <img
                key={index}
                src={url}
                alt={`Мініатюра ${index + 1}`}
                className={`thumbnail ${index === currentIndex ? "active" : ""}`}
                onClick={() => handleThumbnailClick(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

