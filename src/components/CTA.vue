<template>
  <section class="cta-section" id="cta-acessibilidade" ref="root">
    <!-- BG (leve) -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow bg__glow--a"></div>
      <div class="bg__glow bg__glow--b"></div>
      <div class="bg__noise"></div>

      <!-- particles (menos no mobile, sem JS infinito) -->
      <div class="bg__particles" aria-hidden="true">
        <span v-for="n in particlesCount" :key="n" class="p"></span>
      </div>

      <!-- cursor glow (desativado em touch / reduce motion) -->
      <div class="bg__cursor" aria-hidden="true"></div>
    </div>

    <div class="wrap">
      <div class="kicker" ref="kicker">
        <span class="kicker__dot" aria-hidden="true"></span>
        Inclusão Digital Jurídica • Acessibilidade + Conversão • Performance
      </div>

      <header class="head">
        <h2 class="title" ref="title">
          Se o seu escritório não tem um site acessível,
          <span class="accent">você está perdendo</span>
          confiança e contatos todos os dias.
        </h2>

        <p class="subtitle" ref="subtitle">
          Um site com inclusão digital reduz barreiras, melhora a experiência e aumenta a chance
          do visitante virar conversa no WhatsApp ou lead no formulário.
        </p>
      </header>

      <div class="grid">
        <!-- PROBLEMAS -->
        <article class="card card--danger" ref="cardProblems">
          <div class="card__top">
            <div class="pill">
              <i class="mdi mdi-alert-decagram-outline"></i>
              Sem site acessível
            </div>

            <div class="badge">
              <span class="badge__dot" aria-hidden="true"></span>
              Risco alto
            </div>
          </div>

          <h3 class="card__title">O que acontece sem inclusão digital</h3>

          <ul class="list">
            <li class="item">
              <span class="ico danger" aria-hidden="true">
                <i class="mdi mdi-close-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Perde clientes sem perceber.</strong> O usuário trava e desiste.
              </div>
            </li>
            <li class="item">
              <span class="ico danger" aria-hidden="true">
                <i class="mdi mdi-close-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Menos autoridade.</strong> Sem prova institucional, o concorrente leva.
              </div>
            </li>
            <li class="item">
              <span class="ico danger" aria-hidden="true">
                <i class="mdi mdi-close-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>WhatsApp bagunçado.</strong> Sem triagem, vem mensagem sem contexto.
              </div>
            </li>
            <li class="item">
              <span class="ico danger" aria-hidden="true">
                <i class="mdi mdi-close-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Menos Google.</strong> Sem estrutura, sua busca orgânica cai.
              </div>
            </li>
          </ul>

          <div class="card__foot">
            <div class="mini-note">
              <i class="mdi mdi-information-outline"></i>
              Inclusão digital = experiência + reputação + conversão.
            </div>

            <button class="mini-link" type="button" @click="openAudit('problemas')">
              Ver checklist rápido <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>

        <!-- VANTAGENS -->
        <article class="card card--good" ref="cardBenefits">
          <div class="card__top">
            <div class="pill">
              <i class="mdi mdi-shield-check-outline"></i>
              Com site acessível
            </div>

            <div class="badge">
              <span class="badge__dot" aria-hidden="true"></span>
              Vantagem real
            </div>
          </div>

          <h3 class="card__title">O que muda com um site acessível</h3>

          <ul class="list">
            <li class="item">
              <span class="ico good" aria-hidden="true">
                <i class="mdi mdi-check-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Mais leads qualificados.</strong> CTA claro + formulário estratégico.
              </div>
            </li>
            <li class="item">
              <span class="ico good" aria-hidden="true">
                <i class="mdi mdi-check-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Autoridade instantânea.</strong> Estrutura institucional convincente.
              </div>
            </li>
            <li class="item">
              <span class="ico good" aria-hidden="true">
                <i class="mdi mdi-check-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Acessibilidade real.</strong> Contraste, foco, semântica, navegação.
              </div>
            </li>
            <li class="item">
              <span class="ico good" aria-hidden="true">
                <i class="mdi mdi-check-circle-outline"></i>
              </span>
              <div class="txt">
                <strong>Performance + SEO base.</strong> Carrega rápido e aparece mais.
              </div>
            </li>
          </ul>

          <div class="ctaBox" ref="ctaBox">
            <div class="ctaBox__left">
              <div class="ctaBox__title">Quer um exemplo com sua identidade?</div>
              <div class="ctaBox__sub">
                Eu monto um modelo com suas cores e logo pra você ver — sem compromisso.
              </div>
            </div>

            <div class="ctaBox__right">
              <button
                class="cta primary"
                ref="ctaPrimary"
                type="button"
                @click="goForm"
              >
                Solicitar Exemplo
                <span class="arrow" aria-hidden="true">→</span>
                <span class="shine" aria-hidden="true"></span>
              </button>

              <button
                class="cta secondary"
                ref="ctaSecondary"
                type="button"
                @click="openAudit('beneficios')"
              >
                Ver auditoria rápida
                <span class="chev" aria-hidden="true"></span>
              </button>
            </div>

            <div class="ctaBox__meta">
              <span class="meta-pill">
                <i class="mdi mdi-timer-sand"></i> 24–72h
              </span>
              <span class="meta-pill">
                <i class="mdi mdi-lock-outline"></i> LGPD
              </span>
              <span class="meta-pill">
                <i class="mdi mdi-speedometer"></i> Performance
              </span>
              <span class="meta-pill">
                <i class="mdi mdi-wheelchair-accessibility"></i> Acessível
              </span>
            </div>
          </div>
        </article>
      </div>

      <div class="bottom" ref="bottom">
        <div class="proof">
          <div class="proof__icon" aria-hidden="true">
            <i class="mdi mdi-scale-balance"></i>
          </div>
          <div class="proof__txt">
            <strong>Tom institucional.</strong> Sem promessas de resultado. Clareza + confiança + inclusão.
          </div>
        </div>

        <div class="divider" aria-hidden="true"></div>

        <div class="micro">
          <button class="micro__btn" type="button" @click="scrollTo('#contato')">
            Quero conversar agora <span aria-hidden="true">→</span>
          </button>
          <span class="micro__hint">*Layout final decidido junto com você.</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div
        v-if="auditOpen"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Auditoria rápida"
        @keydown.esc="closeAudit"
      >
        <div class="modal__overlay" @click="closeAudit"></div>

        <div class="modal__panel" ref="modalPanel" tabindex="-1">
          <div class="modal__top">
            <div class="modal__tag">
              <span class="dot" aria-hidden="true"></span>
              Auditoria rápida • Inclusão digital
            </div>

            <button
              class="modal__close"
              type="button"
              @click="closeAudit"
              aria-label="Fechar"
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>

          <h3 class="modal__title">
            {{
              auditMode === "problemas"
                ? "Checklist do que derruba conversão"
                : "Checklist do que aumenta confiança"
            }}
          </h3>

          <p class="modal__sub">
            Se falhar em 2–3 itens, já perde contato. Quer? Eu resolvo no seu modelo.
          </p>

          <div class="checks">
            <label
              v-for="(c, i) in auditChecklist"
              :key="i"
              class="check"
            >
              <input type="checkbox" />
              <span class="check__box" aria-hidden="true"></span>
              <span class="check__txt">
                <strong>{{ c.t }}</strong>
                <span class="muted">{{ c.d }}</span>
              </span>
            </label>
          </div>

          <div class="modal__cta">
            <button class="cta primary" type="button" @click="goForm">
              Quero meu exemplo pronto
              <span class="arrow" aria-hidden="true">→</span>
              <span class="shine" aria-hidden="true"></span>
            </button>

            <button class="cta secondary" type="button" @click="closeAudit">
              Continuar
              <span class="chev" aria-hidden="true"></span>
            </button>
          </div>

          <p class="modal__fine">
            *Conteúdo informativo. Sem promessas. Acessibilidade = inclusão + experiência + alcance.
          </p>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
  computed,
  nextTick,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { animate } from "@motionone/dom";

