import resumeJson from './resumeData.json';

export interface ResumePersonalInfo {
  name: string;
  title: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  github: string;
  githubUrl: string;
  portfolio: string;
  portfolioUrl: string;
  educationSummary: string;
}

export interface ResumeSkillCategory {
  category: string;
  skills: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  liveUrl?: string;
  liveUrlLabel?: string;
  technologies: string;
  bullets: string[];
}

export interface ResumeExperience {
  role: string;
  organization: string;
  period: string;
  location: string;
  technologies: string;
  bullets: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  stream: string;
  graduationYear: string;
}

export interface ResumeLanguage {
  name: string;
  fluency: string;
}

export interface ResumeData {
  personalInfo: ResumePersonalInfo;
  professionalSummary: string;
  technicalSkills: ResumeSkillCategory[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  education: ResumeEducation;
  certifications: string[];
  achievements: string[];
  leadershipAndActivities: string[];
  languages: ResumeLanguage[];
  interests: string[];
}

export const resumeData: ResumeData = resumeJson as ResumeData;

/**
 * Generates a clean, plain-text formatted version of the resume
 * dynamically derived from the decoupled JSON data source.
 */
export function generateResumePlainText(data: ResumeData = resumeData): string {
  const { personalInfo, professionalSummary, technicalSkills, projects, education, certifications, achievements, leadershipAndActivities, languages, interests } = data;

  const skillsText = technicalSkills
    .map((s) => `${s.category}: ${s.skills}`)
    .join('\n');

  const projectsText = projects
    .map((p) => {
      const header = p.liveUrlLabel ? `${p.title} (${p.liveUrlLabel})` : p.title;
      const tech = `Technologies: ${p.technologies}`;
      const bullets = p.bullets.map((b) => `• ${b}`).join('\n');
      return `${header}\n${tech}\n${bullets}`;
    })
    .join('\n\n');

  const certsText = certifications.map((c) => `• ${c}`).join('\n');
  const achieveText = achievements.map((a) => `• ${a}`).join('\n');
  const activitiesText = leadershipAndActivities.map((la) => `• ${la}`).join('\n');
  const langsText = languages.map((l) => `${l.name} (${l.fluency})`).join(', ');
  const interestsText = interests.join(', ');

  return `${personalInfo.name.toUpperCase()}
${personalInfo.title}
${personalInfo.phone} | ${personalInfo.email} | ${personalInfo.github}

PROFESSIONAL SUMMARY
${professionalSummary}

TECHNICAL SKILLS
${skillsText}

PROJECTS
${projectsText}

EDUCATION
${education.institution}
${education.degree} | ${education.stream}
${education.graduationYear}

CERTIFICATIONS
${certsText}

ACHIEVEMENTS
${achieveText}

LEADERSHIP / EXTRACURRICULAR ACTIVITIES
${activitiesText}

LANGUAGES
${langsText}

INTERESTS
${interestsText}`;
}
