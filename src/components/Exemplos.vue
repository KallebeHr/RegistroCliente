<template>
  <section class="examples" id="exemplos" ref="root">
    <!-- BG -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow bg__glow--a"></div>
      <div class="bg__glow bg__glow--b"></div>
      <div class="bg__noise"></div>
    </div>

    <div class="wrap">
      <div class="kicker" ref="kicker">
        <span class="kicker__dot" aria-hidden="true"></span>
        Exemplos reais • Layouts prontos • Mesma vibe do seu escritório
      </div>

      <header class="head">
        <h2 class="title" ref="title">
          Exemplos que eu já entreguei —
          <span class="accent">sites</span> com cara profissional e foco em conversão.
        </h2>

        <p class="subtitle" ref="subtitle">
          Aqui você vê modelos de landing, institucional e páginas com estrutura clara.
          Posso montar um exemplo no seu nome/cores/logo — sem compromisso.
        </p>
      </header>

      <!-- Controls -->
      <div class="controls" ref="controls">
        <div class="search">
          <i class="mdi mdi-magnify" aria-hidden="true"></i>
          <input
            v-model="q"
            class="search__input"
            type="text"
            placeholder="Buscar por nome, tag ou categoria…"
            aria-label="Buscar exemplos"
          />
          <button v-if="q" class="search__clear" type="button" @click="q = ''" aria-label="Limpar busca">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <div class="filters" role="tablist" aria-label="Filtros de exemplos">
          <button
            v-for="f in filters"
            :key="f.key"
            class="chip"
            :class="{ active: activeFilter === f.key }"
            type="button"
            role="tab"
            :aria-selected="activeFilter === f.key ? 'true' : 'false'"
            @click="activeFilter = f.key"
          >
            <span class="chip__dot" aria-hidden="true"></span>
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid" ref="grid">
        <article
          v-for="ex in filtered"
          :key="ex.id"
          class="card"
          role="button"
          tabindex="0"
          @click="open(ex)"
          @keydown.enter.prevent="open(ex)"
          @keydown.space.prevent="open(ex)"
        >
          <div class="thumb">
            <div v-if="!loaded[ex.id]" class="skeleton" aria-hidden="true"></div>

            <img
              class="thumb__img"
              :src="ex.cover"
              :alt="`Preview do site: ${ex.title}`"
              loading="lazy"
              decoding="async"
              @load="onLoad(ex.id)"
            />

            <div class="thumb__overlay" aria-hidden="true"></div>

            <div class="badges" aria-hidden="true">
              <span class="badge">
                <i class="mdi mdi-monitor"></i> {{ ex.type }}
              </span>
              <span class="badge soft" v-if="ex.acessivel">
                <i class="mdi mdi-wheelchair-accessibility"></i> Acessível
              </span>
            </div>
          </div>

          <div class="body">
            <h3 class="card__title">{{ ex.title }}</h3>
            <p class="card__desc">{{ ex.desc }}</p>

            <div class="tags">
              <span class="tag" v-for="t in ex.tags" :key="t">{{ t }}</span>
            </div>

            <div class="foot">
              <button class="mini-link" type="button" @click.stop="open(ex)">
                Ver detalhes <span aria-hidden="true">→</span>
              </button>

              <span class="hint">
                <i class="mdi mdi-cursor-default-click-outline"></i>
                clique para abrir
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty state -->
      <div v-if="filtered.length === 0" class="empty" ref="empty">
        <div class="empty__icon" aria-hidden="true"><i class="mdi mdi-folder-search-outline"></i></div>
        <div class="empty__title">Nada encontrado</div>
        <div class="empty__sub">Tente outro termo ou mude o filtro.</div>
        <button class="btn ghost" type="button" @click="resetFilters">Limpar filtros</button>
      </div>

      <!-- Bottom CTA -->
      <div class="cta" ref="cta">
        <div class="cta__left">
          <div class="cta__title">Quer um exemplo no seu nome e identidade?</div>
          <div class="cta__sub">
            Eu monto um modelo com suas cores e logo pra você ver como ficaria — sem compromisso.
          </div>
        </div>

        <div class="cta__right">
          <button class="btn primary" ref="ctaPrimary" type="button" @click="goForm">
            Solicitar Exemplo
            <span class="arrow" aria-hidden="true">→</span>
            <span class="shine" aria-hidden="true"></span>
          </button>

          <button class="btn secondary" type="button" @click="goWhats">
            Falar no WhatsApp
            <span class="chev" aria-hidden="true"></span>
          </button>
        </div>

        <div class="cta__meta">
          <span class="meta"><i class="mdi mdi-timer-sand"></i> 24–72h</span>
          <span class="meta"><i class="mdi mdi-lock-outline"></i> LGPD</span>
          <span class="meta"><i class="mdi mdi-speedometer"></i> Performance</span>
          <span class="meta"><i class="mdi mdi-wheelchair-accessibility"></i> Inclusão</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div
        v-if="openItem"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do exemplo"
        @keydown.esc="close"
      >
        <div class="modal__overlay" @click="close"></div>

        <div class="modal__panel" ref="panel" tabindex="-1">
          <div class="modal__top">
            <div class="modal__tag">
              <span class="dot" aria-hidden="true"></span>
              Exemplo • {{ openItem.type }}
            </div>

            <button class="modal__close" type="button" @click="close" aria-label="Fechar">
              <i class="mdi mdi-close"></i>
            </button>
          </div>

          <div class="modal__content">
            <div class="preview">
              <img
                class="preview__img"
                :src="openItem.cover"
                :alt="`Preview do site: ${openItem.title}`"
                loading="lazy"
                decoding="async"
              />
              <div class="preview__fade" aria-hidden="true"></div>
            </div>

            <div class="info">
              <h3 class="info__title">{{ openItem.title }}</h3>
              <p class="info__desc">{{ openItem.desc }}</p>

              <div class="info__row">
                <span class="pill" v-if="openItem.acessivel">
                  <i class="mdi mdi-wheelchair-accessibility"></i> Inclusão digital
                </span>
                <span class="pill" v-if="openItem.seo">
                  <i class="mdi mdi-google"></i> SEO base
                </span>
                <span class="pill" v-if="openItem.performance">
                  <i class="mdi mdi-speedometer"></i> Performance
                </span>
                <span class="pill" v-if="openItem.form">
                  <i class="mdi mdi-form-select"></i> Formulário
                </span>
                <span class="pill" v-if="openItem.whats">
                  <i class="mdi mdi-whatsapp"></i> WhatsApp
                </span>
              </div>

              <div class="tags big">
                <span class="tag" v-for="t in openItem.tags" :key="t">{{ t }}</span>
              </div>

              <div class="modal__cta">
                <a
                  v-if="openItem.url"
                  class="btn secondary"
                  :href="openItem.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver online
                  <span class="chev" aria-hidden="true"></span>
                </a>

                <button class="btn primary" type="button" @click="goForm">
                  Quero um igual
                  <span class="arrow" aria-hidden="true">→</span>
                  <span class="shine" aria-hidden="true"></span>
                </button>

                <button class="btn ghost" type="button" @click="goWhatsWith(openItem.title)">
                  WhatsApp com contexto <span aria-hidden="true">→</span>
                </button>
              </div>

              <p class="fine">
                *Conteúdo informativo. Sem promessas de resultado. Layout adaptado ao seu escritório.
              </p>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref, computed, reactive, nextTick, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { animate } from "@motionone/dom";

