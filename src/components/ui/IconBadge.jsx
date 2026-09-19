export default function IconBadge({
  color = "#1F5F4F",
  label = "",
  size = 28,
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-xs font-medium text-paper"
      style={{ backgroundColor: color, width: size, height: size }}
    >
      {label?.slice(0, 1).toUpperCase()}
    </span>
  );
}
