export async function optimizeImageToDataUrl(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  },
): Promise<string> {
  const maxWidth = options?.maxWidth ?? 1200;
  const maxHeight = options?.maxHeight ?? 1200;
  const quality = options?.quality ?? 0.78;

  const image = await fileToImage(file);
  const { width, height } = fitInside(image.width, image.height, maxWidth, maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo procesar la imagen.");
  }

  ctx.drawImage(image, 0, 0, width, height);

  // JPEG keeps payload size lower and avoids "Request Entity Too Large" on serverless requests.
  return canvas.toDataURL("image/jpeg", quality);
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("No se pudo leer la imagen."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function fitInside(width: number, height: number, maxWidth: number, maxHeight: number) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const scale = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
