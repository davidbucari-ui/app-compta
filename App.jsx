import { useState } from "react";

const palette = {
  sage: "#7C9A7E", sageDark: "#5A7A5C", sageLight: "#A8C4AA", sagePale: "#D4E8D5",
  cream: "#F5F0E8", creamDark: "#EBE3D0", creamDeep: "#D9CDB8",
  terracotta: "#C4714A", terracottaDark: "#A85A36", terracottaLight: "#D9906F", terracottaPale: "#F0D4C4",
  brown: "#5C3D2E", text: "#2C1F17", textMid: "#6B4F3A", textLight: "#9C7B65", white: "#FDFAF6",
};

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];

const initialData = {
  revenus: [
    { id: 1, date: "2026-05-03", label: "Formation React — Client A", categorie: "Formation", montant: 2400, statut: "payé" },
    { id: 2, date: "2026-05-10", label: "Audit technique — Client B", categorie: "Tech", montant: 1800, statut: "payé" },
    { id: 3, date: "2026-05-18", label: "Formation UX — Client C", categorie: "Formation", montant: 3200, statut: "en attente" },
    { id: 4, date: "2026-05-25", label: "Développement app — Client D", categorie: "Tech", montant: 4500, statut: "en attente" },
  ],
  depenses: [
    { id: 1, date: "2026-05-02", label: "Abonnement Figma", categorie: "Tech", montant: 45, statut: "payé" },
    { id: 2, date: "2026-05-05", label: "Loyer bureau partagé", categorie: "Frais généraux", montant: 380, statut: "payé" },
    { id: 3, date: "2026-05-08", label: "Matériel pédagogique", categorie: "Formation", montant: 120, statut: "payé" },
    { id: 4, date: "2026-05-15", label: "Comptable mensuel", categorie: "Frais généraux", montant: 200, statut: "payé" },
    { id: 5, date: "2026-05-20", label: "Hébergement serveur", categorie: "Tech", montant: 89, statut: "payé" },
    { id: 6, date: "2026-05-28", label: "Assurance RC Pro", categorie: "Frais généraux", montant: 160, statut: "en attente" },
  ],
  factures: [
    { id: "F-2026-001", date: "2026-05-03", client: "Client A", label: "Formation React avancé", montant: 2400, echeance: "2026-06-03", statut: "payée" },
    { id: "F-2026-002", date: "2026-05-10", client: "Client B", label: "Audit technique sécurité", montant: 1800, echeance: "2026-06-10", statut: "payée" },
    { id: "F-2026-003", date: "2026-05-18", client: "Client C", label: "Formation UX Research", montant: 3200, echeance: "2026-06-18", statut: "envoyée" },
    { id: "F-2026-004", date: "2026-05-25", client: "Client D", label: "Développement app mobile", montant: 4500, echeance: "2026-06-25", statut: "brouillon" },
  ],
  budget: {
    revenus: {
      Formation: [1500,1500,2000,2000,2000,2500,2500,2500,3000,3000,3000,3000],
      Tech:      [1500,1500,2000,2000,2000,2500,2500,2500,3000,3000,3000,3000],
    },
    depenses: {
      "Frais généraux": [570,570,570,570,570,570,570,570,570,570,570,570],
      Tech:             [140,140,140,140,140,140,140,140,140,140,140,140],
      Formation:        [120,120,120,120,120,120,120,120,120,120,120,120],
    },
  },
};

const categories = ["Formation", "Tech", "Frais généraux"];
const categorieColors = { Formation: palette.sage, Tech: palette.terracotta, "Frais généraux": palette.textMid };
const statutColors = {
  payé: { bg: palette.sagePale, text: palette.sageDark },
  "en attente": { bg: palette.terracottaPale, text: palette.terracottaDark },
  payée: { bg: palette.sagePale, text: palette.sageDark },
  envoyée: { bg: "#E8EFF8", text: "#3A5A8C" },
  brouillon: { bg: palette.creamDark, text: palette.textMid },
};

