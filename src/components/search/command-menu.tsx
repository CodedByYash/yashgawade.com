"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { setThemePreference } from "@/lib/theme";
import { rankGroups, splitMatches } from "./rank";
import type { SearchGroup, SearchItem } from "./types";

const kbd =
  "rounded bg-kbd px-1.5 py-0.5 font-nav text-[11px] font-medium leading-[13px] text-kbd-text";

/** Wraps matched text in a subtle underline so people see why a result showed up. */
function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitMatches(text, query).map((part, i) =>
        part.match ? (
          <mark
            key={i}
            className="bg-transparent text-foreground underline decoration-icon decoration-dashed underline-offset-[3px]"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

type Flash = { id: string; text: string };

function Palette({
  groups,
  onClose,
  onNavigate,
}: {
  groups: SearchGroup[];
  onClose: () => void;
  /** Runs `go` after the menu has finished closing. */
  onNavigate: (go: () => void) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [flash, setFlash] = useState<Flash | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const filtered = useMemo(() => rankGroups(groups, query), [groups, query]);
  const count = filtered.reduce((total, group) => total + group.items.length, 0);

  const showThenClose = useCallback(
    (id: string, text: string) => {
      setFlash({ id, text });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(onClose, 900);
    },
    [onClose],
  );

  async function copy(item: SearchItem, read: () => Promise<string>) {
    try {
      await navigator.clipboard.writeText(await read());
      showThenClose(item.id, "Copied ✓");
    } catch {
      showThenClose(item.id, "Couldn’t copy");
    }
  }

  function run(item: SearchItem) {
    const { action } = item;
    switch (action.type) {
      case "route":
        onNavigate(() => router.push(action.href));
        break;
      case "external":
        // Opened right away, inside the click, so popup blockers allow it.
        if (action.href.startsWith("mailto:")) window.location.href = action.href;
        else window.open(action.href, "_blank", "noopener,noreferrer");
        onClose();
        break;
      case "copy":
        void copy(item, async () => action.text);
        break;
      case "theme":
        setThemePreference(action.theme);
        showThenClose(item.id, "Applied ✓");
        break;
      case "copy-phone":
        void copy(item, async () => {
          const res = await fetch("/api/phone", { cache: "no-store" });
          if (!res.ok) throw new Error("unavailable");
          return ((await res.json()) as { phone: string }).phone;
        });
        break;
    }
  }

  return (
    <Autocomplete.Root
      open
      inline
      items={groups}
      filteredItems={filtered}
      value={query}
      onValueChange={(value, details) => {
        // Choosing a result runs it; it must not rewrite what was typed.
        if (details.reason === "item-press") return;
        setQuery(value);
      }}
      itemToStringValue={(item: SearchItem) => item.label}
      autoHighlight="always"
      keepHighlight
    >
      <Autocomplete.InputGroup className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4 transition-colors has-[input:focus]:border-icon">
        <Icon name="hugeicons:search-01" size={18} className="text-nav-muted" />
        <Autocomplete.Input
          aria-label="Search the site"
          placeholder="Search the site…"
          autoComplete="off"
          spellCheck={false}
          // `!` is needed: the site-wide :focus-visible ring is unlayered CSS and
          // would otherwise draw a dashed box around this full-height input.
          // Focus shows as a brighter line under the row instead (see InputGroup).
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none! placeholder:text-muted any-pointer-coarse:text-base"
        />
        <Dialog.Close
          aria-label="Close search"
          className={`${kbd} shrink-0 transition-colors hover:bg-line-strong any-pointer-coarse:px-3 any-pointer-coarse:py-2`}
        >
          Esc
        </Dialog.Close>
      </Autocomplete.InputGroup>

      <ScrollArea.Root className="relative flex min-h-0 flex-1 overflow-hidden">
        <ScrollArea.Viewport className="min-h-0 flex-1 overscroll-contain [scroll-padding-block:0.5rem]">
          <ScrollArea.Content style={{ minWidth: "100%" }}>
            <Autocomplete.Empty>
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium">No results for “{query.trim()}”</p>
                <p className="mt-1 text-xs text-muted">Try a section, a component or a blog post.</p>
              </div>
            </Autocomplete.Empty>

            <Autocomplete.List className="py-2">
              {(group: SearchGroup) => (
                <Autocomplete.Group key={group.value} items={group.items} className="not-last:mb-1">
                  <Autocomplete.GroupLabel className="px-4 pb-1.5 pt-3 font-mono text-[11px] font-medium uppercase tracking-wide text-muted select-none">
                    {group.value}
                  </Autocomplete.GroupLabel>
                  <Autocomplete.Collection>
                    {(item: SearchItem) => (
                      <Autocomplete.Item
                        key={item.id}
                        value={item}
                        onClick={() => run(item)}
                        className="group grid min-h-12 cursor-default grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 outline-none select-none [scroll-margin-block:0.5rem] data-highlighted:bg-chip data-highlighted:outline data-highlighted:outline-1 data-highlighted:-outline-offset-1 data-highlighted:outline-dashed data-highlighted:outline-chip-line"
                      >
                        <span
                          aria-hidden
                          className="flex size-8 items-center justify-center border border-dashed border-box-line bg-box"
                        >
                          <Icon name={item.icon} size={16} className="text-icon" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            <Highlight text={item.label} query={query} />
                          </span>
                          {item.description && (
                            <span className="block truncate text-xs text-muted">
                              <Highlight text={item.description} query={query} />
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-muted group-data-highlighted:text-foreground max-sm:hidden">
                          {flash?.id === item.id ? flash.text : item.hint}
                        </span>
                        {flash?.id === item.id && (
                          <span className="sr-only" role="status">
                            {flash.text}
                          </span>
                        )}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="flex w-2 justify-center py-1">
          <ScrollArea.Thumb className="w-full bg-line-strong" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <p role="status" className="sr-only">
        {query.trim() ? `${count} ${count === 1 ? "result" : "results"}` : ""}
      </p>

      <div className="flex shrink-0 items-center justify-between border-t border-line px-4 py-2.5 text-xs text-muted max-sm:hidden">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <kbd className={kbd}>↑</kbd>
            <kbd className={kbd}>↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className={kbd}>↵</kbd>
            Open
          </span>
        </div>
        <span className="flex items-center gap-1.5">
          <kbd className={kbd}>Esc</kbd>
          Close
        </span>
      </div>
    </Autocomplete.Root>
  );
}

/**
 * Keeps Tab and Shift+Tab inside the dialog. The dialog's own focus manager
 * let focus slip out to the page behind, so the loop is made explicit here:
 * past the last stop comes the first, and before the first comes the last.
 */
function trapTab(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;

  // Only elements Tab can really land on: Base UI also renders a hidden form
  // input inside the dialog, which must not count as the "last" stop.
  const stops = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]',
    ),
  ).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.getClientRects().length > 0,
  );
  if (stops.length === 0) return;

  const first = stops[0];
  const last = stops[stops.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** The Ctrl+K dialog. Loaded on demand by `Search`. */
export default function CommandMenu({
  open,
  onOpenChange,
  groups,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: SearchGroup[];
}) {
  const afterClose = useRef<(() => void) | null>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  // Navigation waits for the close animation, so the page scroll lock is gone
  // by the time a `/#section` jump needs to scroll.
  const navigateAfterClose = useCallback(
    (go: () => void) => {
      afterClose.current = go;
      onOpenChange(false);
    },
    [onOpenChange],
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (isOpen) return;
        const go = afterClose.current;
        afterClose.current = null;
        go?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-(--backdrop) backdrop-blur-[2px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-[71] flex items-start justify-center overflow-hidden px-4 pb-4 pt-[min(12vh,6rem)] max-sm:pt-4">
          <Dialog.Popup
            aria-label="Search"
            onKeyDown={trapTab}
            className="relative flex max-h-[min(34rem,calc(100dvh-2rem))] w-full max-w-[640px] flex-col overflow-hidden border border-line bg-background shadow-[0_24px_80px_-12px_var(--popup-shadow)] transition-[translate,scale,opacity] duration-150 data-ending-style:-translate-y-2 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:scale-[0.98] data-starting-style:opacity-0"
          >
            <Palette groups={groups} onClose={close} onNavigate={navigateAfterClose} />
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
