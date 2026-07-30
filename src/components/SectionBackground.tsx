import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Star } from 'lucide-react';

export type BackgroundTint = 'cyan' | 'purple' | 'pink';

const RGB: Record<BackgroundTint, string> = {
  cyan: '34, 211, 238',
  purple: '167, 139, 250',
  pink: '244, 114, 182',
};

// Every section runs the same brightness; only the order of the three accents
// changes, so sections read as variations of one treatment instead of copies.
const TINT_ORDER: Record<BackgroundTint, BackgroundTint[]> = {
  cyan: ['cyan', 'purple', 'pink'],
  purple: ['purple', 'cyan', 'pink'],
  pink: ['pink', 'purple', 'cyan'],
};

// Offsets the seeded field below so sections don't share an identical layout.
const TINT_SEED: Record<BackgroundTint, number> = {
  cyan: 1,
  purple: 977,
  pink: 1931,
};

/**
 * Deterministic pseudo-random in [0, 1). Keeps the component pure — the star
 * and particle fields have to stay put across re-renders, and `Math.random()`
 * during render can't promise that.
 */
const seeded = (seed: number) => {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  return n - Math.floor(n);
};

const AnimatedStar = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Star className="text-cyan-300 fill-cyan-300" style={{ width: size, height: size }} />
  </motion.div>
);

const Particle = ({ delay, x, duration }: { delay: number; x: number; duration: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-cyan-300 to-purple-400"
    style={{ left: `${x}%`, bottom: 0 }}
    animate={{
      y: [0, -800],
      opacity: [0, 1, 1, 0],
      scale: [0, 1.5, 1, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

type SectionBackgroundProps = {
  /** Which accent leads the mesh, grid and first orb. */
  tint?: BackgroundTint;
  starCount?: number;
  particleCount?: number;
};

/**
 * The Hero background treatment — base colour, animated mesh gradient, glowing
 * grid, drifting orbs, stars and rising particles — shared by every section so
 * the whole page keeps the same brightness.
 */
export default function SectionBackground({
  tint = 'cyan',
  starCount = 18,
  particleCount = 24,
}: SectionBackgroundProps) {
  const [lead, second, third] = TINT_ORDER[tint];
  const seed = TINT_SEED[tint];

  // Seeded rather than random so the field doesn't jump around when the parent
  // re-renders (tab switches, carousel steps, typing in the contact form).
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => {
        const s = seed + i * 4;
        return {
          x: seeded(s) * 100,
          y: seeded(s + 1) * 100,
          delay: seeded(s + 2) * 5,
          size: 8 + seeded(s + 3) * 12,
        };
      }),
    [starCount, seed]
  );

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
        const s = seed + 500 + i * 3;
        return {
          x: seeded(s) * 100,
          delay: seeded(s + 1) * 8,
          duration: 8 + seeded(s + 2) * 4,
        };
      }),
    [particleCount, seed]
  );

  const mesh = useMemo(() => {
    const a = RGB[lead];
    const b = RGB[second];
    const c = RGB[third];
    return [
      `radial-gradient(circle at 20% 20%, rgba(${a}, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(${b}, 0.2) 0%, transparent 50%)`,
      `radial-gradient(circle at 80% 20%, rgba(${a}, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(${b}, 0.2) 0%, transparent 50%)`,
      `radial-gradient(circle at 50% 50%, rgba(${a}, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(${c}, 0.15) 0%, transparent 50%)`,
      `radial-gradient(circle at 20% 20%, rgba(${a}, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(${b}, 0.2) 0%, transparent 50%)`,
    ];
  }, [lead, second, third]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base colour */}
      <div className="absolute inset-0 bg-[#050508]" />

      {/* Animated mesh gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: mesh }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Grid pattern — always cyan. Purple and pink read visibly dimmer at the
          same alpha, which would leave tinted sections darker than the hero. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(${RGB.cyan}, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${RGB.cyan}, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${RGB[lead]}, 0.3) 0%, transparent 70%)`,
          left: '10%',
          top: '10%',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${RGB[second]}, 0.25) 0%, transparent 70%)`,
          right: '10%',
          bottom: '10%',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${RGB[third]}, 0.2) 0%, transparent 70%)`,
          left: '50%',
          top: '30%',
          transform: 'translateX(-50%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <AnimatedStar key={i} {...star} />
        ))}
      </div>

      {/* Rising particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <Particle key={i} {...particle} />
        ))}
      </div>
    </div>
  );
}
