import { icons, type IconName } from "@/lib/icons.generated";
import { cn } from "@/lib/utils";

type IconProps = Omit<React.SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  /** Force single-colour rendering for multi-colour brand icons. */
  monochrome?: boolean;
};

export function Icon({ name, size = 20, monochrome, className, ...props }: IconProps) {
  const icon = icons[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${icon.w} ${icon.h}`}
      width={size}
      height={size}
      fill="none"
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn("shrink-0", monochrome && "[&_*]:fill-current", className)}
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
}
