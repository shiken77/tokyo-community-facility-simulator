 "use client";

import { useMemo, useState } from "react";
import TokyoMeshMap from "./components/TokyoMeshMap";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronRight,
  CircleHelp,
  MapPinned,
  Play,
  RotateCcw,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

type Mode = "aging" | "mothers";
type View = "areas" | "simulation";

type Community = {
  id: string;
  name: string;
  english: string;
  ward: string;
  profile: string;
  status: "connected" | "placeholder";
  tags: string[];
};

const agingCommunities: Community[] = [
  { id: "ojima-4", name: "大島四丁目", english: "Ojima 4-chome", ward: "Koto City", profile: "Aging + leisure opportunity gap", status: "connected", tags: ["Connected result", "Target mesh 53394626"] },
  { id: "minamisuna-1", name: "南砂一丁目", english: "Minamisuna 1-chome", ward: "Koto City", profile: "Aging + lower local activity", status: "placeholder", tags: ["Placeholder area"] },
  { id: "ojima-1", name: "大島一丁目", english: "Ojima 1-chome", ward: "Koto City", profile: "Aging + facility access gap", status: "placeholder", tags: ["Placeholder area"] },
  { id: "kameido-7", name: "亀戸七丁目", english: "Kameido 7-chome", ward: "Koto City", profile: "Aging + declining activity", status: "placeholder", tags: ["Placeholder area"] },
];

const motherCommunities: Community[] = [
  { id: "toyosu-5", name: "豊洲五丁目", english: "Toyosu 5-chome", ward: "Koto City", profile: "Working mothers + young children", status: "placeholder", tags: ["Sample placeholder"] },
  { id: "shinonome-1", name: "東雲一丁目", english: "Shinonome 1-chome", ward: "Koto City", profile: "Working mothers + young children", status: "placeholder", tags: ["Sample placeholder"] },
  { id: "tatsumi-1", name: "辰巳一丁目", english: "Tatsumi 1-chome", ward: "Koto City", profile: "Working mothers + young children", status: "placeholder", tags: ["Sample placeholder"] },
  { id: "kiyosumi-2", name: "清澄二丁目", english: "Kiyosumi 2-chome", ward: "Koto City", profile: "Working mothers + young children", status: "placeholder", tags: ["Sample placeholder"] },
];

const connectedResults = {
  neighborhood: [
    { label: "Total non-routine activity duration", value: "+25.9%", tone: "positive" },
    { label: "Free-activity duration", value: "+19.1%", tone: "positive" },
    { label: "Local residents · total episodes", value: "+4.9%", tone: "positive" },
    { label: "Local residents · free episodes", value: "−1.8%", tone: "negative" },
  ],
  resident: [
    { label: "Commuter seniors · free-activity time", value: "+3.2%", tone: "positive" },
    { label: "Non-commuter seniors · free-activity time", value: "+12.1%", tone: "positive" },
    { label: "Commuter seniors · free episodes", value: "+25.6%", tone: "positive" },
    { label: "Non-commuter seniors · free episodes", value: "−7.8%", tone: "negative" },
  ],
} as const;

const facilityOptions = [
  { id: "hsd", label: "Hobby & self-development", detail: "Connected Ojima scenario" },
  { id: "shopping", label: "Shopping & eating", detail: "Results coming soon" },
  { id: "community", label: "Community learning center", detail: "Results coming soon" },
];

function TokyoWardsMap({ mode }: { mode: Mode }) {
  return (
    <div className="map-placeholder real-map-shell">
      <div className="map-topline"><div><span className="map-kicker">Tokyo 23 wards · 1 km mesh</span><strong>{mode === "aging" ? "Aging + declining communities" : "Working mothers + young kids"}</strong></div><span className="map-status"><span className="status-dot connected" /> Blue = problem area</span></div>
      <TokyoMeshMap mode={mode} />
      <div className="map-legend"><span><i className={mode === "aging" ? "legend-swatch aging-swatch" : "legend-swatch mother-swatch"} /> Problem mesh</span><span><i className="legend-swatch neutral-swatch" /> Other 1 km meshes</span></div>
      <div className="map-caption"><MapPinned size={14} /> OpenStreetMap base · 1,000 m mesh overlay</div>
    </div>
  );
}

