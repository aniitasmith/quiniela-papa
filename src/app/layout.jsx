import "./globals.css";

export const metadata = {
  title: "Quiniela Martín Smith — Mundial 2026",
  description: "Bracket interactivo de la quiniela de Martín Smith para el Mundial 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