const router = useRouter();

const root = ref(null);
const kicker = ref(null);
const title = ref(null);
const subtitle = ref(null);
const controls = ref(null);
const grid = ref(null);
const empty = ref(null);
const cta = ref(null);
const ctaPrimary = ref(null);

const panel = ref(null);
const openItem = ref(null);

const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const isTouch =
  typeof window !== "undefined" &&
  (matchMedia?.("(pointer: coarse)")?.matches || "ontouchstart" in window);

/** ========= CONFIG =========
 *  Coloque seu WhatsApp aqui:
 *  Ex: 5598999999999
 */
const WHATS_PHONE = "558681426485"

function goForm() {
  router.push("/Formulario");
}

function goWhats() {
  const msg = encodeURIComponent("Olá, vim através do site");
  window.open(`https://wa.me/${WHATS_PHONE}?text=${msg}`, "_blank");
}

function goWhatsWith(exampleTitle) {
  const msg = encodeURIComponent(`Olá, vim através do site. Vi o exemplo: ${exampleTitle}`);
  window.open(`https://wa.me/${WHATS_PHONE}?text=${msg}`, "_blank");
}

/** ========= DATA =========
 * Troque cover/url pelos seus.
 * cover pode ser:
 * - imagem local: "/imgs/exemplo1.webp"
 * - ou URL externa
 */
