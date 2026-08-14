const destinationImages = {
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
  Paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
  Bali:
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",
  Japan:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200",
  Dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
  Switzerland:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
  London:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
  NewYork:
    "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1200",
};

const defaultImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

export default function getDestinationImage(destination) {
  if (!destination) return defaultImage;

  const key = destination.replace(/\s/g, "");

  return destinationImages[key] || defaultImage;
}