<template>
  <section class="guide" id="guia" ref="root">
    <!-- BG leve + ponteiro glow -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow"></div>
      <div class="bg__noise"></div>
      <div class="bg__cursor"></div>
    </div>

    <div class="guide__container">
      <!-- HEAD -->
      <header class="head">
        <p class="kicker">Guia do cliente • Veja na prática</p>

        <h2 class="title">
          Cada item abre um <span class="accent">exemplo real</span> dentro do modal.
        </h2>

        <p class="subtitle">
          Clique em <b>Ver exemplo</b> para abrir um preview responsivo do componente.
          Depois, em <b>Como funciona</b>, você vê explicação detalhada.
        </p>
      </header>

      <!-- CARDS -->
      <div class="steps">
        <article
          v-for="(card, idx) in cards"
          :key="card.id"
          class="step"
          :class="{ active: activeId === card.id }"
          @mouseenter="activeId = card.id"
        >
          <div class="step__top">
            <span class="pill">{{ card.pill }}</span>
            <span class="num">{{ String(idx + 1).padStart(2, "0") }}</span>
          </div>

          <h3 class="step__title">{{ card.title }}</h3>
          <p class="step__desc">{{ card.desc }}</p>

          <div class="step__list">
            <div class="li" v-for="(b, i) in card.bullets" :key="i">
              <span class="dot" aria-hidden="true"></span>
              <span>{{ b }}</span>
            </div>
          </div>

          <div class="step__actions">
            <button class="btn primary" type="button" @click="openDemo(card.id)">
              Ver exemplo
              <span class="arrow" aria-hidden="true">→</span>
            </button>

            <button
              class="btn ghost"
              type="button"
              @click="toggleMore(card.id)"
              :aria-expanded="openMore.has(card.id) ? 'true' : 'false'"
            >
              Detalhes
              <span class="chev" aria-hidden="true"></span>
            </button>
          </div>

          <!-- detalhes expand -->
          <div
            class="more"
            :style="{
              height: openMore.has(card.id) ? (moreHeights[card.id] || 0) + 'px' : '0px'
            }"
          >
            <div class="more__inner" :ref="(el) => setMoreRef(card.id, el)">
              <p class="more__text">{{ card.more }}</p>

              <div v-if="card.examples?.length" class="examples">
                <div class="ex" v-for="(ex, i) in card.examples" :key="i">
                  <span class="ex__k">{{ ex.k }}</span>
                  <span class="ex__v">{{ ex.v }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

     
    </div>

    <!-- MODAL COM DEMOS REAIS -->
    <teleport to="body">
      <div v-if="modalOpen" class="modal" role="dialog" aria-modal="true" @click.self="closeModal">
        <div class="modal__panel" ref="panelRef">
          <!-- top -->
          <div class="modal__top">
            <div class="modal__left">
              <span class="modal__pill">{{ current?.pill }}</span>
              <strong class="modal__title">{{ current?.modalTitle }}</strong>
              <span class="modal__muted">{{ current?.modalHint }}</span>
            </div>

            <div class="modal__right">
              <button class="tab" :class="{ on: modalTab === 'preview' }" type="button" @click="modalTab = 'preview'">
                Preview
              </button>
              <button class="tab" :class="{ on: modalTab === 'how' }" type="button" @click="modalTab = 'how'">
                Como funciona
              </button>

              <button class="modal__close" type="button" @click="closeModal" aria-label="Fechar">✕</button>
            </div>
          </div>

          <!-- body -->
          <div class="modal__body">
            <!-- PREVIEW -->
            <div v-if="modalTab === 'preview'" class="preview">
              <div class="preview__toolbar">
                <div class="seg">
                  <button class="segBtn" :class="{ on: previewMode === 'desktop' }" type="button" @click="previewMode = 'desktop'">
                    Desktop
                  </button>
                  <button class="segBtn" :class="{ on: previewMode === 'mobile' }" type="button" @click="previewMode = 'mobile'">
                    Mobile
                  </button>
                </div>

                <button class="ghostBtn" type="button" @click="replayDemo">
                  Reproduzir animação
                </button>
              </div>

              <div class="frame" :class="previewMode">
                <div class="frame__inner">
                  <component v-if="currentComponent" :is="currentComponent" />
                  <div v-else class="demoFallback">Nenhum demo carregado (verifique o demoMap).</div>
                </div>
              </div>

              <p class="preview__hint">
                Isso é um componente real rodando no modal (não é print). O modo Mobile muda o frame.
              </p>
            </div>

            <!-- COMO FUNCIONA -->
            <div v-else class="how">
              <div class="how__box">
                <div class="how__head">
                  <span class="howDot" aria-hidden="true"></span>
                  <span class="howTitle">Explicação didática</span>
                </div>

                <p class="howText">{{ current?.howText }}</p>

                <div class="howGrid" v-if="current?.howSteps?.length">
                  <div class="howCard" v-for="(s, i) in current.howSteps" :key="i">
                    <div class="howCard__top">
                      <span class="howNum">{{ String(i + 1).padStart(2, "0") }}</span>
                      <span class="howTag">{{ s.tag }}</span>
                    </div>
                    <div class="howCard__title">{{ s.title }}</div>
                    <div class="howCard__desc">{{ s.desc }}</div>
                  </div>
                </div>

                <div class="howFooter">
                  <span class="miniTip">✅ Meta: clareza + confiança + ação</span>
                  <span class="miniTip">⚡ Performance: transform/opacity</span>
                  <span class="miniTip">♿ Acessível: foco, labels, contraste</span>
                </div>
              </div>
            </div>
          </div>

          <!-- bottom -->
          <div class="modal__bottom">
            <button class="btn ghost" type="button" @click="prevDemo" :disabled="!hasPrev">← Anterior</button>
            <button class="btn ghost" type="button" @click="nextDemo" :disabled="!hasNext">Próximo →</button>
            <button class="btn primary" type="button" @click="closeModal">Fechar</button>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, defineComponent, h, markRaw } from "vue";
import { animate } from "@motionone/dom";

/**
 * Dependências:
 * npm i @motionone/dom leaflet
 * (recomendado) npm i -D @types/leaflet
 *
 * CSS do leaflet (import aqui):
 */
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const root = ref(null);
const panelRef = ref(null);

const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const activeId = ref("header");

/* =========================
   CARDS (AGORA COM VÁRIOS)
   ========================= */
