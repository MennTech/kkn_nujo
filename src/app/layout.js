import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nujo",
  keywords: "Padukuhan Nujo",
  description: "Nujo adalah sebuah padukuhan yang terletak di Desa Pucung, Kecamatan Girisubo, Kabupaten Gunung Kidul, Daerah Istimewa Yogyakarta.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.png"/>
      </head>
      <body className={inter.className}>
        <Provider>
          <Toaster richColors='true'/>
          {children}
        </Provider>
        </body>
    </html>
  );
}
