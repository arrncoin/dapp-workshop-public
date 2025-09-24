// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../styles/Header.css";

export default function Header() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return `header-nav-link ${isActive ? "header-nav-link-active" : ""}`;
  };

  return (
    <header className="header-container">
      <Link href="/" className="header-logo">
        KimCil
      </Link>
      
      <nav className="header-nav-center">
        <div className="header-links-container">
          <Link href="/" className={getLinkClassName("/")}>
            Home
          </Link>
          <Link href="/swap" className={getLinkClassName("/swap")}>
            Swap
          </Link>
          <Link href="/game" className={getLinkClassName("/game")}>
            Game
          </Link>
          <Link href="/faucet" className={getLinkClassName("/faucet")}>
            Faucet
          </Link>
        </div>
      </nav>
      
      <div className="header-connect-button-container">
        <ConnectButton />
      </div>
    </header>
  );
}