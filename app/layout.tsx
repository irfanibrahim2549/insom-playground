import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "Insomnia - Omnichannel Chat User Testing",
  description: "Media user testing untuk menguji fitur Get New Chat dan Chat Status Filter pada platform Insomnia Omnichannel Chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col antialiased">
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
