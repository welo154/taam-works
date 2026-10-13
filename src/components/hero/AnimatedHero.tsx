"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { HeroBadge } from "@/components/hero/HeroBadge";
import { TaamWordmark } from "@/components/hero/TaamWordmark";
import {
  heroStateMobile,
  heroStatesDesktop,
  heroTiming,
  type HeroArrangement,
  type HeroLabelId,
} from "@/content/hero-states";
import { heroNav } from "@/content/site";

function subscribeMedia(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => subscribeMedia(query, onChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

type LiveState = {
  arrangement: HeroArrangement;
  transitionMs: number;
};

export function AnimatedHero() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isNarrow = useMediaQuery("(max-width: 767px)");
  const settled = isNarrow ? heroStateMobile : heroStatesDesktop.C;

  const [live, setLive] = useState<LiveState | null>(null);
  const frozenRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    clearTimers();
    frozenRef.current = false;

    if (reducedMotion || isNarrow) {
      return clearTimers;
    }

    // All arrangement updates are scheduled asynchronously (lint-safe).
    timersRef.current.push(
      window.setTimeout(() => {
        if (frozenRef.current) return;
        setLive({ arrangement: heroStatesDesktop.A, transitionMs: 0 });
      }, 0),
    );

    const toB = heroTiming.holdAMs;
    timersRef.current.push(
      window.setTimeout(() => {
        if (frozenRef.current) return;
        setLive({
          arrangement: heroStatesDesktop.B,
          transitionMs: heroTiming.transitionMs,
        });
      }, toB),
    );

    const toC = toB + heroTiming.transitionMs + heroTiming.holdBMs;
    timersRef.current.push(
      window.setTimeout(() => {
        if (frozenRef.current) return;
        setLive({
          arrangement: heroStatesDesktop.C,
          transitionMs: heroTiming.transitionMs,
        });
      }, toC),
    );

    return clearTimers;
  }, [reducedMotion, isNarrow]);

  const freeze = () => {
    frozenRef.current = true;
    clearTimers();
  };

  const unfreeze = () => {
    frozenRef.current = false;
  };

  const arrangement =
    reducedMotion || isNarrow
      ? settled
      : (live?.arrangement ?? heroStatesDesktop.A);
  const transitionMs =
    reducedMotion || isNarrow ? 0 : (live?.transitionMs ?? 0);

  const labelOrder = useMemo(
    () => heroNav.map((item) => item.id as HeroLabelId),
    [],
  );

  return (
    <section
      className="site-shell relative min-h-[70vh] py-8 md:min-h-[85vh] md:py-12"
      aria-label="TAAM navigation hero"
    >
      <div className="relative mx-auto aspect-[4/3] w-full max-w-6xl md:aspect-[16/10]">
        <TaamWordmark />
        {labelOrder.map((id) => {
          const item = heroNav.find((n) => n.id === id)!;
          const point = arrangement[id];
          return (
            <HeroBadge
              key={id}
              item={item}
              onInteractStart={freeze}
              onInteractEnd={unfreeze}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transitionDuration: `${transitionMs}ms`,
                transitionTimingFunction: heroTiming.easing,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
