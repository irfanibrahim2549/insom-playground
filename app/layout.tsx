import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "xyfili7275";

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
      <head>
        <Script
          id="microsoft-clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `,
          }}
        />
      </head>
      <body className="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col antialiased">
        <MicrosoftClarity />
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
