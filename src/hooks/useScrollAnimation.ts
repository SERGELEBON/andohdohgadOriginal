import { useRef } from "react";
import { useInView } from "framer-motion";

export function useScrollAnimation(margin: `${number}px` = "-80px") {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin });
  return { ref, isInView };
}
