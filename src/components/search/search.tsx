"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icon";
import type { SearchGroup } from "./types";

const loadMenu = () => import("./command-menu");

/** The menu code is only fetched once someone is likely to use it. */
const CommandMenu = dynamic(loadMenu, { ssr: false });

const subscribe = () => () => {};
const isApple = () => /mac|iphone|ipad/i.test(navigator.userAgent);

/**
 * Header search button plus the global Ctrl/⌘+K shortcut. Only this small
 * piece ships on every page; the menu itself loads on first use or when the
 * browser is idle.
 */
export function Search({ groups }: { groups: SearchGroup[] }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const apple = useSyncExternalStore(subscribe, isApple, () => false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isK = event.key.toLowerCase() === "k";
      if (isK && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        setReady(true);
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Warm the chunk while the browser has nothing better to do.
  useEffect(() => {
    const warm = () => void loadMenu();
    // Safari has no requestIdleCallback, hence the check.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setReady(true);
          setOpen(true);
        }}
        onPointerEnter={() => void loadMenu()}
        onFocus={() => void loadMenu()}
        aria-label="Search"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+K Meta+K"
        className="flex size-9 shrink-0 items-center justify-center text-nav-muted transition-colors hover:text-foreground sm:h-[33px] sm:w-[91px] sm:justify-start sm:gap-3 sm:px-2"
      >
        <Icon name="hugeicons:search-01" size={16} className="max-sm:size-5" />
        <kbd className="rounded bg-kbd px-1.5 py-0.5 font-nav text-[11px] font-medium leading-[13px] text-kbd-text max-sm:hidden">
          {apple ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>

      {ready && <CommandMenu open={open} onOpenChange={setOpen} groups={groups} />}
    </>
  );
}
