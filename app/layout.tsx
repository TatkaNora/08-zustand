import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const siteTitle = 'NoteHub — your lightweight notes with filters';
const siteDescription = 'NoteHub helps you create, filter, and organize notes with tags. Fast UX with SSR + CSR, TanStack Query, and Zustand draft.';
const siteUrl = 'https://08-zustand-two-blond.vercel.app/';


const geistRoboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description:
      siteDescription,
    url: siteUrl,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub app screenshot',
      },
    ],
    siteName: 'NoteHub',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children, modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistRoboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
