import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, CheckCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import SectionBackground from './SectionBackground';
import GradientBadge from './GradientBadge';

/** Where form submissions and mailto: links land. */
const CONTACT_EMAIL = 'arthurparadizi77825@gmail.com';

const contactInfo = [
  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Phone', value: '+55 31 9 8699-2900', href: 'tel:+5531986992900' },
  { icon: MapPin, label: 'Location', value: 'Belo Horizonte, MG, Brazil', href: '#' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bots fill every field they find; humans never see this one.
  const [honeypot, setHoneypot] = useState('');

  /** Last resort when the API can't deliver — the message is never dropped. */
  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio enquiry from ${formState.name}`);
    const body = encodeURIComponent(`${formState.message}\n\n— ${formState.name} (${formState.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Silently accept and discard: telling a bot it failed invites a retry.
    if (honeypot) {
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          // Sent as well as checked above: a bot posting straight to the API
          // never runs the check on this side.
          company_website: honeypot,
        }),
      });
      const result = await response.json().catch(() => ({}));

      // The server is up but has no mail transport configured. Hand the message
      // to the visitor's own mail client rather than claiming it was delivered.
      if (response.status === 503 && result.code === 'not_configured') {
        openMailClient();
        return;
      }

      if (!response.ok) {
        // Rate limits and validation come back with a reason worth showing;
        // anything else gets the generic fallback.
        setError(result.error ?? `Sorry — that didn't send. Please email me directly at ${CONTACT_EMAIL}.`);
        return;
      }

      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      // Network-level failure — the API is unreachable, so nothing was sent.
      setError(`Sorry — that didn't send. Please email me directly at ${CONTACT_EMAIL}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="pt-20 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
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
              <span className="text-cyan-300 text-sm font-medium">Get In Touch</span>
            </GradientBadge>
          </motion.div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's{' '}
            <motion.span 
              className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent inline-block leading-[1.3]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.3)',
                  '0 0 40px rgba(6, 182, 212, 0.5)',
                  '0 0 20px rgba(6, 182, 212, 0.3)',
                ],
                filter: [
                  'brightness(1)',
                  'brightness(1.3)',
                  'brightness(1)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Work Together
            </motion.span>
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Have a project in mind? Feel free to reach out. I'm always open to discussing new opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info — same panel treatment as the form, so the two
              columns read as a matching pair. */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              className="h-full flex flex-col bg-gray-900/80 rounded-2xl border border-gray-700 p-6 md:p-8"
              whileHover={{ boxShadow: '0 20px 40px rgba(34, 211, 238, 0.1)' }}
            >
              <h4 className="text-xl font-semibold text-white mb-6">Contact Information</h4>

              {/* Rows borrow the form inputs' styling — inset and darker than
                  the panel — so both columns share one visual vocabulary. */}
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, label, value, href }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 px-4 py-3 bg-[#0a0a12] border border-gray-700 rounded-xl hover:border-cyan-400 transition-all duration-300 group"
                  >
                    <motion.div
                      className="w-11 h-11 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </motion.div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-500">{label}</div>
                      <div className="font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                        {value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="mt-8">
                <h5 className="text-sm font-medium text-gray-300 mb-3">Connect with Me</h5>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label, href }, index) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-[#0a0a12] border border-gray-700 rounded-xl flex items-center justify-center hover:border-cyan-400 transition-all duration-300 group"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5 text-gray-500 group-hover:text-cyan-300 transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability — mt-auto pins it to the panel floor, mirroring
                  the way the submit button anchors the form. */}
              <motion.div
                className="mt-auto pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <div className="border-t border-gray-800 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
                    </span>
                    <span className="font-semibold text-cyan-300">Available for hire</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="bg-gray-900/80 rounded-2xl border border-gray-700 p-6 md:p-8"
              whileHover={{ boxShadow: '0 20px 40px rgba(34, 211, 238, 0.1)' }}
            >
              <h4 className="text-xl font-semibold text-white mb-6">Send a Message</h4>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="w-8 h-8 text-cyan-300" />
                  </motion.div>
                  <h5 className="text-xl font-semibold text-white mb-2">Message Sent!</h5>
                  <p className="text-gray-300">Thank you for reaching out. I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot — hidden from people and screen readers alike. */}
                  <input
                    type="text"
                    name="company_website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                  {[
                    { id: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  ].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        id={field.id}
                        value={formState[field.id as keyof typeof formState]}
                        onChange={(e) => setFormState({ ...formState, [field.id]: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#0a0a12] border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-600 transition-all duration-300"
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      id="message"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      rows={7}
                      className="w-full px-4 py-3 bg-[#0a0a12] border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-600 transition-all duration-300 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </motion.div>
                  {error && (
                    <motion.div
                      role="alert"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/40 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                      <p className="text-sm text-red-200">{error}</p>
                    </motion.div>
                  )}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 15px 30px rgba(34, 211, 238, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
