import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isUpperCase = (char:string) => {
  if (char >= 'A' && char <= 'Z') {
    return true;
  } else {
    return false;
  }
};
export const isLowerCase = (char:string)=>{
  if (char >= 'a' && char <= 'z') {
    return true;
  } else {
    return false;
  }
}