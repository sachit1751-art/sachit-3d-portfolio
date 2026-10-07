import React from 'react';

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

const baseStyle: React.CSSProperties = {
  shapeRendering: 'crispEdges',
  imageRendering: 'pixelated',
};

// 1. Pixel Unfold / Open Sheet
export const PixelUnfold: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    {/* Outer page outline */}
    <path d="M3 2H10V5H13V14H3V2Z" fill={color} fillOpacity="0.15" />
    <path d="M3 1H10V2H3V1ZM10 1L14 5V15H2V1H10ZM10 2V5H13V14H3V2H10Z" fill={color} />
    {/* Page fold lines */}
    <rect x="5" y="4" width="4" height="1" fill={color} />
    <rect x="5" y="6" width="6" height="1" fill={color} />
    <rect x="5" y="8" width="6" height="1" fill={color} />
    <rect x="5" y="10" width="4" height="1" fill={color} />
    {/* Corner crease */}
    <path d="M10 2H11V5H14V6H10V2Z" fill={color} />
  </svg>
);

// 2. Pixel Fold / Crumpled Ball
export const PixelCrumple: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    {/* Origami crumpled paper ball silhouette */}
    <rect x="5" y="2" width="6" height="1" fill={color} />
    <rect x="3" y="3" width="2" height="2" fill={color} />
    <rect x="11" y="3" width="2" height="2" fill={color} />
    <rect x="2" y="5" width="1" height="6" fill={color} />
    <rect x="13" y="5" width="1" height="6" fill={color} />
    <rect x="3" y="11" width="2" height="2" fill={color} />
    <rect x="11" y="11" width="2" height="2" fill={color} />
    <rect x="5" y="13" width="6" height="1" fill={color} />
    {/* Crease fold internal lines */}
    <rect x="4" y="6" width="3" height="1" fill={color} />
    <rect x="8" y="5" width="1" height="3" fill={color} />
    <rect x="9" y="8" width="3" height="1" fill={color} />
    <rect x="6" y="9" width="1" height="3" fill={color} />
    <rect x="7" y="10" width="3" height="1" fill={color} />
  </svg>
);

// 3. Pixel Speaker / Volume
export const PixelVolume: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    {/* Speaker cone */}
    <rect x="2" y="6" width="2" height="4" fill={color} />
    <rect x="4" y="5" width="2" height="6" fill={color} />
    <path d="M6 5L9 2V14L6 11V5Z" fill={color} />
    {/* Sound waves */}
    <rect x="11" y="6" width="1" height="4" fill={color} />
    <rect x="13" y="4" width="1" height="8" fill={color} />
  </svg>
);

// 4. Pixel Mute
export const PixelMute: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    {/* Speaker cone */}
    <rect x="1" y="6" width="2" height="4" fill={color} />
    <rect x="3" y="5" width="2" height="6" fill={color} />
    <path d="M5 5L8 2V14L5 11V5Z" fill={color} />
    {/* Pixel X */}
    <rect x="10" y="5" width="1" height="1" fill={color} />
    <rect x="14" y="5" width="1" height="1" fill={color} />
    <rect x="11" y="6" width="1" height="1" fill={color} />
    <rect x="13" y="6" width="1" height="1" fill={color} />
    <rect x="12" y="7" width="1" height="2" fill={color} />
    <rect x="11" y="9" width="1" height="1" fill={color} />
    <rect x="13" y="9" width="1" height="1" fill={color} />
    <rect x="10" y="10" width="1" height="1" fill={color} />
    <rect x="14" y="10" width="1" height="1" fill={color} />
  </svg>
);

// 5. Pixel Terminal
export const PixelTerminal: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <rect x="1" y="2" width="14" height="12" fill={color} fillOpacity="0.1" />
    <path d="M1 2H15V14H1V2ZM2 3V13H14V3H2Z" fill={color} />
    <rect x="2" y="3" width="12" height="2" fill={color} fillOpacity="0.2" />
    {/* > prompt */}
    <rect x="4" y="7" width="1" height="1" fill={color} />
    <rect x="5" y="8" width="1" height="1" fill={color} />
    <rect x="4" y="9" width="1" height="1" fill={color} />
    {/* Cursor underscore */}
    <rect x="7" y="9" width="3" height="1" fill={color} />
  </svg>
);