function fmt(n) { return Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" }); }

function Tag({ statut }) {
  const c = statutColors[statut] || { bg: "#eee", text: "#555" };
  return <span style={{ background: c.bg, color: c.text, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{statut}</span>;
}

function CatBadge({ cat }) {
  const color = categorieColors[cat] || palette.textLight;
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{cat}</span>;
}

function KPI({ label, value, sub, accent }) {
  return (
    <div style={{ background: palette.white, border: `1.5px solid ${palette.creamDark}`, borderRadius: 16, padding: "22px 26px", position: "relative", overflow: "hidden", flex: 1, minWidth: 160 }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: accent, borderRadius: "16px 0 0 16px" }} />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: palette.textLight, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: palette.text, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: palette.textLight, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, height = 120 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", background: d.color, height: Math.max(4, (d.value / max) * (height - 24)), borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
          <div style={{ fontSize: 9, color: palette.textLight, textAlign: "center", lineHeight: 1.2 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  let offset = 0;
  const r = 42, cx = 60, cy = 60, circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={palette.creamDark} strokeWidth={14} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circumference;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={14} strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset} style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }} />;
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill={palette.text}>{total > 0 ? Math.round(segments[0]?.value / total * 100) + "%" : "–"}</text>
    </svg>
  );
}

const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid #D9CDB8`, background: "#FDFAF6", fontSize: 13, color: "#2C1F17", outline: "none", boxSizing: "border-box" };
const btnStyle = { padding: "11px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em" };
const actionBtn = (color) => ({ background: color + "18", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" });

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9C7B65", display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

function Section({ title, accent, children, onAdd, btnLabel }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C7B65", fontWeight: 700 }}>Gestion</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#2C1F17", margin: "4px 0 0" }}>{title}</h1>
        </div>
        {onAdd && <button onClick={onAdd} style={{ background: accent, color: "#FDFAF6", border: "none", cursor: "pointer", padding: "11px 22px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>+ {btnLabel || "Ajouter"}</button>}
      </div>
      <div style={{ background: "#FDFAF6", borderRadius: 16, padding: "8px 28px 20px", border: "1.5px solid #D9CDB8" }}>{children}</div>
    </div>
  );
}

function EntryRow({ entry, sign, color, onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #EBE3D0" }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: categorieColors[entry.categorie] || "#aaa", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1F17", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label}</div>
        <div style={{ fontSize: 11, color: "#9C7B65", marginTop: 3 }}>{entry.date} · <CatBadge cat={entry.categorie} /></div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color }}>{sign}{fmt(entry.montant)}</div>
        <Tag statut={entry.statut} />
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onEdit} style={actionBtn("#7C9A7E")}>✏️ Modifier</button>
          <button onClick={onDelete} style={actionBtn("#C4714A")}>🗑 Supprimer</button>
        </div>
      </div>
    </div>
  );
}

function SummaryBar({ label, total, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18, marginTop: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9C7B65" }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Playfair Display', serif" }}>{fmt(total)}</span>
    </div>
  );
}

