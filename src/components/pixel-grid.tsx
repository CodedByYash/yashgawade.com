/**
 * Pixel art rendered as a single SVG instead of hundreds of DOM nodes.
 * Bitmaps are copied cell-for-cell from the Figma file ("1" = filled).
 */

const LOGO_ROWS = [
  "1111111111",
  "1111111111",
  "1010100011",
  "1010101111",
  "1000101001",
  "1101101011",
  "1101100011",
  "1111111111",
  "1111111111",
];

const ALL = "1".repeat(53);

// Reads "YASHGAWADE" — letters are the empty (dark) cells.
export const WORDMARK_ROWS = [
  ALL,
  ALL,
  "111" + "1101010001" + "0001010110" + "0010001011" + "101000100" + "01100011111",
  "111" + "1101010101" + "0111010110" + "1110101011" + "101010101" + "10101111111",
  "111" + "1100010001" + "0001000110" + "1010001010" + "10100010" + "110100011111",
  "111" + "1110110101" + "1101010110" + "1010101101" + "011010101" + "10101111111",
  "111" + "1110110101" + "0001010110" + "0010101101" + "011010100" + "01100011111",
  ALL,
  ALL,
];

export function Grid({
  rows,
  cell,
  gap,
  fill,
  title,
  className,
}: {
  rows: string[];
  cell: number;
  gap: number;
  fill: string;
  title: string;
  className?: string;
}) {
  const cols = rows[0].length;
  const pitch = cell + gap;
  const width = cols * pitch - gap;
  const height = rows.length * pitch - gap;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={title}
      className={className}
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        [...row].map((bit, x) =>
          bit === "1" ? (
            <rect key={`${x}-${y}`} x={x * pitch} y={y * pitch} width={cell} height={cell} fill={fill} />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return <Grid rows={LOGO_ROWS} cell={3} gap={1} fill="var(--pixel)" title="YG logo" className={className} />;
}
