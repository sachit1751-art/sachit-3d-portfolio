import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  CheckCircle2,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Mail,
  Phone,
  GitBranch,
  Globe,
  Award,
  Sparkles,
  Code2,
  Layers,
  GraduationCap,
  Briefcase,
  Terminal
} from 'lucide-react';
import { PaperTheme } from '../../types';
import { resumeData, generateResumePlainText } from '../../data/resume';

/**
 * Editorial framer-motion variants applying a soft fade-in and subtle slide-up effect
 * tuned with a smooth cubic-bezier curve to match the paper aesthetic of the site.
 */
export const resumeViewerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // Soft, fluid cubic-bezier curve matching editorial paper aesthetics
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const resumeContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface ResumeViewerProps {
  theme: PaperTheme;
  onBack: () => void;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({ theme, onBack }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const toastTimeoutRef = useRef<number | null>(null);

  // Split projects across two printable sheets for optimal page distribution (3 on Page 1, 3 on Page 2)
  const page1Projects = resumeData.projects.slice(0, 3);
  const page2Projects = resumeData.projects.slice(3);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleDownloadClick = () => {
    triggerToast('Downloading Sachit_Resume.pdf...');
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Print request failed:', err);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <motion.main
      data-theme={theme}
      variants={resumeViewerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="resume-viewer-main relative w-full min-h-screen py-6 sm:py-10 px-3 sm:px-6 md:px-10 transition-colors duration-300 bg-transparent"
      style={{ color: 'var(--c-body)' }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.aside
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="status"
            aria-live="polite"
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-md)] shadow-lg no-print backdrop-blur-md"
            style={{
              backgroundColor: 'var(--c-btn-bg)',
              color: 'var(--c-btn-text)',
              border: '1px solid var(--c-border)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span className="text-xs font-mono font-medium">{toastMessage}</span>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.div variants={resumeContentVariants} className="max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
        {/* Top Control Bar */}
        <div
          className="resume-controls no-print flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-5 rounded-[var(--radius-lg)] shadow-xs backdrop-blur-md"
          style={{
            backgroundColor: 'var(--c-card)',
            border: '1px solid var(--c-border)',
          }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] cursor-pointer transition-all hover:bg-[var(--c-input-bg-focus)] hover:border-[var(--c-border-focus)] active:scale-95"
            style={{
              backgroundColor: 'var(--c-input-bg)',
              color: 'var(--c-heading)',
              border: '1px solid var(--c-border)',
            }}
            aria-label="Back to portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back to Portfolio</span>
            <span className="xs:hidden">Back</span>
          </button>

          {/* View Zoom and Text Size Controls */}
          <div
            className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-[var(--radius-md)]"
            style={{
              backgroundColor: 'var(--c-input-bg)',
              border: '1px solid var(--c-border)',
            }}
          >
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 70}
              className="p-1.5 rounded hover:bg-[var(--c-input-bg-focus)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Decrease scale (70% - 150%)"
              aria-label="Decrease text size"
            >
              <ZoomOut className="w-3.5 h-3.5" style={{ color: 'var(--c-body)' }} />
            </button>
            <span
              className="text-xs font-mono font-medium px-1.5 min-w-[48px] text-center select-none"
              style={{ color: 'var(--c-subtle)' }}
            >
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="p-1.5 rounded hover:bg-[var(--c-input-bg-focus)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Increase scale (70% - 150%)"
              aria-label="Increase text size"
            >
              <ZoomIn className="w-3.5 h-3.5" style={{ color: 'var(--c-body)' }} />
            </button>
            <div className="w-[1px] h-4 mx-1 bg-[var(--c-border)]" />
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded hover:bg-[var(--c-input-bg-focus)] cursor-pointer transition-colors"
              title="Reset scale to 100%"
              aria-label="Reset scale"
            >
              <Maximize2 className="w-3.5 h-3.5" style={{ color: 'var(--c-body)' }} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <a
              href="/Sachit_Resume.pdf"
              download="Sachit_Resume.pdf"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
              style={{
                backgroundColor: 'var(--c-btn-bg)',
                color: 'var(--c-btn-text)',
              }}
              aria-label="Download original Sachit Resume PDF file"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Download PDF</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:bg-[var(--c-input-bg)] hover:border-[var(--c-border-focus)] active:scale-95 cursor-pointer"
              style={{
                color: 'var(--c-heading)',
                border: '1px solid var(--c-border)',
                backgroundColor: 'transparent',
              }}
              title="Print resume clean layout or save as PDF"
              aria-label="Print resume to PDF"
            >
              <Printer className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
              <span>Print to PDF</span>
            </button>

            <a
              href="/Sachit_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:bg-[var(--c-input-bg)] hover:border-[var(--c-border-focus)] active:scale-95"
              style={{
                color: 'var(--c-heading)',
                border: '1px solid var(--c-border)',
                backgroundColor: 'transparent',
              }}
              aria-label="Open original PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Open PDF</span>
            </a>
          </div>
        </div>

        {/* Paper Sheet Document Canvas Container */}
        <div
          className="resume-viewer-container relative w-full overflow-x-auto overflow-y-visible flex flex-col p-0 sm:p-2 bg-transparent"
        >
          {/* Paper Header / Metadata */}
          <div className="resume-metadata-bar flex items-center justify-between px-2 pb-4 mb-6 border-b border-[var(--c-border)]">
            <div
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
              style={{ color: 'var(--c-subtle)' }}
            >
              <FileText className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
              <span>Sachit_Resume.pdf</span>
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-[10px] border"
                style={{
                  backgroundColor: 'var(--c-input-bg)',
                  borderColor: 'var(--c-border)',
                  color: 'var(--c-heading)',
                }}
              >
                2 Pages • Verified Decoupled Data Source
              </span>
            </div>
            <div
              className="text-[10px] font-mono uppercase tracking-wider hidden sm:flex items-center gap-2"
              style={{ color: 'var(--c-faint)' }}
            >
              <span>Editorial Typography</span>
            </div>
          </div>

          {/* Printable Resume Sheets Frame */}
          <div
            className="resume-pdf-frame flex flex-col items-center gap-8 w-full py-2 transition-all duration-200 origin-top"
            style={{
              zoom: `${zoomLevel}%`,
            }}
          >
            {/* ============================================================ */}
            {/* PAGE 1: Header, Summary, Technical Skills, Projects, Education */}
            {/* ============================================================ */}
            <article
              className="resume-page-card resume-sheet w-full max-w-[850px] rounded-[var(--radius-lg)] p-6 sm:p-10 md:p-12 transition-all select-text backdrop-blur-md"
              style={{
                backgroundColor: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-body)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Top Banner Page Indicator (Screen Only) */}
              <div className="no-print flex items-center justify-between text-[11px] font-mono pb-4 mb-6 border-b border-[var(--c-border)] opacity-60">
                <span>Page 1 of 2</span>
                <span>{resumeData.personalInfo.name} — Curriculum Vitae</span>
              </div>

              {/* Resume Header */}
              <header className="flex flex-col gap-3 pb-6 mb-6 border-b border-[var(--c-border)]">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h1
                    className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    {resumeData.personalInfo.name}
                  </h1>
                  <span
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-[var(--radius-sm)] w-fit"
                    style={{
                      backgroundColor: 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-heading)',
                    }}
                  >
                    {resumeData.personalInfo.educationSummary}
                  </span>
                </div>

                <p
                  className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--c-heading)' }}
                >
                  {resumeData.personalInfo.title}
                </p>

                {/* Contact Line Items */}
                <div
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs font-mono"
                  style={{ color: 'var(--c-subtle)' }}
                >
                  <a
                    href={resumeData.personalInfo.phoneHref}
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </a>
                  <span>•</span>
                  <a
                    href={resumeData.personalInfo.emailHref}
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{resumeData.personalInfo.email}</span>
                  </a>
                  <span>•</span>
                  <a
                    href={resumeData.personalInfo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors underline"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{resumeData.personalInfo.github}</span>
                  </a>
                  <span>•</span>
                  <a
                    href={resumeData.personalInfo.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio: {resumeData.personalInfo.portfolio}</span>
                  </a>
                </div>
              </header>

              {/* 1. PROFESSIONAL SUMMARY */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Briefcase className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Professional Summary
                  </h2>
                </div>
                <p className="text-sm font-body leading-relaxed text-justify" style={{ color: 'var(--c-body)' }}>
                  {resumeData.professionalSummary}
                </p>
              </section>

              {/* 2. TECHNICAL SKILLS */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Terminal className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Technical Skills
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-sm">
                  {resumeData.technicalSkills.map((skillItem) => (
                    <div key={skillItem.category} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="font-mono text-xs font-bold min-w-[170px]" style={{ color: 'var(--c-heading)' }}>
                        {skillItem.category}:
                      </span>
                      <span className="font-body text-xs sm:text-sm" style={{ color: 'var(--c-body)' }}>
                        {skillItem.skills}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. PROJECTS (Page 1 Subset) */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[var(--c-border)]">
                  <Code2 className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Projects
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  {page1Projects.map((project) => (
                    <div key={project.id} className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                          {project.title}
                        </h3>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono underline hover:text-[var(--c-heading)]"
                            style={{ color: 'var(--c-heading)' }}
                          >
                            {project.liveUrlLabel || 'live demo'}
                          </a>
                        )}
                      </div>
                      <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                        <strong className="text-[var(--c-heading)]">Technologies:</strong> {project.technologies}
                      </p>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                        {project.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. EDUCATION & CERTIFICATIONS (Bottom of Page 1) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[var(--c-border)]">
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--c-border)]">
                    <GraduationCap className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                    <h2
                      className="font-heading text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--c-heading)' }}
                    >
                      Education
                    </h2>
                  </div>
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--c-heading)' }}>
                    {resumeData.education.institution}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--c-subtle)' }}>
                    {resumeData.education.degree} | {resumeData.education.stream}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--c-subtle)' }}>
                    {resumeData.education.graduationYear}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--c-border)]">
                    <Award className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                    <h2
                      className="font-heading text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--c-heading)' }}
                    >
                      Certifications
                    </h2>
                  </div>
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--c-heading)' }}>
                    Anthropic Skill Jar
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--c-subtle)' }}>
                    {resumeData.certifications[0]}
                  </p>
                </div>
              </div>
            </article>

            {/* ============================================================ */}
            {/* PAGE 2: Additional Projects, Achievements, Activities, Langs */}
            {/* ============================================================ */}
            <article
              className="resume-page-card resume-sheet w-full max-w-[850px] rounded-[var(--radius-lg)] p-6 sm:p-10 md:p-12 transition-all select-text backdrop-blur-md"
              style={{
                backgroundColor: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-body)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Top Banner Page Indicator (Screen Only) */}
              <div className="no-print flex items-center justify-between text-[11px] font-mono pb-4 mb-6 border-b border-[var(--c-border)] opacity-60">
                <span>Page 2 of 2</span>
                <span>{resumeData.personalInfo.name} — Curriculum Vitae (Continued)</span>
              </div>

              {/* Continued Projects */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[var(--c-border)]">
                  <Code2 className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Projects (Continued)
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  {page2Projects.map((project) => (
                    <div key={project.id} className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                          {project.title}
                        </h3>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono underline hover:text-[var(--c-heading)]"
                            style={{ color: 'var(--c-heading)' }}
                          >
                            {project.liveUrlLabel || 'live demo'}
                          </a>
                        )}
                      </div>
                      <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                        <strong className="text-[var(--c-heading)]">Technologies:</strong> {project.technologies}
                      </p>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                        {project.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ACHIEVEMENTS */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Achievements
                  </h2>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                  {resumeData.achievements.map((achievement, aIdx) => (
                    <li key={aIdx}>{achievement}</li>
                  ))}
                </ul>
              </section>

              {/* LEADERSHIP / EXTRACURRICULAR ACTIVITIES */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Layers className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Leadership / Extracurricular Activities
                  </h2>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                  {resumeData.leadershipAndActivities.map((activity, actIdx) => (
                    <li key={actIdx}>{activity}</li>
                  ))}
                </ul>
              </section>

              {/* LANGUAGES & INTERESTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[var(--c-border)]">
                <div>
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Languages
                  </h3>
                  <p className="text-xs sm:text-sm font-body" style={{ color: 'var(--c-body)' }}>
                    {resumeData.languages.map((l) => `${l.name} (${l.fluency})`).join(', ')}
                  </p>
                </div>

                <div>
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Interests
                  </h3>
                  <p className="text-xs sm:text-sm font-body" style={{ color: 'var(--c-body)' }}>
                    {resumeData.interests.join(', ')}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Direct Fallback Helper Bar */}
          <div
            className="resume-fallback-bar mt-6 pt-4 border-t border-[var(--c-border)] text-center text-xs font-mono no-print flex flex-wrap items-center justify-center gap-2"
            style={{ color: 'var(--c-subtle)' }}
          >
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 underline font-semibold hover:text-[var(--c-heading)] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <span>•</span>
            <a
              href="/Sachit_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-[var(--c-heading)]"
            >
              Open PDF in new tab
            </a>
            <span>•</span>
            <a
              href="/Sachit_Resume.pdf"
              download="Sachit_Resume.pdf"
              onClick={handleDownloadClick}
              className="underline font-semibold hover:text-[var(--c-heading)]"
            >
              Download PDF directly
            </a>
          </div>
        </div>
      </motion.div>
    </motion.main>
  );
};
export default ResumeViewer;
