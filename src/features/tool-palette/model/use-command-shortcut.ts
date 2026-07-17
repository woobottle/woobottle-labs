"use client";

import { useEffect } from "react";

/**
 * Registers a global ⌘K / Ctrl+K shortcut that toggles the tool palette.
 * The callback receives the desired next open state.
 */
export const useCommandShortcut = (onToggle: () => void) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggle]);
};
