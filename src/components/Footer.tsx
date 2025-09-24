// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import "../styles/Footer.css";

export default function Footer() {
  return (
    // Tag <footer> diubah menjadi <div> dan teks copyright dihapus
    <div className="footer-container">
      <div className="social-links">
        {/* Ganti '#' dengan URL profil Twitter Anda */}
        <Link href="https://twitter.com/kridopratomo90" target="_blank" rel="noopener noreferrer" className="social-icon-link twitter">
          <FaTwitter />
        </Link>
        {/* Ganti '#' dengan URL profil GitHub Anda */}
        <Link href="https://github.com/arrncoin" target="_blank" rel="noopener noreferrer" className="social-icon-link github">
          <FaGithub />
        </Link>
        {/* Ganti '#' dengan URL website Anda */}
        <Link href="#" target="_blank" rel="noopener noreferrer" className="social-icon-link website">
          <FaGlobe />
        </Link>
      </div>
    </div>
  );
}