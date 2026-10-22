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
  sourceUrl?: string;
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
  const sections: string[] = [];

  sections.push([
    personalInfo.name.toUpperCase(),
    personalInfo.title,
    [personalInfo.phone, personalInfo.email, personalInfo.github, personalInfo.portfolio]
      .filter(Boolean)
      .join(' | '),
  ].join('\n'));

  sections.push(`PROFESSIONAL SUMMARY\n${professionalSummary}`);
  sections.push(`TECHNICAL SKILLS\n${technicalSkills.map((s) => `${s.category}: ${s.skills}`).join('\n')}`);

  const projectsText = projects.map((project) => {
    const links = [
      project.liveUrlLabel || project.liveUrl,
      project.sourceUrl ? `Source: ${project.sourceUrl}` : '',
    ].filter(Boolean).join(' | ');
    const bullets = project.bullets.map((bullet) => `• ${bullet}`).join('\n');
    return [project.title, links, `Technologies: ${project.technologies}`, bullets].filter(Boolean).join('\n');
  }).join('\n\n');
  if (projectsText) sections.push(`PROJECTS\n${projectsText}`);

  sections.push(`LEARNING & DEVELOPMENT\n${education.institution}\n${education.degree} | ${education.stream}\n${education.graduationYear}`);
  if (certifications.length) sections.push(`CERTIFICATIONS\n${certifications.map((item) => `• ${item}`).join('\n')}`);
  if (achievements.length) sections.push(`PROJECT HIGHLIGHTS\n${achievements.map((item) => `• ${item}`).join('\n')}`);
  if (leadershipAndActivities.length) sections.push(`LEADERSHIP / ACTIVITIES\n${leadershipAndActivities.map((item) => `• ${item}`).join('\n')}`);
  if (languages.length) sections.push(`LANGUAGES\n${languages.map((item) => `${item.name} (${item.fluency})`).join(', ')}`);
  if (interests.length) sections.push(`INTERESTS\n${interests.join(', ')}`);

  return sections.join('\n\n');
}
