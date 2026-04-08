import { useCallback, useEffect, type MouseEvent } from "react";
import { useDashboardStore } from "@/zustand";

export function useDashboardDrag() {
  const sidebarPos = useDashboardStore((s) => s.sidebarPos);
  const sidebarExpanded = useDashboardStore((s) => s.sidebarExpanded);
  const isDragging = useDashboardStore((s) => s.isDragging);
  const dragOffset = useDashboardStore((s) => s.dragOffset);
  const setIsDragging = useDashboardStore((s) => s.setIsDragging);
  const setDragOffset = useDashboardStore((s) => s.setDragOffset);
  const setSidebarPos = useDashboardStore((s) => s.setSidebarPos);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest(".drag-handle")) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - sidebarPos.x,
      y: e.clientY - sidebarPos.y,
    });
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const sidebarWidth = sidebarExpanded ? 320 : 48;
      const sidebarHeight = sidebarExpanded ? 600 : 48;

      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - sidebarWidth));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - sidebarHeight));

      setSidebarPos({ x: newX, y: newY });
    },
    [isDragging, dragOffset, sidebarExpanded, setSidebarPos]
  );

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, setIsDragging]);

  return { onMouseDown };
}
