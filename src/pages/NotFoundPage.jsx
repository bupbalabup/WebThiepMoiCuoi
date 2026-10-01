import { WeddingMonogram } from "../components/Ornaments.jsx";
import React from "react";

export default function NotFoundPage() {
  return <main className="centered-page"><div className="state-card"><WeddingMonogram /><h1>Không tìm thấy trang</h1><p>Đường dẫn bạn mở chưa đúng hoặc đã thay đổi.</p><a className="button button-primary" href="/">Về trang chủ</a></div></main>;
}
