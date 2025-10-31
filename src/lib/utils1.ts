import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToWebP = async (file: File): Promise<File | null> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (ctx) {
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], `${file.name.split(".")[0]}.webp`, {
                type: "image/webp",
              })
              resolve(webpFile)
            } else {
              resolve(null)
            }
          },
          "image/webp",
          0.8,
        )
      } else {
        resolve(null)
      }
    }

    img.onerror = () => resolve(null)
    img.src = URL.createObjectURL(file)
  })
}
