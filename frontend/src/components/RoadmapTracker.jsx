import { CheckCircle2, CircleDashed, Map, TrendingUp } from "lucide-react";
import { backendRoadmap, projectMilestones } from "../data/backendRoadmap";

export default function RoadmapTracker({ compact = false }) {
  const totalProgress = Math.round(
    backendRoadmap.reduce((sum, item) => sum + item.progress, 0) / backendRoadmap.length
  );

  return (
    <section className="roadmap-tracker">
      <div className="roadmap-header">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Map size={17} /> Backend master roadmap
          </div>
          <h2>{compact ? "Implementation Progress" : "Track what you planned to practice"}</h2>
          <p>
            Ye chart tumhare 40-topic backend syllabus ko project milestones mein map karta hai. Progress values frontend-only hain; tum implement karte waqt update kar sakte ho.
          </p>
        </div>
        <div className="roadmap-score">
          <TrendingUp size={18} />
          <strong>{totalProgress}%</strong>
          <span>overall</span>
        </div>
      </div>

      <div className="roadmap-milestones">
        {projectMilestones.map((milestone, index) => (
          <div key={milestone} className="milestone-pill">
            {index === 0 ? <CheckCircle2 size={16} /> : <CircleDashed size={16} />}
            {milestone}
          </div>
        ))}
      </div>

      <div className={compact ? "roadmap-grid roadmap-grid-compact" : "roadmap-grid"}>
        {backendRoadmap.map((item) => (
          <article key={item.group} className="roadmap-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3>{item.group}</h3>
                <span>{item.status}</span>
              </div>
              <strong>{item.progress}%</strong>
            </div>
            <div className="roadmap-bar"><div style={{ width: `${item.progress}%` }} /></div>
            <p>{item.practice}</p>
            <div className="topic-list">
              {item.topics.map((topic) => <span key={topic}>{topic}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}