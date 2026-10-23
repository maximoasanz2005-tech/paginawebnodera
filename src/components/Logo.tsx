interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Logo de NODERA.
 *
 * Actualmente usa un wordmark SVG provisional (texto tipográfico) ubicado en
 * /public/nodera-wordmark.svg. Para reemplazarlo por el logo original:
 * 1. Colocá el archivo del logo en public/nodera-wordmark.svg (versión oscura)
 *    y public/nodera-wordmark-light.svg (versión clara para fondos oscuros).
 * 2. Conservá las proporciones y el viewBox. Si el archivo tiene otro viewBox,
 *    ajustá el width/height aquí o usá width="100%".
 * 3. Si el logo es un PNG/WebP, cambiá la extensión en el src de abajo y
 *    ajustá el alt.
 */
export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const src =
    variant === "light" ? "/nodera-wordmark-light.svg" : "/nodera-wordmark.svg";
  return (
    <img
      src={src}
      alt="NODERA"
      width={160}
      height={36}
      className={className}
      style={{ display: "block", height: "5rem", width: "auto" }}
    />
  );
}
