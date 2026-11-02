import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { CodeBlock } from "@/components/blog/code-block";
import { CodeTabs } from "@/components/blog/code-tabs";
import { Callout, Compare, Details, Flow, RepoCard, Terminal } from "@/components/blog/parts";
import { Prompt } from "@/components/blog/prompt";

/** The "#" that appears beside a heading so a section can be linked to. */
function Anchor({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="ml-2 font-mono text-muted no-underline opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
    >
      #
    </a>
  );
}

/** Typography for MDX content, matching the rest of the site. */
const components: MDXComponents = {
  h1: (props) => <h1 className="mt-10 text-2xl font-bold leading-snug first:mt-0" {...props} />,
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="group mt-10 text-xl font-bold leading-snug" {...props}>
      {children}
      <Anchor id={id} />
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="group mt-8 text-lg font-semibold leading-snug" {...props}>
      {children}
      <Anchor id={id} />
    </h3>
  ),
  p: (props) => <p className="mt-4 text-[15px] leading-7" {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-7 marker:text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-7 marker:text-muted" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: ({ href = "", children, ...props }) => {
    const className = "underline underline-offset-4 decoration-muted transition-colors hover:decoration-foreground";
    if (href.startsWith("/") || href.startsWith("#")) {
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
    <blockquote className="mt-4 border-l border-box-line pl-4 text-muted" {...props} />
  ),
  hr: () => <hr className="my-8 border-t border-dashed border-line" />,
  code: (props) => (
    <code className="rounded-sm border border-line bg-chip px-1 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  // Highlighted code arrives as <figure><figcaption/><pre/></figure> (see globals.css).
  figure: (props) => <figure className="mt-4" {...props} />,
  figcaption: (props) => <figcaption {...props} />,
  pre: CodeBlock,
  table: (props) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-line px-3 py-2 font-semibold" {...props} />,
  td: (props) => <td className="border-b border-dashed border-line px-3 py-2 align-top" {...props} />,
  Callout,
  Prompt,
  Compare,
  CodeTabs,
  Terminal,
  Flow,
  RepoCard,
  Details,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
