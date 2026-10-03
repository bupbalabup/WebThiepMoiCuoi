import React, { useRef, useState } from "react";
import photos from "virtual:wedding-album";
import "../styles/album.css";

export default function WeddingGallery() {
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState({});
  const touch = useRef(null);
  const total = photos.length;
  const wrap = index => (index + total) % total;
  const go = direction => setActive(index => wrap(index + direction));

  if (!total) return null;
  function distance(index) {
    let offset = (index - active + total) % total;
    if (offset > total / 2) offset -= total;
    return offset;
  }

  return <section className="wedding-album" aria-labelledby="gallery-title">
    <h2 id="gallery-title" className="mi-script mi-heading">Khoảnh Khắc Ngọt Ngào</h2>
    <div className="album-stage" role="region" aria-label="Album ảnh cưới" aria-roledescription="băng chuyền ảnh"
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); go(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={event => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          go(dx < 0 ? 1 : -1);
        }
        touch.current = null;
      }}>
      <div className="album-perspective">
        {photos.map((photo, index) => {
          const offset = distance(index), depth = Math.abs(offset);
          return <div key={photo.id} className="album-photo"
            aria-hidden={offset !== 0 ? true : undefined}
            style={{ aspectRatio: ratios[photo.id] || "2 / 3", transform: `translateX(${Math.sign(offset) * (depth === 1 ? 72 : depth * 62)}%) translateZ(${-depth * 45}px) rotateY(${-Math.sign(offset) * Math.min(depth * 18, 28)}deg) scale(${Math.max(.66, 1 - depth * .16)})`, opacity: depth > 2 ? 0 : Math.max(.55, 1 - depth * .16), zIndex: 100 - depth, pointerEvents: depth > 2 ? "none" : "auto" }}
            >
            <img src={photo.src} alt={`Ảnh cưới Tuấn Anh và Ngọc Anh ${index + 1}`} draggable="false" loading="lazy" decoding="async"
              onLoad={event => { const image = event.currentTarget; setRatios(previous => ({ ...previous, [photo.id]: image.naturalWidth / image.naturalHeight })); }} />
          </div>;
        })}
      </div>
      {total > 1 && <>
        <button className="album-arrow album-prev" type="button" aria-label="Ảnh trước" onClick={() => { go(-1); }}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m14 6-6 6 6 6" /></svg></button>
        <button className="album-arrow album-next" type="button" aria-label="Ảnh sau" onClick={() => { go(1); }}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m10 6 6 6-6 6" /></svg></button>
      </>}
    </div>
  </section>;
}
