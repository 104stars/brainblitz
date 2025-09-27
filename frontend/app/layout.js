import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BrainBlitz - Juego de Preguntas Multijugador",
  description: "Pon a prueba tu conocimiento en el juego de preguntas multijugador más emocionante. Compite en tiempo real con jugadores de todo el mundo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
