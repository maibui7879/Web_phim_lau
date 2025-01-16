import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} BeroFlix. Netflop gọi bằng điện thoại.</p>
        <p>Đô nết tại VietinBank: 0329556941 để assmin có tiền roll Herta mẹ.</p>
      </div>
    </footer>
  );
};

export default Footer;
