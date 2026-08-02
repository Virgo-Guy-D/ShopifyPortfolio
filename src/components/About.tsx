import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TrendingUp, Code2, Users, Zap, Award, Clock, CheckCircle, Handshake, Sparkles } from 'lucide-react';
import SectionBackground from './SectionBackground';
import GradientBadge from './GradientBadge';

// Split into number and suffix so the number can be counted up on first view.
const stats = [
  { value: 8, suffix: '+', label: 'Years Experience', icon: '🚀' },
  { value: 150, suffix: '+', label: 'Projects Completed', icon: '💼' },
  { value: 100, suffix: '%', label: 'Client Satisfaction', icon: '⭐' },
];

const qualities = [
  { icon: TrendingUp, title: 'Conversion Focused', desc: 'Every line of code optimized for sales', color: 'cyan' },
  { icon: Code2, title: 'Clean Architecture', desc: 'Scalable, maintainable solutions', color: 'purple' },
  { icon: Users, title: 'UX Obsessed', desc: 'Seamless shopping experiences', color: 'pink' },
  { icon: Zap, title: 'Performance First', desc: 'Lightning-fast load times', color: 'amber' },
];

const badges = [
  { icon: Award, text: 'Shopify Partner' },
  { icon: Clock, text: 'On-Time Delivery' },
  { icon: CheckCircle, text: 'Quality Assured' },
  { icon: Handshake, text: 'Long-term Support' },
];

/**
 * Entrance for the achievement rows.
 *
 * The stagger delay lives inside the variant rather than on the element,
 * because an element-level `transition` also governs `whileHover` — so the
 * bottom row used to sit still for 1.1s after the pointer arrived before it
 * began to move. Hover timing is set on the element instead, and the two never
 * share a curve again.
 */
const achievementVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.8 + i * 0.1, ease: 'easeOut' },
  }),
};

const codeSnippet = `const developer = {
  name: "Arthur Paradizi",
  role: "Senior Shopify Developer",
  experience: "8+ years",
  location: "Remote • Worldwide",
  focus: [
    "Shopify Development",
    "Custom Themes",
    "App Integrations",
    "Headless Commerce",
    "Conversion Optimization"
  ],
  passion: "Building stores that sell"
};`;

