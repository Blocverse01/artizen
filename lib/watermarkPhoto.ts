import Compressor from "compressorjs";

const text = "Artizen";

class Watermark {
  text = "Artizen";

  defaultWatermark = async (
    photo: File,
    callback: (watermarkedPhoto: Blob) => void
  ) => {
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
    ctx.fillText(text, img.width / 2 - textWidth / 2, img.height / 2 + textHeight / 2);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.log("blob is null");
          return;
        }
        callback(blob);
      },
      "image/jpg",
      0.6
    );
  };

  withCompressorJs = (photo: File, callback: (watermarkedPhoto: string) => void) => {
    const _ = new Compressor(photo, {
      quality: 0.6,
      drew: (ctx, canvas) => {
        ctx.font = `${canvas.width / 10}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        const textWidth = ctx.measureText(text).width;
        const textHeight = parseInt(ctx.font, 10);
        ctx.fillText(
          text,
          canvas.width / 2 - textWidth / 2,
          canvas.height / 2 + textHeight / 2
        );
      },
      success: (result: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = () => {
          callback(reader.result as string);
        };
      },
    });
  };
}

const watermark = new Watermark();

export default watermark;