const cards = [
  {
    id: "header",
    pill: "Header",
    title: "Header (Topo + navegação + CTA)",
    desc: "Guia o usuário e deixa o botão de ação sempre fácil de achar.",
    bullets: ["Logo e identidade", "Links para seções", "CTA (WhatsApp/Cadastro)"],
    more: "Um bom header reduz abandono porque o visitante sabe para onde ir. CTA fixo ajuda na conversão.",
    examples: [
      { k: "CTA", v: "“Criar cadastro” / “WhatsApp”" },
      { k: "Âncoras", v: "Início • Serviços • FAQ • Cadastro" }
    ]
  },
  {
    id: "hero",
    pill: "Hero",
    title: "Hero (Primeira dobra)",
    desc: "Prende atenção e passa confiança em segundos.",
    bullets: ["Headline forte", "Subheadline clara", "Botão principal e secundário"],
    more: "Hero é a área mais valiosa: se ficar confuso, a pessoa sai. Tem que ser simples, premium e direto.",
    examples: [
      { k: "Headline", v: "Promessa clara + confiança" },
      { k: "Prova", v: "Selos: rápido • acessível • profissional" }
    ]
  },
  {
    id: "services",
    pill: "Serviços",
    title: "Serviços (Cards + prova de valor)",
    desc: "Organiza o que você faz e direciona o clique (menos dúvida).",
    bullets: ["Cards com ícone", "Benefício por serviço", "CTA por item"],
    more: "Em vez de texto gigante, use cards curtos com benefício claro. Isso aumenta conversão porque o usuário se encontra rápido.",
    examples: [
      { k: "Formato", v: "Grid 2-3 colunas (responsivo)" },
      { k: "CTA", v: "“Quero esse serviço” → WhatsApp" }
    ]
  },
  {
    id: "map",
    pill: "Mapa • Leaflet",
    title: "Mapa (Leaflet) com rota em 1 clique",
    desc: "Mostra exatamente onde fica + abre rota no Google Maps/Waze.",
    bullets: ["Marker no local", "Popup com endereço", "Botão “Abrir rota”"],
    more: "Mapa aumenta confiança (local real). O botão de rota remove fricção: a pessoa sai do site direto para navegar até você.",
    examples: [
      { k: "Ação", v: "Abrir rota com destino" },
      { k: "Detalhe", v: "Popup com endereço e horário" }
    ]
  },
  {
    id: "testimonials",
    pill: "Provas",
    title: "Depoimentos + comentários (com nota)",
    desc: "Prova social que derruba objeções e acelera decisão.",
    bullets: ["Cards com estrelas", "Lista de comentários", "Form de comentário (demo)"],
    more: "Depoimentos curtos com nota e contexto (tipo de caso) funcionam muito. Comentários aumentam “vida” na página.",
    examples: [
      { k: "Estrutura", v: "Nome • Nota • Texto curto" },
      { k: "Extra", v: "Filtro: “Mais recentes”" }
    ]
  },
  {
    id: "form",
    pill: "Formulário",
    title: "Formulário (Cadastro de lead)",
    desc: "Onde o visitante vira contato real.",
    bullets: ["Poucos campos", "Validação", "Envio + feedback"],
    more: "O formulário deve pedir só o essencial e dar feedback claro. Também pode enviar pro WhatsApp.",
    examples: [
      { k: "Campos", v: "Nome • WhatsApp • Assunto" },
      { k: "Feedback", v: "“Enviado! Em instantes responderemos”" }
    ]
  },
  {
    id: "pricing",
    pill: "Planos",
    title: "Planos/Orçamento (clareza de valores)",
    desc: "Define expectativa e evita conversa perdida no WhatsApp.",
    bullets: ["3 tiers simples", "Destaque no plano ideal", "CTA por plano"],
    more: "Quando o cliente entende o que recebe, ele pergunta menos e fecha mais rápido. Mesmo sem preço fixo, dá pra mostrar “a partir de”.",
    examples: [
      { k: "Planos", v: "Essencial • Profissional • Premium" },
      { k: "CTA", v: "“Quero esse” → WhatsApp" }
    ]
  },
  {
    id: "faq",
    pill: "FAQ",
    title: "FAQ (Dúvidas / Objeções)",
    desc: "Responde dúvidas e remove barreiras antes do cadastro.",
    bullets: ["Perguntas comuns", "Respostas diretas", "Organizado e leve"],
    more: "FAQ diminui insegurança e ajuda o visitante a decidir.",
    examples: [
      { k: "Pergunta", v: "“Como funciona o atendimento?”" },
      { k: "Resposta", v: "Curta, clara e com CTA" }
    ]
  }
];

/* ===== Detalhes expand ===== */
const openMore = ref(new Set());
const moreRefs = reactive({});
const moreHeights = reactive({});

function setMoreRef(id, el) {
  if (!el) return;
  moreRefs[id] = el;
}

async function toggleMore(id) {
  const s = new Set(openMore.value);
  const willOpen = !s.has(id);
  willOpen ? s.add(id) : s.delete(id);
  openMore.value = s;

  await nextTick();
  const el = moreRefs[id];
  if (el) moreHeights[id] = el.scrollHeight || 0;

  if (!prefersReduced && el) {
    animate(el, { opacity: [0.92, 1], transform: ["translateY(-2px)", "translateY(0px)"] }, { duration: 0.18 });
  }
}

/* =========================
   MODAL / DEMOS
   ========================= */
const modalOpen = ref(false);
const modalTab = ref("preview"); // preview | how
const previewMode = ref("desktop"); // desktop | mobile

const order = ["header", "hero", "services", "map", "testimonials", "form", "pricing", "faq"];
const currentId = ref("header");

const hasPrev = computed(() => order.indexOf(currentId.value) > 0);
const hasNext = computed(() => order.indexOf(currentId.value) < order.length - 1);

/* =========================
   DEMOS (COMPONENTES REAIS)
   ========================= */
