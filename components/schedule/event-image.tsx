"use client"

import { ZoomIn } from "lucide-react"
import Image, { type ImageProps } from "next/image"
import { useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type LoadedImageProps = Omit<ImageProps, "onLoad"> & {
  wrapperClassName?: string
  skeletonClassName?: string
}

export function EventImage({
  wrapperClassName,
  skeletonClassName,
  className,
  alt,
  width,
  height,
  ...restProps
}: LoadedImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={wrapperClassName}>
      {!loaded && (
        <Skeleton className={cn("h-40 w-full rounded", skeletonClassName)} />
      )}
      <button
        type="button"
        onClick={() => {
          const src = (restProps as any)?.src as string | undefined
          if (src) window.open(src, "_blank", "noopener,noreferrer")
        }}
        className={cn(
          !loaded && "hidden",
          "group relative block cursor-zoom-in",
        )}
      >
        <Image
          {...restProps}
          alt={alt}
          className={cn("transition-opacity group-hover:opacity-80", className)}
          width={typeof width === "number" ? width : undefined}
          height={typeof height === "number" ? height : undefined}
          onLoad={() => setLoaded(true)}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
          <ZoomIn className="drop-shadow-md" size={20} />
        </div>
      </button>
    </div>
  )
}
