import { cn } from "@/lib/utils";

export const FRAME_WIDTH = "w-[95vw] max-w-[1440px] md:w-[90vw] 2xl:w-[85vw] 2xl:max-w-[1800px]";

export const FrameRails = () => (
  <div
    className={cn(
      "pointer-events-none fixed inset-y-0 left-1/2 z-60 -translate-x-1/2 border-x-2 border-dashed",
      FRAME_WIDTH,
    )}
  />
);
