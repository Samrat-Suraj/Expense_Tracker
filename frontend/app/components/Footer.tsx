import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black/95 text-white py-12 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand / About */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Expensio<span className="text-yellow-400">.</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Track your daily spending effortlessly. Expensio helps you save, budget, and stay in control of your money.
          </p>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-left">
          <p className="text-xl font-semibold mb-4">Follow Us</p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#"
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-110"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-all transform hover:scale-110"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all transform hover:scale-110"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="#"
              className="p-3 rounded-full bg-sky-400 hover:bg-sky-500 text-white transition-all transform hover:scale-110"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <p className="text-xl font-semibold mb-4">Contact Us</p>
          <div className="flex flex-col gap-2 text-gray-300">
            <p>Email: <a href="mailto:Samratsuraj10@gmail.com" className="hover:text-yellow-400 transition">Samratsuraj10@gmail.com</a></p>
            <p>Phone: <a href="tel:+919794603102" className="hover:text-yellow-400 transition">+91 9794603102</a></p>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Expensio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;