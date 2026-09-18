import Image from "next/image";

type AnimatedShapeImageProps = {
  src: string;
  width: number;
  height: number;
  className: string;
  imageClassName: string;
};

export function AnimatedShapeImage({
  src,
  width,
  height,
  className,
  imageClassName,
}: AnimatedShapeImageProps) {
  return (
    <div className={`${className} pointer-events-none max-w-full animate-shape-float`} aria-hidden="true">
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={`${imageClassName} select-none`}
      />
    </div>
  );
}