// Moving border card with continuous animation
const MovingBorderCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Moving gradient border */}
      <div
        className="absolute -inset-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered 
            ? 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)' 
            : 'transparent',
          backgroundSize: '300% 100%',
          animation: isHovered ? 'movingBorder 2s linear infinite' : 'none',
        }}
      />
      
      {/* Inner background */}
      <div className="absolute inset-[2px] rounded-xl bg-gray-900/95 z-0" />
      
      {/* Glow effect */}
      {isHovered && (
        <motion.div
          className="absolute -inset-4 rounded-xl opacity-30 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          style={{
            background: 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      <style>{`
        @keyframes movingBorder {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </motion.div>
  );
};

// Trace border card - border traces around on hover
const TraceBorderCard = ({ children, className = '', color = 'cyan' }: { children: React.ReactNode; className?: string; color?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colors: Record<string, { primary: string; glow: string }> = {
    cyan: { primary: '#22d3ee', glow: 'rgba(34, 211, 238, 0.5)' },
    purple: { primary: '#a78bfa', glow: 'rgba(167, 139, 250, 0.5)' },
    pink: { primary: '#f472b6', glow: 'rgba(244, 114, 182, 0.5)' },
    amber: { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)' },
  };

  const currentColor = colors[color] || colors.cyan;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Base border */}
      <div className="absolute inset-0 rounded-xl border border-gray-700" />
      
      {/* Animated tracing border */}
      {isHovered && (
        <>
          {/* Top border - left to right */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${currentColor.primary}, transparent)` }}
            initial={{ width: 0, x: 0 }}
            animate={{ width: '100%', x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          {/* Right border - top to bottom */}
          <motion.div
            className="absolute top-0 right-0 w-[2px] rounded-full"
            style={{ background: `linear-gradient(180deg, transparent, ${currentColor.primary}, transparent)` }}
            initial={{ height: 0, y: 0 }}
            animate={{ height: '100%', y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
          />
          {/* Bottom border - right to left */}
          <motion.div
            className="absolute bottom-0 right-0 h-[2px] rounded-full"
            style={{ background: `linear-gradient(270deg, transparent, ${currentColor.primary}, transparent)` }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
          />
          {/* Left border - bottom to top */}
          <motion.div
            className="absolute bottom-0 left-0 w-[2px] rounded-full"
            style={{ background: `linear-gradient(0deg, transparent, ${currentColor.primary}, transparent)` }}
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 0.3, delay: 0.45, ease: 'easeOut' }}
          />
          
          {/* Corner glows */}
          <motion.div
            className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
            style={{ background: currentColor.primary, boxShadow: `0 0 10px ${currentColor.primary}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: currentColor.primary, boxShadow: `0 0 10px ${currentColor.primary}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.55 }}
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: currentColor.primary, boxShadow: `0 0 10px ${currentColor.primary}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full"
            style={{ background: currentColor.primary, boxShadow: `0 0 10px ${currentColor.primary}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.65 }}
          />
        </>
      )}

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0"
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        style={{ 
          background: currentColor.primary,
          filter: 'blur(20px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

// Badge with border animation
const AnimatedBadge = ({ icon: Icon, text, delay }: { icon: React.ElementType; text: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="inline-block"
    >
      <GradientBadge
        className="flex items-center gap-2 px-4 py-2 bg-gray-900/95 border border-transparent"
        hoverScale={1.1}
      >
        <Icon className="w-4 h-4 text-cyan-300" />
        <span className="text-gray-300 text-sm">{text}</span>
      </GradientBadge>
    </motion.div>
  );
};

// Portrait lives at public/images/profile.jpeg; the initials tile below is the
// fallback if it ever goes missing.
const PHOTO_SRC = '/images/profile.jpeg';

// Sits in the empty gutter beside the code, inside the editor card. Hidden at
// the lg breakpoint, where the two-column grid squeezes the card to ~456px and
// the photo would push the code into horizontal scroll; it returns at xl.
const ProfilePhoto = () => {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      className="hidden sm:block lg:hidden xl:block shrink-0 w-1/3 max-w-[11rem]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      whileHover={{ scale: 1.04 }}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-700">
        {failed ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-2xl font-bold text-cyan-200">
            AP
          </div>
        ) : (
          <img
            src={PHOTO_SRC}
            alt="Arthur Paradizi"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

// Each column is 0-9 with a repeated 0 on the end, so rolling past 9 lands on a
// visually identical 0 and the strip can wrap without a jump.
const DIGIT_ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// One text row. Digits are comfortably inside this, and every strip shares it so
// the columns stay in register.
const ROW = 1.15;

/**
 * Where the column for `place` should sit, in digit units, for value `v`.
 *
 * The ones column tracks the value continuously, so it glides rather than
 * stepping — that is the whole point of the odometer, since rendering
 * `Math.round()` gives a target of 8 only nine states to pass through and no
 * easing can hide nine discrete jumps.
 *
 * Every column above it holds its digit and turns only while the column below
 * wraps 9→0. Rolling those continuously as well looks smooth but reads wrong: at
 * 150 the hundreds column would come to rest halfway between 1 and 2.
 */
const columnPosition = (v: number, place: number) => {
  const scaled = v / place;
  const digit = Math.floor(scaled) % 10;
  const fraction = scaled - Math.floor(scaled);
  if (place === 1) return digit + fraction;
  // The column below spans the last tenth of this one's unit — 190→200 for the
  // hundreds — so that is exactly the window this column turns in.
  const CARRY = 0.9;
  return fraction <= CARRY ? digit : digit + (fraction - CARRY) / (1 - CARRY);
};

/** A single rolling column of the odometer. */
const DigitColumn = ({
  count,
  place,
  index,
  columns,
}: {
  count: MotionValue<number>;
  place: number;
  index: number;
  columns: number;
}) => {
  const position = useTransform(count, (v) => columnPosition(v, place));
  const y = useTransform(position, (p) => `${-p * ROW}em`);

  // A fast column streaks rather than strobing: at full tilt the ones digit
  // passes ~75 values a second, well past what the eye or the display can
  // resolve. The blur scales with speed and clears as the count settles.
  const velocity = useVelocity(position);
  const filter = useTransform(velocity, (v) => `blur(${Math.min(Math.abs(v) * 0.05, 2.5)}px)`);

  // A leading zero isn't part of the number yet. Fading those columns in as the
  // count reaches their place reads like a counter gaining a digit, and because
  // the column keeps its width nothing reflows when it appears. The ones column
  // is exempt: it is always part of the number, including while the number is 0.
  const leadingOpacity = useTransform(count, [place * 0.8, place], [0, 1], { clamp: true });
  const opacity = place === 1 ? 1 : leadingOpacity;

  return (
    <span className="inline-block overflow-hidden" style={{ height: `${ROW}em` }}>
      <motion.span
        className="flex flex-col"
        style={{
          y,
          filter,
          opacity,
          // The gradient has to live on this element rather than being inherited
          // from the stat line: a transformed descendant does not contribute its
          // glyphs to an ancestor's `background-clip: text`, so every column that
          // had rolled off zero painted as nothing at all. Each column carries
          // the slice of the sweep belonging to its position, so the digits still
          // read as one gradient across the number.
          backgroundImage: 'linear-gradient(to right, var(--color-cyan-300), var(--color-purple-300))',
          backgroundSize: `${columns * 100}% 100%`,
          backgroundPosition: columns > 1 ? `${(index / (columns - 1)) * 100}% 0` : '0 0',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {DIGIT_ROWS.map((digit, i) => (
          <span key={i} style={{ height: `${ROW}em`, lineHeight: `${ROW}em` }}>
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

/**
 * Counts up from zero to `to` the first time the stats scroll into view,
 * rendered as rolling digit columns.
 *
 * One MotionValue drives every column. framer-motion writes the transforms
 * straight to the DOM, so a full run costs no React re-renders — not here, and
 * not in the section around it.
 */
const CountUp = ({
  to,
  suffix,
  start,
  duration = 2.2,
}: {
  to: number;
  suffix: string;
  start: boolean;
  duration?: number;
}) => {
  const count = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  // Decimal places the final figure needs, most significant first: 8 → [1],
  // 150 → [100, 10, 1].
  const places = useMemo(() => {
    const result: number[] = [];
    for (let place = 1; place <= to; place *= 10) result.unshift(place);
    return result.length ? result : [1];
  }, [to]);

  useEffect(() => {
    if (!start) return;
    // The count is decorative; anyone who has asked for less motion gets the
    // finished figure with no journey to it.
    if (prefersReducedMotion) {
      count.set(to);
      return;
    }
    // Every card shares this duration, so 8 and 150 land together rather than
    // the small number finishing early and sitting still. The curve is a cubic
    // ease-out: quick off the mark, then a long settle into the final figure.
    const controls = animate(count, to, { duration, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [start, to, duration, count, prefersReducedMotion]);

  return (
    <span className="inline-flex items-center">
      {/* One stable figure for screen readers — a number changing sixty times a
          second is noise to announce, and the strips read as gibberish. */}
      <span className="sr-only">{`${to}${suffix}`}</span>
      <span aria-hidden="true" className="inline-flex">
        {places.map((place, i) => (
          <DigitColumn key={place} count={count} place={place} index={i} columns={places.length} />
        ))}
        {suffix}
      </span>
    </span>
  );
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Tracked separately from the section header: the stats sit far below it, so
  // keying off `isInView` would run the count while they were still off screen
  // and leave a static number to scroll down to.
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <SectionBackground tint="cyan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <GradientBadge className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/40">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-300 text-sm font-medium">About Me</span>
            </GradientBadge>
          </motion.div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Crafting{' '}
            <motion.span 
              className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
              animate={{
                textShadow: [
                  '0 0 20px rgba(34, 211, 238, 0.3)',
                  '0 0 40px rgba(34, 211, 238, 0.5)',
                  '0 0 20px rgba(34, 211, 238, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Digital Experiences
            </motion.span>
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            8+ years of experience building high-converting online stores with a passion for clean code and exceptional user experiences.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Code Block */}
          <motion.div variants={itemVariants}>
            <MovingBorderCard className="rounded-2xl">
              <div className="bg-gray-900/80 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" />
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" />
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" />
                  <span className="ml-2 text-xs text-gray-400 font-mono">developer.ts</span>
                </div>
                <div className="flex items-start gap-5 p-6">
                  <pre className="flex-1 min-w-0 text-sm overflow-x-auto">
                    <code className="font-mono">
                      {codeSnippet.split('\n').map((line, i) => (
                        <motion.div
                          key={i}
                          className="flex"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          <span className="text-gray-500 w-6 flex-shrink-0 select-none">{i + 1}</span>
                          <span className="text-gray-300">
                            {line.includes('const') && <span className="text-cyan-300">{line.split(' ')[0]} </span>}
                            {line.includes('const') ? line.slice(6) : line}
                          </span>
                        </motion.div>
                      ))}
                    </code>
                  </pre>
                  <ProfilePhoto />
                </div>
              </div>
            </MovingBorderCard>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-white mb-3">Who I Am</h4>
              <p className="text-gray-300 leading-relaxed">
                I'm a Senior Shopify Developer specializing in Shopify and custom online store solutions. 
                With over 8 years of experience, I've helped businesses of all sizes launch and scale their online presence.
              </p>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              My approach combines technical expertise with a deep understanding of e-commerce best practices. 
              From custom Shopify themes to complex app integrations, I build solutions that not only look beautiful 
              but also drive conversions and revenue.
            </p>

            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Key Achievements</h4>
              <ul className="space-y-3">
                {[
                  'Built and launched 150+ successful Shopify stores across various industries',
                  'Developed custom apps that increased client revenue by an average of 35%',
                  'Optimized checkout flows resulting in 25% reduction in cart abandonment',
                  'Created reusable component libraries for rapid store deployment'
                ].map((item, i) => (
                  // Hover changes two things: the text colour, and the position of
                  // the row (icon included). Both in CSS rather than
                  // framer-motion — Tailwind v4 emits oklch, which the browser
                  // blends natively, and the shift has to stay off the <li>, whose
                  // transform framer-motion owns for the entrance slide. Sharing
                  // that node makes hover in and out travel through the entrance's
                  // delayed curve, which strands the row in its shifted position
                  // once the pointer leaves. Hence the inner wrapper.
                  <motion.li
                    key={i}
                    custom={i}
                    variants={achievementVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="group text-gray-300 transition-colors duration-300 ease-out hover:text-cyan-300"
                  >
                    <div className="flex items-start gap-3 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                      <CheckCircle className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Qualities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {qualities.map(({ icon: Icon, title, desc, color }) => (
            <TraceBorderCard key={title} className="rounded-xl" color={color}>
              <div className="p-6 bg-gray-900/80 rounded-xl h-full">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-cyan-300" />
                </motion.div>
                <h5 className="font-semibold text-white mb-1">{title}</h5>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </TraceBorderCard>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-3 gap-6 mt-12"
        >
          {stats.map(({ value, suffix, label, icon }, index) => (
            <TraceBorderCard key={label} className="rounded-xl" color={['cyan', 'purple', 'pink'][index]}>
              <div className="text-center p-6 bg-gray-900/80 rounded-xl h-full">
                <motion.div 
                  className="text-3xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {icon}
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-1 tabular-nums">
                  <CountUp to={value} suffix={suffix} start={statsInView} />
                </div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            </TraceBorderCard>
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {badges.map(({ icon, text }, idx) => (
            <AnimatedBadge key={text} icon={icon} text={text} delay={1 + idx * 0.1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
