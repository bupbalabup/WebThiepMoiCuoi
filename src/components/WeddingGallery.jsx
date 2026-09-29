import React, { useEffect, useState } from "react";
import wedding from "../config/wedding.json";
import Modal from "./Modal.jsx";

export default function WeddingGallery() {
  const photos = wedding.gallery.slots.filter((photo) => photo.src && photo.id !== "hero");
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (selectedIndex !== null && !photos[selectedIndex]) {
      setSelectedIndex(null);
    }
  }, [photos, selectedIndex]);

  if (!photos.length) return null;

  function prevPhoto() {
    setSelectedIndex((curr) => (curr > 0 ? curr - 1 : photos.length - 1));
  }

  function nextPhoto() {
    setSelectedIndex((curr) => (curr < photos.length - 1 ? curr + 1 : 0));
  }

  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <section className="section gallery-section" aria-labelledby="gallery-title">
      <div className="section-heading">

        <h2 id="gallery-title">Khoảnh khắc hạnh phúc</h2>
        <p className="section-subtext">Những bức hình ghi lại hành trình tình yêu của chúng mình</p>
      </div>

      <div className={`gallery-grid count-${Math.min(photos.length, 18)}`}>
        {photos.map((photo, index) => (
          <button
            type="button"
            className={`gallery-item role-${photo.role} ratio-${photo.aspectRatio.replace("/", "-")}`}
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            aria-label={`Xem ảnh cưới ${index + 1}`}
          >
            <img
              src={photo.src}
              alt={photo.alt || `Ảnh cưới Tuấn Anh và Ngọc Anh ${index + 1}`}
              loading={photo.priority ? "eager" : "lazy"}
              decoding="async"
            />
          </button>
        ))}
      </div>

      <Modal
        title={`Khoảnh khắc (${selectedIndex !== null ? selectedIndex + 1 : 1}/${photos.length})`}
        open={Boolean(currentPhoto)}
        onClose={() => setSelectedIndex(null)}
        className="photo-modal"
      >
        {currentPhoto && (
          <div className="lightbox-wrapper">
            <button
              type="button"
              className="lightbox-nav-btn prev-btn"
              onClick={prevPhoto}
              aria-label="Ảnh trước"
            >
              Ảnh trước
            </button>
            <img
              className="lightbox-image"
              src={currentPhoto.src}
              alt={currentPhoto.alt || "Ảnh cưới Tuấn Anh và Ngọc Anh"}
            />
            <button
              type="button"
              className="lightbox-nav-btn next-btn"
              onClick={nextPhoto}
              aria-label="Ảnh sau"
            >
              Ảnh sau
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
