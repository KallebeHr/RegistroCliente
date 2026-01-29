<template>
  <section class="leads-root">
    <!-- Header -->
    <div class="leads-hero">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-kicker">
            <i class="mdi mdi-account-multiple-outline"></i>
            Leads • Cadastros
          </div>
          <h1 class="hero-title">Painel de Leads</h1>
          <p class="hero-subtitle">
            Cards de leads com modal completo. Agora com ações de admin: definir tipo/status e excluir.
          </p>
        </div>

        <div class="hero-right">
          <v-btn
            class="btn-glow"
            variant="flat"
            color="primary"
            :loading="loading"
            prepend-icon="mdi-refresh"
            @click="fetchLeads"
          >
            Atualizar
          </v-btn>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <v-text-field
          v-model="q"
          label="Buscar por nome, e-mail, WhatsApp, marca…"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          hide-details
          class="control"
          clearable
        />

        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag-outline"
          hide-details
          class="control"
          clearable
        />

        <v-select
          v-model="sortMode"
          :items="sortOptions"
          label="Ordenar"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-sort"
          hide-details
          class="control"
        />
      </div>

      <div class="meta">
        <v-chip class="meta-chip" variant="tonal" color="primary">
          <i class="mdi mdi-database-outline mr-2"></i>
          Total: <b class="ml-1">{{ filteredLeads.length }}</b>
        </v-chip>

        <v-chip v-if="lastUpdated" class="meta-chip" variant="tonal">
          <i class="mdi mdi-clock-outline mr-2"></i>
          Atualizado: <b class="ml-1">{{ lastUpdated }}</b>
        </v-chip>
      </div>
    </div>

    <!-- Content -->
    <div class="leads-container">
      <div v-if="loading" class="skeleton-grid">
        <v-skeleton-loader v-for="n in 9" :key="n" type="card" class="sk-card" />
      </div>

      <div v-else-if="filteredLeads.length === 0" class="empty">
        <div class="empty-ico"><i class="mdi mdi-text-box-search-outline"></i></div>
        <h3>Nenhum lead encontrado</h3>
        <p>Tente limpar filtros ou ajustar a busca.</p>
        <v-btn variant="tonal" prepend-icon="mdi-refresh" @click="fetchLeads">
          Recarregar
        </v-btn>
      </div>

      <div v-else class="grid">
        <article
          v-for="lead in sortedLeads"
          :key="lead.id"
          class="lead-card"
          role="button"
          tabindex="0"
          @click="openLead(lead)"
          @keydown.enter.prevent="openLead(lead)"
        >
          <div class="card-top">
            <div class="avatar"><span>{{ initials(lead.nome || lead.marca || "Lead") }}</span></div>

            <div class="card-title">
              <div class="name">{{ lead.nome || "Sem nome" }}</div>
              <div class="brand">{{ lead.marca || "Sem marca" }}</div>
            </div>

            <div class="status">
              <span class="status-dot" :class="statusDot(lead.status)"></span>
              <span class="status-text">{{ lead.status || "novo" }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="row">
              <i class="mdi mdi-email-outline"></i>
              <span class="truncate">{{ lead.email || "—" }}</span>
            </div>
            <div class="row">
              <i class="mdi mdi-whatsapp"></i>
              <span>{{ lead.whats || "—" }}</span>
            </div>
            <div class="row">
              <i class="mdi mdi-map-marker-outline"></i>
              <span class="truncate">{{ lead.cidade || lead.localPrincipal || "—" }}</span>
            </div>

            <div class="chips">
              <span v-for="a in (lead.areas || []).slice(0, 3)" :key="a" class="chip">
                <i class="mdi mdi-scale-balance"></i>
                {{ a }}
              </span>
              <span v-if="(lead.areas || []).length > 3" class="chip chip-more">
                +{{ (lead.areas || []).length - 3 }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="date">
              <i class="mdi mdi-calendar-clock-outline"></i>
              <span>{{ lead.createdAtBR || "—" }}</span>
            </div>

            <div class="cta">
              <span>Abrir</span>
              <i class="mdi mdi-arrow-right"></i>
            </div>
          </div>

          <div class="card-glow" aria-hidden="true"></div>
        </article>
      </div>
    </div>

    <!-- Modal -->
    <v-dialog v-model="modal.on" max-width="1020" scrollable>
      <v-card class="modal-card">
        <v-card-title class="modal-title">
          <div class="title-left">
            <div class="modal-avatar">{{ initials(modal.lead?.nome || modal.lead?.marca || "Lead") }}</div>
            <div class="t-wrap">
              <div class="t-name">{{ modal.lead?.nome || "Lead" }}</div>
              <div class="t-sub">
                {{ modal.lead?.marca || "Sem marca" }}
                <span class="sep">•</span>
                <span class="muted">{{ modal.lead?.tipo || "—" }}</span>
              </div>
            </div>
          </div>

          <div class="title-right">
            <v-chip class="mr-2" variant="tonal" :color="vuetifyStatusColor(modal.lead?.status)">
              <i class="mdi mdi-tag-outline mr-2"></i>
              {{ modal.lead?.status || "novo" }}
            </v-chip>

            <v-btn icon="mdi-close" variant="text" @click="modal.on = false" />
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="modal-body">
          <!-- ADMIN ACTION BAR -->
          <div class="admin-bar">
            <div class="admin-left">
              <div class="admin-title">
                <i class="mdi mdi-shield-crown-outline"></i>
                Ações do Admin
              </div>
              <div class="admin-sub">Defina tipo/status do lead ou exclua o cadastro.</div>
            </div>

            <div class="admin-right">
              <v-select
                v-model="admin.tipo"
                :items="tipoOptions"
                label="Tipo"
                variant="outlined"
                density="compact"
                hide-details
                class="admin-field"
                prepend-inner-icon="mdi-account-tie-outline"
              />

              <v-select
                v-model="admin.status"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="compact"
                hide-details
                class="admin-field"
                prepend-inner-icon="mdi-tag-outline"
              />

              <v-btn
                class="admin-btn"
                color="primary"
                variant="flat"
                :loading="adminSaving"
                prepend-icon="mdi-content-save-outline"
                @click="saveAdminEdits"
              >
                Salvar
              </v-btn>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="quick-actions">
            <v-btn variant="tonal" prepend-icon="mdi-content-copy" @click="copyLeadJson(modal.lead)">
              Copiar JSON
            </v-btn>

            <v-btn
              v-if="modal.lead?.whats"
              variant="tonal"
              color="success"
              prepend-icon="mdi-whatsapp"
              :href="waLink(modal.lead?.whats)"
              target="_blank"
            >
              Abrir WhatsApp
            </v-btn>

            <v-btn
              v-if="modal.lead?.email"
              variant="tonal"
              color="info"
              prepend-icon="mdi-email-outline"
              :href="`mailto:${modal.lead?.email}`"
            >
              Enviar E-mail
            </v-btn>
          </div>

          <!-- Sections -->
          <div class="sections">
            <div class="sec">
              <div class="sec-head">
                <i class="mdi mdi-account-badge-outline"></i>
                <div>
                  <div class="sec-title">Perfil</div>
                  <div class="sec-sub">Dados principais do cliente</div>
                </div>
              </div>

              <div class="sec-grid">
                <Info label="Tipo" :value="modal.lead?.tipo" />
                <Info label="Nome" :value="modal.lead?.nome" />
                <Info label="Marca" :value="modal.lead?.marca" />
                <Info label="WhatsApp" :value="modal.lead?.whats" />
                <Info label="E-mail" :value="modal.lead?.email" />
                <Info label="Cidade" :value="modal.lead?.cidade" />
                <Info label="Atendimento" :value="modal.lead?.atendimento" />
                <Info label="Criado em" :value="modal.lead?.createdAtBR" />
              </div>
            </div>

            <div class="sec">
              <div class="sec-head">
                <i class="mdi mdi-scale-balance"></i>
                <div>
                  <div class="sec-title">Atuação</div>
                  <div class="sec-sub">Posicionamento e público</div>
                </div>
              </div>

              <div class="sec-grid">
                <Info label="Público" :value="modal.lead?.publico" />
                <Info label="Áreas (marcadas)" :value="joinArr(modal.lead?.areas)" wide />
                <Info label="Diferenciais" :value="modal.lead?.diferenciais" wide multiline />
              </div>
            </div>

            <div class="sec">
              <div class="sec-head">
                <i class="mdi mdi-web"></i>
                <div>
                  <div class="sec-title">Site</div>
                  <div class="sec-sub">Estrutura e captação</div>
                </div>
              </div>

              <div class="sec-grid">
                <Info label="Objetivo" :value="modal.lead?.objetivo" />
                <Info label="Páginas" :value="modal.lead?.paginas" />
                <Info label="Tom" :value="modal.lead?.tom" />
                <Info label="CTA" :value="modal.lead?.cta" />
                <Info label="Estrutura" :value="joinArr(modal.lead?.estrutura)" wide />
                <Info label="Funcionalidades" :value="joinArr(modal.lead?.features)" wide />
                <Info label="Integrações" :value="joinArr(modal.lead?.integracoes)" wide />
                <Info label="Domínio" :value="modal.lead?.dominio" />
                <Info label="Prazo" :value="modal.lead?.prazo" />
                <Info label="Tem referência?" :value="modal.lead?.temRef" />
                <Info label="Link de referência" :value="modal.lead?.refLink" wide />
              </div>
            </div>

            <div class="sec">
              <div class="sec-head">
                <i class="mdi mdi-map-marker-outline"></i>
                <div>
                  <div class="sec-title">Localização e unidades</div>
                  <div class="sec-sub">SEO local e unidades</div>
                </div>
              </div>

              <div class="sec-grid">
                <Info label="Cidade/UF principal" :value="modal.lead?.localPrincipal" />
                <Info label="Multi unidade?" :value="modal.lead?.multiUnidade" />
                <Info label="Outras unidades" :value="modal.lead?.outrasUnidades" wide multiline />
              </div>
            </div>

            <div class="sec">
              <div class="sec-head">
                <i class="mdi mdi-shield-lock-outline"></i>
                <div>
                  <div class="sec-title">Conformidade</div>
                  <div class="sec-sub">OAB e LGPD</div>
                </div>
              </div>

              <div class="sec-grid">
                <Info label="OAB" :value="modal.lead?.oab ? 'Sim' : 'Não'" />
                <Info label="LGPD" :value="modal.lead?.lgpd ? 'Sim' : 'Não'" />
              </div>
            </div>

            <div class="sec">
              <div class="sec-head">
                <i class="mdi mdi-folder-outline"></i>
                <div>
                  <div class="sec-title">Conteúdo</div>
                  <div class="sec-sub">Materiais disponíveis</div>
                </div>
              </div>

              <div class="sec-grid">
                <Info label="Identidade" :value="modal.lead?.identidade" />
                <Info label="Conteúdos" :value="joinArr(modal.lead?.conteudo)" wide />
                <Info label="Observações finais" :value="modal.lead?.obs" wide multiline />
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="modal-actions">
          <v-spacer />
          <v-btn variant="text" prepend-icon="mdi-close" @click="modal.on = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="confirmDelete.on" max-width="520">
      <v-card class="confirm-card">
        <v-card-title class="confirm-title">
          <i class="mdi mdi-alert-octagon-outline mr-2"></i>
          Confirmar exclusão
        </v-card-title>

        <v-card-text class="confirm-body">
          <p>
            Você tem certeza que deseja excluir este cadastro?
            <br />
            <b>Essa ação não pode ser desfeita.</b>
          </p>

          <div class="confirm-box">
            <div class="confirm-line">
              <span class="k">Nome:</span>
              <span class="v">{{ modal.lead?.nome || "—" }}</span>
            </div>
            <div class="confirm-line">
              <span class="k">Marca:</span>
              <span class="v">{{ modal.lead?.marca || "—" }}</span>
            </div>
            <div class="confirm-line">
              <span class="k">Criado em:</span>
              <span class="v">{{ modal.lead?.createdAtBR || "—" }}</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="confirm-actions">
          <v-btn variant="text" @click="confirmDelete.on = false">Cancelar</v-btn>
          <v-spacer />
          <v-btn
            color="error"
            variant="flat"
            :loading="adminDeleting"
            prepend-icon="mdi-delete-outline"
            @click="deleteLead"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snack -->
    <div class="snack" :class="{ on: snack.on }" role="status" aria-live="polite">
      <i class="mdi" :class="snack.icon" aria-hidden="true"></i>
      <span>{{ snack.text }}</span>
    </div>
  </section>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from "vue";

// ✅ Firestore
import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

/** Mini componente interno: campo do modal */
const Info = defineComponent({
  name: "Info",
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number, Boolean, null], default: "" },
    wide: { type: Boolean, default: false },
    multiline: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h("div", { class: ["info", props.wide && "info--wide"] }, [
        h("div", { class: "info-label" }, props.label),
        h(
          "div",
          { class: ["info-value", props.multiline && "info-value--multi"] },
          props.value && String(props.value).trim().length ? String(props.value) : "—"
        ),
      ]);
  },
});

