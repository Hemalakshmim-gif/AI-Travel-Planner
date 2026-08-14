const getAIImage = (keyword) => {
  return `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(keyword)}`;
};

export default getAIImage;