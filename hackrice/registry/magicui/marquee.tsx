"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ className, reverse, pauseOnHover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
          {
            "hover:[animation-play-state:paused]": pauseOnHover,
          },
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex min-w-0 shrink-0 justify-around [gap:var(--gap)]",
            reverse ? "animate-marquee-reverse" : "animate-marquee"
          )}
        >
          {children}
        </div>
        <div
          className={cn(
            "flex min-w-0 shrink-0 justify-around [gap:var(--gap)]",
            reverse ? "animate-marquee-reverse" : "animate-marquee"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

export default Marquee;
