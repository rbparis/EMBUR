import Image from "next/image";

type EmburLogoProps = {
  showName?: boolean;
  size?: "small" | "medium" | "large";
  light?: boolean;
  className?: string;
};

const sizes = {
  small: {
    image: 32,
    text: "text-lg",
    radius: "rounded-lg",
  },
  medium: {
    image: 40,
    text: "text-2xl",
    radius: "rounded-xl",
  },
  large: {
    image: 64,
    text: "text-3xl",
    radius: "rounded-2xl",
  },
};

export default function EmburLogo({
  showName = true,
  size = "medium",
  light = false,
  className = "",
}: EmburLogoProps) {
  const selectedSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/embur-logo.png"
        alt="EMBUR"
        width={selectedSize.image}
        height={selectedSize.image}
        priority
        className={`${selectedSize.radius} object-contain`}
      />

      {showName && (
        <span
          className={`${selectedSize.text} font-bold tracking-tight ${
            light ? "text-white" : "text-slate-950"
          }`}
        >
          EMBUR
        </span>
      )}
    </div>
  );
}