const router = useRouter();

const root = ref(null);
const kicker = ref(null);
const title = ref(null);
const subtitle = ref(null);
const cardProblems = ref(null);
const cardBenefits = ref(null);
const ctaBox = ref(null);
const ctaPrimary = ref(null);
const ctaSecondary = ref(null);
const bottom = ref(null);
const modalPanel = ref(null);

const auditOpen = ref(false);
const auditMode = ref("beneficios");

// flags reativas (melhor pra SSR e pra perf)
const prefersReduced = ref(false);
const isTouch = ref(false);

// particles: menos no mobile
const particlesCount = computed(() => (isTouch.value ? 8 : 12));

function goForm() {
  router.push("/Formulario");
}

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openAudit(mode) {
  auditMode.value = mode;
  auditOpen.value = true;

  nextTick(() => {
    if (!modalPanel.value) return;
    modalPanel.value.focus?.();

    if (!prefersReduced.value) {
      animate(
        modalPanel.value,
        {
          opacity: [0, 1],
          transform: [
            "translateY(12px) scale(0.98)",
            "translateY(0px) scale(1)",
          ],
        },
        {
          duration: 0.2,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)", // ease-out suave
        }
      );
    }
  });
}

function closeAudit() {
  auditOpen.value = false;
}

function lockBody(locked) {
  if (typeof document === "undefined") return;
  const cls = "body-lock";
  document.documentElement.classList.toggle(cls, locked);
  document.body.classList.toggle(cls, locked);
}

