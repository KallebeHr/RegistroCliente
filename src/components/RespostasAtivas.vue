<template>
  <section class="leads-root">
    <!-- Header -->
    <div class="leads-hero">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-kicker">
            <i class="mdi mdi-account-multiple-outline"></i>
            Leads • Cadastros • Financeiro
          </div>
          <h1 class="hero-title">Painel de Leads + Metas</h1>
          <p class="hero-subtitle">
            CRM leve com financeiro por lead (orçamento, faturamento, custos, lucro, margem) + metas semanais/mensais
            + projeção por probabilidade + despesas fixas (lucro real) + relatório por origem + export CSV.
            <span class="muted-hero">Financeiro por lead no Firestore • Metas/Despesas fixas no localStorage.</span>
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

          <v-btn
            class="btn-soft"
            variant="tonal"
            prepend-icon="mdi-file-delimited-outline"
            :disabled="loading || !filteredLeads.length"
            @click="downloadCsvFiltered()"
          >
            Exportar CSV
          </v-btn>

          <v-btn
            class="btn-soft"
            variant="tonal"
            prepend-icon="mdi-receipt-text-outline"
            @click="fixedUi.open = !fixedUi.open"
          >
            Despesas fixas
          </v-btn>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpis">
        <div class="kpi">
          <div class="kpi-top">
            <i class="mdi mdi-cash-multiple"></i>
            <span>Faturamento (filtrado)</span>
          </div>
          <div class="kpi-val">{{ money(totals.revenue) }}</div>
          <div class="kpi-sub">
            Ticket médio: <b>{{ money(totals.avgTicket) }}</b> • Conversão: <b>{{ pct(totals.conversionRate) }}</b>
          </div>
        </div>

        <div class="kpi">
          <div class="kpi-top">
            <i class="mdi mdi-chart-line"></i>
            <span>Lucro (filtrado)</span>
          </div>
          <div class="kpi-val">{{ money(totals.profit) }}</div>
          <div class="kpi-sub">
            Margem média: <b>{{ pct(totals.avgMargin) }}</b> • Custos: <b>{{ money(totals.costs) }}</b>
          </div>
        </div>

        <div class="kpi kpi--accent">
          <div class="kpi-top">
            <i class="mdi mdi-finance"></i>
            <span>Lucro real (com fixos)</span>
          </div>
          <div class="kpi-val" :class="{ good: totals.realProfit > 0, bad: totals.realProfit < 0 }">
            {{ money(totals.realProfit) }}
          </div>
          <div class="kpi-sub">
            Fixos no período: <b>{{ money(totals.fixedAllocated) }}</b> • Dias: <b>{{ totals.periodDays }}</b>
          </div>
        </div>

        <div class="kpi">
          <div class="kpi-top">
            <i class="mdi mdi-target"></i>
            <span>Projeção (pipeline)</span>
          </div>
          <div class="kpi-val">{{ money(totals.forecast) }}</div>
          <div class="kpi-sub">
            Orçamentos: <b>{{ money(totals.budget) }}</b> • Prob. média: <b>{{ pct(totals.avgProb) }}</b>
          </div>
        </div>
      </div>

      <!-- Despesas fixas (editor) -->
      <div v-if="fixedUi.open" class="fixed">
        <div class="fixed-head">
          <div class="fixed-title">
            <i class="mdi mdi-receipt-text-outline"></i>
            Despesas fixas (mensais)
          </div>
          <div class="fixed-sub">
            Essas despesas entram no <b>Lucro real</b>. É rateado automaticamente conforme o período do filtro.
          </div>
        </div>

        <div class="fixed-grid">
          <v-text-field
            v-model="fixedUi.tools"
            label="Ferramentas (Vercel, domínio, IA…) R$/mês"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-tools"
          />
          <v-text-field
            v-model="fixedUi.marketing"
            label="Marketing/Tráfego R$/mês"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-bullhorn-outline"
          />
          <v-text-field
            v-model="fixedUi.ops"
            label="Operacional (internet, energia, etc) R$/mês"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-office-building-cog-outline"
          />
          <v-text-field
            v-model="fixedUi.other"
            label="Outros fixos R$/mês"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-dots-horizontal-circle-outline"
          />
        </div>

        <div class="fixed-footer">
          <div class="fixed-total">
            Total fixo/mês: <b>{{ money(fixedTotalMonthly) }}</b> • Custo/dia (aprox): <b>{{ money(fixedDaily) }}</b>
          </div>
          <div class="fixed-actions">
            <v-btn variant="tonal" prepend-icon="mdi-backup-restore" @click="resetFixed()">
              Resetar
            </v-btn>
            <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save-outline" @click="saveFixed()">
              Salvar fixos
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Metas -->
      <div class="goals">
        <div class="goals-head">
          <div class="goals-title">
            <i class="mdi mdi-flag-checkered"></i>
            Metas
          </div>
          <div class="goals-actions">
            <v-btn variant="tonal" prepend-icon="mdi-pencil-outline" @click="goalsUi.open = !goalsUi.open">
              {{ goalsUi.open ? "Fechar" : "Editar metas" }}
            </v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-content-copy" @click="copyResumo()">
              Copiar resumo
            </v-btn>
          </div>
        </div>

        <div class="goals-grid">
          <div class="goal-card">
            <div class="goal-label">Semana • Faturamento</div>
            <div class="goal-val">
              {{ money(totals.revenueWeek) }}
              <span class="muted">/ {{ money(goals.weekRevenue) }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill" :style="{ width: pctClamp(totals.revenueWeek / (goals.weekRevenue || 1)) }"></div>
            </div>
            <div class="goal-sub">Falta: <b>{{ money(Math.max(0, goals.weekRevenue - totals.revenueWeek)) }}</b></div>
          </div>

          <div class="goal-card">
            <div class="goal-label">Mês • Faturamento</div>
            <div class="goal-val">
              {{ money(totals.revenueMonth) }}
              <span class="muted">/ {{ money(goals.monthRevenue) }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill" :style="{ width: pctClamp(totals.revenueMonth / (goals.monthRevenue || 1)) }"></div>
            </div>
            <div class="goal-sub">Falta: <b>{{ money(Math.max(0, goals.monthRevenue - totals.revenueMonth)) }}</b></div>
          </div>

          <div class="goal-card">
            <div class="goal-label">Semana • Lucro</div>
            <div class="goal-val">
              {{ money(totals.profitWeek) }}
              <span class="muted">/ {{ money(goals.weekProfit) }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill" :style="{ width: pctClamp(totals.profitWeek / (goals.weekProfit || 1)) }"></div>
            </div>
            <div class="goal-sub">Falta: <b>{{ money(Math.max(0, goals.weekProfit - totals.profitWeek)) }}</b></div>
          </div>

          <div class="goal-card">
            <div class="goal-label">Mês • Lucro</div>
            <div class="goal-val">
              {{ money(totals.profitMonth) }}
              <span class="muted">/ {{ money(goals.monthProfit) }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill" :style="{ width: pctClamp(totals.profitMonth / (goals.monthProfit || 1)) }"></div>
            </div>
            <div class="goal-sub">Falta: <b>{{ money(Math.max(0, goals.monthProfit - totals.profitMonth)) }}</b></div>
          </div>
        </div>

        <div v-if="goalsUi.open" class="goals-editor">
          <div class="editor-grid">
            <v-text-field
              v-model="goalsUi.weekRevenue"
              label="Meta semanal • Faturamento (R$)"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-cash"
            />
            <v-text-field
              v-model="goalsUi.monthRevenue"
              label="Meta mensal • Faturamento (R$)"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-cash"
            />
            <v-text-field
              v-model="goalsUi.weekProfit"
              label="Meta semanal • Lucro (R$)"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-chart-line"
            />
            <v-text-field
              v-model="goalsUi.monthProfit"
              label="Meta mensal • Lucro (R$)"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-chart-line"
            />
          </div>

          <div class="editor-actions">
            <v-btn variant="tonal" prepend-icon="mdi-backup-restore" @click="resetGoals()">Resetar</v-btn>
            <v-spacer />
            <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save-outline" @click="saveGoals()">
              Salvar metas
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Relatório por origem -->
      <div class="origin">
        <div class="origin-head">
          <div class="origin-title">
            <i class="mdi mdi-source-branch"></i>
            Relatório por origem
          </div>
          <div class="origin-sub">
            Agrupado por <b>fin.source</b> (se existir) senão <b>origin</b>. Baseado no filtro atual.
          </div>
        </div>

        <div class="origin-grid">
          <div v-for="row in originReportTop" :key="row.key" class="origin-card">
            <div class="origin-k">{{ row.key }}</div>
            <div class="origin-v">
              <span class="pill2"><i class="mdi mdi-account-multiple-outline"></i> {{ row.count }}</span>
              <span class="pill2"><i class="mdi mdi-cash-check"></i> {{ money(row.revenue) }}</span>
              <span class="pill2"><i class="mdi mdi-chart-line"></i> {{ money(row.profit) }}</span>
              <span class="pill2"><i class="mdi mdi-finance"></i> {{ money(row.forecast) }}</span>
            </div>
            <div class="origin-mini">
              Ticket: <b>{{ money(row.countClosed ? row.revenue / row.countClosed : 0) }}</b> • Fechados:
              <b>{{ row.countClosed }}</b>
            </div>
          </div>

          <div v-if="!originReportTop.length" class="origin-empty">
            Sem dados ainda. Preencha "Origem" no financeiro do lead (ou use origin).
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <v-text-field
          v-model="q"
          label="Buscar por nome, e-mail, WhatsApp, marca, cidade…"
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
          v-model="periodFilter"
          :items="periodOptions"
          label="Período"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-calendar-range"
          hide-details
          class="control"
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

      <div v-if="periodFilter === 'Custom'" class="controls controls--custom">
        <v-text-field
          v-model="customRange.start"
          type="date"
          label="Início"
          variant="outlined"
          density="comfortable"
          hide-details
          class="control"
          prepend-inner-icon="mdi-calendar"
        />
        <v-text-field
          v-model="customRange.end"
          type="date"
          label="Fim"
          variant="outlined"
          density="comfortable"
          hide-details
          class="control"
          prepend-inner-icon="mdi-calendar"
        />
        <v-btn variant="tonal" prepend-icon="mdi-filter-outline" @click="noop">Aplicado</v-btn>
      </div>

      <!-- Quick status chips -->
      <div class="status-chips">
        <button
          v-for="s in statusOptions"
          :key="s"
          type="button"
          class="sChip"
          :class="{ on: statusFilter === s }"
          @click="statusFilter = (statusFilter === s ? null : s)"
        >
          <span class="dot" :class="statusDot(s)"></span>
          {{ s }}
        </button>

        <button type="button" class="sChip ghost" :class="{ on: !statusFilter }" @click="statusFilter = null">
          <i class="mdi mdi-filter-off-outline"></i>
          limpar
        </button>
      </div>

      <div class="meta">
        <v-chip class="meta-chip" variant="tonal" color="primary">
          <i class="mdi mdi-database-outline mr-2"></i>
          Total: <b class="ml-1">{{ filteredLeads.length }}</b>
        </v-chip>

        <v-chip class="meta-chip" variant="tonal">
          <i class="mdi mdi-check-decagram-outline mr-2"></i>
          Fechados: <b class="ml-1">{{ closedLeads.length }}</b>
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
        <v-btn variant="tonal" prepend-icon="mdi-refresh" @click="fetchLeads">Recarregar</v-btn>
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
          @mousemove="onCardMove"
        >
          <div class="card-top">
            <div class="avatar">
              <span>{{ initials(lead.nome || lead.marca || 'Lead') }}</span>
            </div>

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
              <span class="truncate">{{ lead.localPrincipal || lead.cidade || "—" }}</span>
            </div>

            <div class="finance-mini">
              <div class="fChip">
                <i class="mdi mdi-cash"></i><span class="k">Orç.</span><b class="v">{{ money(leadNum(lead, "budget")) }}</b>
              </div>
              <div class="fChip">
                <i class="mdi mdi-cash-check"></i><span class="k">Fat.</span><b class="v">{{ money(leadNum(lead, "revenue")) }}</b>
              </div>
              <div class="fChip" :class="{ good: leadNum(lead, 'profit') > 0, bad: leadNum(lead, 'profit') < 0 }">
                <i class="mdi mdi-chart-line"></i><span class="k">Lucro</span><b class="v">{{ money(leadNum(lead, "profit")) }}</b>
              </div>
              <div class="fChip fChip--ghost">
                <i class="mdi mdi-percent-outline"></i><span class="k">Prob</span><b class="v">{{ pct(leadProb(lead)) }}</b>
              </div>
            </div>

            <div class="chips">
              <span v-if="lead.oab" class="chip chip-ok"><i class="mdi mdi-shield-check-outline"></i>OAB ok</span>
              <span v-if="lead.lgpd" class="chip chip-ok"><i class="mdi mdi-shield-lock-outline"></i>LGPD ok</span>
              <span v-if="lead.multiUnidade === 'Sim'" class="chip"><i class="mdi mdi-map-marker-multiple-outline"></i>Multi unidade</span>
            </div>

            <div class="chips">
              <span v-for="a in (lead.areas || []).slice(0, 3)" :key="a" class="chip">
                <i class="mdi" :class="areaIcon(a)"></i>{{ a }}
              </span>
              <span v-if="(lead.areas || []).length > 3" class="chip chip-more">
                +{{ (lead.areas || []).length - 3 }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="date">
              <i class="mdi mdi-calendar-clock-outline"></i>
              <span>{{ displayCreatedAt(lead) }}</span>
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
    <v-dialog v-model="modal.on" max-width="1120" scrollable>
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
              <div class="admin-sub">
                Tipo/status + financeiro. Em “Fechado”, preencha faturamento e custos para ter lucro correto.
              </div>
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

              <v-btn
                class="admin-btn"
                color="error"
                variant="tonal"
                :loading="adminDeleting"
                prepend-icon="mdi-delete-outline"
                @click="confirmDelete.on = true"
              >
                Excluir
              </v-btn>
            </div>
          </div>

          <div class="quick-actions">
            <v-btn variant="tonal" prepend-icon="mdi-content-copy" @click="copyLeadJson(modal.lead)">Copiar JSON</v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-table-arrow-right" @click="copyCsvOne(modal.lead)">Copiar CSV (1 lead)</v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-file-delimited-outline" @click="downloadCsvFiltered()">
              Exportar CSV (filtro)
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

          <div class="sections">
            <!-- FINANCEIRO -->
            <div class="sec sec--finance">
              <div class="sec-head">
                <i class="mdi mdi-cash-multiple"></i>
                <div>
                  <div class="sec-title">Financeiro</div>
                  <div class="sec-sub">Orçamento, faturamento, custos, lucro, projeção e origem</div>
                </div>
              </div>

              <div class="sec-grid">
                <v-text-field
                  v-model="finUi.budget"
                  label="Orçamento (R$)"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-cash"
                />
                <v-text-field
                  v-model="finUi.revenue"
                  label="Faturamento (R$)"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-cash-check"
                />
                <v-text-field
                  v-model="finUi.costs"
                  label="Custos (R$)"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-receipt-text-outline"
                />
                <v-text-field
                  v-model="finUi.prob"
                  label="Probabilidade (0–100)"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-percent-outline"
                />

                <div class="info info--wide fin-preview">
                  <div class="fin-preview-row">
                    <div class="pill">
                      <span class="k">Lucro</span>
                      <b class="v" :class="{ good: finCalc.profit > 0, bad: finCalc.profit < 0 }">{{ money(finCalc.profit) }}</b>
                    </div>
                    <div class="pill">
                      <span class="k">Margem</span>
                      <b class="v">{{ pct(finCalc.margin) }}</b>
                    </div>
                    <div class="pill">
                      <span class="k">Projeção</span>
                      <b class="v">{{ money(finCalc.forecast) }}</b>
                    </div>
                    <div class="pill">
                      <span class="k">Ticket</span>
                      <b class="v">{{ money(finCalc.revenue || finCalc.budget) }}</b>
                    </div>
                  </div>

                  <div class="fin-preview-actions">
                    <v-btn variant="tonal" prepend-icon="mdi-auto-fix" @click="smartFill()">Auto preencher</v-btn>
                    <v-btn
                      color="primary"
                      variant="flat"
                      :loading="finSaving"
                      prepend-icon="mdi-content-save-outline"
                      @click="saveFinanceEdits"
                    >
                      Salvar financeiro
                    </v-btn>
                  </div>

                  <div class="fin-hint">
                    <i class="mdi mdi-lightbulb-outline"></i>
                    Dica: “Origem” aqui aparece no relatório por origem (ex: IG, Indicação, Tráfego, Kwai, etc).
                  </div>
                </div>

                <v-text-field
                  v-model="finUi.nextContact"
                  type="date"
                  label="Próximo contato"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-calendar-clock-outline"
                />
                <v-text-field
                  v-model="finUi.source"
                  label="Origem (ex: IG, Indicação, Tráfego)"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-source-branch"
                />

                <v-textarea
                  v-model="finUi.notes"
                  label="Notas internas"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  auto-grow
                  rows="2"
                  prepend-inner-icon="mdi-notebook-edit-outline"
                  class="info--wide"
                />
              </div>
            </div>

            <!-- (resto do seu modal fica igual; mantive enxuto aqui) -->
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
                <Info label="Criado em" :value="displayCreatedAt(modal.lead)" />
                <Info label="Status" :value="modal.lead?.status || 'novo'" />
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
              <span class="v">{{ displayCreatedAt(modal.lead) }}</span>
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
import { db } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";

/** Mini componente interno */
const Info = defineComponent({
  name: "Info",
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number, Boolean, Object, null], default: "" },
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

/* ===== Money helpers ===== */
const fmtMoney = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
function money(n) {
  const v = Number(n || 0);
  return fmtMoney.format(isFinite(v) ? v : 0);
}
function pct(n) {
  const v = Number(n || 0);
  return `${Math.round(v * 100)}%`;
}
function pctClamp(x) {
  const v = Math.max(0, Math.min(1, Number(x || 0)));
  return `${Math.round(v * 100)}%`;
}
function parseBRNumber(input) {
  if (input == null) return 0;
  const s = String(input).trim();
  if (!s) return 0;
  const normalized = s
    .replace(/[^\d.,-]/g, "")
    .replace(/\./g, "__DOT__")
    .replace(/,/g, ".")
    .replace(/__DOT__/g, "");
  const n = Number(normalized);
  return isFinite(n) ? n : 0;
}
function clamp(n, min, max) {
  const v = Number(n);
  if (!isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

/* ===== Data ===== */
const leads = ref([]);
const loading = ref(false);
const lastUpdated = ref("");
const COLLECTION_NAME = "cadastros_clientes";

function toDateMaybe(v) {
  if (!v) return null;
  if (typeof v?.toDate === "function") return v.toDate();
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
function fmtBRDateTime(d) {
  if (!d) return "—";
  try {
    return d.toLocaleString("pt-BR");
  } catch {
    return "—";
  }
}
function displayCreatedAt(lead) {
  if (!lead) return "—";
  if (lead.createdAtBR && String(lead.createdAtBR).trim()) return lead.createdAtBR;
  const d = toDateMaybe(lead.createdAt);
  if (d) return fmtBRDateTime(d);
  const p = lead.createdAtParts;
  if (p && typeof p === "object" && p.dia && p.mes && p.ano) {
    const dd = String(p.dia).padStart(2, "0");
    const mm = String(p.mes).padStart(2, "0");
    const yy = String(p.ano);
    const hh = String(p.hora ?? 0).padStart(2, "0");
    const mi = String(p.minuto ?? 0).padStart(2, "0");
    const ss = String(p.segundo ?? 0).padStart(2, "0");
    return `${dd}/${mm}/${yy} ${hh}:${mi}:${ss}`;
  }
  return "—";
}
function sortTimeMs(lead) {
  const d = toDateMaybe(lead?.createdAt);
  if (d) return d.getTime();
  const s = String(lead?.createdAtBR || "").trim();
  if (s) {
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
      const dd = Number(m[1]);
      const mm = Number(m[2]);
      const yy = Number(m[3]);
      const hh = Number(m[4]);
      const mi = Number(m[5]);
      const ss = Number(m[6] || 0);
      return new Date(yy, mm - 1, dd, hh, mi, ss).getTime();
    }
  }
  const p = lead?.createdAtParts;
  if (p && typeof p === "object" && p.dia && p.mes && p.ano) {
    return new Date(p.ano, (p.mes || 1) - 1, p.dia || 1, p.hora || 0, p.minuto || 0, p.segundo || 0).getTime();
  }
  return 0;
}

async function fetchLeads() {
  loading.value = true;
  try {
    const qy = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"), limit(250));
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

/* ===== Filters ===== */
const q = ref("");
const statusFilter = ref(null);
const statusOptions = ["novo", "em_andamento", "contatado", "fechado", "perdido"];

const periodFilter = ref("Todos");
const periodOptions = ["Todos", "Hoje", "7 dias", "Este mês", "Este ano", "Custom"];
const customRange = reactive({ start: "", end: "" });

const sortMode = ref("Mais recentes");
const sortOptions = [
  "Mais recentes",
  "Mais antigos",
  "A-Z (Nome)",
  "A-Z (Marca)",
  "Maior faturamento",
  "Maior lucro",
  "Maior projeção",
];

const tipoOptions = ["Advogado(a)", "Escritório/Advocacia", "Outro"];

/* ===== Period helpers ===== */
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
function startOfWeek(d) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 dom
  const diff = (day === 0 ? -6 : 1 - day);
  x.setDate(x.getDate() + diff);
  return x;
}
function startOfMonth(d) { const x = startOfDay(d); x.setDate(1); return x; }
function startOfYear(d) { const x = startOfDay(d); x.setMonth(0,1); return x; }
function daysBetweenInclusive(a, b) {
  const A = startOfDay(a).getTime();
  const B = startOfDay(b).getTime();
  const diff = Math.round((B - A) / 86400000);
  return Math.max(1, diff + 1);
}
function inPeriod(lead) {
  if (periodFilter.value === "Todos") return true;
  const d = toDateMaybe(lead?.createdAt) || new Date(sortTimeMs(lead) || 0);
  if (!d || isNaN(d.getTime())) return false;
  const now = new Date();
  if (periodFilter.value === "Hoje") return d >= startOfDay(now) && d <= endOfDay(now);
  if (periodFilter.value === "7 dias") {
    const from = new Date(now); from.setDate(from.getDate() - 6);
    return d >= startOfDay(from) && d <= endOfDay(now);
  }
  if (periodFilter.value === "Este mês") return d >= startOfMonth(now) && d <= endOfDay(now);
  if (periodFilter.value === "Este ano") return d >= startOfYear(now) && d <= endOfDay(now);
  if (periodFilter.value === "Custom") {
    const s = customRange.start ? startOfDay(new Date(customRange.start)) : null;
    const e = customRange.end ? endOfDay(new Date(customRange.end)) : null;
    if (s && e) return d >= s && d <= e;
    if (s && !e) return d >= s;
    if (!s && e) return d <= e;
    return true;
  }
  return true;
}
function periodDaysNow() {
  const now = new Date();
  if (periodFilter.value === "Hoje") return 1;
  if (periodFilter.value === "7 dias") return 7;
  if (periodFilter.value === "Este mês") return daysBetweenInclusive(startOfMonth(now), now);
  if (periodFilter.value === "Este ano") return daysBetweenInclusive(startOfYear(now), now);
  if (periodFilter.value === "Custom") {
    const s = customRange.start ? new Date(customRange.start) : null;
    const e = customRange.end ? new Date(customRange.end) : null;
    if (s && e) return daysBetweenInclusive(s, e);
    return 30; // fallback
  }
  // Todos
  return 30; // fallback (pra rateio não virar absurdo)
}
const periodLabel = computed(() => (periodFilter.value === "Custom" ? "Custom" : periodFilter.value));

function noop(){}

/* ===== Finance getters ===== */
function leadNum(lead, key) {
  const fin = lead?.fin || {};
  const directMap = {
    budget: fin.budget ?? lead.orcamento ?? lead.budget,
    revenue: fin.revenue ?? lead.faturamento ?? lead.revenue,
    costs: fin.costs ?? lead.custos ?? lead.costs,
    profit: fin.profit,
  };
  let v = directMap[key];
  if (key === "profit") {
    const rev = parseBRNumber(directMap.revenue);
    const cst = parseBRNumber(directMap.costs);
    if (fin.profit != null && fin.profit !== "") v = fin.profit;
    else v = rev - cst;
  }
  return parseBRNumber(v);
}
function leadProb(lead) {
  const fin = lead?.fin || {};
  const p = fin.prob ?? lead.prob ?? lead.probabilidade;
  return clamp(parseBRNumber(p), 0, 100) / 100;
}
function leadForecast(lead) {
  const b = leadNum(lead, "budget");
  const r = leadNum(lead, "revenue");
  const base = r > 0 ? r : b;
  return base * leadProb(lead);
}
function leadMargin(lead) {
  const rev = leadNum(lead, "revenue");
  const prof = leadNum(lead, "profit");
  return rev > 0 ? prof / rev : 0;
}
function leadSource(lead) {
  const fin = lead?.fin || {};
  return String(fin.source || lead?.origin || "Sem origem").trim() || "Sem origem";
}

/* ===== Filtered / sorted ===== */
const filteredLeads = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  return (leads.value || []).filter((l) => {
    const byStatus = statusFilter.value ? (l.status || "novo") === statusFilter.value : true;
    if (!byStatus) return false;
    if (!inPeriod(l)) return false;
    if (!term) return true;

    const hay = [
      l.nome, l.marca, l.email, l.whats, l.cidade, l.localPrincipal,
      l.createdAtBR, l.updatedAtBR, l.tipo, l.status, l.publico,
      l.origin, l.fin?.source,
      Array.isArray(l.areas) ? l.areas.join(" ") : "",
    ].filter(Boolean).join(" ").toLowerCase();

    return hay.includes(term);
  });
});
const closedLeads = computed(() => (filteredLeads.value || []).filter((l) => (l.status || "novo") === "fechado"));

const sortedLeads = computed(() => {
  const arr = [...filteredLeads.value];
  switch (sortMode.value) {
    case "Mais antigos": return arr.sort((a,b) => sortTimeMs(a)-sortTimeMs(b));
    case "A-Z (Nome)": return arr.sort((a,b) => String(a.nome||"").localeCompare(String(b.nome||""), "pt-BR"));
    case "A-Z (Marca)": return arr.sort((a,b) => String(a.marca||"").localeCompare(String(b.marca||""), "pt-BR"));
    case "Maior faturamento": return arr.sort((a,b) => leadNum(b,"revenue")-leadNum(a,"revenue"));
    case "Maior lucro": return arr.sort((a,b) => leadNum(b,"profit")-leadNum(a,"profit"));
    case "Maior projeção": return arr.sort((a,b) => leadForecast(b)-leadForecast(a));
    default: return arr.sort((a,b) => sortTimeMs(b)-sortTimeMs(a));
  }
});

/* ===== Totals ===== */
function sumBy(list, fn) { return (list||[]).reduce((acc,x)=>acc+(Number(fn(x))||0),0); }
function avgBy(list, fn) {
  const arr = (list||[]).map(fn).filter((v)=>isFinite(v));
  return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
}
function countBy(list, fn) { return (list||[]).reduce((acc,x)=>acc+(fn(x)?1:0),0); }
function betweenCreated(lead, from, to) {
  const d = toDateMaybe(lead?.createdAt) || new Date(sortTimeMs(lead) || 0);
  if (!d || isNaN(d.getTime())) return false;
  return d >= from && d <= to;
}

/* ===== Fixos (localStorage) ===== */
const FIXED_KEY = "leads_fixed_v1";
const fixed = reactive({
  tools: 0,
  marketing: 0,
  ops: 0,
  other: 0,
});
const fixedUi = reactive({
  open: false,
  tools: "",
  marketing: "",
  ops: "",
  other: "",
});
function loadFixed() {
  try {
    const raw = localStorage.getItem(FIXED_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      fixed.tools = Number(obj.tools ?? fixed.tools);
      fixed.marketing = Number(obj.marketing ?? fixed.marketing);
      fixed.ops = Number(obj.ops ?? fixed.ops);
      fixed.other = Number(obj.other ?? fixed.other);
    }
  } catch {}
  syncFixedUi();
}
function syncFixedUi() {
  fixedUi.tools = String(fixed.tools || "");
  fixedUi.marketing = String(fixed.marketing || "");
  fixedUi.ops = String(fixed.ops || "");
  fixedUi.other = String(fixed.other || "");
}
function saveFixed() {
  fixed.tools = parseBRNumber(fixedUi.tools);
  fixed.marketing = parseBRNumber(fixedUi.marketing);
  fixed.ops = parseBRNumber(fixedUi.ops);
  fixed.other = parseBRNumber(fixedUi.other);
  localStorage.setItem(FIXED_KEY, JSON.stringify({ ...fixed }));
  showSnack("Despesas fixas salvas ✅", "mdi-receipt-text-outline");
  fixedUi.open = false;
}
function resetFixed() {
  fixed.tools = 0; fixed.marketing = 0; fixed.ops = 0; fixed.other = 0;
  localStorage.setItem(FIXED_KEY, JSON.stringify({ ...fixed }));
  syncFixedUi();
  showSnack("Fixos resetados", "mdi-backup-restore");
}
const fixedTotalMonthly = computed(() => (fixed.tools||0)+(fixed.marketing||0)+(fixed.ops||0)+(fixed.other||0));
const fixedDaily = computed(() => fixedTotalMonthly.value / 30);

/* ===== Totals computados (inclui lucro real) ===== */
const totals = computed(() => {
  const list = filteredLeads.value || [];
  const revenue = sumBy(list, (l) => leadNum(l, "revenue"));
  const costs = sumBy(list, (l) => leadNum(l, "costs"));
  const profit = sumBy(list, (l) => leadNum(l, "profit"));
  const budget = sumBy(list, (l) => leadNum(l, "budget"));
  const forecast = sumBy(list, (l) => leadForecast(l));
  const avgProb = avgBy(list, (l) => leadProb(l));
  const avgMargin = avgBy(list.filter((l) => leadNum(l, "revenue") > 0), (l) => leadMargin(l));
  const closed = countBy(list, (l) => (l.status || "novo") === "fechado");
  const conversionRate = list.length ? closed / list.length : 0;
  const avgTicket = closed ? revenue / closed : 0;

  const now = new Date();
  const wStart = startOfWeek(now);
  const mStart = startOfMonth(now);
  const todayEnd = endOfDay(now);

  const weekList = list.filter((l) => betweenCreated(l, wStart, todayEnd));
  const monthList = list.filter((l) => betweenCreated(l, mStart, todayEnd));

  const periodDays = periodDaysNow();
  const fixedAllocated = fixedDaily.value * periodDays;
  const realProfit = profit - fixedAllocated;

  return {
    revenue, costs, profit, budget, forecast, avgProb, avgMargin, conversionRate, avgTicket,
    revenueWeek: sumBy(weekList, (l) => leadNum(l, "revenue")),
    profitWeek: sumBy(weekList, (l) => leadNum(l, "profit")),
    revenueMonth: sumBy(monthList, (l) => leadNum(l, "revenue")),
    profitMonth: sumBy(monthList, (l) => leadNum(l, "profit")),
    periodDays,
    fixedAllocated,
    realProfit,
  };
});

/* ===== Origin report ===== */
const originReport = computed(() => {
  const map = new Map();
  for (const l of filteredLeads.value || []) {
    const key = leadSource(l);
    if (!map.has(key)) {
      map.set(key, { key, count: 0, revenue: 0, profit: 0, forecast: 0, countClosed: 0 });
    }
    const row = map.get(key);
    row.count += 1;
    row.revenue += leadNum(l, "revenue");
    row.profit += leadNum(l, "profit");
    row.forecast += leadForecast(l);
    if ((l.status || "novo") === "fechado") row.countClosed += 1;
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
});
const originReportTop = computed(() => originReport.value.slice(0, 8));

/* ===== Modal ===== */
const modal = reactive({ on: false, lead: null });
const admin = reactive({ tipo: null, status: null });
const adminSaving = ref(false);
const adminDeleting = ref(false);
const confirmDelete = reactive({ on: false });

const finUi = reactive({ budget: "", revenue: "", costs: "", prob: "", nextContact: "", notes: "", source: "" });
const finSaving = ref(false);

const finCalc = computed(() => {
  const budget = parseBRNumber(finUi.budget);
  const revenue = parseBRNumber(finUi.revenue);
  const costs = parseBRNumber(finUi.costs);
  const prob = clamp(parseBRNumber(finUi.prob), 0, 100) / 100;
  const base = revenue > 0 ? revenue : budget;
  const profit = (revenue || 0) - (costs || 0);
  const margin = revenue > 0 ? profit / revenue : 0;
  const forecast = base * prob;
  return { budget, revenue, costs, profit, margin, forecast, prob };
});

function openLead(lead) {
  modal.lead = lead;
  modal.on = true;
}

watch(
  () => modal.on,
  (on) => {
    if (!on) return;
    admin.tipo = modal.lead?.tipo || null;
    admin.status = modal.lead?.status || "novo";

    const fin = modal.lead?.fin || {};
    finUi.budget = String(fin.budget ?? modal.lead?.orcamento ?? modal.lead?.budget ?? "");
    finUi.revenue = String(fin.revenue ?? modal.lead?.faturamento ?? modal.lead?.revenue ?? "");
    finUi.costs = String(fin.costs ?? modal.lead?.custos ?? modal.lead?.costs ?? "");
    finUi.prob = String(fin.prob ?? modal.lead?.prob ?? modal.lead?.probabilidade ?? "");
    finUi.notes = String(fin.notes ?? modal.lead?.notes ?? "");
    finUi.source = String(fin.source ?? modal.lead?.origin ?? "");
    finUi.nextContact = fin.nextContactAt ? new Date(fin.nextContactAt).toISOString().slice(0, 10) : "";
  }
);

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
function areaIcon(a) {
  if (String(a).includes("Agro")) return "mdi-tractor";
  if (a === "Criminal") return "mdi-gavel";
  if (a === "Família") return "mdi-account-group";
  if (a === "Trabalhista") return "mdi-briefcase";
  if (a === "Tributário") return "mdi-cash";
  if (a === "Empresarial") return "mdi-domain";
  if (a === "Imobiliário") return "mdi-home-city";
  if (a === "Consumidor") return "mdi-cart";
  return "mdi-scale-balance";
}

/* ===== Admin actions ===== */
function replaceLeadInList(updated) {
  const idx = leads.value.findIndex((x) => x.id === updated.id);
  if (idx >= 0) leads.value[idx] = { ...leads.value[idx], ...updated };
}

async function saveAdminEdits() {
  if (!modal.lead?.id) return;
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

function smartFill() {
  if (!String(finUi.revenue || "").trim() && String(finUi.budget || "").trim()) finUi.revenue = finUi.budget;

  const st = (admin.status || modal.lead?.status || "novo").toLowerCase();
  const map = { novo: 15, em_andamento: 35, contatado: 55, fechado: 100, perdido: 0 };
  if (!String(finUi.prob || "").trim()) finUi.prob = String(map[st] ?? 25);

  if (st === "fechado" && !String(finUi.costs || "").trim()) {
    const r = parseBRNumber(finUi.revenue);
    if (r > 0) finUi.costs = String(Math.round(r * 0.1));
  }
  showSnack("Auto preencher aplicado ✨", "mdi-auto-fix");
}

async function saveFinanceEdits() {
  if (!modal.lead?.id) return;
  finSaving.value = true;
  try {
    const refDoc = doc(db, COLLECTION_NAME, modal.lead.id);
    const payloadFin = {
      budget: finCalc.value.budget,
      revenue: finCalc.value.revenue,
      costs: finCalc.value.costs,
      profit: finCalc.value.profit,
      prob: Math.round(finCalc.value.prob * 100),
      nextContactAt: finUi.nextContact ? new Date(finUi.nextContact).toISOString() : null,
      notes: String(finUi.notes || ""),
      source: String(finUi.source || ""),
      updatedAtBR: new Date().toLocaleString("pt-BR"),
    };

    await updateDoc(refDoc, {
      fin: payloadFin,
      origin: payloadFin.source || modal.lead?.origin || null,
      updatedAtBR: payloadFin.updatedAtBR,
    });

    const merged = {
      ...modal.lead,
      fin: { ...(modal.lead?.fin || {}), ...payloadFin },
      origin: payloadFin.source || modal.lead?.origin || null,
      updatedAtBR: payloadFin.updatedAtBR,
    };

    modal.lead = merged;
    replaceLeadInList({ id: modal.lead.id, ...merged });
    showSnack("Financeiro salvo ✅", "mdi-cash-check");
  } catch (err) {
    console.error(err);
    showSnack("Falha ao salvar financeiro (verifique rules).", "mdi-alert-circle");
  } finally {
    finSaving.value = false;
  }
}

async function deleteLead() {
  if (!modal.lead?.id) return;
  adminDeleting.value = true;
  try {
    const refDoc = doc(db, COLLECTION_NAME, modal.lead.id);
    await deleteDoc(refDoc);
    leads.value = leads.value.filter((x) => x.id !== modal.lead.id);
    showSnack("Cadastro excluído ✅", "mdi-delete-outline");
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

/* ===== Copy / CSV ===== */
async function copyLeadJson(lead) {
  try {
    await navigator.clipboard.writeText(JSON.stringify(lead || {}, null, 2));
    showSnack("JSON copiado ✅", "mdi-content-copy");
  } catch {
    showSnack("Falha ao copiar", "mdi-alert-circle");
  }
}
function csvEscape(v) {
  const s = String(v ?? "");
  const needs = /[",\n;]/.test(s);
  const out = s.replace(/"/g, '""');
  return needs ? `"${out}"` : out;
}
async function copyCsvOne(lead) {
  try {
    const fin = lead?.fin || {};
    const row = {
      id: lead?.id || "",
      nome: lead?.nome || "",
      marca: lead?.marca || "",
      status: lead?.status || "novo",
      createdAt: displayCreatedAt(lead),
      budget: leadNum(lead, "budget"),
      revenue: leadNum(lead, "revenue"),
      costs: leadNum(lead, "costs"),
      profit: leadNum(lead, "profit"),
      prob: Math.round(leadProb(lead) * 100),
      forecast: leadForecast(lead),
      source: fin.source ?? lead?.origin ?? "",
      nextContact: fin.nextContactAt ?? "",
    };
    const header = Object.keys(row).join(";");
    const line = Object.values(row).map(csvEscape).join(";");
    await navigator.clipboard.writeText(`${header}\n${line}`);
    showSnack("CSV copiado ✅", "mdi-table-arrow-right");
  } catch {
    showSnack("Falha ao copiar CSV", "mdi-alert-circle");
  }
}
function buildCsvFiltered() {
  const rows = (filteredLeads.value || []).map((lead) => {
    const fin = lead?.fin || {};
    return {
      id: lead?.id || "",
      nome: lead?.nome || "",
      marca: lead?.marca || "",
      email: lead?.email || "",
      whats: lead?.whats || "",
      cidade: lead?.cidade || "",
      localPrincipal: lead?.localPrincipal || "",
      status: lead?.status || "novo",
      tipo: lead?.tipo || "",
      createdAt: displayCreatedAt(lead),
      budget: leadNum(lead, "budget"),
      revenue: leadNum(lead, "revenue"),
      costs: leadNum(lead, "costs"),
      profit: leadNum(lead, "profit"),
      margin: leadMargin(lead),
      prob: Math.round(leadProb(lead) * 100),
      forecast: leadForecast(lead),
      source: fin.source ?? lead?.origin ?? "",
      nextContactAt: fin.nextContactAt ?? "",
      notes: fin.notes ?? "",
    };
  });

  const header = Object.keys(rows[0] || {
    id:"",nome:"",marca:"",email:"",whats:"",cidade:"",localPrincipal:"",
    status:"",tipo:"",createdAt:"",budget:"",revenue:"",costs:"",profit:"",
    margin:"",prob:"",forecast:"",source:"",nextContactAt:"",notes:""
  }).join(";");

  const lines = rows.map((r) => Object.values(r).map(csvEscape).join(";"));
  return [header, ...lines].join("\n");
}
function downloadFile(filename, content, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function downloadCsvFiltered() {
  if (!filteredLeads.value.length) return;
  const csv = buildCsvFiltered();
  const name = `leads_${String(periodLabel.value).replace(/\s+/g,"_").toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`;
  downloadFile(name, csv);
  showSnack("CSV exportado ✅", "mdi-file-delimited-outline");
}

/* ===== Card glow ===== */
function onCardMove(e) {
  const el = e.currentTarget;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / r.width) * 100;
  const my = ((e.clientY - r.top) / r.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

/* ===== Goals ===== */
const GOALS_KEY = "leads_goals_v1";
const goals = reactive({ weekRevenue: 1500, monthRevenue: 6000, weekProfit: 800, monthProfit: 3000 });
const goalsUi = reactive({ open: false, weekRevenue: "", monthRevenue: "", weekProfit: "", monthProfit: "" });

function loadGoals() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      goals.weekRevenue = Number(obj.weekRevenue ?? goals.weekRevenue);
      goals.monthRevenue = Number(obj.monthRevenue ?? goals.monthRevenue);
      goals.weekProfit = Number(obj.weekProfit ?? goals.weekProfit);
      goals.monthProfit = Number(obj.monthProfit ?? goals.monthProfit);
    }
  } catch {}
  syncGoalsUi();
}
function syncGoalsUi() {
  goalsUi.weekRevenue = String(goals.weekRevenue);
  goalsUi.monthRevenue = String(goals.monthRevenue);
  goalsUi.weekProfit = String(goals.weekProfit);
  goalsUi.monthProfit = String(goals.monthProfit);
}
function saveGoals() {
  goals.weekRevenue = parseBRNumber(goalsUi.weekRevenue);
  goals.monthRevenue = parseBRNumber(goalsUi.monthRevenue);
  goals.weekProfit = parseBRNumber(goalsUi.weekProfit);
  goals.monthProfit = parseBRNumber(goalsUi.monthProfit);
  localStorage.setItem(GOALS_KEY, JSON.stringify({ ...goals }));
  showSnack("Metas salvas ✅", "mdi-flag-checkered");
  goalsUi.open = false;
}
function resetGoals() {
  goals.weekRevenue = 1500;
  goals.monthRevenue = 6000;
  goals.weekProfit = 800;
  goals.monthProfit = 3000;
  localStorage.setItem(GOALS_KEY, JSON.stringify({ ...goals }));
  syncGoalsUi();
  showSnack("Metas resetadas", "mdi-backup-restore");
}
async function copyResumo() {
  try {
    const t = totals.value;
    const text =
      `RESUMO (${periodLabel.value})\n` +
      `• Leads: ${filteredLeads.value.length} | Fechados: ${closedLeads.value.length}\n` +
      `• Faturamento: ${money(t.revenue)} | Lucro: ${money(t.profit)} | Fixos: ${money(t.fixedAllocated)} | Lucro REAL: ${money(t.realProfit)}\n` +
      `• Projeção: ${money(t.forecast)} | Prob. média: ${pct(t.avgProb)}\n` +
      `• Semana: Fat ${money(t.revenueWeek)} / ${money(goals.weekRevenue)} | Lucro ${money(t.profitWeek)} / ${money(goals.weekProfit)}\n` +
      `• Mês:    Fat ${money(t.revenueMonth)} / ${money(goals.monthRevenue)} | Lucro ${money(t.profitMonth)} / ${money(goals.monthProfit)}\n`;
    await navigator.clipboard.writeText(text);
    showSnack("Resumo copiado ✅", "mdi-content-copy");
  } catch {
    showSnack("Falha ao copiar resumo", "mdi-alert-circle");
  }
}

/* ===== Misc ===== */
function areaDummy(){}

/* ===== Lifecycle ===== */
onMounted(() => {
  loadGoals();
  loadFixed();
  fetchLeads();
});
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
  max-width: 900px;
}
.muted-hero{
  display: inline-block;
  margin-left: 6px;
  opacity: .75;
  font-size: 12px;
}
.hero-right{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.btn-glow{
  border-radius: 14px;
  box-shadow: 0 0 0 1px rgba(255,255,255,.12) inset, 0 12px 40px rgba(59,130,246,.12);
}
.btn-soft{ border-radius: 14px; }

/* ========= KPI ========= */
.kpis{
  margin-top: 14px;
  display:grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  position: relative;
}
.kpi{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 12px;
}
.kpi--accent{
  border-color: rgba(34,211,238,.25);
  background: linear-gradient(180deg, rgba(34,211,238,.08), rgba(255,255,255,.02));
}
.kpi-top{
  display:flex;
  align-items:center;
  gap: 8px;
  opacity: .86;
  font-size: 12px;
}
.kpi-val{
  font-weight: 950;
  margin-top: 6px;
  font-size: 20px;
  letter-spacing: .2px;
}
.kpi-val.good{ color: rgba(34,197,94,.95); }
.kpi-val.bad{ color: rgba(239,68,68,.95); }
.kpi-sub{
  margin-top: 6px;
  opacity: .75;
  font-size: 12px;
}

/* ========= Fixos ========= */
.fixed{
  margin-top: 12px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 12px;
}
.fixed-head{ display:flex; flex-direction: column; gap: 4px; }
.fixed-title{ display:flex; align-items:center; gap: 8px; font-weight: 950; }
.fixed-sub{ opacity: .75; font-size: 12px; }
.fixed-grid{
  margin-top: 10px;
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.fixed-footer{
  margin-top: 10px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.fixed-total{ opacity: .8; font-size: 12px; }
.fixed-actions{ display:flex; gap: 10px; flex-wrap: wrap; }

/* ========= Goals ========= */
.goals{
  margin-top: 12px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 12px;
}
.goals-head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}
.goals-title{ display:flex; align-items:center; gap: 8px; font-weight: 950; }
.goals-actions{ display:flex; gap: 10px; flex-wrap: wrap; }
.goals-grid{
  margin-top: 10px;
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.goal-card{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.02);
  border-radius: 14px;
  padding: 10px;
}
.goal-label{ font-size: 12px; opacity: .8; }
.goal-val{ margin-top: 6px; font-weight: 950; letter-spacing: .2px; }
.goal-val .muted{ opacity: .65; font-weight: 700; margin-left: 6px; }
.bar{
  margin-top: 8px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  overflow: hidden;
}
.bar-fill{
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(59,130,246,.85), rgba(34,211,238,.75));
}
.goal-sub{ margin-top: 8px; font-size: 12px; opacity: .75; }
.goals-editor{
  margin-top: 12px;
  border-top: 1px dashed rgba(255,255,255,.12);
  padding-top: 12px;
}
.editor-grid{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.editor-actions{
  margin-top: 10px;
  display:flex;
  align-items:center;
  gap: 10px;
}

/* ========= Origin ========= */
.origin{
  margin-top: 12px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 12px;
}
.origin-head{ display:flex; flex-direction: column; gap: 4px; }
.origin-title{ display:flex; gap: 8px; align-items:center; font-weight: 950; }
.origin-sub{ opacity: .75; font-size: 12px; }
.origin-grid{
  margin-top: 10px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.origin-card{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.02);
  border-radius: 14px;
  padding: 10px;
}
.origin-k{ font-weight: 950; }
.origin-v{
  margin-top: 8px;
  display:flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pill2{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  display:inline-flex;
  gap: 8px;
  align-items:center;
}
.origin-mini{ margin-top: 8px; opacity: .75; font-size: 12px; }
.origin-empty{
  grid-column: 1 / -1;
  opacity: .75;
  font-size: 12px;
  border: 1px dashed rgba(255,255,255,.14);
  border-radius: 14px;
  padding: 12px;
}

/* ========= Controls ========= */
.controls{
  display:grid;
  grid-template-columns: 1.4fr .7fr .7fr .7fr;
  gap: 12px;
  margin-top: 14px;
  position: relative;
}
.controls--custom{ grid-template-columns: .6fr .6fr auto; }
.control{ border-radius: 14px; }

.status-chips{
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  position: relative;
}
.sChip{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  color: rgba(255,255,255,.88);
  border-radius: 999px;
  padding: 8px 10px;
  cursor: pointer;
  display:flex;
  align-items:center;
  gap: 8px;
  font-size: 12px;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.sChip:hover{ transform: translateY(-1px); background: rgba(255,255,255,.05); }
.sChip.on{ background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.18); }
.sChip.ghost{ opacity: .85; }
.sChip .dot{ width: 10px; height: 10px; border-radius: 999px; box-shadow: 0 0 0 3px rgba(255,255,255,.04); }
.sChip .dot.new{ background: #60a5fa; }
.sChip .dot.ok{ background: #22c55e; }
.sChip .dot.info{ background: #38bdf8; }
.sChip .dot.warn{ background: #fbbf24; }
.sChip .dot.bad{ background: #ef4444; }

.meta{ display:flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; position: relative; }
.meta-chip{ border-radius: 999px; }

/* ========= Grid ========= */
.leads-container{ max-width: 1200px; margin: 0 auto; }
.grid{ display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }

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
.lead-card:hover{ transform: translateY(-2px); border-color: rgba(255,255,255,.16); background: rgba(255,255,255,.045); }
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
.name{ font-weight: 800; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.brand{ opacity: .72; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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

.finance-mini{ display:flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.fChip{
  display:inline-flex; align-items:center; gap: 8px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
}
.fChip .k{ opacity: .72; }
.fChip .v{ font-weight: 900; }
.fChip.good{ border-color: rgba(34,197,94,.28); background: rgba(34,197,94,.08); }
.fChip.bad{ border-color: rgba(239,68,68,.28); background: rgba(239,68,68,.08); }
.fChip--ghost{ opacity: .85; }

.chips{ display:flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.chip{
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  display:inline-flex; gap: 6px; align-items:center;
}
.chip i{ opacity: .9; }
.chip-more{ opacity: .75; }
.chip-ok{ border-color: rgba(34,197,94,.28); background: rgba(34,197,94,.10); }

.card-footer{ margin-top: 12px; display:flex; align-items:center; justify-content: space-between; opacity: .9; }
.date{ display:flex; gap: 8px; align-items:center; font-size: 12px; opacity: .75; }
.cta{ display:flex; gap: 6px; align-items:center; font-size: 12px; font-weight: 700; }

/* ========= Modal (mantive base do seu) ========= */
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
.t-name{ font-weight: 900; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t-sub{ opacity: .72; font-size: 12px; display:flex; align-items:center; gap: 8px; }
.sep{ opacity: .5; }
.muted{ opacity: .85; }
.title-right{ display:flex; align-items:center; gap: 8px; }

.modal-body{ padding: 18px; }

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
.admin-title{ display:flex; align-items:center; gap: 8px; font-weight: 900; }
.admin-sub{ font-size: 12px; opacity: .72; margin-top: 4px; }
.admin-right{ display:flex; gap: 10px; align-items:center; flex-wrap: wrap; justify-content: flex-end; }
.admin-field{ min-width: 220px; border-radius: 14px; }
.admin-btn{ border-radius: 14px; }

.quick-actions{ display:flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }

.sections{ display:flex; flex-direction: column; gap: 14px; }
.sec{
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  border-radius: 16px;
  padding: 14px;
}
.sec--finance{
  border-color: rgba(59,130,246,.22);
  background: linear-gradient(180deg, rgba(59,130,246,.06), rgba(255,255,255,.02));
}
.sec-head{ display:flex; gap: 12px; align-items:flex-start; margin-bottom: 10px; }
.sec-head i{ font-size: 20px; opacity: .9; }
.sec-title{ font-weight: 900; margin: 0; }
.sec-sub{ opacity: .72; font-size: 12px; }
.sec-grid{ display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }

.info{
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  padding: 10px 12px;
}
.info--wide{ grid-column: 1 / -1; }
.info-label{ font-size: 11px; letter-spacing: .08em; text-transform: uppercase; opacity: .65; margin-bottom: 6px; }
.info-value{ font-size: 13px; opacity: .92; word-break: break-word; }
.info-value--multi{ white-space: pre-wrap; line-height: 1.45; }

.fin-preview{ padding: 12px; }
.fin-preview-row{ display:flex; flex-wrap: wrap; gap: 10px; }
.pill{
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
  padding: 8px 10px;
  display:flex;
  gap: 8px;
  align-items:center;
  font-size: 12px;
}
.pill .k{ opacity: .7; }
.pill .v{ font-weight: 950; }
.pill .v.good{ color: rgba(34,197,94,.95); }
.pill .v.bad{ color: rgba(239,68,68,.95); }
.fin-preview-actions{ margin-top: 10px; display:flex; gap: 10px; flex-wrap: wrap; align-items:center; }
.fin-hint{ margin-top: 10px; display:flex; gap: 8px; align-items:flex-start; opacity: .75; font-size: 12px; }

.modal-actions{ padding: 12px 14px; }

.confirm-card{ border-radius: 18px; overflow: hidden; background: rgba(10, 12, 18, .98); }
.confirm-title{ font-weight: 900; display:flex; align-items:center; }
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
.confirm-line{ display:flex; justify-content: space-between; gap: 12px; }
.confirm-line .k{ opacity: .7; font-size: 12px; }
.confirm-line .v{ font-weight: 700; font-size: 12px; }
.confirm-actions{ padding: 12px 14px; }

/* ========= Loading / Empty ========= */
.skeleton-grid{ display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
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
  .kpis{ grid-template-columns: 1fr 1fr; }
  .goals-grid{ grid-template-columns: 1fr 1fr; }
  .editor-grid{ grid-template-columns: 1fr 1fr; }
  .controls{ grid-template-columns: 1fr 1fr; }
  .fixed-grid{ grid-template-columns: 1fr 1fr; }
  .origin-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 900px){
  .controls{ grid-template-columns: 1fr; }
  .hero-inner{ flex-direction: column; align-items: flex-start; }
  .admin-bar{ flex-direction: column; }
  .admin-right{ justify-content: flex-start; }
  .admin-field{ min-width: 100%; }
  .sec-grid{ grid-template-columns: 1fr; }
  .goals-grid{ grid-template-columns: 1fr; }
  .editor-grid{ grid-template-columns: 1fr; }
  .fixed-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 560px){
  .grid, .skeleton-grid{ grid-template-columns: 1fr; }
  .leads-root{ padding: 18px 12px 64px; }
}
</style>
