import React from 'react';
import {
  Mail,
  Briefcase,
  Code2,
  Terminal,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { GitHubIcon } from './Icons';

export interface PixelIconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function PixelGithub({ size = 18, className = '', style }: PixelIconProps) {
  return <GitHubIcon size={size} className={className} style={style} />;
}

export function PixelMail({ size = 18, className = '', style }: PixelIconProps) {
  return <Mail size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelBriefcase({ size = 18, className = '', style }: PixelIconProps) {
  return <Briefcase size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelCode({ size = 18, className = '', style }: PixelIconProps) {
  return <Code2 size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelTerminal({ size = 18, className = '', style }: PixelIconProps) {
  return <Terminal size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelSparkle({ size = 18, className = '', style }: PixelIconProps) {
  return <Sparkles size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelVolume({ size = 18, className = '', style }: PixelIconProps) {
  return <Volume2 size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelMute({ size = 18, className = '', style }: PixelIconProps) {
  return <VolumeX size={size} className={`inline-block ${className}`} style={style} />;
}

export function PixelUnfold({ size = 18, className = '', style }: PixelIconProps) {
  return <Maximize2 size={size} className={`inline-block ${className}`} style={style} />;
}