/* ===== Snack ===== */
const snack = ref({ on: false, text: "", icon: "mdi-check-circle" });
let snackTimer = null;
function showSnack(text, icon = "mdi-check-circle") {
  snack.value.text = text;
  snack.value.icon = icon;
  snack.value.on = true;
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => (snack.value.on = false), 1800);
}

/* ===== Data ===== */
const leads = ref([]);
const loading = ref(false);
const lastUpdated = ref("");

const COLLECTION_NAME = "cadastros_clientes";

async function fetchLeads() {
  loading.value = true;
  try {
    const qy = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"), limit(200));
    const snap = await getDocs(qy);
    leads.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    lastUpdated.value = new Date().toLocaleString("pt-BR");
    showSnack("Leads carregados ✅", "mdi-check-circle");
  } catch (err) {
    console.error(err);
    showSnack("Falha ao carregar leads (verifique rules/índices).", "mdi-alert-circle");
  } finally {
    loading.value = false;
  }
}
onMounted(fetchLeads);

/* ===== UI Filters ===== */
const q = ref("");
const statusFilter = ref(null);

const statusOptions = ["novo", "em_andamento", "contatado", "fechado", "perdido"];
const sortMode = ref("Mais recentes");
const sortOptions = ["Mais recentes", "Mais antigos", "A-Z (Nome)", "A-Z (Marca)"];

