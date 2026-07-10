type EmburLogoProps = {
  showName?: boolean;
  size?: "small" | "medium" | "large";
  light?: boolean;
  className?: string;
};

const sizes = {
  small: {
    image: "h-8 w-8",
    text: "text-lg",
    radius: "rounded-lg",
  },
  medium: {
    image: "h-10 w-10",
    text: "text-2xl",
    radius: "rounded-xl",
  },
  large: {
    image: "h-16 w-16",
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
      <img
        src="/embur-logo.png"
        alt="EMBUR"
        className={`${selectedSize.image} ${selectedSize.radius} shrink-0 object-contain`}
      />

      {showName && (
        <span
          className={`${selectedSize.text} whitespace-nowrap font-bold tracking-tight ${
            light ? "text-white" : "text-slate-950"
          }`}
        >
          EMBUR
        </span>
      )}
    </div>
  );
}