watchEffect(() => {
  lockBody(auditOpen.value);
});

const auditChecklist = computed(() => {
  if (auditMode.value === "problemas") {
    return [
      { t: "CTA escondido", d: "Usuário não sabe o que fazer e sai." },
      {
        t: "Contraste ruim / fonte pequena",
        d: "Leitura difícil derruba conversão.",
      },
      {
        t: "Sem prova institucional",
        d: "Confiança menor = menos contato.",
      },
      { t: "Lento no celular", d: "Cada segundo reduz cliques." },
      {
        t: "Sem triagem",
        d: "WhatsApp vira bagunça e você perde tempo.",
      },
    ];
  }
  return [
    {
      t: "CTA claro + WhatsApp com contexto",
      d: "Aumenta clique e qualidade do lead.",
    },
    {
      t: "Estrutura institucional",
      d: "Autoridade e confiança imediata.",
    },
    { t: "Acessibilidade real", d: "Mais alcance e menos barreiras." },
    {
      t: "Performance + SEO base",
      d: "Carrega rápido e aparece mais.",
    },
    {
      t: "Formulário estratégico",
      d: "Você recebe lead com contexto.",
    },
  ];
});

// ===== Cursor glow otimizado (RAF + off em touch/reduced) =====
let raf = 0;
let lastX = 0;
let lastY = 0;
let pending = false;

function setupCursorGlow() {
  const glow = root.value?.querySelector(".bg__cursor");
  if (!glow || prefersReduced.value || isTouch.value) return () => {};

  const onMove = (e) => {
    const r = root.value.getBoundingClientRect();
    lastX = e.clientX - r.left;
    lastY = e.clientY - r.top;

    if (pending) return;
    pending = true;
    raf = requestAnimationFrame(() => {
      pending = false;
      glow.style.setProperty("--cx", `${lastX}px`);
      glow.style.setProperty("--cy", `${lastY}px`);
    });
  };

  root.value.addEventListener("mousemove", onMove, { passive: true });

  return () => {
    cancelAnimationFrame(raf);
    root.value?.removeEventListener("mousemove", onMove);
  };
}

// ===== Particles: posiciona uma vez =====
function setupParticlesStatic() {
  const wrap = root.value?.querySelector(".bg__particles");
  if (!wrap) return;

  const dots = wrap.querySelectorAll(".p");
  dots.forEach((d) => {
    const size = Math.floor(Math.random() * 3) + 2; // 2..4
    const left = Math.floor(Math.random() * 88) + 6;
    const top = Math.floor(Math.random() * 84) + 10;
    const opacity = (Math.random() * 0.08 + 0.06).toFixed(3);

    d.style.width = `${size}px`;
    d.style.height = `${size}px`;
    d.style.left = `${left}%`;
    d.style.top = `${top}%`;
    d.style.opacity = opacity;
  });
}

// ===== Reveal leve (IntersectionObserver + Motion One) =====
let io;

function setupReveal() {
  if (prefersReduced.value) return;

  const targets = [
    kicker.value,
    title.value,
    subtitle.value,
    cardProblems.value,
    cardBenefits.value,
    ctaBox.value,
    bottom.value,
  ].filter(Boolean);

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.filter = "blur(6px)";
    el.style.willChange = "transform, opacity, filter";
  });

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (!ent.isIntersecting) return;
        const el = ent.target;

        animate(
          el,
          {
            opacity: [0, 1],
            transform: ["translateY(12px)", "translateY(0px)"],
            filter: ["blur(6px)", "blur(0px)"],
          },
          {
            duration: 0.38,
            easing: "cubic-bezier(0.33, 1, 0.68, 1)",
          }
        );

        // depois de animar, tira will-change pra ficar mais leve
        setTimeout(() => {
          el.style.willChange = "auto";
        }, 420);

        io.unobserve(el);
      });
    },
    {
      root: null,
      threshold: 0.16,
    }
  );

  targets.forEach((el) => io.observe(el));
}

