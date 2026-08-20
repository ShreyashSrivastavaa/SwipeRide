import React from 'react'

interface IconProps {
  className?: string
  size?: number
  color?: string
}

export const MotorcycleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Rear Wheel */}
    <circle cx="5" cy="16" r="3.5" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="5" cy="16" r="1.2" fill={color} />
    {/* Front Wheel */}
    <circle cx="19" cy="16" r="3.5" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="19" cy="16" r="1.2" fill={color} />
    {/* Chassis & Tank */}
    <path d="M5 16l4-7h5l3 4" stroke={color} strokeWidth="2" />
    <path d="M9 9l3 7h4l3-7" stroke={color} strokeWidth="2" />
    <path d="M12 9l-2-3h-3" stroke={color} strokeWidth="2" />
    {/* Handlebars */}
    <path d="M15 6l2 3" stroke={color} strokeWidth="2" />
    <path d="M17 5h-3" stroke={color} strokeWidth="2" />
    {/* Exhaust */}
    <path d="M7 16h6" stroke={color} strokeWidth="2.5" strokeLinecap="square" />
  </svg>
)

export const HelmetIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Helmet Shell */}
    <path d="M4 14a8 8 0 0 1 16 0c0 3-1.5 5.5-4 6.5H8c-2.5-1-4-3.5-4-6.5z" stroke={color} strokeWidth="2" />
    {/* Visor */}
    <path d="M7 12h10l-1.5 4.5H8.5L7 12z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
    {/* Chin Guard Ventilation */}
    <path d="M10 18.5h4" stroke={color} strokeWidth="2" />
  </svg>
)

export const TelemetryPinIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 7 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
    <circle cx="12" cy="10" r="3" fill={color} />
  </svg>
)

export const SpeedometerIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a9 9 0 0 0-9 9c0 3.12 1.58 5.87 4 7.5" />
    <path d="M21 12a9 9 0 0 0-4-7.5" />
    <circle cx="12" cy="12" r="2" fill={color} />
    <path d="M12 12l4-4" stroke={color} strokeWidth="2.5" />
    <path d="M6 12h1" />
    <path d="M12 6v1" />
    <path d="M18 12h-1" />
  </svg>
)

export const SurgeLightningIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#FFB800' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export const RadarIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="12" x2="19" y2="5" />
  </svg>
)

export const CargoBoxIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)