/* ===== Admin options ===== */
const tipoOptions = ["Advogado(a)", "Escritório/Advocacia", "Outro"];

const filteredLeads = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  return (leads.value || []).filter((l) => {
    const byStatus = statusFilter.value ? (l.status || "novo") === statusFilter.value : true;
    if (!byStatus) return false;

    if (!term) return true;

    const hay = [
      l.nome,
      l.marca,
      l.email,
      l.whats,
      l.cidade,
      l.localPrincipal,
      l.createdAtBR,
      l.tipo,
      l.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(term);
  });
});

const sortedLeads = computed(() => {
  const arr = [...filteredLeads.value];
  switch (sortMode.value) {
    case "Mais antigos":
      return arr.reverse();
    case "A-Z (Nome)":
      return arr.sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"));
    case "A-Z (Marca)":
      return arr.sort((a, b) => String(a.marca || "").localeCompare(String(b.marca || ""), "pt-BR"));
    default:
      return arr;
  }
});

/* ===== Modal ===== */
const modal = reactive({ on: false, lead: null });

/** Admin state (edita tipo/status) */
const admin = reactive({ tipo: null, status: null });
const adminSaving = ref(false);
const adminDeleting = ref(false);

const confirmDelete = reactive({ on: false });

function openLead(lead) {
  modal.lead = lead;
  modal.on = true;
}

