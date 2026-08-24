export const backendRoadmap = [
  {
    group: "Foundation",
    progress: 35,
    status: "In progress",
    topics: ["Internet", "HTTP", "Advanced JavaScript", "Node.js", "Express", "REST API"],
    practice: "Health routes, request lifecycle, middleware chain, REST response format",
  },
  {
    group: "Databases",
    progress: 18,
    status: "Planned",
    topics: ["MongoDB", "Mongoose", "Aggregation", "PostgreSQL", "Advanced SQL", "Prisma / ORM"],
    practice: "Schemas, CRUD, indexes, relations, transactions, query optimization",
  },
  {
    group: "Identity & Security",
    progress: 12,
    status: "Designing",
    topics: ["Authentication", "JWT", "Authorization", "OAuth", "Web Security", "Validation"],
    practice: "Role login, refresh tokens, RBAC, OTP reset, secure cookies, rate limits",
  },
  {
    group: "Product APIs",
    progress: 8,
    status: "Planned",
    topics: ["Files", "Email", "Notifications", "Payments", "Webhooks"],
    practice: "Uploads, transactional emails, payment verification, webhook idempotency",
  },
  {
    group: "Async Systems",
    progress: 6,
    status: "Planned",
    topics: ["Redis", "Caching", "WebSockets", "Socket.IO", "Queues", "Background Jobs"],
    practice: "Cache-aside, sessions, live chat, notifications, job retries, workers",
  },
  {
    group: "Production Engineering",
    progress: 4,
    status: "Planned",
    topics: ["Testing", "Error Handling", "Logging", "Monitoring", "Performance", "Nginx"],
    practice: "Supertest, global errors, request IDs, metrics, profiling, reverse proxy",
  },
  {
    group: "Deployment & Scale",
    progress: 2,
    status: "Later",
    topics: ["Docker", "Linux", "Deployment", "AWS", "Search", "System Design"],
    practice: "Docker compose, VPS deploy, SSL, S3, Elasticsearch, scalable architecture",
  },
  {
    group: "Advanced Backend",
    progress: 1,
    status: "Later",
    topics: ["Design Patterns", "Microservices", "Distributed Systems", "Rate Limiting", "Production Projects"],
    practice: "Repository/service layers, sagas, message brokers, distributed reliability",
  },
];

export const projectMilestones = [
  "Auth System",
  "E-Commerce Backend",
  "Real-Time Chat",
  "SaaS Workspace",
  "Production Deployment",
];