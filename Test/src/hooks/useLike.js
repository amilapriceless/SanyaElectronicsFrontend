import { useState } from "react";

export function useLike(initialIsLiked = false, initialCount = 0) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialCount);

  const toggleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  return { isLiked, count, toggleLike };
}