/** Quando abrir um lead, carregar valores atuais nos selects */
watch(
  () => modal.on,
  (on) => {
    if (!on) return;
    admin.tipo = modal.lead?.tipo || null;
    admin.status = modal.lead?.status || "novo";
  }
);

function joinArr(arr) {
  if (!Array.isArray(arr) || !arr.length) return "—";
  return arr.join(" • ");
}
function initials(name) {
  const s = String(name || "").trim();
  if (!s) return "L";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}
function statusDot(status) {
  const s = (status || "novo").toLowerCase();
  if (s === "fechado") return "ok";
  if (s === "contatado") return "info";
  if (s === "em_andamento") return "warn";
  if (s === "perdido") return "bad";
  return "new";
}
function vuetifyStatusColor(status) {
  const s = (status || "novo").toLowerCase();
  if (s === "fechado") return "success";
  if (s === "contatado") return "info";
  if (s === "em_andamento") return "warning";
  if (s === "perdido") return "error";
  return "primary";
}
function waLink(whats) {
  const digits = String(whats || "").replace(/\D/g, "");
  const phone = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${phone}`;
}

/* ===== Admin actions ===== */
function replaceLeadInList(updated) {
  const idx = leads.value.findIndex((x) => x.id === updated.id);
  if (idx >= 0) leads.value[idx] = { ...leads.value[idx], ...updated };
}

async function saveAdminEdits() {
  if (!modal.lead?.id) return;

  // nada mudou?
  const currentTipo = modal.lead?.tipo || null;
  const currentStatus = modal.lead?.status || "novo";
  if (admin.tipo === currentTipo && admin.status === currentStatus) {
    showSnack("Nada para salvar", "mdi-information-outline");
    return;
  }

  adminSaving.value = true;
  try {
    const refDoc = doc(db, COLLECTION_NAME, modal.lead.id);

    const updatePayload = {
      status: admin.status || "novo",
      tipo: admin.tipo || null,
      updatedAtBR: new Date().toLocaleString("pt-BR"),
    };

    await updateDoc(refDoc, updatePayload);

    // Atualiza UI (modal + lista)
    modal.lead = { ...modal.lead, ...updatePayload };
    replaceLeadInList({ id: modal.lead.id, ...updatePayload });

    showSnack("Atualizado com sucesso ✅", "mdi-check-circle");
  } catch (err) {
    console.error(err);
    showSnack("Falha ao salvar (verifique rules).", "mdi-alert-circle");
  } finally {
    adminSaving.value = false;
  }
}

async function deleteLead() {
  if (!modal.lead?.id) return;

  adminDeleting.value = true;
  try {
    const refDoc = doc(db, COLLECTION_NAME, modal.lead.id);
    await deleteDoc(refDoc);

    // remove da lista
    leads.value = leads.value.filter((x) => x.id !== modal.lead.id);

    showSnack("Cadastro excluído ✅", "mdi-delete-outline");

    // fecha dialogs
    confirmDelete.on = false;
    modal.on = false;
    modal.lead = null;
  } catch (err) {
    console.error(err);
    showSnack("Falha ao excluir (verifique rules).", "mdi-alert-circle");
  } finally {
    adminDeleting.value = false;
  }
}

/* ===== Copy JSON ===== */
async function copyLeadJson(lead) {
  try {
    const payload = JSON.stringify(lead || {}, null, 2);
    await navigator.clipboard.writeText(payload);
    showSnack("JSON copiado ✅", "mdi-content-copy");
  } catch {
    showSnack("Falha ao copiar", "mdi-alert-circle");
  }
}
</script>

<style scoped>
/* ========= Base / Background ========= */
.leads-root{
  min-height: 100vh;
  background:
    radial-gradient(1100px 600px at 20% 0%, rgba(96,165,250,.18), transparent 55%),
    radial-gradient(900px 600px at 80% 10%, rgba(167,139,250,.16), transparent 60%),
    radial-gradient(800px 500px at 50% 90%, rgba(34,211,238,.10), transparent 55%),
    linear-gradient(180deg, #0b1020 0%, #070a12 100%);
  color: rgba(255,255,255,.92);
  padding: 28px 18px 70px;
}

/* ========= HERO ========= */
.leads-hero{
  max-width: 1200px;
  margin: 0 auto 18px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}
.leads-hero::before{
  content:"";
  position:absolute; inset:-2px;
  background: radial-gradient(600px 200px at 20% 0%, rgba(255,255,255,.10), transparent 60%);
  pointer-events:none;
}
.hero-inner{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 14px;
  position: relative;
}
.hero-kicker{
  display:inline-flex;
  gap: 10px;
  align-items:center;
  font-size: 12px;
  letter-spacing: .14em;
  text-transform: uppercase;
  opacity: .86;
}
.hero-title{
  margin: 8px 0 6px;
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.1;
}
.hero-subtitle{
  margin: 0;
  opacity: .78;
  max-width: 720px;
}
.btn-glow{
  border-radius: 14px;
  box-shadow: 0 0 0 1px rgba(255,255,255,.12) inset, 0 12px 40px rgba(59,130,246,.12);
}

/* ========= Controls ========= */
.controls{
  display:grid;
  grid-template-columns: 1.6fr .7fr .7fr;
  gap: 12px;
  margin-top: 14px;
  position: relative;
}
.control{ border-radius: 14px; }
.meta{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
  position: relative;
}
.meta-chip{ border-radius: 999px; }

/* ========= Container / Grid ========= */
.leads-container{ max-width: 1200px; margin: 0 auto; }
.grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

/* ========= Card ========= */
.lead-card{
  position: relative;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.03);
  padding: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
  outline: none;
}
.lead-card:hover{
  transform: translateY(-2px);
  border-color: rgba(255,255,255,.16);
  background: rgba(255,255,255,.045);
}
.lead-card:focus-visible{ box-shadow: 0 0 0 3px rgba(59,130,246,.25); }

.card-glow{
  position:absolute; inset:-1px;
  background: radial-gradient(500px 200px at var(--mx, 40%) var(--my, 10%), rgba(59,130,246,.18), transparent 60%);
  opacity: .0;
  transition: opacity .18s ease;
  pointer-events:none;
}
.lead-card:hover .card-glow{ opacity: 1; }

.card-top{ display:flex; align-items:center; gap: 12px; }
.avatar{
  width: 44px; height: 44px;
  border-radius: 14px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  font-weight: 800;
}
.card-title{ flex: 1; min-width: 0; }
.name{
  font-weight: 800;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brand{
  opacity: .72;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status{ display:flex; align-items:center; gap: 8px; font-size: 12px; opacity: .9; }
.status-dot{ width: 10px; height: 10px; border-radius: 999px; box-shadow: 0 0 0 3px rgba(255,255,255,.04); }
.status-dot.new{ background: #60a5fa; }
.status-dot.ok{ background: #22c55e; }
.status-dot.info{ background: #38bdf8; }
.status-dot.warn{ background: #fbbf24; }
.status-dot.bad{ background: #ef4444; }

.card-body{ margin-top: 12px; display:flex; flex-direction: column; gap: 8px; }
.row{ display:flex; align-items:center; gap: 10px; opacity: .88; font-size: 13px; }
.row i{ opacity: .85; }
.truncate{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chips{ display:flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.chip{
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  display:inline-flex; gap: 6px; align-items:center;
}
.chip-more{ opacity: .75; }

.card-footer{ margin-top: 12px; display:flex; align-items:center; justify-content: space-between; opacity: .9; }
.date{ display:flex; gap: 8px; align-items:center; font-size: 12px; opacity: .75; }
.cta{ display:flex; gap: 6px; align-items:center; font-size: 12px; font-weight: 700; }

/* ========= Modal ========= */
.modal-card{ border-radius: 18px; overflow: hidden; background: rgba(10, 12, 18, .98); }
.modal-title{ display:flex; align-items:center; justify-content: space-between; gap: 12px; }
.title-left{ display:flex; align-items:center; gap: 12px; min-width: 0; }
.modal-avatar{
  width: 44px; height: 44px;
  border-radius: 14px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  font-weight: 800;
}
.t-wrap{ min-width: 0; }
.t-name{
  font-weight: 900;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.t-sub{ opacity: .72; font-size: 12px; display:flex; align-items:center; gap: 8px; }
.sep{ opacity: .5; }
.muted{ opacity: .85; }
.title-right{ display:flex; align-items:center; gap: 8px; }

.modal-body{ padding: 18px; }

/* ========= Admin Bar ========= */
.admin-bar{
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 14px;
}
.admin-title{
  display:flex;
  align-items:center;
  gap: 8px;
  font-weight: 900;
}
.admin-sub{ font-size: 12px; opacity: .72; margin-top: 4px; }
.admin-right{
  display:flex;
  gap: 10px;
  align-items:center;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.admin-field{
  min-width: 220px;
  border-radius: 14px;
}
.admin-btn{ border-radius: 14px; }

/* Quick actions */
.quick-actions{
  display:flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

/* Sections */
.sections{ display:flex; flex-direction: column; gap: 14px; }
.sec{
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 14px;
}
.sec-head{ display:flex; gap: 12px; align-items:flex-start; margin-bottom: 10px; }
.sec-head i{ font-size: 20px; opacity: .9; }
.sec-title{ font-weight: 900; margin: 0; }
.sec-sub{ opacity: .72; font-size: 12px; }
.sec-grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.info{
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  padding: 10px 12px;
}
.info--wide{ grid-column: 1 / -1; }
.info-label{
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .65;
  margin-bottom: 6px;
}
.info-value{ font-size: 13px; opacity: .92; word-break: break-word; }
.info-value--multi{ white-space: pre-wrap; line-height: 1.45; }

.modal-actions{ padding: 12px 14px; }

/* Confirm delete */
.confirm-card{
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 12, 18, .98);
}
.confirm-title{
  font-weight: 900;
  display:flex;
  align-items:center;
}
.confirm-body p{ margin: 0 0 12px; opacity: .9; }
.confirm-box{
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  padding: 12px;
  display:flex;
  flex-direction: column;
  gap: 8px;
}
.confirm-line{
  display:flex;
  justify-content: space-between;
  gap: 12px;
}
.confirm-line .k{ opacity: .7; font-size: 12px; }
.confirm-line .v{ font-weight: 700; font-size: 12px; }
.confirm-actions{ padding: 12px 14px; }

/* ========= Loading / Empty ========= */
.skeleton-grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.sk-card{ border-radius: 18px; overflow: hidden; }
.empty{
  max-width: 720px;
  margin: 26px auto 0;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 18px;
  padding: 22px;
  text-align: center;
}
.empty-ico{
  width: 62px; height: 62px;
  margin: 0 auto 10px;
  border-radius: 18px;
  display:flex; align-items:center; justify-content:center;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
}
.empty-ico i{ font-size: 26px; opacity: .9; }

/* ========= Snack ========= */
.snack{
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 9999;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(10,12,18,.92);
  box-shadow: 0 16px 50px rgba(0,0,0,.35);
  transform: translateY(10px);
  opacity: 0;
  pointer-events: none;
  transition: .18s ease;
}
.snack.on{ transform: translateY(0); opacity: 1; }
.snack i{ opacity: .92; }

/* ========= Responsive ========= */
@media (max-width: 1100px){
  .grid, .skeleton-grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px){
  .controls{ grid-template-columns: 1fr; }
  .hero-inner{ flex-direction: column; align-items: flex-start; }
  .admin-bar{ flex-direction: column; }
  .admin-right{ justify-content: flex-start; }
  .admin-field{ min-width: 100%; }
  .sec-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 560px){
  .grid, .skeleton-grid{ grid-template-columns: 1fr; }
  .leads-root{ padding: 18px 12px 64px; }
}
</style>