const examples = ref([
  {
    id: "ex1",
    title: "Landing Advocacia Premium",
    type: "Landing",
    desc: "Hero + CTA + prova social + formulário estratégico. Foco em conversão e credibilidade.",
    cover: "/IMGS/1.webp",
    url: "https://advocacia-opal.vercel.app/",
    tags: ["Conversão", "Institucional", "CTA", "Responsivo"],
    acessivel: true,
    seo: true,
    performance: true,
    form: true,
    whats: true
  },
  {
    id: "ex2",
    title: "Landing Advocacia Premium",
    type: "Landing",
    desc: "Hero + CTA + prova social + formulário estratégico. Foco em conversão e credibilidade.",
    cover: "/IMGS/2.webp",
    url: "https://advogado-orcin.vercel.app/",
    tags: ["Autoridade", "Equipe", "Atuação", "Contato"],
    acessivel: true,
    seo: true,
    performance: true,
    form: false,
    whats: true
  },
  {
    id: "ex3",
    title: "Landing Advocacia Premium",
    type: "Landing",
    desc: "Hero + CTA + prova social + formulário estratégico. Foco em conversão e credibilidade.",
    cover: "/IMGS/3.webp",
    url: "https://maxsistemas.vercel.app/",
    tags: ["Blog", "SEO", "Conteúdo", "Estrutura"],
    acessivel: true,
    seo: true,
    performance: true,
    form: true,
    whats: true
  }
]);

const filters = [
  { key: "all", label: "Todos" },
  { key: "Landing", label: "Landing" },
  { key: "Institucional", label: "Institucional" },
  { key: "Blog", label: "Blog" },
  { key: "Acessibilidade", label: "Acessibilidade" }
];

const q = ref("");
const activeFilter = ref("all");

const loaded = reactive({});
function onLoad(id) {
  loaded[id] = true;
}

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();

  return examples.value.filter((ex) => {
    const inQuery =
      !query ||
      ex.title.toLowerCase().includes(query) ||
      ex.type.toLowerCase().includes(query) ||
      ex.desc.toLowerCase().includes(query) ||
      ex.tags.some((t) => t.toLowerCase().includes(query));

    const inFilter =
      activeFilter.value === "all"
        ? true
        : activeFilter.value === "Acessibilidade"
          ? !!ex.acessivel
          : ex.type === activeFilter.value;

    return inQuery && inFilter;
  });
});

function resetFilters() {
  q.value = "";
  activeFilter.value = "all";
}

/* ===== Modal ===== */
function open(ex) {
  openItem.value = ex;
  nextTick(() => {
    panel.value?.focus?.();
    if (!prefersReduced && panel.value) {
      animate(
        panel.value,
        { opacity: [0, 1], transform: ["translateY(12px) scale(0.99)", "translateY(0px) scale(1)"] },
        { duration: 0.16 }
      );
    }
  });
}

function close() {
  openItem.value = null;
}

/* body lock */
function lockBody(locked) {
  const cls = "body-lock";
  document.documentElement.classList.toggle(cls, locked);
  document.body.classList.toggle(cls, locked);
}

watchEffect(() => lockBody(!!openItem.value));

/* ===== Reveal leve ===== */
let io;
function setupReveal() {
  if (prefersReduced) return;

  const cardEls = Array.from(root.value?.querySelectorAll(".card") ?? []);
  const targets = [kicker.value, title.value, subtitle.value, controls.value, ...cardEls, cta.value].filter(Boolean);

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.filter = "blur(6px)";
    el.style.willChange = "transform, opacity, filter";
  });

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (!ent.isIntersecting) return;
        animate(
          ent.target,
          { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"], filter: ["blur(6px)", "blur(0px)"] },
          { duration: 0.35 }
        );
        io.unobserve(ent.target);
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => io.observe(el));
}

/* Magnetic (só CTA principal no desktop) */
let magCleanup = () => {};
function setupMagnetic(el, strength = 18) {
  if (!el || prefersReduced || isTouch) return () => {};

  let raf = 0;
  let tx = 0;
  let ty = 0;

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    tx = x / strength;
    ty = y / strength;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf);
    el.style.transform = `translate3d(0,0,0)`;
  };

  el.addEventListener("mousemove", onMove, { passive: true });
  el.addEventListener("mouseleave", onLeave);

  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

function onKeydownGlobal(e) {
  if (e.key === "Escape" && openItem.value) close();
}

onMounted(() => {
  setupReveal();
  magCleanup = setupMagnetic(ctaPrimary.value, 16);
  document.addEventListener("keydown", onKeydownGlobal);

  // inicia skeleton state
  examples.value.forEach((ex) => (loaded[ex.id] = false));
});

