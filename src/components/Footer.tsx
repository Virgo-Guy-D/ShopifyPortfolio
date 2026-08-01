import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowUp,
  Mail,
  MapPin,
  Store,
  Code2,
  Rocket,
  TrendingUp,
} from 'lucide-react';
import SectionBackground from './SectionBackground';

const services = [
  { name: 'Shopify Theme Development', icon: Store },
  { name: 'Headless & Hydrogen Builds', icon: Code2 },
  { name: 'Store Migration & Setup', icon: Rocket },
  { name: 'Speed & Conversion Tuning', icon: TrendingUp },
];

const explore = [
  { name: 'Selected Work', href: '#projects' },
  { name: 'About Me', href: '#about' },
  { name: 'Client Results', href: '#testimonials' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-gray-800/80 overflow-hidden">
      <SectionBackground tint="cyan" starCount={12} particleCount={16} intensity={0.4} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="pt-14 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8"
        >
          {/* Brand */}
          <div className="lg:col-span-5">
            <p className="text-lg font-semibold text-white">
              Arthur Paradizi<span className="text-cyan-300">.</span>
            </p>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-sm">
              Senior shopify developer building high-converting Shopify
              storefronts — custom themes, headless builds and the performance
              work that makes them pay off.
            </p>

            <a
              href="mailto:arthurparadizi77825@gmail.com"
              className="mt-5 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              arthurparadizi77825@gmail.com
            </a>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                  Belo Horizonte, MG, Brazil
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-400" />
                </span>
                Available for new projects
              </span>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              What I Build
            </h3>
            <ul className="mt-5 space-y-3.5">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href="#contact"
                    className="group flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 text-cyan-300 group-hover:border-cyan-400/40 transition-colors">
                      <service.icon className="w-4 h-4" />
                    </span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {explore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-300 transition-colors"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 order-2 sm:order-1">
            © {currentYear} Arthur Paradizi. All rights reserved.
          </p>

          <div className="flex items-center gap-6 order-1 sm:order-2">
            <p className="hidden md:block text-xs text-gray-600">
              React · TypeScript · Tailwind CSS
            </p>
            <motion.button
              onClick={scrollToTop}
              aria-label="Back to top"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
