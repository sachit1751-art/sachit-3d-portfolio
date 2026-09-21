import { useEffect } from 'react';
// ​provenance:sachit-2026-original​
import { trackPageView } from '../../utils/analytics';

export interface SEOMetadataProps {
  activeSection?: string;
  pageType?: 'home' | 'resume' | 'privacy' | 'terms' | '404';
  customTitle?: string;
  customDescription?: string;
  canonicalPath?: string;
  googleSiteVerification?: string;
}

const SECTION_SEO_MAP: Record<string, { title: string; description: string; keywords: string[] }> = {
  hero: {
    title: 'Sachit',
    description: 'Portfolio of Sachit, a Software Developer and Prompt Engineer focusing on full-stack web applications, AI tools, custom Android platforms, and automation.',
    keywords: ['Sachit', 'Sachit developer', 'Sachit web developer', 'Sachit AI developer', 'AI automation developer', 'React', 'TypeScript', 'Next.js', 'Python'],
  },
  about: {
    title: 'About Sachit — AI Automation & Web Developer',
    description: 'Learn about Sachit’s engineering background, craftsmanship, and passion for building high-performance web applications and AI automation systems.',
    keywords: ['About Sachit', 'Sachit software developer', 'AI automation developer India', 'Full-Stack Developer Background'],
  },
  projects: {
    title: 'Featured Projects — Sachit Portfolio',
    description: 'Explore featured software engineering and AI projects built by Sachit including SKY ROMs, Claude Doc Summarizer, and AI Chatbot.',
    keywords: ['Portfolio Projects', 'SKY ROMs', 'Claude API', 'React Projects', 'TypeScript Apps', 'AI Automation Projects'],
  },
  skills: {
    title: 'Technical Skills & Stack — Sachit',
    description: 'Detailed breakdown of technical proficiencies: Python, JavaScript, TypeScript, React, Next.js, Node.js, Supabase, PostgreSQL, and AI APIs.',
    keywords: ['Technical Skills', 'React Developer', 'TypeScript Developer', 'Next.js Developer', 'AI Integration', 'Python Developer'],
  },
  quotes: {
    title: 'Dev Mindset & Quotes — Sachit',
    description: 'Engineering principles, software craftsmanship philosophies, and quotes that guide Sachit’s development approach.',
    keywords: ['Dev Mindset', 'Software Engineering Principles', 'Sachit Portfolio'],
  },
  contact: {
    title: 'Contact Sachit — AI Automation & Web Developer',
    description: 'Get in touch with Sachit for software development opportunities, AI automation consulting, web application projects, or collaborations.',
    keywords: ['Contact Sachit', 'Hire Sachit', 'AI Automation Developer Contact'],
  },
  'building-in-public': {
    title: 'Engineering Journal & Building in Public — Sachit',
    description: 'Read Sachit’s latest engineering logs, architectural experiments, and open-source building updates in real-time.',
    keywords: ['Engineering Journal', 'Building in Public', 'Code Logs', 'Software Architecture Blog'],
  },
};

export const SEOMetadata = ({
  activeSection = 'hero',
  pageType = 'home',
  customTitle,
  customDescription,
  canonicalPath = '/',
  googleSiteVerification = 'google-site-verification-placeholder-token',
}: SEOMetadataProps) => {
  useEffect(() => {
    let title = customTitle;
    let description = customDescription;
    let keywords = ['Sachit', 'Software Developer', 'Prompt Engineer', 'Portfolio'];

    if (pageType === 'resume') {
      title = 'Curriculum Vitae / Resume — Sachit';
      description = 'Interactive professional resume of Sachit, detailing software engineering experience, projects, and technical skills.';
      keywords.push('Resume', 'CV', 'Software Engineer Resume');
    } else if (pageType === 'privacy') {
      title = 'Privacy Policy — Sachit Portfolio';
      description = 'Privacy policy and data handling practices for Sachit portfolio website.';
    } else if (pageType === 'terms') {
      title = 'Terms of Service — Sachit Portfolio';
      description = 'Terms of service and usage conditions for Sachit portfolio application.';
    } else if (pageType === '404') {
      title = 'Page Not Found (404) — Sachit';
      description = 'The requested page could not be found on Sachit portfolio.';
    } else if (activeSection && SECTION_SEO_MAP[activeSection]) {
      const sectionInfo = SECTION_SEO_MAP[activeSection];
      title = title || sectionInfo.title;
      description = description || sectionInfo.description;
      keywords = [...keywords, ...sectionInfo.keywords];
    } else {
      title = title || 'Sachit';
      description = description || 'Portfolio of Sachit, a Software Developer and Prompt Engineer focusing on full-stack web applications, AI tools, custom Android platforms, and automation.';
    }

    const fullTitle = title.includes('Sachit') ? title : `${title} — Sachit`;
    document.title = fullTitle;

    // 1. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 2. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // 3. Google Site Verification (Search Console)
    let gSiteVer = document.querySelector('meta[name="google-site-verification"]');
    if (!gSiteVer) {
      gSiteVer = document.createElement('meta');
      gSiteVer.setAttribute('name', 'google-site-verification');
      document.head.appendChild(gSiteVer);
    }
    gSiteVer.setAttribute('content', googleSiteVerification);

    // 4. Open Graph Meta Tags (Facebook, LinkedIn, Google Search)
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', fullTitle);
    setOgTag('og:description', description);
    setOgTag('og:type', pageType === 'home' && activeSection === 'hero' ? 'website' : 'article');
    setOgTag('og:url', `https://sachin-portfoli.vercel.app${canonicalPath}`);
    setOgTag('og:site_name', 'Sachit Portfolio');

    // 5. Twitter Card Meta Tags
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', fullTitle);
    setTwitterTag('twitter:description', description);

    // 6. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://sachin-portfoli.vercel.app${canonicalPath}`);

    // 7. Schema.org JSON-LD Structured Data for Google Search Console & Knowledge Graph
    let jsonLdScript = document.querySelector('#seo-json-ld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('id', 'seo-json-ld');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: 'Sachit',
        jobTitle: 'AI Automation & Web Developer',
        url: 'https://sachin-portfoli.vercel.app/',
        sameAs: [
          'https://github.com/sachit1751-art',
          'https://linkedin.com/in/sachit',
        ],
        knowsAbout: [
          'AI Automation',
          'Web Development',
          'React',
          'TypeScript',
          'Next.js',
          'Python',
          'Claude API',
          'Full-Stack Web Development',
        ],
      },
    };

    jsonLdScript.textContent = JSON.stringify(structuredData);

    // Track page view
    trackPageView(canonicalPath, fullTitle);
  }, [activeSection, pageType, customTitle, customDescription, canonicalPath, googleSiteVerification]);

  return null;
};