const DemoHeader = defineComponent({
  name: "DemoHeader",
  setup() {
    const open = ref(false);
    const dropRef = ref(null);

    const items = [
      { t: "Início", id: "#inicio" },
      { t: "Serviços", id: "#servicos" },
      { t: "Mapa", id: "#mapa" },
      { t: "Cadastro", id: "#cadastro" }
    ];

    async function toggle() {
      open.value = !open.value;
      await nextTick();
      if (open.value && dropRef.value) {
        animate(dropRef.value, { opacity: [0, 1], transform: ["translateY(-6px)", "translateY(0px)"] }, { duration: 0.16 });
      }
    }

    return () =>
      h("div", { class: "demo demoHeader" }, [
        h("div", { class: "demoHeader__top" }, [
          h("div", { class: "demoLogo" }, [
            h("span", { class: "demoLogo__mark" }),
            h("div", { class: "demoLogo__text" }, [
              h("div", { class: "demoLogo__name" }, "Seu Escritório"),
              h("div", { class: "demoLogo__sub" }, "Acessível • Profissional")
            ])
          ]),
          h("nav", { class: "demoNav" }, items.map((it) => h("a", { class: "demoLink", href: it.id }, it.t))),
          h("div", { class: "demoActions" }, [
            h("button", { class: "demoBtn ghost", type: "button", onClick: toggle }, open.value ? "Fechar menu" : "Abrir menu"),
            h("button", { class: "demoBtn primary", type: "button" }, "WhatsApp")
          ])
        ]),

        open.value
          ? h("div", { class: "demoHeader__drop", ref: dropRef }, [
              h("div", { class: "demoDrop__title" }, "Menu rápido"),
              ...items.map((it) => h("a", { class: "demoDrop__item", href: it.id }, it.t))
            ])
          : null,

        h("div", { class: "demoExplain" }, [
          h("div", { class: "demoExplain__k" }, "Por que isso converte?"),
          h("div", { class: "demoExplain__v" }, "Navegação clara + CTA sempre visível. Menos confusão, mais cadastro.")
        ])
      ]);
  }
});

const DemoHero = defineComponent({
  name: "DemoHero",
  setup() {
    const pills = ref(null);

    onMounted(() => {
      if (!pills.value || prefersReduced) return;
      animate(pills.value, { transform: ["translateY(0px)", "translateY(-3px)", "translateY(0px)"] }, { duration: 1.6, repeat: Infinity });
    });

    return () =>
      h("div", { class: "demo demoHero" }, [
        h("div", { class: "demoHero__glass" }, [
          h("div", { class: "demoPills", ref: pills }, [
            h("span", { class: "pillX" }, "✅ Visual premium"),
            h("span", { class: "pillX" }, "⚡ Rápido"),
            h("span", { class: "pillX" }, "♿ Acessível")
          ]),
          h("h3", { class: "demoH" }, [
            "Transforme visitantes em clientes com uma ",
            h("span", { class: "demoAccent" }, "landing page"),
            " que passa confiança."
          ]),
          h("p", { class: "demoP" }, "Headline clara + CTA direto. O visitante entende em segundos e toma ação."),
          h("div", { class: "demoRow" }, [
            h("button", { class: "demoBtn primary", type: "button" }, "Criar cadastro"),
            h("button", { class: "demoBtn ghost", type: "button" }, "Tirar dúvidas")
          ])
        ])
      ]);
  }
});

const DemoServices = defineComponent({
  name: "DemoServices",
  setup() {
    const items = [
      { t: "Consultoria", d: "Análise rápida e objetiva do seu caso.", b: "Resposta no mesmo dia" },
      { t: "Contratos", d: "Revisão completa para evitar riscos.", b: "Pontos críticos em destaque" },
      { t: "Defesa", d: "Atuação estratégica com transparência.", b: "Atualizações por WhatsApp" },
      { t: "Documentos", d: "Organização e checklist pronto.", b: "Tudo em PDF" }
    ];

    const pulseRef = ref(null);
    onMounted(() => {
      if (!pulseRef.value || prefersReduced) return;
      animate(pulseRef.value, { opacity: [0.7, 1, 0.7] }, { duration: 1.6, repeat: Infinity });
    });

    return () =>
      h("div", { class: "demo demoServices" }, [
        h("div", { class: "demoServices__head" }, [
          h("div", { class: "demoServices__k" }, "Serviços"),
          h("div", { class: "demoServices__h" }, ["O que resolvemos pra você", h("span", { class: "demoServices__pulse", ref: pulseRef })])
        ]),
        h(
          "div",
          { class: "svcGrid" },
          items.map((it) =>
            h("div", { class: "svcCard" }, [
              h("div", { class: "svcTop" }, [
                h("span", { class: "svcIcon", "aria-hidden": "true" }, "⬡"),
                h("div", { class: "svcTitle" }, it.t)
              ]),
              h("div", { class: "svcDesc" }, it.d),
              h("div", { class: "svcBadge" }, it.b),
              h("button", { class: "demoBtn primary svcBtn", type: "button" }, "Quero esse serviço →")
            ])
          )
        )
      ]);
  }
});

/**
 * ✅ LEAFLET MAP DEMO
 * - Marker + popup
 * - Botão de rota (abre Google Maps Directions)
 * - Clique no marker também abre popup e mostra botão
 */
