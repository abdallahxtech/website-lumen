import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumen Realty",
    short_name: "Lumen",
    description: "Dubai real estate brokerage",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#1D2F49",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
