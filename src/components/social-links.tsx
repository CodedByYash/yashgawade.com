"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/icon";
import { Item, March, Stagger } from "@/components/motion";
import { ease } from "@/lib/motion";
import type { SocialLink } from "@/data/profile";

const box =
  "relative flex size-[43px] items-center justify-center border border-dashed border-social-line bg-social-bg text-social-icon transition-colors duration-500";

const marching = "hover:text-foreground";

/**
 * The solid GitHub / LinkedIn / YouTube marks fill their whole box, while the
 * outline icons carry padding. 20px vs 24px gives both the ~19px glyph the
 * design draws.
 */
const glyphSize = (name: string) => (name.startsWith("akar-icons:") ? 20 : 24);

/** Square dashed social buttons. Entries without a URL yet render inert. */
export function SocialButtons({ items }: { items: SocialLink[] }) {
  return (
    <Stagger dir="right" className="flex flex-wrap gap-4">
      {items.map((item) => (
        <Item key={item.label}>
          {item.href === "#" ? (
            <span className={`${box} opacity-60`} role="img" aria-label={`${item.label} (link not set)`}>
              <Icon name={item.icon} size={glyphSize(item.icon)} />
            </span>
          ) : (
            <motion.a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={`${box} ${marching}`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.4, ease }}
            >
              <Icon name={item.icon} size={glyphSize(item.icon)} />
              <March />
            </motion.a>
          )}
        </Item>
      ))}
    </Stagger>
  );
}

/** Compact X | GitHub | LinkedIn row used in the footer. */
export function SocialInline({ items }: { items: SocialLink[] }) {
  return (
    <Stagger dir="right" className="flex items-center gap-2">
      {items.map((item, i) => (
        <Item key={item.label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-4 w-px bg-line-strong" />}
          <motion.a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="block text-foreground transition-colors duration-500 hover:text-nav-muted"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.4, ease }}
          >
            <Icon name={item.icon} size={20} />
          </motion.a>
        </Item>
      ))}
    </Stagger>
  );
}
