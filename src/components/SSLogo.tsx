import React from 'react';

interface LogoProps {
  size?: number;
  /** 'light' = white mark, transparent bg | 'dark' = black bg | 'ice' = ice-blue glow */
  variant?: 'light' | 'dark' | 'ice';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Shashank Sharma – SS circular monogram logo
 * Precise SVG recreation: outer ring + inner interlocking double-S mark
 */
export const SSLogo: React.FC<LogoProps> = ({
  size = 40,
  variant = 'light',
  className,
  style,
}) => {
  const fgColor = variant === 'ice' ? '#b8d9e8' : '#ffffff';
  const glowFilter = variant === 'ice'
    ? 'drop-shadow(0 0 6px rgba(74,154,181,0.65)) drop-shadow(0 0 16px rgba(74,154,181,0.35))'
    : 'none';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0, filter: glowFilter, ...style }}
      aria-label="Shashank Sharma Logo"
      role="img"
    >
      {/* ── Black background ── */}
      {variant === 'dark' && (
        <rect width="200" height="200" fill="#000000" rx="32" />
      )}

      {/* ── Outer ring ── */}
      <circle cx="100" cy="100" r="91" fill="none" stroke={fgColor} strokeWidth="9" />

      {/* ── Inner ring (double-ring effect) ── */}
      <circle cx="100" cy="100" r="77" fill="none" stroke={fgColor} strokeWidth="5.5" />

      {/*
        ── SS Monogram ──
        The mark is two interlocked S-curves sharing a spine.
        The outer S spirals clockwise (top-right anchor → bottom-left anchor).
        The inner S mirrors, creating the figure-8 / spiral joint at the bottom.

        Traced to match: the top has a large C-curve opening right,
        the middle crosses, and the bottom has a smaller coiled loop.
      */}
      <g fill="none" stroke={fgColor} strokeLinecap="round" strokeLinejoin="round">

        {/* OUTER S — large sweep */}
        <path
          d="
            M 115 48
            C 145 48, 162 63, 162 80
            C 162 96, 148 105, 130 110
            L 100 118
            C 78  124, 62 134, 62 152
            C 62  169, 77 182, 100 182
            C 118 182, 133 174, 140 162
          "
          strokeWidth="14"
          fill="none"
        />

        {/* Outer S — top bowl C-curve (the outer visible arc) */}
        <path
          d="
            M 78  62
            C 78  49, 90 42, 105 42
            C 122 42, 138 51, 142 66
          "
          strokeWidth="14"
          fill="none"
        />

        {/* INNER S — smaller interlocked form */}
        <path
          d="
            M 124 68
            C 140 68, 148 76, 148 86
            C 148 96, 139 102, 124 107
            L 98  116
            C 82  121, 72  130, 72 143
            C 72  156, 82 164, 98 164
            C 110 164, 120 158, 126 150
          "
          strokeWidth="9"
          fill="none"
        />

        {/* Inner top bowl */}
        <path
          d="
            M 88  76
            C 88  67, 95 62, 105 62
            C 116 62, 125 68, 127 77
          "
          strokeWidth="9"
          fill="none"
        />

        {/* Coiled bottom joint — the distinctive spiral loop */}
        <path
          d="
            M 100 155
            C 92  155, 86 150, 86 144
            C 86  136, 94 132, 102 135
            C 110 138, 112 146, 106 152
            C 102 156, 96 156, 92 152
          "
          strokeWidth="8"
          fill="none"
        />
      </g>
    </svg>
  );
};