const DemoLeafletMap = defineComponent({
  name: "DemoLeafletMap",
  setup() {
    const mapEl = ref(null);
    let map = null;
    let marker = null;

    // Exemplo de local (troque pelo seu):
    const place = {
      name: "Seu Escritório",
      address: "Av. Exemplo, 123 • Centro",
      lat: -3.731862, // Fortaleza (exemplo)
      lng: -38.526669
    };

    function openRoute() {
      const dest = `${place.lat},${place.lng}`;
      // Google Maps Directions (funciona em desktop/mobile, abre app quando disponível):
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&destination_place_id=&travelmode=driving`;
      window.open(url, "_blank", "noopener,noreferrer");
    }

    function buildPopupHtml() {
      // HTML simples (sem v-html no Vue, é o Leaflet popup)
      return `
        <div class="lfPop">
          <div class="lfPop__t">${place.name}</div>
          <div class="lfPop__a">${place.address}</div>
          <button class="lfPop__btn" data-route="1" type="button">Abrir rota</button>
          <div class="lfPop__hint">Dica: no celular abre o app de mapas.</div>
        </div>
      `;
    }

    function attachPopupButtonHandler() {
      // O popup é criado pelo Leaflet, então pegamos o botão no DOM do popup
      const container = map?.getContainer?.();
      if (!container) return;
      const btn = container.querySelector(".lfPop__btn");
      if (!btn) return;

      // evita múltiplos binds
      btn.onclick = (e) => {
        e.preventDefault();
        openRoute();
      };
    }

    function mountMap() {
      if (!mapEl.value || map) return;

      map = L.map(mapEl.value, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false, // evita “travar” scroll do modal
        dragging: !isTouch
      }).setView([place.lat, place.lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.bindPopup(buildPopupHtml(), { closeButton: true, autoClose: true });

      marker.on("click", () => {
        marker.openPopup();
        setTimeout(attachPopupButtonHandler, 0);
      });

      map.on("popupopen", () => {
        setTimeout(attachPopupButtonHandler, 0);
      });

      // garante tamanho correto quando renderiza no modal
      nextTick(() => {
        map?.invalidateSize?.();
      });

      const onResize = () => map?.invalidateSize?.();
      window.addEventListener("resize", onResize);

      onBeforeUnmount(() => {
        window.removeEventListener("resize", onResize);
      });
    }

    onMounted(() => {
      mountMap();
      // abre popup “de cara” pra demonstrar o CTA
      setTimeout(() => {
        marker?.openPopup?.();
        attachPopupButtonHandler();
        map?.invalidateSize?.();
      }, 60);
    });

    onBeforeUnmount(() => {
      try {
        map?.remove?.();
      } catch {}
      map = null;
      marker = null;
    });

    return () =>
      h("div", { class: "demo demoLeaflet" }, [
        h("div", { class: "lfTop" }, [
          h("div", { class: "lfTitle" }, "Onde estamos"),
          h("div", { class: "lfMeta" }, [
            h("span", { class: "lfChip" }, "📍 " + place.address),
            h("button", { class: "demoBtn primary lfRoute", type: "button", onClick: openRoute }, "Abrir rota")
          ])
        ]),
        h("div", { class: "lfMapWrap" }, [h("div", { class: "lfMap", ref: mapEl })]),
        h("div", { class: "lfNote" }, "Clique no marker para ver o popup. O botão abre a rota em 1 clique.")
      ]);
  }
});

const DemoTestimonials = defineComponent({
  name: "DemoTestimonials",
  setup() {
    const list = ref([
      { name: "Mariana S.", stars: 5, text: "Atendimento rápido e direto. Me passaram segurança do começo ao fim.", tag: "Contrato" },
      { name: "Carlos P.", stars: 5, text: "Explicou tudo sem enrolação e resolveu com estratégia. Recomendo.", tag: "Defesa" },
      { name: "Ana L.", stars: 4, text: "Muito organizado. Checklist e documentos bem claros.", tag: "Documentos" }
    ]);

    const newName = ref("");
    const newStars = ref(5);
    const newText = ref("");
    const toast = ref("");

    function add() {
      if (!newName.value.trim()) return (toast.value = "Digite seu nome (demo).");
      if (!newText.value.trim()) return (toast.value = "Escreva um comentário curto (demo).");
      list.value = [{ name: newName.value.trim(), stars: Number(newStars.value), text: newText.value.trim(), tag: "Comentário" }, ...list.value];
      newName.value = "";
      newStars.value = 5;
      newText.value = "";
      toast.value = "Comentário adicionado (demo).";
      setTimeout(() => (toast.value = ""), 1800);
    }

    const starsRow = (n) => "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);

    return () =>
      h("div", { class: "demo demoTest" }, [
        h("div", { class: "testHead" }, [
          h("div", { class: "testTitle" }, "Depoimentos e comentários"),
          h("div", { class: "testSub" }, "Prova social curta, com nota e contexto")
        ]),

        h(
          "div",
          { class: "testGrid" },
          list.value.slice(0, 4).map((it) =>
            h("div", { class: "testCard" }, [
              h("div", { class: "testTop" }, [
                h("div", { class: "testName" }, it.name),
                h("div", { class: "testTag" }, it.tag)
              ]),
              h("div", { class: "testStars", "aria-label": `${it.stars} de 5` }, starsRow(it.stars)),
              h("div", { class: "testText" }, it.text)
            ])
          )
        ),

        h("div", { class: "testForm" }, [
          h("div", { class: "testForm__k" }, "Adicionar comentário (demo)"),
          h("div", { class: "testForm__row" }, [
            h("input", {
              class: "testI",
              placeholder: "Seu nome",
              value: newName.value,
              onInput: (e) => (newName.value = e.target.value)
            }),
            h(
              "select",
              {
                class: "testI",
                value: newStars.value,
                onChange: (e) => (newStars.value = e.target.value)
              },
              [5, 4, 3, 2, 1].map((n) => h("option", { value: n }, `${n} ⭐`))
            )
          ]),
          h("textarea", {
            class: "testT",
            rows: 2,
            placeholder: "Comentário curto (1–2 frases)",
            value: newText.value,
            onInput: (e) => (newText.value = e.target.value)
          }),
          h("div", { class: "testForm__actions" }, [
            h("button", { class: "demoBtn primary", type: "button", onClick: add }, "Publicar"),
            h("button", { class: "demoBtn ghost", type: "button" }, "Ver mais")
          ]),
          toast.value ? h("div", { class: "demoToast" }, toast.value) : h("div", { class: "demoHint" }, "Dica: valide, modere e destaque os mais relevantes.")
        ])
      ]);
  }
});

const DemoForm = defineComponent({
  name: "DemoForm",
  setup() {
    const name = ref("");
    const phone = ref("");
    const topic = ref("Cível");
    const msg = ref("");
    const toast = ref("");

    function validatePhone(v) {
      const digits = String(v || "").replace(/\D/g, "");
      return digits.length >= 10;
    }

    function submit() {
      if (!name.value.trim()) return (toast.value = "Digite seu nome.");
      if (!validatePhone(phone.value)) return (toast.value = "Digite um WhatsApp válido.");
      toast.value = "Enviado! (demo) Aqui você salvaria no banco e/ou abriria o WhatsApp.";
      setTimeout(() => (toast.value = ""), 2200);
    }

    return () =>
      h("div", { class: "demo demoForm" }, [
        h("div", { class: "demoForm__card" }, [
          h("div", { class: "demoForm__head" }, [
            h("div", { class: "demoForm__title" }, "Cadastro rápido"),
            h("div", { class: "demoForm__sub" }, "Poucos campos → mais conversão")
          ]),
          h("div", { class: "demoForm__grid" }, [
            h("label", { class: "f" }, [
              h("span", { class: "f__l" }, "Nome"),
              h("input", {
                class: "f__i",
                value: name.value,
                placeholder: "Ex: Dra. Ana",
                onInput: (e) => (name.value = e.target.value)
              })
            ]),
            h("label", { class: "f" }, [
              h("span", { class: "f__l" }, "WhatsApp"),
              h("input", {
                class: "f__i",
                value: phone.value,
                placeholder: "(xx) xxxxx-xxxx",
                onInput: (e) => (phone.value = e.target.value)
              })
            ]),
            h("label", { class: "f" }, [
              h("span", { class: "f__l" }, "Área"),
              h(
                "select",
                {
                  class: "f__i",
                  value: topic.value,
                  onChange: (e) => (topic.value = e.target.value)
                },
                [h("option", "Cível"), h("option", "Trabalhista"), h("option", "Família")]
              )
            ]),
            h("label", { class: "f f--full" }, [
              h("span", { class: "f__l" }, "Mensagem"),
              h("textarea", {
                class: "f__t",
                rows: 3,
                value: msg.value,
                placeholder: "Escreva em uma frase o que você precisa…",
                onInput: (e) => (msg.value = e.target.value)
              })
            ])
          ]),
          h("div", { class: "demoForm__row" }, [
            h("button", { class: "demoBtn primary", type: "button", onClick: submit }, "Enviar"),
            h("button", { class: "demoBtn ghost", type: "button" }, "Falar no WhatsApp")
          ]),
          toast.value ? h("div", { class: "demoToast" }, toast.value) : h("div", { class: "demoHint" }, "Validação + feedback claro = usuário confiante para enviar.")
        ])
      ]);
  }
});

const DemoPricing = defineComponent({
  name: "DemoPricing",
  setup() {
    const plans = [
      { t: "Essencial", p: "A partir de R$ 197", d: "Para demandas simples e objetivas.", f: ["Triagem rápida", "Orientação clara", "Entrega em PDF"], hot: false },
      { t: "Premium", p: "Sob consulta", d: "Para acompanhamento e urgências.", f: ["Prioridade", "Atualizações constantes", "Atuação completa"], hot: false }
    ];

    return () =>
      h("div", { class: "demo demoPricing" }, [
        h("div", { class: "prHead" }, [
          h("div", { class: "prTitle" }, "Planos / Orçamento"),
          h("div", { class: "prSub" }, "Clareza do que inclui → menos dúvidas → mais fechamento")
        ]),
        h(
          "div",
          { class: "prGrid" },
          plans.map((pl) =>
            h("div", { class: ["prCard", pl.hot ? "hot" : ""].join(" ") }, [
              h("div", { class: "prTop" }, [
                h("div", { class: "prName" }, pl.t),
                pl.hot ? h("div", { class: "prBadge" }, "Mais escolhido") : null
              ]),
              h("div", { class: "prPrice" }, pl.p),
              h("div", { class: "prDesc" }, pl.d),
              h(
                "div",
                { class: "prList" },
                pl.f.map((x) => h("div", { class: "prLi" }, [h("span", { class: "prDot" }), h("span", x)]))
              ),
              h("button", { class: "demoBtn primary prBtn", type: "button" }, "Quero esse →")
            ])
          )
        )
      ]);
  }
});

const DemoFAQ = defineComponent({
  name: "DemoFAQ",
  setup() {
    const open = ref("a1");
    const qa = [
      { id: "a1", q: "Em quanto tempo respondem?", a: "Geralmente em poucos minutos, dentro do horário comercial." },
      { id: "a2", q: "Meus dados ficam seguros?", a: "Sim. Você salva somente o necessário e segue boas práticas." },
      { id: "a3", q: "Posso falar direto no WhatsApp?", a: "Sim. Há botões estratégicos para atendimento imediato." }
    ];

    return () =>
      h("div", { class: "demo demoFAQ" }, [
        h("div", { class: "demoFAQ__card" }, [
          h("div", { class: "demoFAQ__head" }, [
            h("div", { class: "demoFAQ__title" }, "Perguntas frequentes"),
            h("div", { class: "demoFAQ__sub" }, "Tira dúvidas e reduz objeções")
          ]),
          h(
            "div",
            { class: "demoFAQ__list" },
            qa.map((item) =>
              h("div", { class: "qaX" }, [
                h(
                  "button",
                  {
                    class: "qaX__q",
                    type: "button",
                    onClick: () => (open.value = open.value === item.id ? null : item.id)
                  },
                  [item.q, h("span", { class: "qaX__chev", "aria-hidden": "true" })]
                ),
                h("div", { class: ["qaX__a", open.value === item.id ? "open" : ""].join(" ") }, item.a)
              ])
            )
          )
        ])
      ]);
  }
});

/* =========================
   MAP (IMPORTANTÍSSIMO)
   ✅ component é markRaw(Componente) (não ref)
   ========================= */
const demoMap = {
  header: {
    pill: "Exemplo • Header",
    modalTitle: "Header real (preview interativo)",
    modalHint: "Clique em “Abrir menu” para ver comportamento.",
    component: markRaw(DemoHeader),
    howText:
      "O Header é a barra superior do site. Ele guia o visitante e mantém um CTA sempre acessível (WhatsApp/Cadastro). Isso reduz confusão e aumenta conversão.",
    howSteps: [
      { tag: "Navegação", title: "Links claros", desc: "Âncoras levam o usuário para seções sem esforço." },
      { tag: "Confiança", title: "Identidade visível", desc: "Logo + nome do escritório reforçam credibilidade." },
      { tag: "Conversão", title: "CTA sempre à mão", desc: "Botão de ação no topo aumenta contatos." }
    ]
  },
  hero: {
    pill: "Exemplo • Hero",
    modalTitle: "Hero real (primeira dobra)",
    modalHint: "Veja headline, selos e botões trabalhando juntos.",
    component: markRaw(DemoHero),
    howText:
      "O Hero é a primeira impressão. Ele precisa comunicar: o que você faz, por que confiar e qual é a ação principal.",
    howSteps: [
      { tag: "Mensagem", title: "Headline forte", desc: "Promessa simples e direta." },
      { tag: "Prova", title: "Selos rápidos", desc: "Reforçam premium/rápido/acessível." },
      { tag: "Ação", title: "CTA principal", desc: "Botão destacado guia o clique." }
    ]
  },
  services: {
    pill: "Exemplo • Serviços",
    modalTitle: "Serviços (cards com CTA por item)",
    modalHint: "Cada card pode abrir WhatsApp com mensagem pronta.",
    component: markRaw(DemoServices),
    howText:
      "A seção de serviços organiza o que você faz e deixa o visitante se encontrar rápido. Cada item com benefício claro + CTA reduz dúvidas e aumenta cliques.",
    howSteps: [
      { tag: "Clareza", title: "Benefício no card", desc: "Mostre o resultado, não só o nome do serviço." },
      { tag: "Direção", title: "CTA por item", desc: "Botão no card já leva para ação (WhatsApp/Contato)." },
      { tag: "UX", title: "Grid responsivo", desc: "2–3 colunas no desktop, 1 coluna no mobile." }
    ]
  },
  map: {
    pill: "Exemplo • Mapa Leaflet",
    modalTitle: "Mapa real (Leaflet) + rota em 1 clique",
    modalHint: "Clique no marker para abrir o popup e testar “Abrir rota”.",
    component: markRaw(DemoLeafletMap),
    howText:
      "O mapa aumenta confiança (local real) e o botão de rota remove fricção: o visitante abre o app de mapas e já vai navegar até você.",
    howSteps: [
      { tag: "Confiança", title: "Local visível", desc: "Mostra que existe endereço e presença real." },
      { tag: "Conversão", title: "Rota em 1 clique", desc: "Menos esforço = mais visitas/contatos." },
      { tag: "UX", title: "Scroll do modal", desc: "Desativar scrollWheelZoom evita travar o scroll do modal." }
    ]
  },
  testimonials: {
    pill: "Exemplo • Depoimentos",
    modalTitle: "Depoimentos + comentários (com nota)",
    modalHint: "Prova social curta com estrelas e contexto.",
    component: markRaw(DemoTestimonials),
    howText:
      "Depoimentos curtos com nota e contexto derrubam objeções. Comentários deixam a página “viva” e aumentam credibilidade.",
    howSteps: [
      { tag: "Prova", title: "Nota e contexto", desc: "Estrelas + tipo de caso aumentam confiança." },
      { tag: "Conversão", title: "Texto curto", desc: "1–2 frases funcionam melhor que parágrafos enormes." },
      { tag: "Segurança", title: "Moderação", desc: "Valide e destaque os melhores; evite spam." }
    ]
  },
  form: {
    pill: "Exemplo • Formulário",
    modalTitle: "Formulário real (validação + feedback)",
    modalHint: "Teste o envio (demo). Veja o feedback.",
    component: markRaw(DemoForm),
    howText:
      "O formulário é onde o visitante vira lead. A regra é: poucos campos, validação amigável e feedback claro.",
    howSteps: [
      { tag: "Fricção", title: "Poucos campos", desc: "Menos esforço → mais envios." },
      { tag: "Segurança", title: "Validação", desc: "Evita dados errados e frustração." },
      { tag: "Clareza", title: "Feedback imediato", desc: "Sucesso/erro de forma simples." }
    ]
  },
  pricing: {
    pill: "Exemplo • Planos",
    modalTitle: "Planos/Orçamento (3 tiers simples)",
    modalHint: "Destaque no plano ideal e CTA por plano.",
    component: markRaw(DemoPricing),
    howText:
      "Planos deixam expectativa clara e evitam conversas longas sem rumo. Mesmo se você não tiver preço fixo, dá pra usar “a partir de”.",
    howSteps: [
      { tag: "Clareza", title: "3 tiers", desc: "Essencial, Profissional e Premium (simples)." },
      { tag: "Direção", title: "Plano em destaque", desc: "Ajuda o visitante a escolher sem travar." },
      { tag: "Ação", title: "CTA por plano", desc: "Cada plano manda uma mensagem pronta no WhatsApp." }
    ]
  },
  faq: {
    pill: "Exemplo • FAQ",
    modalTitle: "FAQ real (acordeão leve)",
    modalHint: "Clique nas perguntas para abrir/fechar.",
    component: markRaw(DemoFAQ),
    howText:
      "FAQ remove dúvidas e objeções antes do cadastro. Quem está inseguro procura respostas rápidas.",
    howSteps: [
      { tag: "Objeções", title: "Respostas diretas", desc: "Sem texto longo." },
      { tag: "Confiança", title: "Transparência", desc: "Mostra como funciona e o que esperar." },
      { tag: "Ação", title: "CTA pós-dúvida", desc: "Depois de responder, guie para cadastro/WhatsApp." }
    ]
  }
};

const current = computed(() => demoMap[currentId.value] || null);
const currentComponent = computed(() => current.value?.component || null);

function openDemo(id) {
  currentId.value = id;
  modalTab.value = "preview";
  previewMode.value = "desktop";
  modalOpen.value = true;

    document.documentElement.style.overflow = "hidden"; // ✅ trava page

  nextTick(() => {
    if (prefersReduced || !panelRef.value) return;
    animate(panelRef.value, { opacity: [0, 1], transform: ["translateY(10px) scale(0.98)", "translateY(0px) scale(1)"] }, { duration: 0.16 });
  });
}

function closeModal() {
  modalOpen.value = false;
  document.documentElement.style.overflow = ""; // ✅ destrava
}

function replayDemo() {
  nextTick(() => {
    const el = panelRef.value?.querySelector(".frame");
    if (!el || prefersReduced) return;
    animate(el, { transform: ["scale(1)", "scale(1.01)", "scale(1)"] }, { duration: 0.22 });
  });
}

function prevDemo() {
  const i = order.indexOf(currentId.value);
  if (i <= 0) return;
  currentId.value = order[i - 1];
  replayDemo();
}

function nextDemo() {
  const i = order.indexOf(currentId.value);
  if (i >= order.length - 1) return;
  currentId.value = order[i + 1];
  replayDemo();
}

/* keyboard */
function onKeydown(e) {
  if (!modalOpen.value) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") prevDemo();
  if (e.key === "ArrowRight") nextDemo();
}

/* ponteiro glow leve */
let cleanupMove = null;

function initPointerGlow() {
  if (!root.value) return;

  root.value.style.setProperty("--px", "50%");
  root.value.style.setProperty("--py", "35%");
  root.value.style.setProperty("--pOpacity", "0");

  if (prefersReduced || isTouch) return;

  const onMove = (e) => {
    const r = root.value.getBoundingClientRect();
    root.value.style.setProperty("--px", `${e.clientX - r.left}px`);
    root.value.style.setProperty("--py", `${e.clientY - r.top}px`);
  };
  const onEnter = () => root.value.style.setProperty("--pOpacity", "1");
  const onLeave = () => root.value.style.setProperty("--pOpacity", "0");

  root.value.addEventListener("mousemove", onMove, { passive: true });
  root.value.addEventListener("mouseenter", onEnter, { passive: true });
  root.value.addEventListener("mouseleave", onLeave, { passive: true });

  cleanupMove = () => {
    root.value?.removeEventListener("mousemove", onMove);
    root.value?.removeEventListener("mouseenter", onEnter);
    root.value?.removeEventListener("mouseleave", onLeave);
  };
}

onMounted(() => {
  initPointerGlow();
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  cleanupMove?.();
  cleanupMove = null;
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
/* =====================
   BASE
   ===================== */
.guide {
  position: relative;
  padding: 84px 0;
  overflow: hidden;
  background: #07080b;
  color: rgba(255, 255, 255, 0.92);
  --px: 50%;
  --py: 35%;
  --pOpacity: 0;
}
.guide__container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 18px;
}

/* bg */
.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg__grid {
  position: absolute;
  inset: -40%;
  background: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: 0.1;
  transform: rotate(8deg);
}
.bg__glow {
  position: absolute;
  left: 50%;
  top: 20%;
  width: 760px;
  height: 760px;
  transform: translateX(-50%);
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.35;
  background: radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.12), transparent 60%);
}
.bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.07;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
}
.bg__cursor {
  position: absolute;
  inset: 0;
  opacity: calc(var(--pOpacity) * 0.55);
  transition: opacity 180ms ease;
  background: radial-gradient(320px 320px at var(--px) var(--py), rgba(255, 255, 255, 0.09), transparent 60%),
    radial-gradient(160px 160px at var(--px) var(--py), rgba(255, 255, 255, 0.06), transparent 62%);
}

/* head */
.head {
  text-align: center;
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}
.kicker {
  margin: 0 auto;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  letter-spacing: 0.3px;
}
.title {
  margin: 0;
  font-size: clamp(24px, 3.6vw, 46px);
  line-height: 1.08;
  letter-spacing: -0.5px;
}
.accent {
  display: inline-block;
  padding: 0 0.08em;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.96));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 10px 34px rgba(0, 0, 0, 0.5);
  animation: shimmer 3.2s linear infinite;
}
@keyframes shimmer {
  to {
    background-position: 200% 50%;
  }
}
.subtitle {
  margin: 0 auto;
  max-width: 920px;
  font-size: clamp(14px, 1.25vw, 18px);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}

/* cards */
.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}
.step {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 14px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.5);
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}
.step:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.045);
}
.step.active {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
}

.step__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.pill {
  font-size: 11px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.78);
}
.num {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.6px;
}
.step__title {
  margin: 10px 0 6px;
  font-size: 16px;
  letter-spacing: -0.2px;
}
.step__desc {
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
  font-size: 13px;
}

.step__list {
  display: grid;
  gap: 8px;
}
.li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.12);
  margin-top: 4px;
}

.step__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 10px 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.04);
  transition: background 160ms ease, transform 160ms ease;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}
.btn.primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  color: rgba(8, 10, 14, 0.95);
  font-weight: 900;
}
.btn.ghost {
  background: rgba(255, 255, 255, 0.02);
}
.arrow {
  margin-left: 8px;
  font-weight: 900;
}
.chev {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 8px;
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  transform: rotate(45deg) translateY(-1px);
}

/* details expand */
.more {
  height: 0px;
  overflow: hidden;
  transition: height 220ms ease;
  margin-top: 10px;
}
.more__inner {
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.more__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
  font-size: 13px;
}
.examples {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}
.ex {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  padding: 10px 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}
.ex__k {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}
.ex__v {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.35;
}

/* note */
.note {
  margin: 14px auto 0;
  max-width: 980px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.74);
  font-size: 13px;
}
.noteDot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.12);
  margin-top: 4px;
}

/* modal */
.modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.modal__panel{
  width: min(1120px, 100%);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 12, 16, 0.92);
  box-shadow: 0 30px 120px rgba(0, 0, 0, 0.65);

  /* ✅ novo */
  display: flex;
  flex-direction: column;
  max-height: min(86vh, 920px); /* limita o modal na tela */
  overflow: hidden;            /* mantém bordas arredondadas */
}
.modal__body{
  padding: 14px;

  /* ✅ novo: o scroll fica aqui */
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  /* importante: deixa o body encolher/rolar dentro do flex */
  flex: 1 1 auto;
  min-height: 0;
}
.modal__bottom{
  /* ✅ garante que footer fique fixo */
  flex: 0 0 auto;
}
.modal__top {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.modal__left {
  display: grid;
  gap: 4px;
}
.modal__pill {
  width: fit-content;
  font-size: 11px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.78);
}
.modal__title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.94);
}
.modal__muted {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
.modal__right {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.tab {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.88);
  border-radius: 14px;
  padding: 9px 10px;
  cursor: pointer;
}
.tab.on {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
}
.modal__close {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  width: 40px;
  height: 40px;
  border-radius: 14px;
  cursor: pointer;
}
.modal__close:hover {
  background: rgba(255, 255, 255, 0.06);
}
.modal__body {
  padding: 14px;
}
.modal__bottom {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

/* preview */
.preview__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.seg {
  display: inline-flex;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}
.segBtn {
  padding: 9px 12px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.86);
  cursor: pointer;
}
.segBtn.on {
  background: rgba(255, 255, 255, 0.08);
}
.ghostBtn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
  border-radius: 14px;
  padding: 9px 12px;
  cursor: pointer;
}
.ghostBtn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.frame {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.45);
}
.frame__inner {
  padding: 12px;
}
.frame.desktop .frame__inner {
  min-height: 380px;
}
.frame.mobile {
  width: min(430px, 100%);
  margin: 0 auto;
}
.preview__hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
.demoFallback {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.75);
}

/* how (simples e bonito) */
.how__box {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 14px;
}
.how__head {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.howDot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 22px rgba(255, 255, 255, 0.12);
}
.howTitle {
  font-weight: 900;
  color: rgba(255, 255, 255, 0.92);
}
.howText {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.5;
  font-size: 13px;
}
.howGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.howCard {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
  border-radius: 16px;
  padding: 12px;
}
.howCard__top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.howNum {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
.howTag {
  font-size: 11px;
  padding: 6px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.78);
}
.howCard__title {
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 4px;
}
.howCard__desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
}
.howFooter {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.miniTip {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  padding: 7px 9px;
  border-radius: 999px;
}

/* =====================
   ✅ DEMOS - usar :deep()
   ===================== */
:deep(.demo) {
  color: rgba(255, 255, 255, 0.9);
}
:deep(.demoBtn) {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease;
}
:deep(.demoBtn:hover) {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}
:deep(.demoBtn.primary) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  color: rgba(8, 10, 14, 0.95);
  font-weight: 900;
}
:deep(.demoBtn.ghost) {
  background: rgba(255, 255, 255, 0.02);
}

/* Demo Header */
:deep(.demoHeader__top) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
}
:deep(.demoLogo) {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}
:deep(.demoLogo__mark) {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.12);
}
:deep(.demoLogo__name) {
  font-size: 13px;
  font-weight: 900;
}
:deep(.demoLogo__sub) {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.62);
}
:deep(.demoNav) {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
:deep(.demoLink) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 12px;
}
:deep(.demoLink:hover) {
  background: rgba(255, 255, 255, 0.04);
}
:deep(.demoActions) {
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
:deep(.demoHeader__drop) {
  margin-top: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
}
:deep(.demoDrop__title) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  margin-bottom: 8px;
}
:deep(.demoDrop__item) {
  display: block;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  padding: 10px;
  border-radius: 12px;
}
:deep(.demoDrop__item:hover) {
  background: rgba(255, 255, 255, 0.05);
}
:deep(.demoExplain) {
  margin-top: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}
:deep(.demoExplain__k) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  margin-bottom: 6px;
}
:deep(.demoExplain__v) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.35;
}

/* Demo Hero */
:deep(.demoHero__glass) {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
}
:deep(.demoPills) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
:deep(.pillX) {
  font-size: 11px;
  padding: 7px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.75);
}
:deep(.demoH) {
  margin: 0;
  font-size: clamp(18px, 2.4vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.4px;
}
:deep(.demoAccent) {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.96));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
:deep(.demoP) {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.72);
}
:deep(.demoRow) {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

/* Demo Services */
:deep(.demoServices__head) {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}
:deep(.demoServices__k) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
:deep(.demoServices__h) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
}
:deep(.demoServices__pulse) {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.15);
}
:deep(.svcGrid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
:deep(.svcCard) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 8px;
}
:deep(.svcTop) {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
:deep(.svcIcon) {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.2);
}
:deep(.svcTitle) {
  font-weight: 900;
}
:deep(.svcDesc) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
}
:deep(.svcBadge) {
  width: fit-content;
  font-size: 11px;
  padding: 6px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
}
:deep(.svcBtn) {
  justify-self: start;
}

/* Demo Leaflet */
:deep(.demoLeaflet) {
  display: grid;
  gap: 10px;
}
:deep(.lfTop) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
:deep(.lfTitle) {
  font-weight: 900;
  font-size: 14px;
}
:deep(.lfMeta) {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}
:deep(.lfChip) {
  font-size: 11px;
  padding: 7px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
}
:deep(.lfRoute) {
  padding: 9px 11px;
}
:deep(.lfMapWrap) {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
}
:deep(.lfMap) {
  height: 320px;
  width: 100%;
}
:deep(.lfNote) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.68);
}

/* Popup Leaflet (conteúdo HTML do popup) */
:deep(.lfPop) {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  display: grid;
  gap: 6px;
  min-width: 200px;
}
:deep(.lfPop__t) {
  font-weight: 900;
  color: #0b0c10;
}
:deep(.lfPop__a) {
  font-size: 12px;
  color: rgba(11, 12, 16, 0.8);
}
:deep(.lfPop__btn) {
  border: 0;
  cursor: pointer;
  padding: 9px 10px;
  border-radius: 12px;
  font-weight: 900;
  color: rgba(8, 10, 14, 0.95);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.78));
}
:deep(.lfPop__hint) {
  font-size: 11px;
  color: rgba(11, 12, 16, 0.65);
}

/* Demo Testimonials */
:deep(.demoTest) {
  display: grid;
  gap: 10px;
}
:deep(.testHead) {
  display: grid;
  gap: 4px;
}
:deep(.testTitle) {
  font-weight: 900;
}
:deep(.testSub) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
:deep(.testGrid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
:deep(.testCard) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 8px;
}
:deep(.testTop) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
:deep(.testName) {
  font-weight: 900;
  font-size: 12px;
}
:deep(.testTag) {
  font-size: 11px;
  padding: 6px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
}
:deep(.testStars) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.85);
}
:deep(.testText) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
}
:deep(.testForm) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 10px;
}
:deep(.testForm__k) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 900;
}
:deep(.testForm__row) {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 10px;
}
:deep(.testI),
:deep(.testT) {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 12px;
  outline: none;
}
:deep(.testT) {
  resize: vertical;
}
:deep(.testForm__actions) {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Demo Form */
:deep(.demoForm__card) {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
}
:deep(.demoForm__head) {
  display: grid;
  gap: 4px;
  margin-bottom: 10px;
}
:deep(.demoForm__title) {
  font-size: 14px;
  font-weight: 900;
}
:deep(.demoForm__sub) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
:deep(.demoForm__grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
:deep(.f) {
  display: grid;
  gap: 6px;
}
:deep(.f__l) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
}
:deep(.f__i) {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 12px;
  outline: none;
}
:deep(.f__i:focus) {
  border-color: rgba(255, 255, 255, 0.2);
}
:deep(.f--full) {
  grid-column: 1 / -1;
}
:deep(.f__t) {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 12px;
  outline: none;
  resize: vertical;
}
:deep(.demoForm__row) {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}
:deep(.demoToast) {
  margin-top: 10px;
  font-size: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.86);
}
:deep(.demoHint) {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

/* Demo Pricing */
:deep(.demoPricing) {
  display: grid;
  gap: 10px;
}
:deep(.prHead) {
  display: grid;
  gap: 4px;
}
:deep(.prTitle) {
  font-weight: 900;
}
:deep(.prSub) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
:deep(.prGrid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
:deep(.prCard) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 8px;
}
:deep(.prCard.hot) {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.35);
}
:deep(.prTop) {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}
:deep(.prName) {
  font-weight: 900;
}
:deep(.prBadge) {
  font-size: 11px;
  padding: 6px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.86);
}
:deep(.prPrice) {
  font-weight: 900;
  font-size: 14px;
}
:deep(.prDesc) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.45;
}
:deep(.prList) {
  display: grid;
  gap: 8px;
}
:deep(.prLi) {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}
:deep(.prDot) {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.12);
}
:deep(.prBtn) {
  margin-top: 6px;
}

/* Demo FAQ */
:deep(.demoFAQ__card) {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
}
:deep(.demoFAQ__head) {
  display: grid;
  gap: 4px;
  margin-bottom: 10px;
}
:deep(.demoFAQ__title) {
  font-size: 14px;
  font-weight: 900;
}
:deep(.demoFAQ__sub) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
:deep(.demoFAQ__list) {
  display: grid;
  gap: 10px;
}
:deep(.qaX__q) {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
:deep(.qaX__chev) {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  transform: rotate(45deg);
  margin-top: 2px;
}
:deep(.qaX__a) {
  display: none;
  padding: 10px 4px 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  line-height: 1.4;
}
:deep(.qaX__a.open) {
  display: block;
}

/* responsive */
@media (max-width: 980px) {
  .steps {
    grid-template-columns: 1fr;
  }
  :deep(.demoNav) {
    display: none;
  }
  :deep(.demoForm__grid) {
    grid-template-columns: 1fr;
  }
  :deep(.svcGrid) {
    grid-template-columns: 1fr;
  }
  :deep(.testGrid) {
    grid-template-columns: 1fr;
  }
  :deep(.testForm__row) {
    grid-template-columns: 1fr;
  }
  :deep(.prGrid) {
    grid-template-columns: 1fr;
  }
  :deep(.lfMap) {
    height: 280px;
  }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
  .bg__cursor {
    display: none !important;
  }
}
</style>