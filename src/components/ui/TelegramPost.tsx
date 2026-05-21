"use client";

import { useEffect, useRef } from "react";

interface TelegramPostProps {
  channel: string;
  messageId: number;
}

export function TelegramPost({ channel, messageId }: TelegramPostProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", `${channel}/${messageId}`);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-userpic", "false");
    containerRef.current.appendChild(script);
  }, [channel, messageId]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden [&>iframe]:!rounded-xl shadow-sm"
    />
  );
}
