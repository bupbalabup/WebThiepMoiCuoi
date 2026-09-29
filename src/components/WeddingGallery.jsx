import React, { useEffect, useState } from "react";
import wedding from "../config/wedding.json";
import Modal from "./Modal.jsx";

export default function WeddingGallery() {
  const photos = wedding.gallery.slots.filter((photo) => photo.src);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected && !photos.some((photo) => photo.id === selected.id)) setSelected(null);
  }, [photos, selected]);

  if (!photos.length) return null;
  return (
    <section className="section gallery-section" aria-labelledby="gallery-title">
      <div className="section-heading">
        <span className="eyebrow">Khoảnh khắc của chúng mình</span>
        <h2 id="gallery-title">Album ảnh cưới</h2>
      </div>
      <div className={`gallery-grid count-${Math.min(photos.length, 18)}`}>
        {photos.map((photo, index) => (
          <button type="button" className={`gallery-item role-${photo.role} ratio-${photo.aspectRatio.replace("/", "-")}`} key={photo.id} onClick={() => setSelected(photo)} aria-label={`Xem ảnh cưới ${index + 1}`}>
            <img src={photo.src} alt={photo.alt || `Ảnh cưới Tuấn Anh và Ngọc Anh ${index + 1}`} loading={photo.priority ? "eager" : "lazy"} decoding="async" />
          </button>
        ))}
      </div>
      <Modal title="Khoảnh khắc của chúng mình" open={Boolean(selected)} onClose={() => setSelected(null)} className="photo-modal">
        {selected && <img className="lightbox-image" src={selected.src} alt={selected.alt || "Ảnh cưới Tuấn Anh và Ngọc Anh"} />}
      </Modal>
    </section>
  );
}
