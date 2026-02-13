import { FC } from "react";

interface FallingTextProps {
  className?: string;
  text?: string;
  highlightWords?: string[];
  highlightClass?: string;
  trigger?: "auto" | "click" | "hover" | string;
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
}

declare const FallingText: FC<FallingTextProps>;

export default FallingText;