// 6. Pixel Code Brackets
export const PixelCode: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    {/* < bracket */}
    <rect x="5" y="4" width="1" height="1" fill={color} />
    <rect x="4" y="5" width="1" height="1" fill={color} />
    <rect x="3" y="6" width="1" height="2" fill={color} />
    <rect x="4" y="8" width="1" height="1" fill={color} />
    <rect x="5" y="9" width="1" height="1" fill={color} />
    {/* / slash */}
    <rect x="9" y="4" width="1" height="2" fill={color} />
    <rect x="8" y="6" width="1" height="2" fill={color} />
    <rect x="7" y="8" width="1" height="2" fill={color} />
    {/* > bracket */}
    <rect x="11" y="4" width="1" height="1" fill={color} />
    <rect x="12" y="5" width="1" height="1" fill={color} />
    <rect x="13" y="6" width="1" height="2" fill={color} />
    <rect x="12" y="8" width="1" height="1" fill={color} />
    <rect x="11" y="9" width="1" height="1" fill={color} />
  </svg>
);

// 7. Pixel Briefcase
export const PixelBriefcase: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <rect x="6" y="2" width="4" height="2" fill={color} fillOpacity="0.2" />
    <path d="M6 2H10V4H6V2ZM5 1H11V3H13V14H3V3H5V1ZM4 4V13H12V4H4Z" fill={color} />
    <rect x="7" y="7" width="2" height="2" fill={color} />
  </svg>
);

// 8. Pixel Mail / Envelope
export const PixelMail: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <path d="M2 3H14V13H2V3ZM3 4V12H13V4H3Z" fill={color} />
    <rect x="3" y="5" width="2" height="1" fill={color} />
    <rect x="11" y="5" width="2" height="1" fill={color} />
    <rect x="5" y="6" width="2" height="1" fill={color} />
    <rect x="9" y="6" width="2" height="1" fill={color} />
    <rect x="7" y="7" width="2" height="1" fill={color} />
  </svg>
);

// 9. Pixel User / Profile
export const PixelUser: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    {/* Head */}
    <rect x="6" y="2" width="4" height="1" fill={color} />
    <rect x="5" y="3" width="6" height="4" fill={color} />
    <rect x="6" y="7" width="4" height="1" fill={color} />
    {/* Body / Shoulders */}
    <rect x="4" y="9" width="8" height="1" fill={color} />
    <rect x="2" y="10" width="12" height="4" fill={color} />
  </svg>
);

// 10. Pixel Arrow Up Right
export const PixelArrowUpRight: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <rect x="7" y="3" width="6" height="2" fill={color} />
    <rect x="11" y="5" width="2" height="4" fill={color} />
    <rect x="9" y="6" width="2" height="2" fill={color} />
    <rect x="7" y="8" width="2" height="2" fill={color} />
    <rect x="5" y="10" width="2" height="2" fill={color} />
    <rect x="3" y="12" width="2" height="2" fill={color} />
  </svg>
);

// 11. Pixel Sparkles / Star
export const PixelSparkle: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <rect x="7" y="2" width="2" height="3" fill={color} />
    <rect x="7" y="11" width="2" height="3" fill={color} />
    <rect x="2" y="7" width="3" height="2" fill={color} />
    <rect x="11" y="7" width="3" height="2" fill={color} />
    <rect x="5" y="5" width="6" height="6" fill={color} />
  </svg>
);

// 12. Pixel Search
export const PixelSearch: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <path d="M4 2H9V3H11V5H12V9H11V11H9V12H4V11H2V9H1V5H2V3H4V2ZM3 5V9H4V10H9V9H10V5H9V4H4V5H3Z" fill={color} />
    <rect x="10" y="10" width="2" height="2" fill={color} />
    <rect x="12" y="12" width="3" height="3" fill={color} />
  </svg>
);

// 13. Pixel Gamepad Controller
export const PixelGamePad: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <path d="M2 5H14V11H12V12H10V11H6V12H4V11H2V5ZM3 6V10H5V9H11V10H13V6H3Z" fill={color} />
    {/* D-pad */}
    <rect x="4" y="7" width="3" height="1" fill={color} />
    <rect x="5" y="6" width="1" height="3" fill={color} />
    {/* Action buttons */}
    <rect x="10" y="8" width="1" height="1" fill={color} />
    <rect x="11" y="7" width="1" height="1" fill={color} />
  </svg>
);

// 14. Pixel GitHub
export const PixelGithub: React.FC<PixelIconProps> = ({ size = 16, className = '', color = 'currentColor', style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ ...baseStyle, ...style }}
    {...props}
  >
    <path d="M5 2H11V3H13V5H14V11H13V13H11V14H9V11H7V14H5V13H3V11H2V5H3V3H5V2Z" fill={color} fillOpacity="0.1" />
    <path d="M5 2H11V3H13V5H14V11H13V13H11V14H9V12H7V14H5V13H3V11H2V5H3V3H5V2ZM3 5V11H5V12H7V10H9V12H11V11H13V5H11V3H5V5H3Z" fill={color} />
    <rect x="4" y="6" width="2" height="2" fill={color} />
    <rect x="10" y="6" width="2" height="2" fill={color} />
  </svg>
);
