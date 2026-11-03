import { nextTick, onBeforeUnmount, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useInvitationMotion(root, entered) {
  let media;

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

      media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions.reduced) return;
          const desktop = context.conditions.desktop;
          const select = gsap.utils.selector(root.value);

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

          function reveal(selector, from, trigger = selector) {
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

          reveal(
            ".letter-copy > *",
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
            ".place > *",
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
              x: (index % 2 ? -1 : 1) * (desktop ? 30 : 14),
              autoAlpha: 0,
              duration: 0.85,
              delay: index * 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                end: "top 55%",
                scrub: 0.6,
              },
            });
          });
          reveal(".vow blockquote", {
            scale: 0.96,
            autoAlpha: 0,
            duration: 1.2,
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
          reveal(".thanks h2", {
            clipPath: "inset(0 100% 0 0)",
            autoAlpha: 0,
            duration: 1.4,
          });

          const stationery = gsap.timeline({
            scrollTrigger: {
              trigger: select(".stationery")[0],
              start: "top 85%",
              end: "top 20%",
              scrub: 0.7,
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

          gsap.fromTo(
            select(".timeline-progress"),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: select(".day-path")[0],
                start: "top 70%",
                end: "bottom 65%",
                scrub: 0.6,
              },
            },
          );

          select(".photo-interlude").forEach((photo, index) => {
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
          gsap.fromTo(
            select(".journey-progress"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: journey,
                start: "top 55%",
                end: "bottom 55%",
                scrub: 0.5,
              },
            },
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
                  clipPath: "inset(8% 0% 8% 0%)",
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
                backgroundColor: getComputedStyle(root.value)
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
        },
        root.value,
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
