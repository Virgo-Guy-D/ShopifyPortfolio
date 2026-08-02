import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Monitor, Server, ShoppingBag, TrendingUp, Plug, Store, Sparkles } from 'lucide-react';
import SectionBackground from './SectionBackground';
import GradientBadge from './GradientBadge';

// Scoped to Shopify development: every skill below feeds Shopify work, and each
// one appears in exactly one tab so the section never quotes two figures for the
// same skill. Levels carried over from the previous grouping where they existed.
const skillCategories = [
  {
    id: 'shopify-core',
    name: 'Shopify Core',
    icon: ShoppingBag,
    color: 'cyan',
    skills: [
      { name: 'Shopify', level: 100 },
      { name: 'Shopify Development', level: 99 },
      { name: 'Shopify Plus', level: 95 },
      { name: 'Shopify Theme', level: 98 },
      { name: 'Liquid', level: 98 },
      { name: 'Shopify CLI', level: 95 },
    ],
  },
  {
    id: 'apps-apis',
    name: 'Apps & APIs',
    icon: Server,
    color: 'purple',
    skills: [
      { name: 'REST APIs', level: 98 },
      { name: 'Node.js', level: 96 },
      { name: 'Admin API', level: 94 },
      { name: 'Shopify Apps', level: 97 },
      { name: 'Storefront API', level: 93 },
      { name: 'GraphQL', level: 90 },
    ],
  },
  {
    id: 'frontend',
    name: 'Headless & Frontend',
    icon: Monitor,
    color: 'pink',
    skills: [
      { name: 'React', level: 97 },
      { name: 'JavaScript', level: 99 },
      { name: 'Tailwind CSS', level: 96 },
      { name: 'TypeScript', level: 94 },
      { name: 'Next.js', level: 95 },
      { name: 'Hydrogen', level: 92 },
    ],
  },
  {
    id: 'storefront',
    name: 'Storefront & Design',
    icon: Store,
    color: 'cyan',
    skills: [
      { name: 'HTML/CSS', level: 97 },
      { name: 'Ecommerce Website', level: 94 },
      { name: 'Responsive Design', level: 94 },
      { name: 'Shopify Templates', level: 95 },
      { name: 'Web Design', level: 92 },
    ],
  },
  {
    id: 'performance',
    name: 'Performance & CRO',
    icon: TrendingUp,
    color: 'purple',
    skills: [
      { name: 'Conversion Rate Optimization', level: 93 },
      { name: 'Page Speed Optimization', level: 91 },
      { name: 'Website Optimization', level: 90 },
      { name: 'SEO', level: 91 },
      { name: 'A/B Testing', level: 92 },
      { name: 'Analytics', level: 90 },
    ],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Plug,
    color: 'pink',
    skills: [
      { name: 'API Integration', level: 95 },
      { name: 'Stripe', level: 92 },
      { name: 'PayPal', level: 93 },
      { name: 'Klaviyo', level: 95 },
      { name: 'Zapier', level: 90 },
      { name: 'Mailchimp', level: 92 },
    ],
  },
];

const additionalSkills = [
  'Front-End Development',
  'Ecommerce Dev Consultation',
  'Git',
  'Figma',
  'Testing',
];

const colorClasses: Record<string, { gradient: string }> = {
  cyan: { gradient: 'from-cyan-500 to-cyan-400' },
  purple: { gradient: 'from-purple-500 to-purple-400' },
  pink: { gradient: 'from-pink-500 to-pink-400' },
};

