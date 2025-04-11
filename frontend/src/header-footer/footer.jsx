import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="">
      <footer className="bg-gray-200 text-gray-500 py-8 md:py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Company Info</h3>
            <p><FaMapMarkerAlt className="inline mr-2" />3053,TRP Mall,Bopal,Ahmedabad</p>
            <p><FaPhoneAlt className="inline mr-2" /> +91 9904861910</p>
            <p><FaEnvelope className="inline mr-2" /> info@tankarsolutions.com</p>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="/web-development" className="hover:text-blue-500">Web Development</a></li>
              <li><a href="/mobile-apps" className="hover:text-blue-500">Mobile Apps</a></li>
              <li><a href="/ui-ux" className="hover:text-blue-500">UI/UX Design</a></li>
              <li><a href="/consulting" className="hover:text-blue-500">IT Consulting</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-500">About Us</a></li>
              <li><a href="/services" className="hover:text-blue-500">Our Services</a></li>
              <li><a href="/portfolio" className="hover:text-blue-500">Portfolio</a></li>
              <li><a href="/contact" className="hover:text-blue-500">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/techcorp" className="text-blue-600 hover:text-blue-800">
                <FaFacebook className="w-6 h-6 md:w-8 md:h-8" />
              </a>
              <a href="https://twitter.com/techcorp" className="text-blue-400 hover:text-blue-600">
                <FaTwitter className="w-6 h-6 md:w-8 md:h-8" />
              </a>
              <a href="https://linkedin.com/company/techcorp" className="text-blue-700 hover:text-blue-900">
                <FaLinkedin className="w-6 h-6 md:w-8 md:h-8" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="text-center text-gray-600 mt-8">
          <p>&copy; 2025 Tankar Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
