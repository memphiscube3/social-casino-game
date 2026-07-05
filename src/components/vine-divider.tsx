/**
 * VineDivider — decorative jungle liana used in place of the old bulb-string.
 * Renders a repeating SVG pattern of a curling vine with leaves, in the site's
 * emerald + gold palette.
 */
export function VineDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`vine-divider ${className}`}
    />
  );
}
