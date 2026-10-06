"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site, youtubeId, youtubeThumb } from "@/lib/site";
import { loadYouTubeApi, type YTPlayer } from "@/lib/youtube-player";

const v = site.featuredVideo;
const PLAYING = 1;
const PAUSED = 2;
const ENDED = 0;

/**
 * Full-width company video. Loads lazily, starts muted when at least half of it is on screen,
 * pauses when it leaves the screen, and does not resume if the visitor paused it themselves.
 */
export function FeaturedVideo() {
  const id = youtubeId(v.youtubeUrl);
  const frame = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);

  // 1. Start loading the player shortly before the section scrolls into view.
  useEffect(() => {
    const el = frame.current;
    if (!el || !id) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  // 2. Create the player, then play/pause it based on visibility.
  useEffect(() => {
    const el = frame.current;
    const target = mount.current;
    if (!near || !id || !el || !target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let player: YTPlayer | null = null;
    let io: IntersectionObserver | null = null;
    let visible = false;
    let userPaused = false;
    let playing = false;
    let pausedByUs = false;
    let cancelled = false;

    const sync = () => {
      if (!player || reduceMotion) return;
      if (visible && !userPaused && !playing) player.playVideo();
      else if (!visible && playing) {
        pausedByUs = true;
        player.pauseVideo();
      }
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        const holder = document.createElement("div");
        target.appendChild(holder);
        player = new YT.Player(holder, {
          videoId: id,
          host: "https://www.youtube-nocookie.com",
          playerVars: { autoplay: 0, mute: 1, playsinline: 1, rel: 0, modestbranding: 1, origin: window.location.origin },
          events: {
            onReady: () => {
              setReady(true);
              sync();
            },
            onStateChange: ({ data }) => {
              if (data === PLAYING) {
                playing = true;
                userPaused = false;
                setMuted(player?.isMuted() ?? true);
              } else if (data === PAUSED) {
                playing = false;
                if (pausedByUs) pausedByUs = false;
                else userPaused = true;
              } else if (data === ENDED) {
                playing = false;
              }
            },
          },
        });
        io = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            sync();
          },
          { threshold: 0.5 },
        );
        io.observe(el);
        playerRef.current = player;
      })
      .catch(() => {
        /* offline or blocked: the poster stays and nothing else breaks */
      });

    return () => {
      cancelled = true;
      io?.disconnect();
      player?.destroy();
      playerRef.current = null;
      setReady(false);
    };
  }, [near, id]);

  // Hidden on the live site until a YouTube link is added; visible placeholder while developing.
  if (!id && process.env.NODE_ENV === "production") return null;

  const poster = id ? youtubeThumb(id) : v.poster;

  return (
    <section id="introduction" aria-labelledby="intro-title" className="bg-light-mesh pb-4 pt-20 sm:pt-24">
      <div className="container-x">
        <SectionHeading eyebrow={v.eyebrow} title={v.title} intro={v.intro} id="intro-title" />

        <Reveal className="mt-12">
          <div
            ref={frame}
            className="relative aspect-video w-full overflow-hidden rounded-[1.7rem] bg-navy-950 shadow-[0_50px_100px_-40px_rgb(8_34_82/0.75)] ring-1 ring-navy-900/15 sm:rounded-[2.2rem]"
          >
            <Image src={poster} alt="" fill sizes="(min-width:1280px) 76rem, 94vw" className="object-cover" />
            {id ? (
              <>
                <div ref={mount} className={`absolute inset-0 transition-opacity duration-500 [&_iframe]:size-full ${ready ? "opacity-100" : "opacity-0"}`} />
                {ready && muted && (
                  <button
                    type="button"
                    onClick={() => {
                      playerRef.current?.unMute();
                      setMuted(false);
                    }}
                    className="glass-panel absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    <Icon name="volume-off" className="size-4" /> Tap for sound
                  </button>
                )}
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-navy-950/60 p-6 text-center text-white">
                <p className="glass-panel max-w-md rounded-3xl p-6 text-sm leading-relaxed">
                  <span className="font-display block text-lg font-semibold">Company video placeholder</span>
                  Add the YouTube link at <code className="rounded bg-white/15 px-1.5 py-0.5">featuredVideo.youtubeUrl</code> in <code className="rounded bg-white/15 px-1.5 py-0.5">src/data/site.json</code>. This
                  placeholder is hidden on the live site until then.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
