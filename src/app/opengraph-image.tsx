import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/blog/og-card";
import { profile } from "@/data/profile";

export const alt = "Yash Gawade, frontend and full-stack developer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard title={profile.name} kicker={profile.role} footer={profile.taglines[0]} />,
    size,
  );
}