// ===== Magnetic hover (leve, desktop only) =====
function setupMagnetic(el, strength = 22) {
  if (!el || prefersReduced.value || isTouch.value) return () => {};

  let raf2 = 0;
  let tx = 0;
  let ty = 0;

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    tx = x / strength;
    ty = y / strength;

    cancelAnimationFrame(raf2);
    raf2 = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf2);
    el.style.transform = `translate3d(0,0,0)`;
  };

  el.addEventListener("mousemove", onMove, { passive: true });
  el.addEventListener("mouseleave", onLeave);

  return () => {
    cancelAnimationFrame(raf2);
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

let cleanupGlow = () => {};
let cleanupMagA = () => {};
let cleanupMagB = () => {};

function onKeydownGlobal(e) {
  if (e.key === "Escape" && auditOpen.value) closeAudit();
}

onMounted(() => {
  // flags de ambiente
  if (typeof window !== "undefined") {
    prefersReduced.value =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    isTouch.value =
      window.matchMedia?.("(pointer: coarse)")?.matches ||
      "ontouchstart" in window;
  }

  setupParticlesStatic();
  cleanupGlow = setupCursorGlow();
  setupReveal();

  cleanupMagA = setupMagnetic(ctaPrimary.value, 18);
  cleanupMagB = setupMagnetic(ctaSecondary.value, 22);

  document.addEventListener("keydown", onKeydownGlobal);
});

onBeforeUnmount(() => {
  cleanupGlow?.();
  cleanupMagA?.();
  cleanupMagB?.();
  io?.disconnect?.();
  document.removeEventListener("keydown", onKeydownGlobal);
});
</script>

<style scoped>
.cta-section{
  position:relative;
  padding:86px 0 78px;
  overflow:hidden;
  background:radial-gradient(1200px 700px at 50% 12%, #0b0f18, #07080b 55%, #06070a);
  color:rgba(255,255,255,.92);
}

.wrap{
  width:100%;
  max-width:1180px;
  margin:0 auto;
  padding:0 18px;
  position:relative;
  z-index:2;
}

/* BG */
.bg{
  position:absolute;
  inset:0;
  pointer-events:none;
}

.bg__grid{
  position:absolute;
  inset:-35%;
  background:
    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size:40px 40px;
  opacity:.12;
  transform:rotate(10deg);
  mask-image:radial-gradient(circle at 50% 35%, #000, rgba(0,0,0,.12) 58%, transparent 75%);
}

.bg__glow{
  position:absolute;
  border-radius:999px;
  filter:blur(52px);
  opacity:.42;
}

.bg__glow--a{
  width:520px;
  height:520px;
  left:50%;
  top:6%;
  transform:translateX(-70%);
  background:radial-gradient(circle at 30% 35%, rgba(255,255,255,.13), transparent 62%);
}

.bg__glow--b{
  width:620px;
  height:620px;
  left:50%;
  top:46%;
  transform:translateX(-25%);
  background:radial-gradient(circle at 55% 45%, rgba(255,255,255,.10), transparent 64%);
}

.bg__noise{
  position:absolute;
  inset:0;
  opacity:.05;
  mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
}

/* particles */
.bg__particles{
  position:absolute;
  inset:0;
}
.bg__particles .p{
  position:absolute;
  border-radius:999px;
  background:rgba(255,255,255,.85);
  filter:blur(.4px);
}

/* cursor glow (off em touch / reduce motion via script) */
.bg__cursor{
  position:absolute;
  inset:0;
  opacity:.42;
  background:
    radial-gradient(320px 320px at var(--cx, 50%) var(--cy, 35%),
      rgba(255,255,255,.08),
      transparent 62%);
  transition:opacity 180ms ease;
}

/* Header */
.kicker{
  margin:0 auto 18px;
  display:inline-flex;
  gap:10px;
  align-items:center;
  padding:9px 12px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.035);
  color:rgba(255,255,255,.82);
  font-size:12px;
  letter-spacing:.35px;
}
.kicker__dot{
  width:8px;
  height:8px;
  border-radius:999px;
  background:rgba(255,255,255,.78);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}

.head{
  text-align:center;
  max-width:980px;
  margin:0 auto 26px;
}
.title{
  margin:0;
  font-size:clamp(26px, 4vw, 52px);
  line-height:1.06;
  letter-spacing:-.6px;
}
.accent{
  background:linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.62));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  text-shadow:0 10px 28px rgba(0,0,0,.5);
}
.subtitle{
  margin:14px auto 0;
  max-width:780px;
  font-size:clamp(14px, 1.35vw, 18px);
  line-height:1.58;
  color:rgba(255,255,255,.72);
}

