<!-- src/components/SiteBackground.vue -->
<template>
  <div class="site-bg-root" ref="root">
    <!-- Camadas globais de background -->
    <div class="site-bg" aria-hidden="true">
      <div class="site-bg__grid"></div>
      <div class="site-bg__glow site-bg__glow--a"></div>
      <div class="site-bg__glow site-bg__glow--b"></div>
      <div class="site-bg__noise"></div>

      <div class="site-bg__particles" ref="particlesWrap">
        <span
          v-for="n in particleCount"
          :key="n"
          class="p"
        ></span>
      </div>

      <div class="site-bg__cursor"></div>
    </div>

    <!-- Conteúdo do site (seções / componentes) -->
    <div class="site-bg__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";

const root = ref(null);
const particlesWrap = ref(null);

const particleCount = 18;

const prefersReduced =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false);

let cleanupGlow = () => {};
let particlesTimeline = [];

// ===== Partículas globais =====
function setupParticles() {
  const wrap = particlesWrap.value;
  if (!wrap) return;

  const dots = wrap.querySelectorAll(".p");
  particlesTimeline = [];

  dots.forEach((d) => {
    const s = gsap.utils.random(2, 5);

    gsap.set(d, {
      xPercent: -50,
      yPercent: -50,
      left: gsap.utils.random(6, 94) + "%",
      top: gsap.utils.random(12, 94) + "%",
      width: s,
      height: s,
      opacity: gsap.utils.random(0.06, 0.18),
      filter: `blur(${gsap.utils.random(0.3, 1.1)}px)`
    });

    if (!prefersReduced) {
      const tl = gsap.to(d, {
        y: `+=${gsap.utils.random(-18, 18)}`,
        x: `+=${gsap.utils.random(-18, 18)}`,
        opacity: gsap.utils.random(0.05, 0.2),
        duration: gsap.utils.random(3.2, 5.8),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
      particlesTimeline.push(tl);
    }
  });
}

// ===== Cursor glow global =====
function setupCursorGlow() {
  const elRoot = root.value;
  if (!elRoot) return () => {};

  const glow = elRoot.querySelector(".site-bg__cursor");
  if (!glow || prefersReduced) return () => {};

  const setOpacity = (value) => {
    glow.style.setProperty("--cursorOpacity", value);
  };

  const move = (e) => {
    const r = elRoot.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glow.style.setProperty("--cx", `${x}px`);
    glow.style.setProperty("--cy", `${y}px`);
    setOpacity(0.5);
  };

  const enter = () => setOpacity(0.5);
  const leave = () => setOpacity(0);

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseenter", enter);
  window.addEventListener("mouseleave", leave);

  return () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseenter", enter);
    window.removeEventListener("mouseleave", leave);
  };
}

// ===== Lifecycle =====
onMounted(() => {
  setupParticles();
  cleanupGlow = setupCursorGlow();
});

onBeforeUnmount(() => {
  cleanupGlow?.();
  particlesTimeline.forEach((tl) => tl.kill && tl.kill());
  particlesTimeline = [];
});
</script>

<style scoped>
/* root cobre toda a viewport e deixa espaço pro conteúdo */
.site-bg-root {
  position: relative;
  min-height: 100vh;
  /* variável global para fundo se você quiser mudar tema depois */
  background: var(
    --app-bg,
    radial-gradient(1200px 700px at 50% 12%, #0b0f18, #07080b 55%, #06070a)
  );
  color: rgba(255, 255, 255, 0.92);
}

/* camada de background fixa atrás de tudo */
.site-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transform: translateY(calc(var(--bgShiftY, 0px) * -1));
  will-change: transform, filter;
}

/* conteudo do app fica acima do bg */
.site-bg__content {
  position: relative;
  z-index: 1;
}

/* grid */
.site-bg__grid {
  position: absolute;
  inset: -35%;
  background:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 38px 38px;
  opacity: 0.14;
  transform: rotate(10deg);
  mask-image: radial-gradient(
    circle at 50% 35%,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.1) 58%,
    transparent 75%
  );
}

/* glows */
.site-bg__glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(64px);
  opacity: 0.45;
}

.site-bg__glow--a {
  width: 520px;
  height: 520px;
  left: 50%;
  top: 10%;
  transform: translateX(-68%);
  background: radial-gradient(
    circle at 30% 35%,
    rgba(255, 255, 255, 0.14),
    transparent 62%
  );
}

.site-bg__glow--b {
  width: 640px;
  height: 640px;
  left: 50%;
  top: 46%;
  transform: translateX(-30%);
  background: radial-gradient(
    circle at 55% 45%,
    rgba(255, 255, 255, 0.11),
    transparent 64%
  );
}

/* noise */
.site-bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
}

/* Partículas */
.site-bg__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.site-bg__particles .p {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.1);
}

/* Cursor glow global */
.site-bg__cursor {
  position: absolute;
  inset: 0;
  opacity: var(--cursorOpacity, 0);
  background:
    radial-gradient(
      320px 320px at var(--cx, 50%) var(--cy, 35%),
      rgba(255, 255, 255, 0.09),
      transparent 62%
    );
  transition: opacity 180ms ease;
}

/* animações */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* responsivo (por enquanto não precisa de muito aqui) */
@media (max-width: 520px) {
  .site-bg-root {
    min-height: 100vh;
  }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  .site-bg {
    transform: none !important;
  }
}
</style>