// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "../components/Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "KimCil DApp",
  description: "Staking and reward platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="main-layout-container">
            <Header />
            <main className="main-content-area">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}