// Moving border card
const MovingBorderCard = ({ children, className = '', isActive = false }: { children: React.ReactNode; className?: string; isActive?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showBorder = isHovered || isActive;

  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -3 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute -inset-[2px] rounded-xl transition-opacity duration-300"
        style={{
          background: showBorder 
            ? 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)' 
            : 'transparent',
          backgroundSize: '300% 100%',
          animation: showBorder ? 'movingBorder 2s linear infinite' : 'none',
          opacity: showBorder ? 1 : 0,
        }}
      />
      <div className="absolute inset-[2px] rounded-xl bg-gray-900/95 z-0" />
      {showBorder && (
        <motion.div
          className="absolute -inset-4 rounded-xl opacity-30 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{ background: 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)' }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
      <style>{`
        @keyframes movingBorder {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </motion.div>
  );
};

// Trace border card
const TraceBorderCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 rounded-xl border border-gray-700" />
      {isHovered && (
        <>
          <motion.div className="absolute top-0 left-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)' }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.2 }} />
          <motion.div className="absolute top-0 right-0 w-[2px]" style={{ background: 'linear-gradient(180deg, transparent, #a78bfa, transparent)' }} initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 0.2, delay: 0.1 }} />
          <motion.div className="absolute bottom-0 right-0 h-[2px]" style={{ background: 'linear-gradient(270deg, transparent, #f472b6, transparent)' }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.2, delay: 0.2 }} />
          <motion.div className="absolute bottom-0 left-0 w-[2px]" style={{ background: 'linear-gradient(0deg, transparent, #22d3ee, transparent)' }} initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 0.2, delay: 0.3 }} />
          {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -right-1', '-bottom-1 -left-1'].map((pos, i) => (
            <motion.div key={i} className={`absolute ${pos} w-2 h-2 rounded-full bg-cyan-400`} style={{ boxShadow: '0 0 10px #22d3ee' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }} />
          ))}
        </>
      )}
      <motion.div className="absolute inset-0 rounded-xl" animate={{ opacity: isHovered ? 0.15 : 0 }} style={{ background: '#22d3ee', filter: 'blur(20px)' }} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('shopify-core');

  const activeSkillData = skillCategories.find(c => c.id === activeCategory);
  const activeSkills = activeSkillData?.skills || [];
  const activeColor = activeSkillData?.color || 'cyan';

  return (
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden">
      <SectionBackground tint="purple" />

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
            <GradientBadge className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/40">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-purple-300 text-sm font-medium">Skills & Expertise</span>
            </GradientBadge>
          </motion.div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            My{' '}
            <motion.span 
              className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent inline-block leading-[1.3]"
              animate={{ textShadow: ['0 0 20px rgba(167, 139, 250, 0.3)', '0 0 40px rgba(167, 139, 250, 0.5)', '0 0 20px rgba(167, 139, 250, 0.3)'], scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Technical Arsenal
            </motion.span>
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            A comprehensive toolkit for building modern, scalable e-commerce solutions.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {skillCategories.map(({ id, name, icon: Icon, color }) => {
            const colors = colorClasses[color];
            const isActive = activeCategory === id;
            return (
              <MovingBorderCard key={id} className="rounded-xl" isActive={isActive}>
                <motion.button
                  onClick={() => setActiveCategory(id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive ? `bg-gradient-to-r ${colors.gradient} text-white` : 'bg-gray-900/80 text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </motion.button>
              </MovingBorderCard>
            );
          })}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {activeSkills.map((skill, index) => {
            const colors = colorClasses[activeColor];
            return (
              <TraceBorderCard key={skill.name} className="rounded-xl">
                <div className="h-full flex flex-col bg-gray-900/80 p-4 rounded-xl">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* text-sm is the largest size at which every skill name fits
                        the ~201px a card leaves at the 3-column breakpoint — the
                        longest, "Conversion Rate Optimization", measures 196px
                        here and 224px at the previous 16px. `truncate` is the
                        backstop: it keeps the row to one line with an ellipsis
                        rather than wrapping if a longer name is ever added. */}
                    <span className="min-w-0 truncate text-sm font-medium text-gray-300" title={skill.name}>
                      {skill.name}
                    </span>
                    <motion.span
                      className="shrink-0 text-sm font-bold text-cyan-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.08, type: 'spring' }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="mt-auto h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.08, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full relative`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                      />
                    </motion.div>
                  </div>
                </div>
              </TraceBorderCard>
            );
          })}
        </motion.div>

        {/* Additional Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h4 className="text-lg font-semibold text-white mb-6">Additional Expertise</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {additionalSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                className="inline-block"
              >
                <GradientBadge rounded="rounded-xl" className="px-4 py-2 bg-gray-900/80 text-sm text-gray-300 cursor-default">
                  {skill}
                </GradientBadge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
