import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "愿望拼图存钱",
    short_name: "存钱拼图",
    description: "每存一笔钱，愿望就拼回来一块",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#f9a8d4",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
