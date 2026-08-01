import { motion, useInView } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  ExternalLink, Github, ChevronLeft, ChevronRight, ChevronDown, Sparkles,
  Droplet, Leaf, Store, Zap, Shirt, Gem, ShoppingBag, Dumbbell, Flower2,
} from 'lucide-react';
import SectionBackground from './SectionBackground';
import GradientBadge from './GradientBadge';

// Real client work. Every `stats` value is a qualitative outcome taken from the
// project write-ups — no invented metrics. `links.github` is '' where the work
// lives in a private client repo, which hides the button rather than 404-ing.
//
// Order matters: the first FEATURED_COUNT entries are the ones shown before the
// visitor clicks "View More", so the strongest four lead.
const projects = [
  {
    id: 1,
    title: 'Bareline',
    category: 'Theme Customization',
    role: 'Shopify Developer',
    description:
      'Storefront customization covering product cards, pricing components, bundle offers, CTA buttons and review displays. Traced and fixed a theme-level bug that forced review stars to fixed values instead of reflecting the reviews app, so product data and promotions read accurately across every page.',
    image: '/images/projects/bareline.jpg',
    tags: ['Product Cards', 'Bundle Offers', 'Review Bug Fix', 'Theme Sections'],
    tech: ['Shopify', 'Liquid', 'JavaScript', 'Theme Development', 'UI/UX'],
    stats: { reviews: 'Accurate', offers: 'Consistent', storefront: 'Cleaner' },
    links: { live: 'https://bareline.com', github: '' },
    icon: Store,
    color: 'purple',
  },
  {
    id: 2,
    title: 'Patrick Adair Designs',
    category: 'Jewelry',
    role: 'Senior Shopify Developer',
    description:
      'Customized and enhanced the Shopify storefront with advanced theme development, responsive UI improvements, custom product page functionality, app integrations, and performance optimization. Delivered scalable solutions while maintaining a premium shopping experience and high conversion standards.',
    image: '/images/projects/patrickadair.jpg',
    tags: ['Advanced Theme Dev', 'Custom Product Pages', 'App Integrations', 'Responsive UI'],
    tech: ['Shopify', 'Liquid', 'Theme Development', 'Responsive Design', 'Performance'],
    stats: { experience: 'Premium', productPages: 'Custom', performance: 'Optimized' },
    links: { live: 'https://patrickadairdesigns.com/', github: '' },
    icon: Gem,
    color: 'purple',
  },
  {
    id: 3,
    title: 'Inhalo',
    category: 'Landing Page',
    role: 'Frontend Developer | Lovable Developer',
    description:
      'Complete 1:1 recreation of the Inhalo site in Lovable, migrating it off GemPages so the client could edit with AI. Reproduced every major section, component, animation and responsive behaviour with pixel-perfect layouts while preserving the original visual identity and user journey.',
    image: '/images/projects/inhalo.jpg',
    tags: ['1:1 Recreation', 'Pixel-Perfect', 'Animations', 'Landing Page'],
    tech: ['Lovable', 'React', 'Frontend Development', 'Responsive Design'],
    stats: { fidelity: '1:1 match', platform: 'GemPages → Lovable', editing: 'AI-ready' },
    links: { live: 'https://inhalopatterns.com', github: '' },
    icon: Zap,
    color: 'cyan',
  },
  {
    id: 4,
    title: 'Sanaliment',
    category: 'DTC Skincare',
    role: 'Shopify UX/UI Developer & Ecommerce Optimization Specialist',
    description:
      'Premium skincare storefront rebuilt around a Learn → Trust → Buy journey. Restructured the homepage for clearer storytelling, established hierarchy between the hero serum and bundles, and strengthened the clinical/ingredient proof points that drive purchase confidence.',
    image: '/images/projects/sanaliment.jpg',
    tags: ['Conversion-First UX', 'Bundle Hierarchy', 'Clinical Storytelling', 'Mobile UX'],
    tech: ['Shopify', 'Liquid', 'HTML/CSS', 'CRO', 'Responsive Design'],
    stats: { positioning: 'Clinical luxury', mobile: 'Improved UX', flow: 'Conversion-first' },
    links: { live: 'https://sanaliment.com/', github: '' },
    icon: Droplet,
    color: 'cyan',
  },
  // ── Revealed by "View More" ──────────────────────────────────────────────
  {
    id: 5,
    title: 'Good Protein',
    category: 'Food & Beverage',
    role: 'Senior Shopify Developer',
    description:
      'Developed and customized Shopify theme features, built responsive sections, implemented custom Liquid functionality, optimized store performance, integrated third-party apps, and improved the shopping experience across desktop and mobile. Focused on creating a fast, scalable, and conversion-oriented storefront.',
    image: '/images/projects/goodprotein.jpg',
    tags: ['Custom Liquid', 'Responsive Sections', 'App Integrations', 'Performance'],
    tech: ['Shopify', 'Liquid', 'Theme Development', 'Responsive Design', 'Performance'],
    stats: { performance: 'Optimized', storefront: 'Scalable', focus: 'Conversion' },
    links: { live: 'https://goodprotein.ca/', github: '' },
    icon: Dumbbell,
    color: 'emerald',
  },
  {
    id: 6,
    title: 'Joon Byrd',
    category: 'Body Care',
    role: 'Shopify UX/UI Developer',
    description:
      'Dermatology-led body care brand whose story was not landing at first glance. Redesigned the homepage structure for clearer product storytelling, reworked CTA placement and shopping flow, and tightened typography and spacing so the UI matched the premium positioning.',
    image: '/images/projects/joonbyrd.jpg',
    tags: ['Brand Storytelling', 'CTA Placement', 'Visual Hierarchy', 'Mobile Spacing'],
    tech: ['Shopify', 'Liquid', 'HTML/CSS', 'UX/UI Design', 'CRO'],
    stats: { story: 'Clearer', hierarchy: 'Stronger', trust: 'More premium' },
    links: { live: 'https://www.joonbyrd.com/', github: '' },
    icon: Sparkles,
    color: 'pink',
  },
  {
    id: 7,
    title: 'COB Foods',
    category: 'Food & Beverage',
    role: 'Shopify Frontend Developer & UX/UI Optimizer',
    description:
      'Health-focused snack brand with weak product storytelling and an inconsistent mobile experience. Redesigned the homepage layout, improved product presentation and CTA visibility, and rebuilt the navigation and shopping flow around customer engagement.',
    image: '/images/projects/cobfoods.jpg',
    tags: ['Homepage Redesign', 'CTA Visibility', 'Mobile Responsive', 'Brand Styling'],
    tech: ['Shopify', 'Liquid', 'HTML/CSS', 'JavaScript', 'Responsive Design'],
    stats: { brand: 'Stronger', mobile: 'Better usability', engagement: 'Improved' },
    links: { live: 'https://cobfoods.com/', github: '' },
    icon: Leaf,
    color: 'emerald',
  },
  {
    id: 8,
    title: 'Fashion Catalog Filtering System',
    category: 'Full-Stack Commerce',
    role: 'Frontend & Full-Stack Developer',
    description:
      'Scalable product browsing and filtering for a fashion e-commerce platform. Implemented dynamic filtering, collection management and optimized rendering for large catalogs, plus backend integration for product data, filtering logic and inventory synchronization under high traffic.',
    image: '/images/projects/fashion-filtering.jpg',
    tags: ['Dynamic Filtering', 'Collection Management', 'Inventory Sync', 'Large Catalogs'],
    tech: ['React', 'Next.js', 'Node.js', 'REST APIs', 'Responsive Design'],
    stats: { catalog: 'High-volume', filtering: 'Dynamic', traffic: 'Scalable' },
    links: { live: '', github: '' },
    icon: Shirt,
    color: 'cyan',
  },
  {
    id: 9,
    title: 'Luxury Skincare Storefront',
    category: 'Shopify Storefront',
    role: 'Senior Shopify & Frontend Developer',
    description:
      'Shopify storefront for a luxury skincare and beauty platform, built around advanced product filtering and premium presentation. Delivered custom collection pages, theme customization and storefront performance work to carry a large catalog without losing clean navigation.',
    image: '/images/projects/luxury-skincare.jpg',
    tags: ['Custom Collections', 'Advanced Filtering', 'Theme Customization', 'Mobile UX'],
    tech: ['Shopify', 'Liquid', 'Frontend Development', 'Responsive Design'],
    stats: { catalog: 'Large-scale', filtering: 'Advanced', navigation: 'Clean' },
    links: { live: '', github: '' },
    icon: Flower2,
    color: 'pink',
  },
  {
    id: 10,
    title: 'Fashion Retail Catalog Platform',
    category: 'Shopify Storefront',
    role: 'Senior Shopify & Frontend Developer',
    description:
      'Large-scale fashion retail storefront supporting thousands of products and seasonal campaigns. Built responsive storefront components, collection management and promotional sections, and optimized category structures and product discovery for growing traffic.',
    image: '/images/projects/fashion-retail.jpg',
    tags: ['Catalog Scalability', 'Campaign Sections', 'Product Discovery', 'Mobile Commerce'],
    tech: ['Shopify', 'Liquid', 'JavaScript', 'React', 'Performance'],
    stats: { catalog: 'Thousands of SKUs', campaigns: 'Seasonal', discovery: 'Optimized' },
    links: { live: '', github: '' },
    icon: ShoppingBag,
    color: 'amber',
  },
];