// ── BUDGET PRÉVISIONNEL ──────────────────────────────────────────────
function BudgetTab({ data, setData }) {
  const [moisActif, setMoisActif] = useState(4); // Mai = index 4
  const [editBudget, setEditBudget] = useState(null);
  const [editVal, setEditVal] = useState("");

  const budget = data.budget;

  // Totaux prévisionnels annuels
  const totalRevPrev = Object.values(budget.revenus).flat().reduce((a, b) => a + b, 0);
  const totalDepPrev = Object.values(budget.depenses).flat().reduce((a, b) => a + b, 0);
  const beneficePrev = totalRevPrev - totalDepPrev;

  // Réel (toutes les données saisies)
  const totalRevReel = data.revenus.reduce((a, b) => a + b.montant, 0);
  const totalDepReel = data.depenses.reduce((a, b) => a + b.montant, 0);

  // Par mois prévisionnel
  const revMoisPrev = MOIS.map((_, i) => Object.values(budget.revenus).reduce((a, cat) => a + cat[i], 0));
  const depMoisPrev = MOIS.map((_, i) => Object.values(budget.depenses).reduce((a, cat) => a + cat[i], 0));
  const tresoMois = revMoisPrev.map((r, i) => r - depMoisPrev[i]);

  // Seuil de rentabilité mensuel moyen
  const seuilMensuel = totalDepPrev / 12;

  const saveEdit = () => {
    if (!editBudget) return;
    const { type, cat, mois } = editBudget;
    const newVal = parseFloat(editVal) || 0;
    setData(prev => {
      const newBudget = { ...prev.sbudget, ...prev.budget };
      const arr = [...newBudget[type][cat]];
      arr[mois] = newVal;
      return { ...prev, budget: { ...prev.budget, [type]: { ...prev.budget[type], [cat]: arr } } };
    });
    setEditBudget(null);
    setEditVal("");
  };

  const maxBar = Math.max(...revMoisPrev, ...depMoisPrev, 1);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: palette.textLight, fontWeight: 700 }}>Prévisionnel</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: palette.text, margin: "4px 0 0" }}>Business Plan 2026</h1>
      </div>

      {/* KPIs annuels */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <KPI label="CA prévisionnel" value={fmt(totalRevPrev)} sub="Objectif annuel" accent={palette.sage} />
        <KPI label="Charges prévues" value={fmt(totalDepPrev)} sub="Annuel" accent={palette.terracotta} />
        <KPI label="Bénéfice prévu" value={fmt(beneficePrev)} sub="Avant impôts" accent={beneficePrev > 0 ? palette.sage : palette.terracotta} />
        <KPI label="Seuil de rentabilité" value={fmt(seuilMensuel)} sub="Par mois" accent={palette.textMid} />
      </div>

      {/* Comparaison prévu vs réel */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Prévu vs Réel — Revenus</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: palette.textLight, marginBottom: 4 }}>Prévu (annuel)</div>
              <div style={{ height: 10, background: palette.sagePale, borderRadius: 5 }}>
                <div style={{ height: "100%", width: "100%", background: palette.sage, borderRadius: 5 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.sageDark, marginTop: 4 }}>{fmt(totalRevPrev)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: palette.textLight, marginBottom: 4 }}>Réel (à ce jour)</div>
              <div style={{ height: 10, background: palette.sagePale, borderRadius: 5 }}>
                <div style={{ height: "100%", width: `${Math.min(100, totalRevReel / totalRevPrev * 100)}%`, background: palette.sageDark, borderRadius: 5 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.sageDark, marginTop: 4 }}>{fmt(totalRevReel)} ({Math.round(totalRevReel / totalRevPrev * 100)}%)</div>
            </div>
          </div>
        </div>
        <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Prévu vs Réel — Dépenses</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: palette.textLight, marginBottom: 4 }}>Prévu (annuel)</div>
              <div style={{ height: 10, background: palette.terracottaPale, borderRadius: 5 }}>
                <div style={{ height: "100%", width: "100%", background: palette.terracottaLight, borderRadius: 5 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.terracottaDark, marginTop: 4 }}>{fmt(totalDepPrev)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: palette.textLight, marginBottom: 4 }}>Réel (à ce jour)</div>
              <div style={{ height: 10, background: palette.terracottaPale, borderRadius: 5 }}>
                <div style={{ height: "100%", width: `${Math.min(100, totalDepReel / totalDepPrev * 100)}%`, background: palette.terracotta, borderRadius: 5 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.terracottaDark, marginTop: 4 }}>{fmt(totalDepReel)} ({Math.round(totalDepReel / totalDepPrev * 100)}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projection mensuelle graphique */}
      <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Projection mensuelle 2026</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, marginBottom: 8 }}>
          {MOIS.map((m, i) => (
            <div key={i} onClick={() => setMoisActif(i)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
              <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 116 }}>
                <div style={{ flex: 1, background: moisActif === i ? palette.sageDark : palette.sage, height: Math.max(4, revMoisPrev[i] / maxBar * 110), borderRadius: "3px 3px 0 0", opacity: 0.85 }} />
                <div style={{ flex: 1, background: moisActif === i ? palette.terracottaDark : palette.terracotta, height: Math.max(4, depMoisPrev[i] / maxBar * 110), borderRadius: "3px 3px 0 0", opacity: 0.75 }} />
              </div>
              <div style={{ fontSize: 9, color: moisActif === i ? palette.text : palette.textLight, fontWeight: moisActif === i ? 700 : 400 }}>{m}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: palette.textMid }}><span style={{ width: 10, height: 10, borderRadius: 2, background: palette.sage, display: "inline-block" }} />Revenus prévus</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: palette.textMid }}><span style={{ width: 10, height: 10, borderRadius: 2, background: palette.terracotta, display: "inline-block" }} />Dépenses prévues</div>
        </div>
      </div>

      {/* Détail du mois sélectionné */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
            Revenus — {MOIS[moisActif]} <span style={{ color: palette.textLight, fontWeight: 400 }}>(cliquez pour modifier)</span>
          </div>
          {Object.entries(budget.revenus).map(([cat, vals]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${palette.creamDark}` }}>
              <CatBadge cat={cat} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: palette.sageDark }}>{fmt(vals[moisActif])}</span>
                <button onClick={() => { setEditBudget({ type: "revenus", cat, mois: moisActif }); setEditVal(String(vals[moisActif])); }} style={actionBtn(palette.sage)}>✏️</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, textTransform: "uppercase" }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: palette.sageDark, fontFamily: "'Playfair Display', serif" }}>{fmt(revMoisPrev[moisActif])}</span>
          </div>
        </div>

        <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
            Charges — {MOIS[moisActif]}
          </div>
          {Object.entries(budget.depenses).map(([cat, vals]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${palette.creamDark}` }}>
              <CatBadge cat={cat} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: palette.terracottaDark }}>{fmt(vals[moisActif])}</span>
                <button onClick={() => { setEditBudget({ type: "depenses", cat, mois: moisActif }); setEditVal(String(vals[moisActif])); }} style={actionBtn(palette.terracotta)}>✏️</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, textTransform: "uppercase" }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: palette.terracottaDark, fontFamily: "'Playfair Display', serif" }}>{fmt(depMoisPrev[moisActif])}</span>
          </div>
        </div>

        <div style={{ background: tresoMois[moisActif] >= 0 ? palette.sagePale : palette.terracottaPale, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, minWidth: 180, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase" }}>Trésorerie {MOIS[moisActif]}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: tresoMois[moisActif] >= 0 ? palette.sageDark : palette.terracottaDark, fontFamily: "'Playfair Display', serif" }}>
            {tresoMois[moisActif] >= 0 ? "+" : ""}{fmt(tresoMois[moisActif])}
          </div>
          <div style={{ fontSize: 11, color: palette.textMid }}>{tresoMois[moisActif] >= 0 ? "✅ Bénéficiaire" : "⚠️ Déficitaire"}</div>
        </div>
      </div>

      {/* Tableau annuel */}
      <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, overflowX: "auto" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Tableau annuel complet</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${palette.creamDark}` }}>
              <th style={{ textAlign: "left", padding: "8px 6px", color: palette.textLight, fontWeight: 700 }}>Mois</th>
              {MOIS.map(m => <th key={m} style={{ textAlign: "right", padding: "8px 6px", color: palette.textLight, fontWeight: 700, fontSize: 11 }}>{m}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${palette.creamDark}` }}>
              <td style={{ padding: "8px 6px", fontWeight: 600, color: palette.sageDark }}>Revenus prév.</td>
              {revMoisPrev.map((v, i) => <td key={i} style={{ textAlign: "right", padding: "8px 6px", color: palette.sageDark, fontWeight: 600 }}>{v.toLocaleString("fr-FR")}€</td>)}
            </tr>
            <tr style={{ borderBottom: `1px solid ${palette.creamDark}` }}>
              <td style={{ padding: "8px 6px", fontWeight: 600, color: palette.terracottaDark }}>Charges prév.</td>
              {depMoisPrev.map((v, i) => <td key={i} style={{ textAlign: "right", padding: "8px 6px", color: palette.terracottaDark, fontWeight: 600 }}>{v.toLocaleString("fr-FR")}€</td>)}
            </tr>
            <tr style={{ background: palette.cream }}>
              <td style={{ padding: "8px 6px", fontWeight: 700, color: palette.text }}>Trésorerie</td>
              {tresoMois.map((v, i) => <td key={i} style={{ textAlign: "right", padding: "8px 6px", fontWeight: 700, color: v >= 0 ? palette.sageDark : palette.terracottaDark }}>{v >= 0 ? "+" : ""}{v.toLocaleString("fr-FR")}€</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal edit budget */}
      {editBudget && (
        <div style={{ position: "fixed", inset: 0, background: "#0006", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setEditBudget(null)}>
          <div style={{ background: palette.white, borderRadius: 20, padding: "36px 40px", width: 360, boxShadow: "0 20px 60px #0003" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: 8, color: palette.text }}>Modifier le budget</h2>
            <p style={{ fontSize: 13, color: palette.textMid, marginBottom: 20 }}>{editBudget.cat} — {MOIS[editBudget.mois]}</p>
            <Field label="Montant (€)" type="number" value={editVal} onChange={setEditVal} />
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setEditBudget(null)} style={{ ...btnStyle, background: palette.creamDark, color: palette.textMid, flex: 1 }}>Annuler</button>
              <button onClick={saveEdit} style={{ ...btnStyle, background: palette.sage, color: palette.white, flex: 1 }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── APP PRINCIPALE ───────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(initialData);
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const totalRevenus = data.revenus.reduce((a, b) => a + b.montant, 0);
  const totalDepenses = data.depenses.reduce((a, b) => a + b.montant, 0);
  const solde = totalRevenus - totalDepenses;
  const revenusPaids = data.revenus.filter(r => r.statut === "payé").reduce((a, b) => a + b.montant, 0);
  const facturesAttente = data.factures.filter(f => f.statut !== "payée").reduce((a, b) => a + b.montant, 0);

  const revenusParCat = categories.map(cat => ({ label: cat.split(" ")[0], value: data.revenus.filter(r => r.categorie === cat).reduce((a, b) => a + b.montant, 0), color: categorieColors[cat] }));
  const depensesParCat = categories.map(cat => ({ label: cat.split(" ")[0], value: data.depenses.filter(d => d.categorie === cat).reduce((a, b) => a + b.montant, 0), color: categorieColors[cat] }));

  const addEntry = (type) => {
    if (editId !== null) {
      setData(prev => ({ ...prev, [type]: prev[type].map(e => e.id === editId ? { ...e, ...formData, montant: parseFloat(formData.montant) || 0 } : e) }));
      setEditId(null);
    } else {
      const id = type === "factures" ? formData.id : Date.now();
      setData(prev => ({ ...prev, [type]: [...prev[type], { id, ...formData, montant: parseFloat(formData.montant) || 0 }] }));
    }
    setShowForm(null);
    setFormData({});
  };

  const openEdit = (type, entry) => { setEditId(entry.id); setFormData({ ...entry, montant: String(entry.montant) }); setShowForm(type); };
  const deleteEntry = (type, id) => { setData(prev => ({ ...prev, [type]: prev[type].filter(e => e.id !== id) })); setConfirmDelete(null); };

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Tableau de bord" },
    { id: "revenus", icon: "↑", label: "Revenus" },
    { id: "depenses", icon: "↓", label: "Dépenses" },
    { id: "factures", icon: "◧", label: "Factures" },
    { id: "budget", icon: "◈", label: "Budget prévi." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: palette.cream, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: palette.text, display: "flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <aside style={{ width: 220, background: palette.brown, display: "flex", flexDirection: "column", padding: "32px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: palette.sageLight, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Mon Entreprise</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: palette.white, fontFamily: "'Playfair Display', serif" }}>Compta</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ background: tab === item.id ? palette.sage : "transparent", color: tab === item.id ? palette.white : palette.creamDeep, border: "none", cursor: "pointer", padding: "13px 24px", textAlign: "left", fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, borderLeft: tab === item.id ? `3px solid ${palette.terracotta}` : "3px solid transparent" }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "24px", borderTop: `1px solid ${palette.textMid}33` }}>
          <div style={{ fontSize: 11, color: palette.textLight }}>Mai 2026</div>
          <div style={{ fontSize: 12, color: palette.creamDeep, fontWeight: 600, marginTop: 2 }}>Exercice en cours</div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", maxWidth: 960 }}>

        {tab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: palette.textLight, fontWeight: 700 }}>Tableau de bord</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: palette.text, margin: "4px 0 0" }}>Vue d'ensemble</h1>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <KPI label="Solde net" value={fmt(solde)} sub="Revenus – Dépenses" accent={solde >= 0 ? palette.sage : palette.terracotta} />
              <KPI label="Revenus totaux" value={fmt(totalRevenus)} sub={`${fmt(revenusPaids)} encaissés`} accent={palette.sage} />
              <KPI label="Dépenses totales" value={fmt(totalDepenses)} sub="Ce mois" accent={palette.terracotta} />
              <KPI label="En attente" value={fmt(facturesAttente)} sub="Factures non soldées" accent={palette.textMid} />
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
              <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Revenus par catégorie</div>
                <BarChart data={revenusParCat} />
              </div>
              <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Dépenses par catégorie</div>
                <BarChart data={depensesParCat} />
              </div>
              <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}`, minWidth: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start" }}>Répartition revenus</div>
                <DonutChart size={120} segments={revenusParCat} />
              </div>
            </div>
            <div style={{ background: palette.white, borderRadius: 16, padding: "24px 28px", border: `1.5px solid ${palette.creamDark}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 18 }}>Dernières opérations</div>
              {[...data.revenus.slice(-3).map(r => ({ ...r, type: "revenu" })), ...data.depenses.slice(-3).map(d => ({ ...d, type: "dépense" }))]
                .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
                .map(op => (
                  <div key={op.id + op.type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${palette.creamDark}`, gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: op.type === "revenu" ? palette.sagePale : palette.terracottaPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: op.type === "revenu" ? palette.sageDark : palette.terracottaDark }}>{op.type === "revenu" ? "↑" : "↓"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: palette.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{op.label}</div>
                      <div style={{ fontSize: 11, color: palette.textLight, marginTop: 2 }}>{op.date} · <CatBadge cat={op.categorie} /></div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: op.type === "revenu" ? palette.sageDark : palette.terracottaDark }}>{op.type === "revenu" ? "+" : "−"}{fmt(op.montant)}</div>
                      <Tag statut={op.statut} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === "revenus" && (
          <Section title="Revenus" accent={palette.sage} onAdd={() => { setEditId(null); setShowForm("revenus"); setFormData({ date: "", label: "", categorie: "Formation", montant: "", statut: "payé" }); }}>
            {data.revenus.map(r => <EntryRow key={r.id} entry={r} sign="+" color={palette.sageDark} onEdit={() => openEdit("revenus", r)} onDelete={() => setConfirmDelete({ type: "revenus", id: r.id, label: r.label })} />)}
            <SummaryBar label="Total revenus" total={totalRevenus} color={palette.sageDark} />
          </Section>
        )}

        {tab === "depenses" && (
          <Section title="Dépenses" accent={palette.terracotta} onAdd={() => { setEditId(null); setShowForm("depenses"); setFormData({ date: "", label: "", categorie: "Frais généraux", montant: "", statut: "payé" }); }}>
            {data.depenses.map(d => <EntryRow key={d.id} entry={d} sign="−" color={palette.terracottaDark} onEdit={() => openEdit("depenses", d)} onDelete={() => setConfirmDelete({ type: "depenses", id: d.id, label: d.label })} />)}
            <SummaryBar label="Total dépenses" total={totalDepenses} color={palette.terracottaDark} />
          </Section>
        )}

        {tab === "factures" && (
          <Section title="Factures" accent={palette.textMid} onAdd={() => { setEditId(null); setShowForm("factures"); setFormData({ id: `F-2026-00${data.factures.length + 1}`, date: "", client: "", label: "", montant: "", echeance: "", statut: "brouillon" }); }} btnLabel="Nouvelle facture">
            {data.factures.map(f => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: `1px solid ${palette.creamDark}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: palette.creamDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: palette.textMid, fontWeight: 700, flexShrink: 0 }}>◧</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: palette.textLight }}>{f.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: palette.text }}>{f.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: palette.textLight, marginTop: 3 }}>{f.client} · Émise le {f.date} · Échéance {f.echeance}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: palette.text }}>{fmt(f.montant)}</div>
                  <Tag statut={f.statut} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit("factures", f)} style={actionBtn(palette.sage)}>✏️ Modifier</button>
                    <button onClick={() => setConfirmDelete({ type: "factures", id: f.id, label: f.label })} style={actionBtn(palette.terracotta)}>🗑 Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
            <SummaryBar label="Total facturé" total={data.factures.reduce((a, b) => a + b.montant, 0)} color={palette.textMid} />
          </Section>
        )}

        {tab === "budget" && <BudgetTab data={data} setData={setData} />}
      </main>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "#0006", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => { setShowForm(null); setEditId(null); }}>
          <div style={{ background: palette.white, borderRadius: 20, padding: "36px 40px", width: 420, maxWidth: "90vw", boxShadow: "0 20px 60px #0003" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: 24, color: palette.text }}>
              {editId ? "Modifier" : showForm === "factures" ? "Nouvelle facture" : showForm === "revenus" ? "Ajouter un revenu" : "Ajouter une dépense"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {showForm === "factures" && <Field label="N° Facture" value={formData.id || ""} onChange={v => setFormData(p => ({ ...p, id: v }))} />}
              {showForm === "factures" && <Field label="Client" value={formData.client || ""} onChange={v => setFormData(p => ({ ...p, client: v }))} />}
              <Field label="Libellé" value={formData.label || ""} onChange={v => setFormData(p => ({ ...p, label: v }))} />
              <Field label="Montant (€)" type="number" value={formData.montant || ""} onChange={v => setFormData(p => ({ ...p, montant: v }))} />
              <Field label="Date" type="date" value={formData.date || ""} onChange={v => setFormData(p => ({ ...p, date: v }))} />
              {showForm === "factures" && <Field label="Échéance" type="date" value={formData.echeance || ""} onChange={v => setFormData(p => ({ ...p, echeance: v }))} />}
              {showForm !== "factures" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: palette.textLight, display: "block", marginBottom: 6 }}>Catégorie</label>
                  <select value={formData.categorie || ""} onChange={e => setFormData(p => ({ ...p, categorie: e.target.value }))} style={inputStyle}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: palette.textLight, display: "block", marginBottom: 6 }}>Statut</label>
                <select value={formData.statut || ""} onChange={e => setFormData(p => ({ ...p, statut: e.target.value }))} style={inputStyle}>
                  {showForm === "factures" ? ["brouillon", "envoyée", "payée"].map(s => <option key={s}>{s}</option>) : ["payé", "en attente"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={() => { setShowForm(null); setEditId(null); }} style={{ ...btnStyle, background: palette.creamDark, color: palette.textMid, flex: 1 }}>Annuler</button>
              <button onClick={() => addEntry(showForm)} style={{ ...btnStyle, background: palette.sage, color: palette.white, flex: 1 }}>{editId ? "Mettre à jour" : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "#0006", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background: palette.white, borderRadius: 20, padding: "36px 40px", width: 380, maxWidth: "90vw", boxShadow: "0 20px 60px #0003" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: 12, color: palette.text }}>Supprimer ?</h2>
            <p style={{ fontSize: 13, color: palette.textMid, marginBottom: 28 }}>Voulez-vous vraiment supprimer <strong>"{confirmDelete.label}"</strong> ? Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...btnStyle, background: palette.creamDark, color: palette.textMid, flex: 1 }}>Annuler</button>
              <button onClick={() => deleteEntry(confirmDelete.type, confirmDelete.id)} style={{ ...btnStyle, background: palette.terracotta, color: palette.white, flex: 1 }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}