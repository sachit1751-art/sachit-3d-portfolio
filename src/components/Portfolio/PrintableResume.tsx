import React from 'react';
// sachit-portfolio-2026-printable-layout
import { resumeData } from '../../data/resume';

export const PrintableResume: React.FC = () => {
  return (
    <div className="print-only hidden print:block font-serif text-black bg-white p-8 max-w-[800px] mx-auto select-text">
      {/* Printable Header */}
      <header className="border-b-2 border-black pb-4 mb-6 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-1">
          {resumeData.personalInfo.name}
        </h1>
        <p className="text-sm font-bold uppercase tracking-wider text-black mb-3">
          {resumeData.personalInfo.title}
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-black font-mono">
          {resumeData.personalInfo.phone && (
            <>
              <span>{resumeData.personalInfo.phone}</span>
              <span>•</span>
            </>
          )}
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.github}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.portfolio}</span>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2 text-black">
          Professional Summary
        </h2>
        <p className="text-xs leading-relaxed text-justify text-black">
          {resumeData.professionalSummary}
        </p>
      </section>

      {/* Technical Skills */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2 text-black">
          Technical Skills
        </h2>
        <div className="space-y-1 text-xs">
          {resumeData.technicalSkills.map((s) => (
            <div key={s.category} className="flex gap-2">
              <span className="font-bold min-w-[150px] text-black">{s.category}:</span>
              <span className="text-black">{s.skills}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-3 text-black">
          Projects
        </h2>
        <div className="space-y-4">
          {resumeData.projects.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="flex flex-wrap justify-between items-baseline gap-2">
                <h3 className="font-bold text-sm text-black">{p.title}</h3>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-black">
                  {p.liveUrl && <span>Live: {p.liveUrl}</span>}
                  {p.sourceUrl && <span>Source: {p.sourceUrl}</span>}
                </div>
              </div>
              <p className="text-[11px] font-mono text-black">
                <strong>Tech:</strong> {p.technologies}
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-xs text-black">
                {p.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Learning & Development */}
      <section className="mb-6 page-break-before">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2 text-black">
          Learning & Development
        </h2>
        <div className="grid grid-cols-1 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-black">{resumeData.education.institution}</h3>
            <p className="text-black">{resumeData.education.degree} | {resumeData.education.stream}</p>
            <p className="text-black">{resumeData.education.graduationYear}</p>
          </div>
          {resumeData.certifications.length > 0 && (
            <div>
              <h3 className="font-bold text-black">Certifications</h3>
              <ul className="list-disc pl-4 space-y-1 text-black">
                {resumeData.certifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2 text-black">
          Achievements
        </h2>
        <ul className="list-disc pl-4 space-y-1 text-xs text-black">
          {resumeData.achievements.map((a, idx) => (
            <li key={idx}>{a}</li>
          ))}
        </ul>
      </section>

      {/* Leadership & Activities */}
      {resumeData.leadershipAndActivities.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2 text-black">
            Leadership & Extracurricular Activities
          </h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-black">
            {resumeData.leadershipAndActivities.map((act) => (
              <li key={act}>{act}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-black text-center text-[10px] text-black font-mono">
        © 2026 Sachit — All Rights Reserved
      </footer>
    </div>
  );
};
