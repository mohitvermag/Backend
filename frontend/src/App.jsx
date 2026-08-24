import { useState } from "react";
import { Activity, Boxes, Database, FileJson, Gauge, Globe2, KeyRound, Lock, Play, RefreshCw, Route, Search, Server, ShieldCheck, TerminalSquare, Webhook, Zap } from "lucide-react";
import { apiScenarios, endpoints, metrics, modules, roadmap } from "./data/workspace";
import "./styles.css";

const methodStyles = {
  GET: "bg-sky-100 text-sky-800 border-sky-200",
  POST: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PUT: "bg-amber-100 text-amber-800 border-amber-200",
  PATCH: "bg-violet-100 text-violet-800 border-violet-200",
  DELETE: "bg-rose-100 text-rose-800 border-rose-200",
};

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
  internet: {
    title: "Internet Request Lifecycle",
    subtitle: "Browser se request nikalne se lekar server response tak ka complete flow practice karo.",
    tasks: ["DNS lookup simulator", "Client/server request trace", "HTTP vs HTTPS headers", "Proxy and reverse proxy notes", "CDN cache status lab"],
    endpoints: ["GET /api/health", "GET /api/debug/request", "GET /api/debug/headers"],
  },
  rest: {
    title: "REST API Workbench",
    subtitle: "Production-style CRUD, filters, pagination, sorting, response format aur errors implement karo.",
    tasks: ["Standard API response", "Global error handler", "Product CRUD", "Pagination + filtering", "Bulk update/delete"],
    endpoints: ["GET /api/v1/products", "POST /api/v1/products", "PATCH /api/v1/products/:id", "DELETE /api/v1/products/:id"],
  },
  databases: {
    title: "Database Lab",
    subtitle: "MongoDB, Mongoose, PostgreSQL aur Prisma ke schemas, relations aur query performance test karo.",
    tasks: ["Mongoose schemas", "Populate vs aggregation", "Indexes and explain", "SQL joins", "Prisma migrations"],
    endpoints: ["GET /api/v1/db/status", "GET /api/v1/products/search", "GET /api/v1/orders/summary"],
  },
  auth: {
    title: "Authentication Studio",
    subtitle: "Register/login se refresh-token rotation aur password reset tak full auth system banao.",
    tasks: ["Register validation", "bcrypt password hashing", "Access token", "Refresh token cookie", "Forgot password flow"],
    endpoints: ["POST /api/v1/auth/register", "POST /api/v1/auth/login", "POST /api/v1/auth/logout", "POST /api/v1/auth/refresh-token"],
  },
  security: {
    title: "Security Checklist",
    subtitle: "CORS, cookies, input validation, rate limiting, injection protection aur secure headers verify karo.",
    tasks: ["Helmet headers", "CORS policy", "Zod validation", "Rate limiter", "NoSQL injection prevention"],
    endpoints: ["POST /api/v1/security/validate", "GET /api/v1/security/headers", "GET /api/v1/admin/audit-logs"],
  },
  webhooks: {
    title: "Webhook Center",
    subtitle: "Payment/email provider events ko signature verification, retry aur idempotency ke saath handle karo.",
    tasks: ["Signature verification", "Duplicate event handling", "Webhook logs", "Replay attack check", "Retry failed events"],
    endpoints: ["POST /api/v1/payments/webhook", "GET /api/v1/webhooks/logs", "POST /api/v1/webhooks/replay/:id"],
  },
  queues: {
    title: "Background Jobs",
    subtitle: "Redis + BullMQ style jobs, retries, workers, delays aur failed job monitoring practice karo.",
    tasks: ["Email worker", "Payment reconciliation", "Retry with backoff", "Dead-letter queue", "Job progress tracking"],
    endpoints: ["POST /api/v1/jobs/email", "GET /api/v1/admin/jobs", "POST /api/v1/admin/jobs/:id/retry"],
  },
  monitoring: {
    title: "Observability Console",
    subtitle: "Logs, metrics, health checks, latency, error rate aur request tracing ka foundation banao.",
    tasks: ["Health/readiness route", "Structured logs", "Request ID", "Latency metrics", "Error dashboard"],
    endpoints: ["GET /api/health", "GET /api/ready", "GET /api/v1/admin/metrics", "GET /api/v1/admin/logs"],
  },
};

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white"><Server size={20} /></div>
          <div>
            <h1 className="text-lg font-semibold text-slate-950">Backend Practice Console</h1>
            <p className="text-sm text-slate-500">React UI for Express, MongoDB, auth, payments, queues and production APIs</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button className="icon-button" aria-label="Search"><Search size={18} /></button>
          <button className="icon-button" aria-label="Refresh"><RefreshCw size={18} /></button>
          <button className="primary-button"><Play size={17} /> Run API Flow</button>
        </div>
      </div>
    </header>
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
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><TerminalSquare size={17} /> Backend URL</div>
        <p className="mt-2 break-all text-sm text-slate-600">http://localhost:8000/api</p>
      </div>
    </aside>
  );
}

