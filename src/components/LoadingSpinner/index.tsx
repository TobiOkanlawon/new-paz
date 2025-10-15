import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";

/**
 * Props:
 *  - scale: fraction of the container size to use for spinner (default 0.18)
 *  - minSize: minimum spinner size in px (default 16)
 *  - maxSize: maximum spinner size in px (default 128)
 *  - color: spinner color (default currentColor)
 *  - style, className: forwarded to outer element
 */
export default function Spinner({
  scale = 0.18,
  minSize = 16,
  maxSize = 128,
  color = "currentColor",
  style = {},
  className = "",
  "aria-label": ariaLabel = "Loading...",
}) {
  const wrapperRef = useRef(null);
  const parentRef = useRef(null);
  const [size, setSize] = useState(minSize);
  const prevParentPosition = useRef(null);

  // when mounted, find parent element (the immediate parent node in the DOM)
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const parent = wrapperRef.current.parentElement;
    parentRef.current = parent ?? null;

    if (!parent) return;

    // If parent has computed position 'static', make it relative so absolute centering works.
    const cs = window.getComputedStyle(parent);
    if (cs.position === "static") {
      prevParentPosition.current = parent.style.position || "";
      parent.style.position = "relative";
    }

    return () => {
      // restore parent's position
      if (parent && prevParentPosition.current !== null) {
        parent.style.position = prevParentPosition.current;
      }
    };
  }, []);

  // ResizeObserver to set spinner size based on parent box
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) {
      // fallback: size from wrapper (if not in DOM yet)
      const r = wrapperRef.current;
      if (r) {
        const rect = r.getBoundingClientRect();
        const s = Math.max(
          minSize,
          Math.min(maxSize, Math.min(rect.width, rect.height) * scale),
        );
        setSize(Math.round(s));
      }
      return;
    }

    const update = (entry) => {
      const rect = entry.contentRect ?? parent.getBoundingClientRect();
      const s = Math.max(
        minSize,
        Math.min(maxSize, Math.min(rect.width, rect.height) * scale),
      );
      setSize(Math.round(s));
    };

    // Prefer ResizeObserver
    let ro;
    try {
      ro = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) return;
        update(entries[0]);
      });
      ro.observe(parent);
      // set initial
      update({ contentRect: parent.getBoundingClientRect() });
    } catch (err) {
      // ResizeObserver not supported: fallback to window resize
      const onResize = () => {
        const rect = parent.getBoundingClientRect();
        const s = Math.max(
          minSize,
          Math.min(maxSize, Math.min(rect.width, rect.height) * scale),
        );
        setSize(Math.round(s));
      };
      window.addEventListener("resize", onResize);
      onResize();
      return () => window.removeEventListener("resize", onResize);
    }

    return () => {
      if (ro) {
        ro.disconnect();
      }
    };
  }, [scale, minSize, maxSize]);

  // styles
  const outerStyle = {
    position: "absolute", // will center relative to first positioned ancestor (we ensure parent is positioned)
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none", // don't block clicks by default; change if you want to block interaction
    ...style,
  };

  const iconStyle = {
    width: size,
    height: size,
    // allow color control via props; FaSpinner inherits color from currentColor
    color,
    // make sure it doesn't scale awkwardly
    display: "block",
  };

  // CSS animation: add a simple keyframe string into a <style> if not present
  useEffect(() => {
    const id = "react-center-spinner-spin-keyframes";
    if (!document.getElementById(id)) {
      const styleTag = document.createElement("style");
      styleTag.id = id;
      styleTag.innerHTML = `
        @keyframes react-center-spinner-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  return (
    <span
      ref={wrapperRef}
      className={`react-center-spinner ${className}`}
      style={outerStyle}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {/* visually-hidden text for screen readers */}
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {ariaLabel}
      </span>

      <FaSpinner
        style={{
          ...iconStyle,
          animation: "react-center-spinner-spin 0.9s linear infinite",
        }}
        aria-hidden="true"
      />
    </span>
  );
}