function MetricBar({ value, label, tone }: { value: string; label: string; tone: "positive" | "negative" }) {
  const numeric = Math.abs(Number(value.replace("%", "").replace("−", "-")));
  const width = Math.min(50, Math.max(3, numeric * 1.8));
  return (
    <div className="metric-row">
      <div className="metric-copy">
        <span>{label}</span>
        <strong className={tone === "negative" ? "negative" : "positive"}>{value}</strong>
      </div>
      <div className="metric-track" aria-hidden="true">
        <span className={tone === "negative" ? "metric-fill negative-fill" : "metric-fill"} style={{ width: width + "%" }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("aging");
  const [view, setView] = useState<View>("areas");
  const [selectedCommunityId, setSelectedCommunityId] = useState("ojima-4");
  const [facility, setFacility] = useState("hsd");
  const [simulated, setSimulated] = useState(false);

  const communities = mode === "aging" ? agingCommunities : motherCommunities;
  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId) ?? communities[0];
  const canSimulate = selectedCommunity?.id === "ojima-4" && facility === "hsd";
  const showResults = canSimulate && simulated;
  const statusText = useMemo(
    () => mode === "mothers" ? "Working-mother community data is ready for your map and model outputs." : "Aging and declining community candidates are shown as a working set.",
    [mode],
  );

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setView("areas");
    setSelectedCommunityId(nextMode === "aging" ? "ojima-4" : "toyosu-5");
    setSimulated(false);
  };

  const openSimulation = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setView("simulation");
    setSimulated(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><MapPinned size={18} strokeWidth={2.5} /></div>
          <div><div className="brand-name">Tokyo facility simulator</div><div className="brand-kicker">Policy sandbox · 2022–2023 activity data</div></div>
        </div>
        <div className="topbar-meta"><span className="data-pill"><span className="live-dot" /> Prototype</span><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button></div>
      </header>

      <nav className="mode-tabs" aria-label="Community mode">
        <button className={mode === "aging" ? "mode-tab active" : "mode-tab"} onClick={() => switchMode("aging")}>
          <span className="tab-icon"><UsersRound size={18} /></span><span><strong>Aging &amp; declining</strong><small>Older residents · local activity gap</small></span><ChevronRight size={17} className="tab-chevron" />
        </button>
        <button className="mode-tab mode-tab-locked" disabled aria-label="Working mothers with young kids mode, coming soon">
          <span className="tab-icon"><Activity size={18} /></span><span><strong>Working mothers + young kids</strong><small>Coming soon</small></span><span className="coming-soon-badge">Future mode</span>
        </button>
      </nav>

      <div className="workspace">
        <aside className="left-rail">
          <div className="rail-heading"><div><span className="eyebrow">Workflow</span><h2>{mode === "aging" ? "Aging community" : "Family community"}</h2></div><button className="reset-button" onClick={() => switchMode(mode)}><RotateCcw size={14} /> Reset</button></div>
          <div className="step-list">
            <button className={view === "areas" ? "step active" : "step"} onClick={() => setView("areas")}><span className="step-number">01</span><span><strong>Explore areas</strong><small>Review candidate chomes</small></span></button>
            <button className={view === "simulation" ? "step active" : "step"} onClick={() => setView("simulation")}><span className="step-number">02</span><span><strong>Run simulation</strong><small>Test one facility scenario</small></span></button>
          </div>
          <div className="rail-note"><SlidersHorizontal size={16} /><p><strong>Current scope</strong><br />One facility · 500 m exposure radius · fixed intervention size</p></div>
          <div className="rail-footer"><span className="mini-label">Working set</span><strong>{communities.length} candidate communities</strong><span>{statusText}</span></div>
        </aside>

        <section className={view === "simulation" ? "main-panel simulation-panel" : "main-panel"}>
          {view === "areas" ? (
            <>
              <div className="panel-heading"><div><span className="eyebrow">Step 01 · Community map</span><h2>Candidate {mode === "aging" ? "aging and declining" : "family"} communities</h2><p>Map layers are placeholders for now. Use the list to choose a community for the next step.</p></div><div className="heading-count"><strong>{communities.length}</strong><span>areas</span></div></div>
              <TokyoWardsMap mode={mode} />
              <div className="list-heading"><div><span className="eyebrow">Candidate list</span><h3>Select a chome to continue</h3></div><span className="placeholder-tag">Illustrative working set</span></div>
              <div className="community-list">
                {communities.map((community) => (
                  <article className={"community-card" + (selectedCommunityId === community.id ? " selected" : "")} key={community.id}>
                    <button className="community-main" onClick={() => setSelectedCommunityId(community.id)}>
                      <div className="community-status"><span className={community.status === "connected" ? "status-dot connected" : "status-dot"} /> {community.status === "connected" ? "Connected" : "Placeholder"}</div>
                      <h3>{community.name}</h3><p>{community.english} · {community.ward}</p><div className="community-tags">{community.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    </button>
                    <div className="community-side"><span>{community.profile}</span><button className="text-button" onClick={() => openSimulation(community.id)}>Simulate <ArrowUpRight size={14} /></button></div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="panel-heading simulation-heading"><div><span className="eyebrow">Step 02 · Intervention design</span><h2>Simulate a targeted facility</h2><p>Choose a community and facility type. Only the connected Ojima result is active in this prototype.</p></div><div className={canSimulate ? "scenario-badge" : "scenario-badge placeholder"}><Building2 size={16} /> {showResults ? "Simulation complete" : canSimulate ? "Ready to run" : "Placeholder"}</div></div>
              <div className="control-card">
                <div className="control-grid">
                  <label className="field"><span>Problem community</span><select value={selectedCommunityId} onChange={(event) => { setSelectedCommunityId(event.target.value); setSimulated(false); }}>{communities.map((community) => <option key={community.id} value={community.id}>{community.name} · {community.english}</option>)}</select></label>
                  <label className="field"><span>Facility type</span><select value={facility} onChange={(event) => { setFacility(event.target.value); setSimulated(false); }}>{facilityOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
                  <div className="scenario-spec"><span>Intervention size</span><strong>+1 facility</strong><small>500 m exposure radius</small></div>
                </div>
                <div className="control-actions"><div className="connected-note"><span className={canSimulate ? "status-dot connected" : "status-dot"} />{canSimulate ? "Connected to Ojima 4-chome simulation" : "This combination is a placeholder"}</div><button className="simulate-button" onClick={() => setSimulated(true)} disabled={!canSimulate}><Play size={16} fill="currentColor" /> Run simulation</button></div>
              </div>
              {!showResults ? (
                <div className="empty-results"><div className="empty-icon"><BarChart3 size={22} /></div><h3>Results will appear here</h3><p>Connect the activity-sequence output for this community and facility type. Ojima 4-chome is the first active scenario.</p><button className="back-link" onClick={() => setView("areas")}>Back to candidate areas <ChevronRight size={14} /></button></div>
              ) : (
                <div className="scenario-context"><div className="context-title"><div><span className="eyebrow">Connected scenario</span><h3>Ojima 4-chome · HSD leisure facility</h3></div><span className="result-chip">DID-adjusted change</span></div><div className="context-facts"><div><span>Target mesh</span><strong>53394626</strong></div><div><span>Population profile</span><strong>65+ share 27.3%</strong></div><div><span>Opportunity signal</span><strong>Leisure − facility gap</strong></div></div></div>
              )}
            </>
          )}
        </section>

        <aside className="results-panel" aria-live="polite">
          <div className="results-header"><div><span className="eyebrow">Simulation results</span>{!showResults && <h2>Awaiting a connected run</h2>}</div><span className="results-icon"><BarChart3 size={18} /></span></div>
          {showResults ? (
            <>
              <div className="benefit-grid">
                <article className="benefit-card neighborhood"><div className="benefit-top"><span className="benefit-icon"><Building2 size={17} /></span><span className="benefit-label">Place-based benefit</span></div><h3>Neighborhood vitality</h3><strong className="headline-number">+25.9%</strong><p>Total non-routine activity duration in the target area.</p><div className="signal"><span className="signal-bar" /><span>Duration expands; episode count is mixed.</span></div></article>
                <article className="benefit-card resident"><div className="benefit-top"><span className="benefit-icon"><UsersRound size={17} /></span><span className="benefit-label">Resident benefit</span></div><h3>Older residents&apos; participation</h3><strong className="headline-number">+12.1%</strong><p>Non-commuter senior free-activity time.</p><div className="signal"><span className="signal-bar" /><span>Local accessibility improves for seniors.</span></div></article>
              </div>
              <div className="quadrant-card"><div className="quadrant-heading"><div><span className="eyebrow">Overall position</span><h3>Impact profile</h3></div><span className="mixed-chip">Mixed but promising</span></div><div className="axis-title axis-title-y">Resident benefit ↑</div><div className="quadrant"><span className="quad-label q1">High / high</span><span className="quad-label q2">Resident-led</span><span className="quad-label q3">Low signal</span><span className="quad-label q4">Place-led</span><span className="quad-line horizontal" /><span className="quad-line vertical" /><span className="quad-point"><span>Ojima 4-chome</span></span></div><div className="axis-title axis-title-x">Neighborhood vitality →</div></div>
              <div className="detail-block"><div className="detail-heading"><div><span className="eyebrow">Detailed readout</span><h3>Neighborhood vitality</h3></div><span className="detail-caption">Target area</span></div>{connectedResults.neighborhood.map((metric) => <MetricBar key={metric.label} {...metric} />)}</div>
              <div className="detail-block"><div className="detail-heading"><div><span className="eyebrow">Detailed readout</span><h3>Resident benefit</h3></div><span className="detail-caption">Local seniors</span></div>{connectedResults.resident.map((metric) => <MetricBar key={metric.label} {...metric} />)}</div>
            </>
          ) : (
            <div className="results-placeholder"><div className="empty-icon"><BarChart3 size={22} /></div><h3>No connected result yet</h3><p>Select Ojima 4-chome and Hobby &amp; self-development to view the current simulation output.</p></div>
          )}
        </aside>
      </div>

      <footer className="footer-note"><span>Prototype for policy exploration</span><span>Source outputs: Agoop activity sequences · IPW-weighted Markov simulation</span></footer>
    </main>
  );
}
