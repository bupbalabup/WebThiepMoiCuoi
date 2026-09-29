import React from "react";
import wedding from "../config/wedding.json";
import Modal from "./Modal.jsx";

export default function GiftDialog({ side, open, onClose }) {
  const account = wedding.gift.accounts[side];
  return (
    <Modal title={`Gửi mừng cưới ${account.label}`} open={open} onClose={onClose} className="gift-modal">
      {account.qrImage ? (
        <div className="gift-content">
          <img className="gift-qr" src={account.qrImage} alt={`Mã QR mừng cưới ${account.label}`} width="560" height="560" />
          <div className="gift-details">
            {account.accountName && <p><span>Chủ tài khoản</span><strong>{account.accountName}</strong></p>}
            {account.bankName && <p><span>Ngân hàng</span><strong>{account.bankName}</strong></p>}
            {account.accountNumber && <p><span>Số tài khoản</span><strong>{account.accountNumber}</strong></p>}
          </div>
          <a className="button button-primary" href={account.qrImage} download={`qr-mung-cuoi-${side}.png`}>Tải ảnh QR</a>
        </div>
      ) : (
        <div className="empty-gift">
          <span aria-hidden="true">♡</span>
          <p>QR mừng cưới {account.label.toLowerCase()} đang được cập nhật.</p>
        </div>
      )}
    </Modal>
  );
}
