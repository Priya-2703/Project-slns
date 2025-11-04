export const getImageUrl = (path) => {
  if (!path) return "/placeholder-image.jpg"; // Add a placeholder image
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}${path}`;
};