onBeforeUnmount(() => {
  io?.disconnect?.();
  magCleanup?.();
  document.removeEventListener("keydown", onKeydownGlobal);
});
</script>
<style scoped>
.examples{
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
.bg{ position:absolute; inset:0; pointer-events:none; }
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
  width:520px; height:520px;
  left:50%; top:6%;
  transform:translateX(-70%);
  background:radial-gradient(circle at 30% 35%, rgba(255,255,255,.13), transparent 62%);
}
.bg__glow--b{
  width:640px; height:640px;
  left:50%; top:46%;
  transform:translateX(-25%);
  background:radial-gradient(circle at 55% 45%, rgba(255,255,255,.10), transparent 64%);
}
.bg__noise{
  position:absolute; inset:0;
  opacity:.05;
  mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
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
  width:8px;height:8px;border-radius:999px;
  background:rgba(255,255,255,.78);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}
.head{
  text-align:center;
  max-width:980px;
  margin:0 auto 20px;
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

/* Controls */
.controls{
  margin:18px auto 16px;
  display:grid;
  gap:12px;
  max-width:980px;
}

.search{
  position:relative;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.04);
  padding:10px 12px 10px 40px;
  box-shadow:0 16px 54px rgba(0,0,0,.42);
}
.search i{
  position:absolute;
  left:12px;
  top:50%;
  transform:translateY(-50%);
  opacity:.85;
}
.search__input{
  width:100%;
  border:0;
  outline:0;
  background:transparent;
  color:rgba(255,255,255,.92);
  font-size:13px;
}
.search__input::placeholder{ color:rgba(255,255,255,.55); }
.search__clear{
  position:absolute;
  right:10px;
  top:50%;
  transform:translateY(-50%);
  width:36px;height:36px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.92);
  cursor:pointer;
}
.search__clear:hover{ background:rgba(255,255,255,.06); }

.filters{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  justify-content:center;
}

.chip{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  font-size:12px;
  cursor:pointer;
  transition:transform 160ms ease, background 160ms ease, border-color 160ms ease;
}
.chip__dot{
  width:7px;height:7px;border-radius:999px;
  background:rgba(255,255,255,.72);
  box-shadow:0 0 10px rgba(255,255,255,.14);
}
.chip:hover{ background:rgba(255,255,255,.05); }
.chip.active{
  background:rgba(255,255,255,.06);
  border-color:rgba(255,255,255,.18);
  color:rgba(255,255,255,.90);
}

/* Grid cards */
.grid{
  display:grid;
  grid-template-columns:repeat(12, 1fr);
  gap:14px;
  align-items:stretch;
}

.card{
  grid-column:span 6;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.04);
  box-shadow:0 18px 64px rgba(0,0,0,.50);
  overflow:hidden;
  cursor:pointer;
  outline:none;
  transition:transform 180ms ease, border-color 180ms ease, background 180ms ease;
}
.card:hover{
  transform:translateY(-2px);
  border-color:rgba(255,255,255,.18);
  background:rgba(255,255,255,.045);
}
.card:focus-visible{
  border-color:rgba(255,255,255,.22);
  box-shadow:0 0 0 3px rgba(255,255,255,.12), 0 18px 64px rgba(0,0,0,.55);
}

.thumb{
  position:relative;
  aspect-ratio: 16/9;
  background:rgba(0,0,0,.25);
  overflow:hidden;
}
.thumb__img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  transform:scale(1.02);
}
.thumb__overlay{
  position:absolute;
  inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.55));
}
.badges{
  position:absolute;
  left:12px;
  top:12px;
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}
.badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(0,0,0,.28);
  color:rgba(255,255,255,.88);
  font-size:12px;
}
.badge.soft{
  background:rgba(255,255,255,.06);
  border-color:rgba(255,255,255,.10);
}

.body{
  padding:14px;
  display:grid;
  gap:10px;
}
.card__title{
  margin:0;
  font-size:16px;
  letter-spacing:-.2px;
  color:rgba(255,255,255,.92);
}
.card__desc{
  margin:0;
  font-size:13px;
  line-height:1.6;
  color:rgba(255,255,255,.74);
}

.tags{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.tags.big{ margin-top:10px; }
.tag{
  display:inline-flex;
  align-items:center;
  padding:7px 9px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  font-size:12px;
}

.foot{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding-top:4px;
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
.mini-link:hover{ opacity:1; }
.hint{
  display:inline-flex;
  gap:8px;
  align-items:center;
  font-size:12px;
  color:rgba(255,255,255,.60);
}

/* Skeleton */
.skeleton{
  position:absolute;
  inset:0;
  background:linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.08), rgba(255,255,255,.04));
  background-size:200% 100%;
  animation:shimmer 1.2s ease-in-out infinite;
}
@keyframes shimmer{
  0%{ background-position: 200% 0; }
  100%{ background-position: -200% 0; }
}

