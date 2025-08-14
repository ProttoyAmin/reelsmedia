"use client";
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";

const imagekitUrlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const res = await fetch("/api/imagekit-auth");
      if (!res.ok) throw new Error("Failed to authenticate");
      return res.json();
    } catch (error) {
      console.error("ImageKit authentication error:", error);
      throw error;
    }
  };

  return (
    <SessionProvider refetchInterval={5 * 60}>
        <ImageKitProvider
          urlEndpoint={imagekitUrlEndpoint}
        >
          {children}
        </ImageKitProvider>
    </SessionProvider>
  );
}