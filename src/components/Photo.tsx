import Image from "next/image";
import { media, type MediaKey } from "@/content/media";

/** Fills its (positioned, sized) parent with a registered photo. */
export function Photo({
  name,
  sizes = "(min-width:1024px) 50vw, 100vw",
  priority = false,
  className = "",
  position,
}: {
  name: MediaKey;
  sizes?: string;
  priority?: boolean;
  className?: string;
  position?: string;
}) {
  const m = media[name];
  return (
    <Image
      src={m.src}
      alt={m.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

/** Wraps a photo in a relative box so it can be dropped into any aspect-ratio container. */
export function PhotoBox({ name, className = "", sizes, position }: { name: MediaKey; className?: string; sizes?: string; position?: string }) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Photo name={name} sizes={sizes} position={position} />
    </div>
  );
}
