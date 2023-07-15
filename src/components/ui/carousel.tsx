"use client";

import NukaCarousel, { CarouselProps } from "nuka-carousel";
import { PropsWithChildren } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { cn } from "@/lib/utils";

export const Carousel = ({
  children,
  ...rest
}: PropsWithChildren & CarouselProps) => {
  return (
    <NukaCarousel
      renderCenterRightControls={(e) => (
        <button
          onClick={e.nextSlide}
          className="p-2 mx-4 transition-all rounded-full hover:bg-secondary/50"
        >
          <ChevronRight />
        </button>
      )}
      renderCenterLeftControls={(e) => (
        <button
          onClick={e.previousSlide}
          className="p-2 mx-4 transition-all rounded-full hover:bg-secondary/50"
        >
          <ChevronLeft />
        </button>
      )}
      renderBottomCenterControls={(e) => (
        <div className="flex">
          {e.pagingDotsIndices.map((p) => (
            <button key={p} onClick={() => e.goToSlide(p)}>
              <Dot
                className={cn("w-8 h-8 text-primary/50", {
                  "text-white": p === e.currentSlide,
                })}
              />
            </button>
          ))}
        </div>
      )}
      wrapAround
      {...rest}
    >
      {children}
    </NukaCarousel>
  );
};