/* Grid */
.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
  align-items:stretch;
}

.card{
  position:relative;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.04);
  box-shadow:0 18px 64px rgba(0,0,0,.50);
  overflow:hidden;
  padding:16px;
}
.card::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius:24px;
  background:radial-gradient(circle at 30% 30%, rgba(255,255,255,.10), transparent 58%);
  opacity:.32;
  pointer-events:none;
}

.card__top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}

.pill{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.035);
  color:rgba(255,255,255,.84);
  font-size:12px;
}

.badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  font-size:12px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(0,0,0,.22);
  color:rgba(255,255,255,.86);
}
.badge__dot{
  width:8px;
  height:8px;
  border-radius:999px;
  background:rgba(255,255,255,.8);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}

.card__title{
  margin:14px 0 12px;
  font-size:16px;
  letter-spacing:-.2px;
  color:rgba(255,255,255,.90);
}

.list{
  list-style:none;
  padding:0;
  margin:0;
  display:grid;
  gap:10px;
}

.item{
  display:grid;
  grid-template-columns:34px 1fr;
  gap:10px;
  align-items:start;
  border-radius:16px;
  padding:10px 10px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.02);
}

.ico{
  width:34px;
  height:34px;
  border-radius:12px;
  display:grid;
  place-items:center;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
}
.ico.danger{
  color:#ff0000;
}
.ico.good{
  color:#00ff1a;
}
.ico i{
  font-size:18px;
}

.txt{
  font-size:13px;
  line-height:1.55;
  color:rgba(255,255,255,.78);
}
.txt strong{
  color:rgba(255,255,255,.92);
  font-weight:900;
}

.card__foot{
  margin-top:12px;
  display:grid;
  gap:10px;
}

.mini-note{
  display:inline-flex;
  gap:8px;
  align-items:center;
  padding:10px 12px;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  font-size:12px;
}

.mini-link{
  border:0;
  background:transparent;
  color:rgba(255,255,255,.86);
  text-decoration:underline;
  cursor:pointer;
  text-underline-offset:4px;
  opacity:.9;
}
.mini-link:hover{
  opacity:1;
}

/* CTA BOX */
.ctaBox{
  margin-top:14px;
  border-radius:20px;
  padding:14px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.035);
  display:grid;
  gap:12px;
}
.ctaBox__title{
  font-size:14px;
  font-weight:900;
  color:rgba(255,255,255,.92);
}
.ctaBox__sub{
  margin-top:2px;
  font-size:12px;
  color:rgba(255,255,255,.70);
}
.ctaBox__right{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}
.ctaBox__meta{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
.meta-pill{
  font-size:12px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  display:inline-flex;
  gap:8px;
  align-items:center;
}

/* Buttons */
.cta{
  position:relative;
  border:1px solid rgba(255,255,255,.12);
  border-radius:16px;
  padding:12px 14px;
  cursor:pointer;
  color:rgba(255,255,255,.90);
  background:rgba(255,255,255,.04);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
  overflow:hidden;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  will-change:transform;
}
.cta.primary{
  background:linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,255,255,.72));
  color:rgba(8,10,14,.96);
  border-color:rgba(255,255,255,.18);
  font-weight:900;
  letter-spacing:.2px;
  box-shadow:0 14px 42px rgba(0,0,0,.45);
}
.cta.primary::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius:18px;
  background:radial-gradient(circle at 30% 30%, rgba(255,255,255,.22), transparent 58%);
  opacity:.28;
  pointer-events:none;
}
.cta.secondary:hover{
  background:rgba(255,255,255,.06);
}
.cta:hover{
  box-shadow:0 18px 50px rgba(0,0,0,.55);
}
.arrow{
  font-weight:900;
}

/* shine só anima no hover pra ficar leve */
.shine{
  position:absolute;
  inset:-55%;
  background:conic-gradient(from 180deg, transparent, rgba(255,255,255,.24), transparent);
  animation:spin 6.4s linear infinite;
  opacity:.45;
  animation-play-state:paused;
}
.cta.primary:hover .shine{
  animation-play-state:running;
}

