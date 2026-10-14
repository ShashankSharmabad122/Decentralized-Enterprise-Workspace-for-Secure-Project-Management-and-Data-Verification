import React, { useState, useEffect, useRef } from 'react';

// Characters used for glitch scramble effect
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>?/\\|[]{}';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;        // ms before animation starts
  speed?: number;        // ms per frame
  triggerOnHover?: boolean;
  showCursor?: boolean;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  delay = 0,
  speed = 28,
  triggerOnHover = false,
  showCursor = false,
}) => {
  const [display, setDisplay] = useState('');
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealRef = useRef(0);

  const scramble = () => {
    if (frameRef.current) clearTimeout(frameRef.current);
    revealRef.current = 0;

    const tick = () => {
      const revealed = revealRef.current;
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealed) return text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );
      if (revealed < text.length) {
        revealRef.current += 0.55;
        frameRef.current = setTimeout(tick, speed);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = setTimeout(tick, delay);
  };

  useEffect(() => {
    scramble();
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [text]);

  return (
    <span
      className={`font-mono ${showCursor ? 'scramble-cursor' : ''} ${className}`}
      onMouseEnter={() => { if (triggerOnHover) scramble(); }}
      style={{ letterSpacing: '0.03em' }}
    >
      {display || text}
    </span>
  );
};
