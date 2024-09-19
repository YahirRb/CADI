import React from 'react';
import QrScanner from 'react-qr-scanner';

const QRCodeScanner = () => {
  const handleScan = (data) => {
    if (data) {
      console.log('QR code data:', data);
    }
  };

  const handleError = (err) => {
    console.error('QR code error:', err);
  };

  return (
    <div>
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default QRCodeScanner;
