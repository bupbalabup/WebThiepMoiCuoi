import React, { useEffect, useState } from "react";
import wedding from "../config/wedding.json";
import Modal from "./Modal.jsx";

export default function WeddingGallery() {
  const photos = wedding.gallery.slots.filter((photo) => photo.src);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (selectedIndex !== null && !photos[selectedIndex]) {
      setSelectedIndex(null);
    }
  }, [photos, selectedIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return undefined;
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        setSelectedIndex((curr) => (curr > 0 ? curr - 1 : photos.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((curr) => (curr < photos.length - 1 ? curr + 1 : 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, photos.length]);

  if (!photos.length) return null;

  function prevPhoto() {
    setSelectedIndex((curr) => (curr > 0 ? curr - 1 : photos.length - 1));
  }

  function nextPhoto() {
    setSelectedIndex((curr) => (curr < photos.length - 1 ? curr + 1 : 0));
  }

  const displayedPhotos = showAll ? photos : photos.slice(0, 9);
  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <section className="lux-gallery-section" aria-labelledby="gallery-title">
      <div className="lux-section-header">
        <span className="lux-eyebrow">ALBUM HÌNH CƯỚI</span>
        <h2 id="gallery-title" className="lux-section-title">Khoảnh Khắc Ngọt Ngào</h2>
        <p className="lux-section-subtitle">
          Những khung hình lưu giữ tình yêu và hành trình cùng nhau bước tới ngày chung đôi.
        </p>
      </div>

      {/* Editorial Responsive Mosaic Grid */}
      <div className="lux-gallery-grid">
        {displayedPhotos.map((photo, index) => {
          const isFeatured = index === 0 || index === 7;
          return (
            <button
              type="button"
              className={`lux-gallery-card ${isFeatured ? "is-featured" : ""}`}
              key={photo.id || index}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Xem ảnh cưới ${index + 1}`}
            >
              <div className="card-media-wrapper">
                <img
                  src={photo.src}
                  alt={photo.alt || `Ảnh cưới Tuấn Anh và Ngọc Anh ${index + 1}`}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="card-hover-overlay">
                  <span className="card-zoom-badge">XEM ẢNH</span>
                  <span className="card-index-pill">0{index + 1}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toggle View More Button */}
      {photos.length > 9 && (
        <div className="lux-gallery-action">
          <button
            type="button"
            className="button button-outline"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "THU GỌN ALBUM" : `XEM TẤT CẢ ${photos.length} ẢNH`}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        title={`Khoảnh khắc (${selectedIndex !== null ? selectedIndex + 1 : 1} / ${photos.length})`}
        open={Boolean(currentPhoto)}
        onClose={() => setSelectedIndex(null)}
        className="photo-modal"
      >
        {currentPhoto && (
          <div className="lux-lightbox-view">
            <button
              type="button"
              className="lux-lightbox-nav prev"
              onClick={prevPhoto}
              aria-label="Ảnh trước đó"
            >
              ẢNH TRƯỚC
            </button>
            <div className="lux-lightbox-image-box">
              <img
                className="lux-lightbox-img"
                src={currentPhoto.fullSrc || currentPhoto.src}
                alt={currentPhoto.alt || "Ảnh cưới Tuấn Anh & Ngọc Anh"}
              />
            </div>
            <button
              type="button"
              className="lux-lightbox-nav next"
              onClick={nextPhoto}
              aria-label="Ảnh kế tiếp"
            >
              ẢNH SAU
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
