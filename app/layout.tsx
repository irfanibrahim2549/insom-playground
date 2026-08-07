import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";

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
        <MicrosoftClarity />
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
