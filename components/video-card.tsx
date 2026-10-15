"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Video } from "@/data/content";

export function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = `video-${video.id}`;

  useEffect(() => {
    if (!playing) return;
    const modal = dialog.current;
    const opener = trigger.current;
    const previousOverflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [playing]);

  return <article aria-labelledby={titleId}>
    <figure>
      <Image src={`/images/videos/${video.youtubeId}.jpg`} alt="" fill sizes="(max-width: 760px) 82vw, (max-width: 1076px) 52vw, 560px" />
      <button ref={trigger} type="button" className="video-open" onClick={() => setPlaying(true)} aria-label={`Abrir vídeo: ${video.title}`} aria-haspopup="dialog">
        <span className="video-play" aria-hidden="true">▶</span>
      </button>
    </figure>
    <h3 id={titleId}>{video.title}</h3>
    <a className="text-link light" href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={`Assistir ${video.title} no YouTube (nova aba)`}>Assistir no YouTube <span aria-hidden="true">↗</span></a>
    {playing && <dialog ref={dialog} className={`video-dialog${video.format === "short" ? " video-dialog-short" : ""}`} aria-labelledby={`${titleId}-modal`} onCancel={() => setPlaying(false)} onClose={() => setPlaying(false)} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, iframe, a[href]");
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }}>
      <div className="video-dialog-heading">
        <h2 id={`${titleId}-modal`}>{video.title}</h2>
        <button type="button" className="video-close" onClick={() => setPlaying(false)} aria-label="Fechar vídeo" autoFocus>✕</button>
      </div>
      <iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=0&playsinline=1&rel=0`} title={video.title} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      <a className="text-link light" href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">Abrir no YouTube <span aria-hidden="true">↗</span></a>
    </dialog>}
  </article>;
}
