import { cn } from "@/lib/utils";

import {
  WORDMARK_ICONS_D,
  WORDMARK_RUNE_D,
  WORDMARK_VB_H,
  WORDMARK_VB_W,
} from "../svg/wordmark-data";
import FooterWordmarkLoader from "./footer-wordmark-loader";

const FooterWordmark = ({ className }: { className?: string }) => {
  return (
    <div className={cn("select-none text-foreground", className)}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WORDMARK_VB_W} ${WORDMARK_VB_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          aria-hidden="true"
        >
          <path d={WORDMARK_RUNE_D} fill="currentColor" fillOpacity="0.07" />
          <path d={WORDMARK_ICONS_D} fill="currentColor" fillOpacity="0.04" />
        </svg>
        <FooterWordmarkLoader />
      </div>
    </div>
  );
};

export default FooterWordmark;
