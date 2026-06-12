import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight, Check, Menu, X, LayoutGrid, FileText,
  Zap, Shield, FolderOpen, Bell, Star,
  ChevronRight
} from "lucide-react";

import Desktop from "../assets/landing_page/index"
import Logo from "../assets/per_ankh_logo.png"

/* ─── Navbar ─── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Fonctionnalités", "Comment ça marche", "À propos"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-slate-200" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
        <img src={Logo} className="h-[50px]" />
          <span className="font-extrabold text-base text-slate-900 tracking-tight">PER ANKH</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l} href="#" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-100">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-100">
            Connexion
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-bold text-white bg-indigo-600 transition-all duration-150 hover:opacity-90">
            Inscription
          </button>
        </div>

        <button className="md:hidden p-2 rounded-lg text-slate-600" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-1 bg-white border-t border-slate-200">
          {links.map((l) => (
            <a key={l} href="#" className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600">{l}</a>
          ))}
          <button className="mt-3 w-full py-2.5 rounded-full text-sm font-bold text-white bg-indigo-600">
            Inscription
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden bg-gradient-to-b from-indigo-50 to-slate-50">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#e2e8f0_1px,transparent_1px),linear-gradient(90deg,#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs bg-white border border-slate-200 font-semibold text-slate-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Plateforme collaborative nouvelle génération
            <ChevronRight size={12} className="text-slate-400" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          className="text-center max-w-3xl mx-auto mb-5 font-extrabold text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.15] tracking-[-0.03em] text-slate-900"
        >
          Toute votre équipe,{" "}
          <span className="text-indigo-600">un seul espace</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
          className="text-center max-w-xl mx-auto mb-8 font-medium text-[17px] leading-[1.65] text-slate-600"
        >
          PER ANKH centralise vos tâches Kanban, notes collaboratives, fichiers et échanges — avec synchronisation temps réel entre tous vos membres.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
        >
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-indigo-600 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all duration-150 hover:opacity-90">
            Créer mon espace gratuit <ArrowRight size={16} />
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-600 bg-white/70 border border-slate-200 transition-colors duration-150 hover:bg-white">
            Voir la démo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
        >
          <div className="w-px h-4 bg-slate-200" />
          <span className="font-semibold text-[13px] text-slate-600">Aucune carte bancaire requise</span>
          <div className="w-px h-4 bg-slate-200" />
          <span className="font-semibold text-[13px] text-slate-600">Accès immédiat</span>
        </motion.div>

        {/* Product screenshot — swap <Desktop /> for your own component or an <img> */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-[1100px]"
        >
          <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl bg-indigo-500" />
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex gap-1.5">
                {["bg-rose-500", "bg-amber-400", "bg-green-500"].map((c) => (
                  <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
                ))}
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded-md text-xs text-center bg-white border border-slate-200 font-medium text-slate-400">
                app.perankh.io/workspace
              </div>
            </div>
            {/* Replace the placeholder below with <Desktop /> once imported */}
            <div className="h-[520px] bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
              <Desktop />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Logos strip ─── */
