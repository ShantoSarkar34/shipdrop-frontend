import Image from "next/image";
import { HERO_IMAGE } from "@/config/images";
import { cn } from "@/lib/utils";

/** Decorative full-bleed image. The parent must be `relative`. */
export function BackdropImage({ priority, className }: { priority?: boolean; className?: string }) {
  return (
    <Image
      src={HERO_IMAGE}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      quality={70}
      unoptimized={HERO_IMAGE.endsWith(".svg")}
      className={cn("object-cover", className)}
    />
  );
}