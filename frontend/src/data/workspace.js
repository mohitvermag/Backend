export const modules = [
  { id: "internet", phase: "01-02", title: "Internet + HTTP", status: "Active", progress: 32, endpoints: 8, tone: "bg-cyan-500" },
  { id: "node", phase: "03-05", title: "JavaScript + Node + Express", status: "Build", progress: 46, endpoints: 14, tone: "bg-emerald-500" },
  { id: "rest", phase: "06", title: "REST API", status: "Build", progress: 58, endpoints: 20, tone: "bg-indigo-500" },
  { id: "mongo", phase: "07-08", title: "MongoDB + Mongoose", status: "Debug", progress: 24, endpoints: 12, tone: "bg-amber-500" },
  { id: "auth", phase: "12-14", title: "Auth + Security", status: "Next", progress: 10, endpoints: 18, tone: "bg-rose-500" },
  { id: "production", phase: "17-35", title: "Production Systems", status: "Planned", progress: 6, endpoints: 30, tone: "bg-violet-500" },
];

export const endpoints = [
  { method: "GET", path: "/api/health", area: "Observability", status: "Ready", auth: "Public" },
  { method: "POST", path: "/api/v1/auth/register", area: "Authentication", status: "Design", auth: "Public" },
  { method: "POST", path: "/api/v1/auth/login", area: "Authentication", status: "Design", auth: "Public" },
  { method: "POST", path: "/api/v1/auth/refresh-token", area: "JWT", status: "Design", auth: "Cookie" },
  { method: "GET", path: "/api/v1/users/me", area: "Authorization", status: "Design", auth: "Bearer" },
  { method: "GET", path: "/api/v1/products", area: "REST", status: "Build", auth: "Public" },
  { method: "POST", path: "/api/v1/orders", area: "E-Commerce", status: "Planned", auth: "Bearer" },
  { method: "POST", path: "/api/v1/payments/webhook", area: "Payments", status: "Planned", auth: "Signature" },
  { method: "GET", path: "/api/v1/admin/jobs", area: "Queues", status: "Planned", auth: "Admin" },
];

export const apiScenarios = [
  "Register user with validation errors",
  "Login and store HttpOnly refresh token",
  "Create product with admin RBAC",
  "Paginate, filter, sort, search products",
  "Create order and verify payment webhook",
  "Trigger email job and inspect logs",
];

export const metrics = [
  { label: "API Requests", value: "12.4k", delta: "+18%" },
  { label: "Avg Latency", value: "128ms", delta: "-9%" },
  { label: "Error Rate", value: "0.8%", delta: "+0.2%" },
  { label: "DB Queries", value: "38k", delta: "+11%" },
];

export const roadmap = [
  "HTTP request lifecycle",
  "Express middleware chain",
  "REST response format",
  "MongoDB data modeling",
  "JWT access + refresh flow",
  "Role based authorization",
  "File upload to object storage",
  "Redis cache-aside pattern",
  "Socket.IO rooms and events",
  "Webhook idempotency",
  "Queue worker retry flow",
  "Docker deployment with Nginx",
];