function MobileTabs({ activeView, onViewChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {navigation.map(({ id, label }) => (
        <button key={id} type="button" onClick={() => onViewChange(id)} className={`tab-button ${activeView === id ? "tab-button-active" : ""}`}>{label}</button>
      ))}
    </div>
  );
}

function ActivePracticePanel({ activeView }) {
  const view = practiceViews[activeView];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected workspace</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{view.title}</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{view.subtitle}</p>
        </div>
        <button className="primary-button w-full md:w-auto"><Play size={17} /> Start Lab</button>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Practice tasks</h3>
          <div className="mt-3 grid gap-2">
            {view.tasks.map((task, index) => (
              <div key={task} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">{index + 1}</span>
                <span className="text-sm font-medium text-slate-700">{task}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Endpoints to build</h3>
          <div className="mt-3 space-y-2">
            {view.endpoints.map((path) => (
              <div key={path} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">{path}</div>
            ))}
          </div>
        </div>
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
          <div className="mt-4 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${item.progress}%` }} /></div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600"><span>{item.progress}% practice</span><span>{item.endpoints} endpoints</span></div>
        </article>
      ))}
    </section>
  );
}

function ApiWorkbench() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-slate-950"><FileJson size={18} /> Endpoint Catalog</div>
          <button className="secondary-button"><Zap size={16} /> Generate CRUD</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Method</th><th className="px-4 py-3">Route</th><th className="px-4 py-3">Area</th><th className="px-4 py-3">Auth</th><th className="px-4 py-3">State</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {endpoints.map((endpoint) => (
                <tr key={endpoint.path} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><span className={`rounded border px-2 py-1 text-xs font-bold ${methodStyles[endpoint.method]}`}>{endpoint.method}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-800">{endpoint.path}</td>
                  <td className="px-4 py-3 text-slate-600">{endpoint.area}</td>
                  <td className="px-4 py-3 text-slate-600">{endpoint.auth}</td>
                  <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{endpoint.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-slate-950"><Lock size={18} /> API Scenario Runner</div>
        <div className="mt-4 space-y-2">
          {apiScenarios.map((scenario) => (
            <button key={scenario} className="scenario-row"><span>{scenario}</span><Play size={15} /></button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <div className="mt-2 flex items-end justify-between gap-2"><strong className="text-2xl font-semibold text-slate-950">{metric.value}</strong><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{metric.delta}</span></div>
        </article>
      ))}
    </section>
  );
}

function RoadmapPanel() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-semibold text-slate-950"><Gauge size={18} /> Practice Roadmap</div><span className="text-sm text-slate-500">12 active labs</span></div>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {roadmap.map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"><span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">{index + 1}</span><span className="text-sm font-medium text-slate-700">{item}</span></div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [activeView, setActiveView] = useState("rest");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="min-w-0 flex-1 space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          <MobileTabs activeView={activeView} onViewChange={setActiveView} />
          <ActivePracticePanel activeView={activeView} />
          <Metrics />
          <ModuleGrid />
          <ApiWorkbench />
          <RoadmapPanel />
        </main>
      </div>
    </div>
  );
}

export default App;