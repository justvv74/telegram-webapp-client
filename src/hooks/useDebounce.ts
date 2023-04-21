import { useRef } from "react";

export default function useDebounce(func: () => void, delay: number) {
  const ref = useRef<any>(null);

  return (e: string) => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => func(), delay);
  };
}
