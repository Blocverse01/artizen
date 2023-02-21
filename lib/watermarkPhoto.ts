const text = "Artizen";
const watermarkWithText = async (photo: File) => {
  const img = await createImageBitmap(photo);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  // make font size relative to image size
  ctx.font = `${img.width / 10}px sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  // correctly watermark at the center of the image
  const textWidth = ctx.measureText(text).width;
  const textHeight = parseInt(ctx.font, 10);
  ctx.fillText(
    text,
    img.width / 2 - textWidth / 2,
    img.height / 2 + textHeight / 2
  );
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      resolve(blob);
    });
  });
};

export { watermarkWithText };