type Project = (typeof projects)[number];

/** How many cards show before the visitor asks for the rest. */
const FEATURED_COUNT = 4;

/** Height of the fixed navbar (`h-16 md:h-20`), so scrolling clears it. */
const NAV_HEIGHT = 80;

/**
 * Project screenshot with a graceful fallback — a project whose image is missing
 * shows its icon on a gradient rather than a broken-image glyph.
 */
const ProjectImage = ({ project, zoomed }: { project: Project; zoomed: boolean }) => {
  const [failed, setFailed] = useState(false);
  const Icon = project.icon;

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-pink-500/20">
        <Icon className="w-12 h-12 text-cyan-300/70" />
      </div>
    );
  }

  return (
    <motion.img
      src={project.image}
      alt={project.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover"
      animate={{ scale: zoomed ? 1.1 : 1 }}
      transition={{ duration: 0.6 }}
    />
  );
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, FEATURED_COUNT);
  const hiddenCount = projects.length - FEATURED_COUNT;

  // The detail panel only ever cycles through what's on screen, so the arrows
  // can't land on a card the visitor hasn't revealed yet.
  const count = visibleProjects.length;
  const nextProject = () => setActiveIndex((prev) => (prev + 1) % count);
  const prevProject = () => setActiveIndex((prev) => (prev - 1 + count) % count);

  const sectionRef = useRef<HTMLElement>(null);
  const returnToTop = useRef(false);

  const toggleShowAll = () => {
    const collapsing = showAll;
    // Collapsing while a now-hidden project is featured would leave the panel
    // showing a card with no counterpart in the grid — reset to the first.
    if (collapsing && activeIndex >= FEATURED_COUNT) setActiveIndex(0);
    returnToTop.current = collapsing;
    setShowAll(!collapsing);
  };

  // Collapsing removes ~1400px of cards from *above* the button, so holding the
  // scroll position strands the visitor in Testimonials. Send them back to the
  // top of this section, where the collapsed grid now lives. Runs after the grid
  // has shrunk, so the measurement is of the final layout.
  // Expanding deliberately does nothing: the new cards flow into view on their own.
  useLayoutEffect(() => {
    if (!returnToTop.current || !sectionRef.current) return;
    returnToTop.current = false;
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [showAll]);

  const activeProject = visibleProjects[activeIndex];

  return (
    <section ref={sectionRef} id="projects" className="py-20 md:py-32 relative overflow-hidden">
      <SectionBackground tint="pink" />

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
              <span className="text-cyan-300 text-sm font-medium">Featured Work</span>
            </GradientBadge>
          </motion.div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Recent{' '}
            <motion.span 
              className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent inline-block leading-[1.3]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                  '0 0 40px rgba(168, 85, 247, 0.5)',
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Projects
            </motion.span>
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            A selection of e-commerce projects showcasing my expertise in building high-converting, scalable online stores.
          </p>
        </motion.div>

        {/* Project Cards Grid */}
        <div id="projects-grid" className="grid md:grid-cols-2 gap-6 mb-8">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              // Stagger within each row of two rather than across the whole
              // list, so cards revealed by "View More" don't trickle in slowly.
              transition={{ duration: 0.6, delay: (index % FEATURED_COUNT) * 0.12 }}
              whileHover={{ y: -8 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(index)}
              className={`group relative bg-gray-900/80 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500 ${
                activeIndex === index 
                  ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' 
                  : 'border-gray-700 hover:border-gray-700'
              }`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <ProjectImage project={project} zoomed={hoveredIndex === index} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/60 to-transparent" />
                
                {/* Category badge */}
                <motion.div 
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 text-white text-xs font-semibold rounded-full">
                    {project.category}
                  </span>
                </motion.div>
                
                {/* Links — rendered only when the project actually has one, so
                    private client work doesn't show a button that goes nowhere. */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.links.live && (
                    <motion.a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 bg-gray-900/90 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white hover:bg-cyan-500 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  )}
                  {project.links.github && (
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 bg-gray-900/90 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white hover:bg-cyan-500 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div 
                    className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <project.icon className="w-5 h-5 text-cyan-300" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">{project.title}</h4>
                    <p className="text-xs text-gray-500">{project.role}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-emerald-500/10 text-cyan-300 text-xs rounded-lg font-medium">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2.5 py-1 bg-gray-800 text-gray-500 text-xs rounded-lg">+{project.tags.length - 3}</span>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-gray-800/80 text-gray-300 text-xs rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Project Detail */}
        <div className="relative">
          {/* Gradient border that drifts slowly around the panel. The two-layer
              mask paints only the 1.5px rim, leaving the middle transparent so
              the section background still shows through the panel's own
              translucent fill. Sits outside the keyed div below so switching
              projects doesn't restart the travel. Kept slow and semi-opaque so
              it reads as an accent rather than competing with the content. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl p-[1.5px] opacity-60"
            style={{
              background: 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)',
              backgroundSize: '300% 100%',
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              maskComposite: 'exclude',
            }}
            animate={{ backgroundPosition: ['0% 50%', '300% 50%'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative bg-gray-900/80 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {(() => {
                    const Icon = activeProject.icon;
                    return <Icon className="w-7 h-7 text-cyan-300" />;
                  })()}
                </motion.div>
                <div>
                  <h4 className="text-xl font-bold text-white">{activeProject.title}</h4>
                  <p className="text-sm text-gray-500">{activeProject.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={prevProject}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl hover:border-cyan-400/50 transition-colors text-gray-300 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={nextProject}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl hover:border-cyan-400/50 transition-colors text-gray-300 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{activeProject.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(activeProject.stats).map(([key, value], i) => (
                <motion.div 
                  key={key} 
                  className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">{value}</div>
                  <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                </motion.div>
              ))}
            </div>

            {/* Full Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {activeProject.tech.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="inline-block"
                >
                  <GradientBadge rounded="rounded-xl" className="px-4 py-2 bg-emerald-500/10 text-cyan-300 text-sm font-medium">
                    {t}
                  </GradientBadge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* View More — reveals the rest of the case studies in place */}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <motion.button
              type="button"
              onClick={toggleShowAll}
              aria-expanded={showAll}
              aria-controls="projects-grid"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-cyan-400/50 transition-all duration-300"
            >
              <span>{showAll ? 'Show Less' : `View More (${hiddenCount})`}</span>
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