function LogosStrip() {
  const logos = ["Notion", "Slack", "Figma", "GitHub", "Linear", "Jira"];
  return (
    <section className="py-16 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center mb-8 text-sm font-semibold text-slate-400 tracking-[0.06em]">
          REMPLACE VOS OUTILS ÉPARPILLÉS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {logos.map((name) => (
            <div key={name} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
              <div className="w-6 h-6 rounded bg-slate-200" />
              <span className="font-bold text-[15px] text-slate-600">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  { icon: LayoutGrid, iconColor: "text-indigo-600", iconBg: "bg-indigo-50", title: "Kanban Board", desc: "Colonnes personnalisables, glisser-déposer, assignation d'utilisateurs, échéances et tags. Vue claire de l'avancement de chaque projet." },
  { icon: FileText, iconColor: "text-violet-600", iconBg: "bg-violet-50", title: "Notes Collaboratives", desc: "Éditez simultanément avec votre équipe. Mentions @utilisateur, commentaires et synchronisation instantanée via WebSockets." },
  { icon: Zap, iconColor: "text-amber-500", iconBg: "bg-amber-50", title: "Temps Réel", desc: "Synchronisation instantanée via WebSockets. Indicateurs de présence, mises à jour en direct, zéro friction entre collaborateurs." },
  { icon: FolderOpen, iconColor: "text-green-600", iconBg: "bg-green-50", title: "Gestion de Fichiers", desc: "Upload, téléchargement et association de fichiers à vos tâches ou notes. Organisation centralisée de toute la documentation." },
  { icon: Bell, iconColor: "text-rose-500", iconBg: "bg-rose-50", title: "Notifications", desc: "Alertes instantanées pour mentions, assignations et changements de statut. Restez informé sans jamais rater l'essentiel." },
  { icon: Shield, iconColor: "text-sky-500", iconBg: "bg-sky-50", title: "Rôles & Permissions", desc: "Gestion fine des accès par espace de travail. Chiffrement, validation serveur, protection des routes d'API et des fichiers." },
];

function Features() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs mb-4 font-bold text-indigo-600 bg-indigo-50 tracking-[0.05em]">FONCTIONNALITÉS</span>
          <h2 className="max-w-xl mx-auto mb-4 font-extrabold text-[clamp(1.8rem,3.5vw,2.5rem)] text-slate-900 tracking-tight leading-tight">
            Tout ce dont votre équipe a besoin
          </h2>
          <p className="font-medium text-base text-slate-600 leading-[1.65]">
            Six modules intégrés, une seule plateforme. Fini la dispersion entre des dizaines d'outils différents.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.iconBg}`}>
                <f.icon size={18} className={f.iconColor} />
              </div>
              <h3 className="mb-2 font-extrabold text-base text-slate-900 tracking-tight">{f.title}</h3>
              <p className="font-medium text-sm text-slate-600 leading-[1.65]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ─── */
const steps = [
  { n: "01", title: "Créez votre espace", desc: "Inscrivez-vous en quelques secondes, invitez vos collaborateurs et définissez les rôles." },
  { n: "02", title: "Organisez vos projets", desc: "Créez des Kanban, des notes collaboratives et centralisez vos fichiers au même endroit." },
  { n: "03", title: "Collaborez en direct", desc: "Toutes les modifications sont synchronisées instantanément. Voyez qui travaille sur quoi, en temps réel." },
];

function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs mb-4 font-bold text-indigo-600 bg-indigo-50 tracking-[0.05em]">COMMENT ÇA MARCHE</span>
          <h2 className="font-extrabold text-[clamp(1.8rem,3.5vw,2.5rem)] text-slate-900 tracking-tight leading-tight">
            Opérationnel en 3 étapes
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-indigo-50">
                <span className="font-extrabold text-[22px] text-indigo-600 tracking-tight">{s.n}</span>
              </div>
              <h3 className="mb-2 font-extrabold text-[17px] text-slate-900 tracking-tight">{s.title}</h3>
              <p className="font-medium text-sm text-slate-600 leading-[1.65] max-w-[220px]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Isabelle Moreau", role: "Chef de projet · Agence Pixel", quote: "PER ANKH a transformé notre façon de travailler. Tout est au même endroit et la synchro temps réel est bluffante.", avatar: "IM", avatarBg: "bg-indigo-600" },
  { name: "Karim Benali", role: "CTO · StartupFlow", quote: "L'architecture est solide et les permissions ultra-flexibles. Exactement ce qu'il nous fallait pour une équipe distribuée.", avatar: "KB", avatarBg: "bg-violet-600" },
  { name: "Margot Dupuis", role: "Product Manager · Innovia", quote: "Le Kanban intégré aux notes collaboratives, c'est un vrai gain de temps. Fini les allers-retours entre 5 outils différents.", avatar: "MD", avatarBg: "bg-rose-500" },
];


/* ─── Pricing ─── */
const plans = [
  {
    name: "Starter", price: "Gratuit", desc: "Parfait pour découvrir PER ANKH",
    perks: ["3 espaces de travail", "5 membres", "1 GB de stockage", "Kanban & notes", "Support communauté"],
    cta: "Commencer", highlight: false,
  },
  {
    name: "Pro", price: "12 €", per: "/ mois / membre", desc: "Pour les équipes ambitieuses",
    perks: ["Espaces illimités", "Membres illimités", "50 GB de stockage", "Toutes les fonctionnalités", "Notifications avancées", "Support prioritaire"],
    cta: "Essayer 14 jours", highlight: true,
  },
  {
    name: "Entreprise", price: "Sur devis", desc: "Pour les grandes organisations",
    perks: ["Tout Pro inclus", "SSO / SAML", "Audit logs", "SLA garanti", "Intégrations custom", "CSM dédié"],
    cta: "Nous contacter", highlight: false,
  },
];


/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_50%),radial-gradient(circle_at_70%_50%,white,transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-white/15">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="font-semibold text-xs text-white/90">Inscription ouverte</span>
          </div>
          <h2 className="mb-4 font-extrabold text-[clamp(1.8rem,4vw,3rem)] text-white tracking-tight leading-tight">
            Prêt à centraliser votre travail d'équipe ?
          </h2>
          <p className="mb-8 max-w-xl mx-auto font-medium text-base text-white/75 leading-[1.65]">
            Rejoignez les équipes qui ont choisi PER ANKH pour collaborer sans friction, en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-indigo-600 bg-white transition-all duration-150 hover:opacity-90">
              Créer mon espace gratuitement <ArrowRight size={16} />
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-white/15 border border-white/25 transition-all duration-150">
              Voir la démo
            </button>
          </div>
          <p className="mt-5 font-medium text-xs text-white/50">
            Aucune carte bancaire requise · Accès immédiat · Annulation à tout moment
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {

  return (
    <footer className="bg-white py-4 text-gray-400">
        <p className="text-center">© 2026 Per Ankh. Tous droits resevés.</p>
    </footer>
    
  );
}

/* ─── LandingPage ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <Navbar />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}