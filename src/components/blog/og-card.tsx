/** Layout shared by the site-wide and per-post share images (rendered by next/og). */
export const ogSize = { width: 1200, height: 630 };

export function OgCard({ title, kicker, footer }: { title: string; kicker: string; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#09090b",
        color: "#fafafa",
        padding: "64px 72px",
        border: "1px dashed #3f3f46",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: "#a1a1aa" }}>
        {kicker}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: title.length > 60 ? 56 : 72,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -1,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a1a1aa" }}>
        <span>{footer}</span>
        <span>yashgawade.com</span>
      </div>
    </div>
  );
}
