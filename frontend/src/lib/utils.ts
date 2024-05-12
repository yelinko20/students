import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
  const files = event.target.files![0];
  const imageUrl = URL.createObjectURL(files);
  return { files, imageUrl };
}
