// import { useState, useEffect } from "react";
// const apiUrl = import.meta.env.VITE_APP_API_URL;

// const ImageGallery = ({ photos = [] }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageUrls, setImageUrls] = useState([]);

//   useEffect(() => {
//     // Guard against undefined photos and undefined entries
//     const processedUrls = (photos || []).map((photo) => {
//       if (!photo) return "";
//       if (photo.startsWith("http")) return photo;

//       if (photo.includes("public/uploads/adv/")) {
//         const filename = photo.split("public/uploads/adv/")[1];
//         return `${apiUrl}/uploads/adv/${filename}`;
//       }

//       if (photo.startsWith("/uploads/")) {
//         return `${apiUrl}${photo}`;
//       }

//       return `${apiUrl}/uploads/adv/${photo.replace(/^public\/uploads\/adv\//, "")}`;
//     });
//     setImageUrls(processedUrls);
//   }, [photos]); // Only recalculate urls when photos change

//   const handlePrevious = () => {
//     setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
//   };

//   const handleThumbnailClick = (index) => {
//     setCurrentIndex(index);
//   };

//   if (!imageUrls.length) return null;

//   return (
//     <div className="image-gallery-container">
//       <div className="image-gallery">
//         <img
//           src={imageUrls[currentIndex]}
//           alt={`Фото ${currentIndex + 1}`}
//           className="main-image"
//         />
//         {imageUrls.length > 1 && (
//           <>
//             <button className="nav-button prev-button" onClick={handlePrevious}>
//               <span className="material-icons">chevron_left</span>
//             </button>
//             <button className="nav-button next-button" onClick={handleNext}>
//               <span className="material-icons">chevron_right</span>
//             </button>
//           </>
//         )}
//       </div>
//       {imageUrls.length > 1 && (
//         <div className="thumbnails">
//           {imageUrls.map((url, index) => {
//             return (
//               <img
//                 key={index}
//                 src={url}
//                 alt={`Мініатюра ${index + 1}`}
//                 className={`thumbnail ${index === currentIndex ? "active" : ""}`}
//                 onClick={() => handleThumbnailClick(index)}
//               />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageGallery;

import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Fade, useTheme, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const resolveUrl = (photo) => {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  if (photo.includes("public/uploads/adv/")) {
    const filename = photo.split("public/uploads/adv/")[1];
    return `${apiUrl}/uploads/adv/${filename}`;
  }
  if (photo.startsWith("/uploads/")) return `${apiUrl}${photo}`;
  return `${apiUrl}/uploads/adv/${photo.replace(/^public\/uploads\/adv\//, "")}`;
};

const ImageGallery = ({ photos = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const urls = (photos || []).map(resolveUrl).filter(Boolean);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? urls.length - 1 : i - 1));
    setLoaded(false);
  }, [urls.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i === urls.length - 1 ? 0 : i + 1));
    setLoaded(false);
  }, [urls.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  if (!urls.length) return null;

  const navBtnSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    bgcolor: "rgba(255,255,255,0.92)",
    color: "grey.800",
    border: "1px solid",
    borderColor: "grey.200",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    "&:hover": {
      bgcolor: "white",
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    },
    transition: "all 0.2s ease",
    zIndex: 2,
    width: { xs: 36, sm: 42 },
    height: { xs: 36, sm: 42 },
  };

  return (
    <>
      {/* Main gallery */}
      <Box>
        {/* Primary image viewer */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            // Fixed aspect ratio container — crops nothing, letterboxes mismatched images
            aspectRatio: "16/10",
            bgcolor: "grey.50",
            overflow: "hidden",
            cursor: urls.length ? "zoom-in" : "default",
            "&:hover .zoom-hint": { opacity: 1 },
          }}
          onClick={() => setLightboxOpen(true)}
        >
          {/* Blurred background fill for letterboxed images */}
          <Box
            component="img"
            src={urls[currentIndex]}
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(18px) saturate(0.7) brightness(0.85)",
              transform: "scale(1.08)",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Sharp main image */}
          <Box
            component="img"
            src={urls[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            onLoad={() => setLoaded(true)}
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.35s ease",
              display: "block",
            }}
          />

          {/* Zoom hint */}
          <Box
            className="zoom-hint"
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              zIndex: 3,
              bgcolor: "rgba(0,0,0,0.45)",
              color: "white",
              borderRadius: "8px",
              px: 1,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 12,
              fontWeight: 500,
              opacity: 0,
              transition: "opacity 0.2s ease",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <ZoomInIcon sx={{ fontSize: 14 }} />
            Agrandir
          </Box>

          {/* Counter badge */}
          {urls.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                zIndex: 3,
                bgcolor: "rgba(0,0,0,0.45)",
                color: "white",
                borderRadius: "8px",
                px: 1.25,
                py: 0.5,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: 1.4,
                userSelect: "none",
              }}
            >
              {currentIndex + 1} / {urls.length}
            </Box>
          )}

          {/* Navigation arrows */}
          {urls.length > 1 && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                sx={{ ...navBtnSx, left: { xs: 8, sm: 12 } }}
                size="small"
                aria-label="Photo précédente"
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                sx={{ ...navBtnSx, right: { xs: 8, sm: 12 } }}
                size="small"
                aria-label="Photo suivante"
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Thumbnails strip */}
        {urls.length > 1 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              bgcolor: "grey.50",
              borderTop: "1px solid",
              borderColor: "grey.100",
            }}
          >
            {urls.map((url, i) => (
              <Box
                key={i}
                component="img"
                src={url}
                alt={`Miniature ${i + 1}`}
                onClick={() => {
                  setCurrentIndex(i);
                  setLoaded(false);
                }}
                sx={{
                  flexShrink: 0,
                  width: { xs: 56, sm: 68 },
                  height: { xs: 44, sm: 52 },
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor:
                    i === currentIndex ? "primary.main" : "transparent",
                  opacity: i === currentIndex ? 1 : 0.55,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    opacity: 1,
                    borderColor:
                      i === currentIndex ? "primary.main" : "grey.400",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Lightbox */}
      <Fade in={lightboxOpen}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            bgcolor: "rgba(0,0,0,0.92)",
            display: lightboxOpen ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
            aria-label="Fermer"
          >
            <CloseIcon />
          </IconButton>

          {/* Image */}
          <Box
            component="img"
            src={urls[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
          />

          {/* Lightbox nav */}
          {urls.length > 1 && (
            <Box
              sx={{ display: "flex", gap: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                onClick={prev}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
                aria-label="Précédent"
              >
                <ChevronLeftIcon />
              </IconButton>
              <Box
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                {currentIndex + 1} / {urls.length}
              </Box>
              <IconButton
                onClick={next}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
                aria-label="Suivant"
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Fade>
    </>
  );
};

export default ImageGallery;
