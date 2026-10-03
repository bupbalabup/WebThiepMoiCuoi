import React, { useState } from "react";
import wedding from "../config/wedding.json";
import Modal from "./Modal.jsx";

export default function GiftDialog({ side, open, onClose }) {
  const account = wedding.gift.accounts[side];
  const [copied, setCopied] = useState(false);

  function copyAccountNumber() {
    if (!account.accountNumber) return;
    navigator.clipboard.writeText(account.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }).catch(() => {
      setCopied(false);
    });
  }

  return (
    <Modal title={`Gửi mừng cưới · ${account.label}`} open={open} onClose={onClose} className="gift-modal">
      <div className="gift-dialog-stationery">
        <span className="script-title small">Cảm ơn bạn</span>
        <p className="gift-quote">
          “Những lời chúc tốt đẹp nhất của Quý vị sẽ là món quà vô cùng quý giá đối với hai gia đình chúng tôi trong ngày trọng đại này.”
        </p>

        {account.qrImage ? (
          <div className="gift-content">
            <div className="gift-qr-wrapper">
              <img className="gift-qr" src={account.qrImage} alt={`Mã QR mừng cưới ${account.label}`} />
            </div>

            <div className="gift-details-card">
              {account.bankName && (
                <div className="gift-row">
                  <span className="gift-label">Ngân hàng</span>
                  <strong className="gift-val">{account.bankName}</strong>
                </div>
              )}
              {account.accountName && (
                <div className="gift-row">
                  <span className="gift-label">Chủ tài khoản</span>
                  <strong className="gift-val">{account.accountName}</strong>
                </div>
              )}
              {account.accountNumber && (
                <div className="gift-row highlight-row">
                  <span className="gift-label">Số tài khoản</span>
                  <div className="gift-number-group">
                    <strong className="gift-val account-number">{account.accountNumber}</strong>
                    <button
                      type="button"
                      className="copy-btn-minimal"
                      onClick={copyAccountNumber}
                    >
                      {copied ? "ĐÃ SAO CHÉP" : "SAO CHÉP"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="gift-actions">
              <a className="button button-primary" href={account.qrImage} download={`qr-mung-cuoi-${side === "groom" ? "nha-trai" : "nha-gai"}.jpg`}>
                TẢI ẢNH QR
              </a>
            </div>
          </div>
        ) : (
          <div className="empty-gift-stationery">
            {account.accountNumber ? (
              <div className="gift-details-card">
                {account.bankName && (
                  <div className="gift-row">
                    <span className="gift-label">Ngân hàng</span>
                    <strong className="gift-val">{account.bankName}</strong>
                  </div>
                )}
                {account.accountName && (
                  <div className="gift-row">
                    <span className="gift-label">Chủ tài khoản</span>
                    <strong className="gift-val">{account.accountName}</strong>
                  </div>
                )}
                <div className="gift-row highlight-row">
                  <span className="gift-label">Số tài khoản</span>
                  <div className="gift-number-group">
                    <strong className="gift-val account-number">{account.accountNumber}</strong>
                    <button
                      type="button"
                      className="copy-btn-minimal"
                      onClick={copyAccountNumber}
                    >
                      {copied ? "ĐÃ SAO CHÉP" : "SAO CHÉP"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty-gift-text">
                Thông tin số tài khoản và mã QR mừng cưới {account.label.toLowerCase()} đang được cập nhật. Bạn cũng có thể trao gửi trực tiếp trong ngày tiệc cưới của chúng tôi!
              </p>
            )}
          </div>
        )}

        <div className="gift-signature-wrap">
          <span className="signature-couple">Tuấn Anh & Ngọc Anh</span>
        </div>
      </div>
    </Modal>
  );
}
