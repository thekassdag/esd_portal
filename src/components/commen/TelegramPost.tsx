"use client";
import { useEffect, useRef, useState } from "react";


export default function TelegramPost({ postLink, header }: { postLink: string, header?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    setIsLoaded(false);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === "IFRAME") {
            const iframe = node as HTMLIFrameElement;
            iframe.addEventListener("load", () => setIsLoaded(true));
            // Fallback timeout in case the load event fails or fires too early
            setTimeout(() => setIsLoaded(true), 2000);
          }
        });
      });
    });

    observer.observe(containerRef.current, { childList: true });

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", postLink);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-userpic", "false");
    containerRef.current.appendChild(script);

    return () => observer.disconnect();
  }, [postLink]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm bg-card relative">
      {header && (
        <div className="w-full relative z-10">
          {header}
        </div>
      )}

      {!isLoaded && (
        <div className="p-5 space-y-4 w-full bg-card min-h-[140px]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-muted animate-pulse rounded w-1/3"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-1/4"></div>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-5/6"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-4/6"></div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full [&>iframe]:!rounded-xl transition-opacity duration-500 ${!isLoaded ? 'absolute opacity-0 pointer-events-none' : 'relative opacity-100'} ${header ? '[&>iframe]:-mt-[38px]' : ''}`}
      />
    </div>
  );
}
