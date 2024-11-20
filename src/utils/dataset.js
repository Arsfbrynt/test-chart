export const generateLargeDataset = (size) => {
  return Array.from({ length: size }, (_, index) => ({
    x: index,
    y: Math.sin(index / 100) * 100 + Math.random() * 20,
  }));
};

export const largeDataset = generateLargeDataset(5000);
