import React, { useState } from "react";
import wedding from "../config/wedding.json";
import Modal from "./Modal.jsx";

export default function GiftDialog({ side, open, onClose }) {
  const account = wedding.gift.accounts[side];
  const [copyMessage, setCopyMessage] = useState("");
  async function copyNumber() {
    try { await navigator.clipboard.writeText(account.accountNumber); setCopyMessage("Đã sao chép số tài khoản."); }
    catch { setCopyMessage("Chưa sao chép được. Bạn có thể chọn và sao chép số tài khoản bên trên."); }
  }
  return <Modal title={`Gửi mừng cưới ${account.label}`} open={open} onClose={onClose} className="gift-modal">
    <p>Sự hiện diện và lời chúc của bạn là món quà quý giá với chúng mình.</p>
    {account.qrImage && <img className="gift-qr" src={account.qrImage} alt={`QR mừng cưới ${account.label}`} width="560" height="560" />}
    {(account.accountNumber || account.qrImage) ? <div className="gift-details">
      {account.bankName && <p><span>Ngân hàng</span><strong>{account.bankName}</strong></p>}
      {account.accountName && <p><span>Chủ tài khoản</span><strong>{account.accountName}</strong></p>}
      {account.accountNumber && <p><span>Số tài khoản</span><strong>{account.accountNumber}</strong></p>}
      <div className="gift-actions">{account.accountNumber && <button type="button" className="button button-outline" onClick={copyNumber}>Sao chép số tài khoản</button>}{account.qrImage && <a className="button button-primary" href={account.qrImage} download={`qr-${side}.png`}>Tải ảnh QR</a>}</div>
      <p role="status">{copyMessage}</p>
    </div> : <p className="form-notice">Thông tin mừng cưới {account.label.toLowerCase()} đang được cập nhật.</p>}
  </Modal>;
}
