import React from "react";

export function InvitationLoading() {
  return <div className="invite-state" role="status"><span className="spinner" aria-hidden="true" />Đang chuẩn bị thiệp dành riêng cho bạn…</div>;
}

export function InvitationError({ error }) {
  const missing = error?.status === 404;
  return (
    <main className="centered-page">
      <div className="state-card">
        <span className="monogram" aria-hidden="true">A & A</span>
        <h1>{missing ? "Không tìm thấy thiệp mời" : "Chưa thể mở thiệp lúc này"}</h1>
        <p>{missing ? "Đường dẫn có thể chưa đúng. Bạn vui lòng kiểm tra lại link đã nhận." : "Kết nối đang gặp sự cố. Vui lòng thử lại sau ít phút."}</p>
        {!missing && <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Thử lại</button>}
        <a className="text-link" href="/">Về trang chủ</a>
      </div>
    </main>
  );
}
