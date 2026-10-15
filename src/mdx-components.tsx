import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/** Typography for MDX content, matching the rest of the site. */
const components: MDXComponents = {
  h1: (props) => <h1 className="mt-10 text-2xl font-bold leading-snug first:mt-0" {...props} />,
  h2: (props) => <h2 className="mt-10 text-xl font-bold leading-snug" {...props} />,
  h3: (props) => <h3 className="mt-8 text-lg font-semibold leading-snug" {...props} />,
  p: (props) => <p className="mt-4 text-[15px] leading-7" {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-7 marker:text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-7 marker:text-muted" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: ({ href = "", children, ...props }) => {
    const className = "underline underline-offset-4 decoration-muted transition-colors hover:decoration-white";
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  },
  strong: (props) => <strong className="font-semibold" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-4 border-l border-chip-line pl-4 text-muted" {...props} />
  ),
  hr: () => <hr className="my-8 border-t border-dashed border-line" />,
  code: (props) => (
    <code className="rounded-sm border border-line bg-chip px-1 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mt-4 overflow-x-auto border border-dashed border-chip-line bg-chip p-4 font-mono text-[13px] leading-6 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
