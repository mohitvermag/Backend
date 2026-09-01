import { useState } from "react";
import {
  Activity,
  Boxes,
  Database,
  FileJson,
  Gauge,
  Globe2,
  KeyRound,
  LogOut,
  Play,
  Route,
  Search,
  Server,
  ShieldCheck,
  UserRound,
  Webhook,
  X,
} from "lucide-react";
import AuthWorkspace from "./components/AuthWorkspace";
import RoadmapTracker from "./components/RoadmapTracker";
import { endpoints, metrics, modules, roadmap } from "./data/workspace";
import { authApi } from "./lib/api";
import "./styles.css";

const navigation = [
  { id: "internet", label: "Internet", icon: Globe2 },
  { id: "rest", label: "REST APIs", icon: Route },
  { id: "databases", label: "Databases", icon: Database },
  { id: "auth", label: "Auth", icon: KeyRound },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "queues", label: "Queues", icon: Boxes },
  { id: "monitoring", label: "Monitoring", icon: Activity },
];

const practiceViews = {
  internet: ["Internet Request Lifecycle", "DNS, HTTP headers, request/response and proxy basics practice karo."],
  rest: ["REST API Workbench", "CRUD, status codes, response format, pagination, filters and versioning build karo."],
  databases: ["Database Lab", "MongoDB schemas, indexes, aggregation, populate and transactions practice karo."],
  auth: ["Authentication Studio", "Register, login, logout, refresh token and OTP password reset implement karo."],
  security: ["Security Checklist", "Validation, CORS, cookies, rate limit, injection protection and secure headers add karo."],
  webhooks: ["Webhook Center", "Signature verification, idempotency, duplicate events and retries handle karo."],
  queues: ["Background Jobs", "Email jobs, retries, backoff, failed jobs and Redis queues practice karo."],
  monitoring: ["Observability Console", "Health checks, logs, request IDs, latency and error tracking add karo."],
};

function Header({ currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Server size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-950">Backend Practice Console</h1>
            <p className="hidden text-sm text-slate-500 sm:block">Express, MongoDB, auth and production API practice</p>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <div className="user-pill">
              <UserRound size={16} />
              {currentUser.roleLabel}
            </div>
            <button className="secondary-button" onClick={onLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function PublicHeader({ onOpenAuth }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Server size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-950">Backend Practice Console</h1>
            <p className="hidden text-sm text-slate-500 sm:block">Production-style backend learning workspace</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="secondary-button" onClick={() => onOpenAuth("login")}>Login</button>
          <button className="primary-button" onClick={() => onOpenAuth("register")}>Register</button>
        </div>
      </div>
    </header>
  );
}

function AuthModal({ mode, onClose, onAuthenticated }) {
  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
      <div className="auth-modal-panel">
        <div className="auth-modal-header">
          <div>
            <p>Account access</p>
            <h2>{mode === "register" ? "Create your account" : "Login to continue"}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close auth form">
            <X size={18} />
          </button>
        </div>
        <AuthWorkspace initialMode={mode} onAuthenticated={onAuthenticated} />
      </div>
    </div>
  );
}

function PublicHome({ onAuthenticated }) {
  const [authMode, setAuthMode] = useState("login");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthenticated = (user) => {
    onAuthenticated(user);
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <PublicHeader onOpenAuth={openAuth} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="public-poster">
          <div className="poster-badge">
            <ShieldCheck size={16} />
            Backend learning project
          </div>
          <h2>Practice production backend concepts behind a real app shell.</h2>
          <p>
            Login ke baad tum dashboard mein REST APIs, databases, auth, security, queues,
            webhooks aur monitoring modules practice kar sakte ho.
          </p>
          <div className="poster-actions">
            <button className="primary-button" onClick={() => openAuth("register")}>Start Practice</button>
            <button className="secondary-button poster-secondary" onClick={() => openAuth("login")}>Login</button>
          </div>
          <div className="poster-grid">
            <div><strong>40+</strong><span>Backend topics</span></div>
            <div><strong>8</strong><span>Practice sections</span></div>
            <div><strong>Real</strong><span>Project workflow</span></div>
          </div>
        </section>
        <RoadmapTracker />
      </main>
      {isAuthOpen && <AuthModal mode={authMode} onClose={() => setIsAuthOpen(false)} onAuthenticated={handleAuthenticated} />}
    </div>
  );
}

function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <nav className="space-y-1">
        {navigation.map(({ id, icon: Icon, label }) => (
          <button key={id} type="button" onClick={() => onViewChange(id)} className={`nav-item ${activeView === id ? "nav-item-active" : ""}`}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Server size={17} />
          Backend URL
        </div>
        <p className="mt-2 break-all text-sm text-slate-600">http://localhost:8000/api</p>
      </div>
    </aside>
  );
}

function MobileTabs({ activeView, onViewChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {navigation.map(({ id, label }) => (
        <button key={id} type="button" onClick={() => onViewChange(id)} className={`tab-button ${activeView === id ? "tab-button-active" : ""}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ActivePracticePanel({ activeView, onAuthenticated }) {
  if (activeView === "auth") {
    return <AuthWorkspace onAuthenticated={onAuthenticated} />;
  }

  const [title, subtitle] = practiceViews[activeView];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected workspace</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p>
        </div>
        <button className="primary-button w-full md:w-auto">
          <Play size={17} />
          Start Lab
        </button>
      </div>
    </section>
  );
}

function ModuleGrid() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {modules.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phase {item.phase}</p>
              <h2 className="mt-1 text-base font-semibold text-slate-950">{item.title}</h2>
            </div>
            <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">{item.status}</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${item.progress}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>{item.progress}% practice</span>
            <span>{item.endpoints} endpoints</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function Metrics() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <strong className="text-2xl font-semibold text-slate-950">{metric.value}</strong>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{metric.delta}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function EndpointCatalog() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 font-semibold text-slate-950">
        <FileJson size={18} />
        Endpoint Catalog
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Auth</th>
              <th className="px-4 py-3">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {endpoints.map((endpoint) => (
              <tr key={endpoint.path} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-700">{endpoint.method}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-800">{endpoint.path}</td>
                <td className="px-4 py-3 text-slate-600">{endpoint.area}</td>
                <td className="px-4 py-3 text-slate-600">{endpoint.auth}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{endpoint.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RoadmapPanel() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-slate-950">
        <Gauge size={18} />
        Practice Roadmap
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {roadmap.map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">{index + 1}</span>
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ currentUser, onLogout }) {
  const [activeView, setActiveView] = useState("rest");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="min-w-0 flex-1 space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          <MobileTabs activeView={activeView} onViewChange={setActiveView} />
          <RoadmapTracker compact />
          <ActivePracticePanel activeView={activeView} onAuthenticated={() => {}} />
          <Metrics />
          <ModuleGrid />
          <EndpointCatalog />
          <RoadmapPanel />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const handleLogout = async () => {

    try {

        await authApi.logoutUser();

        setCurrentUser(null);

    } catch (error) {

        console.error("Logout failed:", error);

    }
};

  if (!currentUser) {
    return <PublicHome onAuthenticated={setCurrentUser} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={() => handleLogout()} />;
}
