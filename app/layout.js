// import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

export const metadata = {
  title: "Tetris Game - Modern Web Tetris",
  description: "A fully featured Tetris game built with Next.js, featuring responsive design, dark/light themes, and persistent game state.",
  keywords: "tetris, game, puzzle, next.js, react, javascript",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
