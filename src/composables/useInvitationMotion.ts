import { nextTick, onBeforeUnmount, watch } from "vue";
import type { Ref, WatchSource } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useInvitationMotion(root: Ref<HTMLElement | null>, entered: WatchSource<boolean>) {
  let media: gsap.MatchMedia | null = null;

  const stop = watch(
    entered,
    async (active, _, onCleanup) => {
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
        media?.revert();
        media = null;
      });
      if (!active) return;
      await nextTick();
      if (cancelled || !root.value) return;
      const rootElement = root.value;

      media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
        },
        (context) => {
          const desktop = context.conditions?.desktop;
          const select = gsap.utils.selector(rootElement);

          gsap.from(select(".hero-copy > *"), {
            y: 28,
            autoAlpha: 0,
            stagger: 0.13,
            duration: 1,
            ease: "power3.out",
          });
          gsap.fromTo(
            select(".hero-photo img"),
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.7,
              ease: "power2.out",
            },
          );
          gsap.to(select(".hero-photo"), {
            yPercent: desktop ? 3 : 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: select(".hero")[0],
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          function reveal(selector: string, from: gsap.TweenVars, trigger = selector) {
            gsap.from(select(selector), {
              duration: 0.9,
              ease: "power3.out",
              ...from,
              scrollTrigger: {
                trigger: select(trigger)[0],
                start: "top 90%",
                end: "top 55%",
                scrub: 0.6,
              },
            });
          }

          select("h2, .photo-interlude figcaption").forEach((heading) => {
            const previous = heading.previousElementSibling;
            const next = heading.nextElementSibling;
            const eyebrow = previous?.matches(".eyebrow") ? previous : null;
            const description = next?.matches(".lead, .eyebrow") ? next : null;
            const entrance = gsap.timeline({
              scrollTrigger: {
                trigger: heading,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
            if (eyebrow) {
              entrance.from(eyebrow, {
                y: 14,
                autoAlpha: 0,
                duration: 0.65,
                ease: "power2.out",
              }, 0);
            }
            entrance.from(heading, {
              y: desktop ? 42 : 28,
              scale: 0.96,
              autoAlpha: 0,
              transformOrigin: "50% 100%",
              duration: 1.05,
              ease: "power3.out",
            }, eyebrow ? 0.12 : 0);
            if (description) {
              entrance.from(description, {
                y: 16,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
              }, 0.28);
            }
          });

          reveal(
            ".letter-copy > :not(h2):not(.eyebrow)",
            {
              y: 12,
              autoAlpha: 0,
              stagger: 0.12,
            },
            ".letter-copy",
          );
          reveal(
            ".families article",
            {
              x: (index) => (index ? 1 : -1) * (desktop ? 28 : 14),
              autoAlpha: 0,
              stagger: 0.2,
            },
            ".families",
          );
          reveal(
            ".place > :not(h2):not(.eyebrow)",
            {
              y: 14,
              autoAlpha: 0,
              stagger: 0.1,
            },
            ".place",
          );
          reveal(".venue", {
            scale: 0.96,
            rotation: -1.5,
            opacity: 0,
            duration: 1.2,
          });
          select(".day li").forEach((item, index) => {
            gsap.from(item, {
              y: desktop ? 20 : 0,
              x: desktop ? 0 : (index % 2 ? -1 : 1) * 14,
              autoAlpha: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: desktop ? select(".day-path")[0] : item,
                start: desktop ? `top ${80 - index * 10}%` : "top 85%",
                end: desktop ? `bottom ${80 - index * 10}%` : "center 65%",
                scrub: true,
              },
            });
            gsap.from(item.querySelector(".day-icon"), {
              scale: 0.75,
              rotation: -12,
              transformOrigin: "center",
              ease: "power2.out",
              scrollTrigger: {
                trigger: desktop ? select(".day-path")[0] : item,
                start: desktop ? `top ${80 - index * 10}%` : "top 85%",
                end: desktop ? `bottom ${80 - index * 10}%` : "center 65%",
                scrub: true,
              },
            });
          });
          gsap.from(select(".vow-word"), {
            y: desktop ? 48 : 32,
            x: (index) => index % 2 ? 10 : -10,
            rotation: (index) => index % 2 ? 7 : -7,
            scale: 0.92,
            autoAlpha: 0,
            transformOrigin: "50% 100%",
            duration: 1.1,
            stagger: 0.09,
            ease: "back.out(1.25)",
            scrollTrigger: {
              trigger: select(".vow blockquote")[0],
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
          reveal(
            ".count > div",
            {
              y: (index) => (index % 2 ? -18 : 18),
              autoAlpha: 0,
              stagger: 0.13,
              duration: 0.7,
            },
            ".count",
          );
          reveal(
            ".guest-details > div",
            {
              x: (index) => (index ? 18 : -18),
              autoAlpha: 0,
              stagger: 0.18,
            },
            ".guest-details",
          );
          reveal(".rsvp form", { y: 16, opacity: 0, duration: 0.7 });

          const stationery = gsap.timeline({
            scrollTrigger: {
              trigger: select(".stationery")[0],
              start: "top 85%",
              end: desktop ? "bottom 60%" : "top 20%",
              scrub: desktop ? 1.1 : 0.7,
            },
          });
          stationery
            .from(
              select(".letter-botanical"),
              {
                x: desktop ? -25 : -12,
                y: 12,
                rotation: "-=8",
                autoAlpha: 0,
                duration: 1.1,
                ease: "power2.out",
              },
              0,
            )
            .from(
              select(".paper-envelope"),
              {
                y: desktop ? -80 : -48,
                x: desktop ? 28 : 14,
                rotation: "-=10",
                autoAlpha: 0,
                duration: 1.2,
                ease: "power2.out",
              },
              0.12,
            )
            .from(
              select(".photo-strip"),
              {
                y: desktop ? -55 : -32,
                x: desktop ? -35 : -16,
                rotation: "+=14",
                autoAlpha: 0,
                duration: 1.3,
                ease: "power3.out",
              },
              0.48,
            )
            .from(
              select(".date-tag"),
              {
                y: desktop ? -95 : -60,
                x: desktop ? 18 : 8,
                rotation: "-=12",
                autoAlpha: 0,
                duration: 1.25,
                ease: "sine.out",
              },
              0.82,
            )
            .fromTo(
              select(".date-tag i"),
              {
                rotation: -7,
                transformOrigin: "top center",
              },
              {
                rotation: 5,
                duration: 0.4,
                repeat: 1,
                yoyo: true,
                ease: "sine.inOut",
              },
              1.65,
            )
            .to(select(".date-tag i"), {
              rotation: 0,
              duration: 0.35,
              ease: "sine.out",
            });

          const timelineSvg = select<SVGSVGElement>(
            desktop ? ".timeline-desktop" : ".timeline-line",
          )[0];
          const timelinePath = timelineSvg.querySelector<SVGPathElement>(".timeline-progress");
          const timelineCursor = timelineSvg.querySelector<SVGCircleElement>(".timeline-cursor");
          if (!timelinePath || !timelineCursor) return;
          const pathLength = timelinePath.getTotalLength();
          const lineProgress = { value: 0 };
          const setLineOffset = gsap.quickSetter(timelinePath, "strokeDashoffset");
          const setCursor = gsap.quickSetter(timelineCursor, "attr");
          const firstPoint = timelinePath.getPointAtLength(0);
          function positionCursor(point: { x: number; y: number }) {
            const scaleX = timelineSvg.viewBox.baseVal.width / timelineSvg.clientWidth;
            const scaleY = timelineSvg.viewBox.baseVal.height / timelineSvg.clientHeight;
            // The path stretches with its container; the thumb stays circular in pixels.
            setCursor({
              cx: point.x,
              cy: point.y,
              transform: `translate(${point.x} ${point.y}) scale(${scaleX} ${scaleY}) translate(${-point.x} ${-point.y})`,
            });
          }
          gsap.set(timelinePath, { strokeDashoffset: 1 });
          gsap.set(timelineCursor, {
            autoAlpha: 1,
            attr: { cx: firstPoint.x, cy: firstPoint.y, transform: "" },
          });
          positionCursor(firstPoint);

          gsap.to(lineProgress, {
            value: 1,
            ease: "none",
            scrollTrigger: {
              trigger: select(".day-path")[0],
              start: desktop ? "top 75%" : "top 65%",
              end: desktop ? "bottom 40%" : "bottom 65%",
              scrub: true,
              onRefresh() {
                positionCursor({
                  x: timelineCursor.cx.baseVal.value,
                  y: timelineCursor.cy.baseVal.value,
                });
              },
            },
            onUpdate() {
              // Give horizontal segments their own scroll distance instead of skipping them.
              const distance = lineProgress.value * pathLength;
              const point = timelinePath.getPointAtLength(distance);
              // Keep fractional offsets; CSS tween auto-rounding makes a 0–1 path jump.
              setLineOffset(1 - distance / pathLength);
              positionCursor(point);
            },
          });

          select(".photo-interlude:not(.album-cover)").forEach((photo, index) => {
            if (photo.matches(".together-cover")) return;
            const direction = index % 2 ? -1 : 1;
            gsap.fromTo(
              photo.querySelector("img"),
              { yPercent: -3 * direction, scale: 1.08 },
              {
                yPercent: 3 * direction,
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                  trigger: photo,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });

          const journey = select(".journey-track")[0];
          gsap.set(select(".journey-cursor"), { autoAlpha: 1 });
          gsap.timeline({
            scrollTrigger: {
              trigger: journey,
              start: "top 65%",
              end: "bottom 65%",
              scrub: true,
            },
          }).fromTo(
            select(".journey-progress"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
            },
            0,
          ).fromTo(
            select(".journey-cursor"),
            { top: "0%" },
            { top: "100%", ease: "none" },
            0,
          );
          select(".journey-scene").forEach((scene, index) => {
            const frame = scene.querySelector(".journey-frame");
            const copy = scene.querySelector(".journey-copy");
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: scene,
                  start: "top 88%",
                  end: "center 48%",
                  scrub: 0.8,
                },
              })
              .from(
                frame,
                {
                  y: desktop ? 60 : 24,
                  rotate: index % 2 ? 2 : -2,
                  ease: "power2.out",
                },
                0,
              )
              .from(
                copy,
                { x: index % 2 ? -18 : 18, opacity: 0.25, ease: "power1.out" },
                0.15,
              )
              .from(
                scene.querySelector("img"),
                { scale: 1.12, ease: "none" },
                0,
              );
            gsap.fromTo(
              scene.querySelector(".journey-dot"),
              { scale: 0.7 },
              {
                scale: 1.35,
                backgroundColor: getComputedStyle(rootElement)
                  .getPropertyValue("--bronze")
                  .trim(),
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 65%",
                  end: "center 50%",
                  scrub: true,
                },
              },
            );
          });

          select(".portrait-frame").forEach((frame, index) => {
            gsap.from(frame, {
              x: (index ? 1 : -1) * (desktop ? 32 : 14),
              y: index ? 22 : -14,
              rotate: index ? 3 : -3,
              delay: index * 0.2,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.6,
              },
            });
          });
          ScrollTrigger.refresh();
          return () => {
            // quickSetter writes are not tweens, so restore them on media changes.
            timelinePath.style.removeProperty("stroke-dashoffset");
            timelineCursor.setAttribute("cx", String(firstPoint.x));
            timelineCursor.setAttribute("cy", String(firstPoint.y));
            timelineCursor.removeAttribute("transform");
          };
        },
        rootElement,
      );
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    },
    { immediate: true, flush: "post" },
  );

  onBeforeUnmount(() => {
    stop();
    media?.revert();
  });
}