/* Empty */
.empty{
  margin:18px auto 0;
  max-width:720px;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.03);
  padding:18px;
  text-align:center;
}
.empty__icon{
  width:52px;height:52px;
  margin:0 auto 10px;
  border-radius:18px;
  display:grid;
  place-items:center;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
}
.empty__icon i{ font-size:22px; opacity:.9; }
.empty__title{ font-weight:950; color:rgba(255,255,255,.92); }
.empty__sub{ margin-top:4px; color:rgba(255,255,255,.70); font-size:13px; }

/* CTA */
.cta{
  margin-top:14px;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.03);
  padding:14px;
  box-shadow:0 18px 64px rgba(0,0,0,.45);
  display:grid;
  gap:12px;
}
.cta__title{ font-size:14px; font-weight:950; color:rgba(255,255,255,.92); }
.cta__sub{ margin-top:2px; font-size:12px; color:rgba(255,255,255,.70); }
.cta__right{ display:flex; gap:10px; flex-wrap:wrap; }
.cta__meta{ display:flex; flex-wrap:wrap; gap:10px; }
.meta{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  font-size:12px;
}

/* Buttons */
.btn{
  position:relative;
  border:1px solid rgba(255,255,255,.12);
  border-radius:16px;
  padding:12px 14px;
  cursor:pointer;
  color:rgba(255,255,255,.90);
  background:rgba(255,255,255,.04);
  transition:background 160ms ease, border-color 160ms ease, transform 160ms ease;
  overflow:hidden;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  will-change:transform;
}
.btn.primary{
  background:linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,255,255,.72));
  color:rgba(8,10,14,.96);
  border-color:rgba(255,255,255,.18);
  font-weight:950;
  letter-spacing:.2px;
  box-shadow:0 14px 42px rgba(0,0,0,.45);
}
.btn.primary::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius:18px;
  background:radial-gradient(circle at 30% 30%, rgba(255,255,255,.22), transparent 58%);
  opacity:.28;
  pointer-events:none;
}
.btn.secondary:hover{ background:rgba(255,255,255,.06); }
.btn.ghost{
  padding:10px 12px;
  border-radius:14px;
  background:transparent;
  text-decoration:underline;
  text-underline-offset:4px;
  opacity:.92;
}
.btn.ghost:hover{ opacity:1; }

.arrow{ font-weight:950; }
.shine{
  position:absolute;
  inset:-55%;
  background:conic-gradient(from 180deg, transparent, rgba(255,255,255,.24), transparent);
  animation:spin 6.4s linear infinite;
  opacity:.45;
}
.chev{
  display:inline-block;
  width:10px; height:10px;
  border-right:2px solid rgba(255,255,255,.70);
  border-bottom:2px solid rgba(255,255,255,.70);
  transform:rotate(45deg) translateY(-1px);
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal */
.modal{
  position:fixed; inset:0;
  z-index:999;
  display:grid;
  place-items:center;
  padding:18px;
}
.modal__overlay{
  position:absolute; inset:0;
  background:rgba(0,0,0,.62);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.modal__panel{
  position:relative;
  width:min(980px, calc(100vw - 24px));
  max-height:min(82vh, 760px);
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
  width:8px;height:8px;border-radius:999px;
  background:rgba(255,255,255,.8);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}
.modal__close{
  width:42px;height:42px;border-radius:14px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.92);
  cursor:pointer;
}
.modal__content{
  margin-top:12px;
  display:grid;
  grid-template-columns: 1.15fr 1fr;
  gap:14px;
  align-items:start;
}
.preview{
  position:relative;
  border-radius:18px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(0,0,0,.25);
}
.preview__img{
  width:100%;
  height:auto;
  display:block;
}
.preview__fade{
  position:absolute;
  inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.35));
}
.info__title{ margin:0; font-size:18px; letter-spacing:-.2px; color:rgba(255,255,255,.92); }
.info__desc{ margin:8px 0 0; color:rgba(255,255,255,.74); font-size:13px; line-height:1.6; }
.info__row{
  margin-top:12px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
.pill{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.80);
  font-size:12px;
}
.modal__cta{
  margin-top:12px;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  align-items:center;
}
.fine{
  margin:10px 0 0;
  font-size:11px;
  color:rgba(255,255,255,.55);
}

/* body lock */
:global(html.body-lock),
:global(body.body-lock){ overflow:hidden; }

/* Responsive */
@media (max-width: 980px){
  .card{ grid-column:span 12; }
  .modal__content{ grid-template-columns:1fr; }
}
@media (max-width: 520px){
  .examples{ padding:72px 0 62px; }
  .btn{ width:100%; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  *{ animation:none !important; transition:none !important; }
}
</style>