.chev{
  display:inline-block;
  width:10px;
  height:10px;
  border-right:2px solid rgba(255,255,255,.70);
  border-bottom:2px solid rgba(255,255,255,.70);
  transform:rotate(45deg) translateY(-1px);
}

/* Bottom */
.bottom{
  margin-top:14px;
  border-radius:20px;
  padding:12px 14px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.03);
  display:grid;
  grid-template-columns:1fr auto 1fr;
  gap:12px;
  align-items:center;
}
.proof{
  display:flex;
  gap:10px;
  align-items:center;
}
.proof__icon{
  width:40px;
  height:40px;
  border-radius:14px;
  display:grid;
  place-items:center;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
}
.proof__txt{
  font-size:12px;
  color:rgba(255,255,255,.74);
}
.proof__txt strong{
  color:rgba(255,255,255,.92);
}
.divider{
  width:1px;
  height:38px;
  background:rgba(255,255,255,.10);
}
.micro{
  display:grid;
  justify-items:end;
  gap:6px;
}
.micro__btn{
  border:0;
  cursor:pointer;
  border-radius:14px;
  padding:10px 12px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  color:rgba(255,255,255,.90);
}
.micro__btn:hover{
  background:rgba(255,255,255,.07);
}
.micro__hint{
  font-size:11px;
  color:rgba(255,255,255,.58);
}

/* Modal */
.modal{
  position:fixed;
  inset:0;
  z-index:999;
  display:grid;
  place-items:center;
  padding:18px;
}
.modal__overlay{
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.62);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
}
.modal__panel{
  position:relative;
  width:min(820px, calc(100vw - 24px));
  max-height:min(78vh, 720px);
  overflow:auto;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(10,12,16,.94);
  box-shadow:0 18px 70px rgba(0,0,0,.70);
  padding:14px;
  z-index:2;
  outline:none;
}
.modal__top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}
.modal__tag{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.82);
  font-size:12px;
}
.modal__tag .dot{
  width:8px;
  height:8px;
  border-radius:999px;
  background:rgba(255,255,255,.8);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}
.modal__close{
  width:42px;
  height:42px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.92);
  cursor:pointer;
}
.modal__title{
  margin:12px 0 6px;
  font-size:18px;
  letter-spacing:-.2px;
}
.modal__sub{
  margin:0 0 12px;
  color:rgba(255,255,255,.72);
  font-size:13px;
  line-height:1.55;
}

.checks{
  display:grid;
  gap:10px;
  margin-top:6px;
}
.check{
  display:grid;
  grid-template-columns:22px 1fr;
  gap:10px;
  align-items:start;
  border-radius:16px;
  padding:12px 12px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.02);
}
.check input{
  position:absolute;
  opacity:0;
  pointer-events:none;
}
.check__box{
  width:18px;
  height:18px;
  border-radius:6px;
  border:1px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.04);
  margin-top:2px;
  position:relative;
}
.check input:checked + .check__box::after{
  content:"";
  position:absolute;
  inset:3px;
  border-radius:4px;
  background:rgba(255,255,255,.86);
}
.check__txt{
  font-size:13px;
  color:rgba(255,255,255,.80);
  line-height:1.5;
}
.check__txt strong{
  color:rgba(255,255,255,.92);
  font-weight:900;
}
.check__txt .muted{
  display:block;
  margin-top:4px;
  font-size:11px;
  color:rgba(255,255,255,.62);
}

.modal__cta{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:12px;
}
.modal__fine{
  margin:10px 0 0;
  font-size:11px;
  color:rgba(255,255,255,.55);
}

/* body lock */
:global(html.body-lock),
:global(body.body-lock){
  overflow:hidden;
}

/* anim */
@keyframes spin{
  to{
    transform:rotate(360deg);
  }
}

/* responsive */
@media (max-width:980px){
  .grid{
    grid-template-columns:1fr;
  }
  .bottom{
    grid-template-columns:1fr;
  }
  .divider{
    display:none;
  }
  .micro{
    justify-items:start;
  }
}
@media (max-width:520px){
  .cta-section{
    padding:72px 0 62px;
  }
  .cta{
    width:100%;
  }
  .ctaBox__right{
    width:100%;
  }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce){
  *{
    animation:none !important;
    transition:none !important;
  }
}
</style>