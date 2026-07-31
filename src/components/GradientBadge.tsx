import { motion } from 'framer-motion';
import { useState } from 'react';

type GradientBadgeProps = {
  children: React.ReactNode;
  /** Classes for the pill itself — padding, background, text colour, border. */
  className?: string;
  /** Must match the pill's own radius, or the ring won't line up with it. */
  rounded?: string;
  hoverScale?: number;
};

/**
 * A small label wrapped in a gradient ring that lights up and travels around on
 * hover. Shared so every chip and pill on the page animates identically.
 */
export default function GradientBadge({
  children,
  className = '',
  rounded = 'rounded-full',
  hoverScale = 1.08,
}: GradientBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: hoverScale, y: -3 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rotating gradient ring, revealed on hover */}
      <motion.div
        className={`absolute -inset-[1px] ${rounded}`}
        style={{
          background: 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)',
          backgroundSize: '300% 100%',
        }}
        animate={{
          backgroundPosition: isHovered ? ['0% 50%', '300% 50%'] : '0% 50%',
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 0.3 },
        }}
      />

      <div className={`relative ${rounded} ${className}`}>{children}</div>
    </motion.div>
  );
}
