import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import {
  ArrowRight,
  Layers,
  Bot,
  Zap,
  Sparkles,
  ChevronDown,
  Code2,
  Terminal,
  GitBranch,
  Workflow,
  Target,
  Rocket,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  Play,
  Star,
  Users,
  GraduationCap,
} from 'lucide-react';
import { useSettingsStore } from '../store';
import { tutorialChapters } from '../data/tutorials';

// Animation hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isIntersecting };
}

// Animated section wrapper
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  isDark,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  isDark: boolean;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div
        className={`group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] ${
          isDark
            ? 'bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-800/50'
            : 'bg-white/80 border border-gray-200/50 hover:border-gray-300/50 hover:bg-white/95'
        } backdrop-blur-xl`}
      >
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} blur-xl -z-10`}
        />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
            isDark ? 'bg-white/5' : 'bg-gray-100'
          }`}
        >
          <Icon className={`w-7 h-7 ${isDark ? 'text-zinc-200' : 'text-gray-700'}`} />
        </div>

        <h3
          className={`text-xl font-semibold mb-3 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}
        >
          {title}
        </h3>
        <p className={`leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </AnimatedSection>
  );
}

// Chapter card component
function ChapterCard({
  chapter,
  index,
  isDark,
  isZh,
  lessonsCountText,
}: {
  chapter: (typeof tutorialChapters)[0];
  index: number;
  isDark: boolean;
  isZh: boolean;
  lessonsCountText: string;
}) {
  const colors = [
    'from-emerald-500 to-teal-500',
    'from-violet-500 to-purple-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-fuchsia-500 to-rose-500',
    'from-teal-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-violet-500',
  ];
  const gradient = colors[index % colors.length];
  const firstLessonId = chapter.lessons[0]?.id || `${chapter.id}-1`;

  return (
    <AnimatedSection delay={index * 80}>
      <Link
        to={`/tutorial/${firstLessonId}`}
        className={`group block p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
          isDark
            ? 'bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/40 hover:border-zinc-700/50'
            : 'bg-white/60 border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50'
        } backdrop-blur-sm`}
      >
        <div className="flex items-start gap-4">
          {/* Chapter number badge */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/10`}
          >
            {chapter.id}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold mb-1 group-hover:text-emerald-500 transition-colors truncate ${
                isDark ? 'text-zinc-200' : 'text-gray-800'
              }`}
            >
              {isZh ? chapter.title : chapter.titleEn}
            </h3>
            <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
              {isZh ? chapter.description : chapter.descriptionEn}
            </p>

            {/* Lesson count and progress indicator */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {lessonsCountText.replace('{{count}}', String(chapter.lessons.length))}
              </span>
              <div className="flex-1 h-1 rounded-full bg-gray-200/20 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 w-0 group-hover:w-full`}
                />
              </div>
            </div>
          </div>

          <ArrowUpRight
            className={`w-5 h-5 flex-shrink-0 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 ${
              isDark ? 'text-zinc-400' : 'text-gray-400'
            }`}
          />
        </div>
      </Link>
    </AnimatedSection>
  );
}

// Stat item component
function StatItem({
  value,
  label,
  icon: Icon,
  color,
  delay = 0,
  isDark,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
  isDark: boolean;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="text-center group">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
            isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
          }`}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <div className={`text-4xl md:text-5xl font-bold mb-2 ${color}`}>{value}</div>
        <div className={`text-sm uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
          {label}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Floating element for background
function FloatingElement({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '8s' }}
    />
  );
}

export default function HomePage() {
  const t = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const theme = useSettingsStore((state) => state.theme);
  const getEffectiveTheme = useSettingsStore((state) => state.getEffectiveTheme);
  const isZh = language === 'zh';

  const [effectiveTheme, setEffectiveTheme] = useState(getEffectiveTheme());
  const isDark = effectiveTheme === 'dark';

  // Listen for system theme changes
  useEffect(() => {
    const updateTheme = () => {
      setEffectiveTheme(getEffectiveTheme());
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getEffectiveTheme]);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCurriculum = () => {
    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark
            ? 'bg-zinc-950/80 border-b border-zinc-800/50'
            : 'bg-white/80 border-b border-gray-200/50'
        } backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Commander</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={scrollToFeatures}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {t.home.featuresTitle}
            </button>
            <button
              onClick={scrollToCurriculum}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {t.home.curriculumTitle}
            </button>
            <Link
              to="/tutorial/L1-1"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {t.nav.tutorials}
            </Link>
            <Link
              to="/settings"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {t.nav.settings}
            </Link>
          </div>

          <Link
            to="/tutorial/L1-1"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            <Play className="w-4 h-4" />
            {t.home.cta}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <FloatingElement
            className={`top-20 right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/30 to-cyan-500/10`}
            delay={0}
          />
          <FloatingElement
            className={`bottom-20 left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-violet-500/20 to-transparent`}
            delay={2}
          />
          <FloatingElement
            className={`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-violet-500/5`}
            delay={4}
          />

          {/* Grid pattern */}
          <div
            className={`absolute inset-0 opacity-[0.02] ${
              isDark ? 'bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)]' : 'bg-[radial-gradient(circle_at_center,_black_1px,_transparent_1px)]'
            }`}
            style={{ backgroundSize: '40px 40px' }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <AnimatedSection delay={0}>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm border ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-600'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t.home.subtitle}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isDark ? 'bg-emerald-400' : 'bg-emerald-500'
                }`}
              />
            </div>
          </AnimatedSection>

          {/* Main heading */}
          <AnimatedSection delay={100}>
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] ${
                isDark ? 'text-zinc-100' : 'text-gray-900'
              }`}
            >
              {t.home.title}
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                  {t.home.titleHighlight}
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C50 2 100 2 150 8C200 14 250 14 298 8"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection delay={200}>
            <p
              className={`text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-gray-600'
              }`}
            >
              {t.home.description}
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/tutorial/L1-1"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
              >
                {t.home.cta}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <button
                onClick={scrollToFeatures}
                className={`group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-800/50'
                    : 'border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                {t.home.learnMore}
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </div>
          </AnimatedSection>

          {/* Trust badges */}
          <AnimatedSection delay={400}>
            <div
              className={`mt-16 flex flex-wrap items-center justify-center gap-6 text-sm ${
                isDark ? 'text-zinc-500' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t.home.trust.free}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t.home.trust.systematic}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t.home.trust.practical}</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={scrollToFeatures}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`py-32 px-6 relative ${isDark ? 'border-t border-zinc-800/50' : 'border-t border-gray-200/50'}`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <AnimatedSection>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 ${
                  isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>{t.home.badge.features}</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? 'text-zinc-100' : 'text-gray-900'
                }`}
              >
                {t.home.featuresTitle}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                {t.home.features}
              </p>
            </AnimatedSection>
          </div>

          {/* Feature cards grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layers}
              title={t.home.sdd}
              description={t.home.sddDesc}
              gradient="from-emerald-500/20 to-teal-500/5"
              delay={0}
              isDark={isDark}
            />
            <FeatureCard
              icon={Bot}
              title={t.home.skills}
              description={t.home.skillsDesc}
              gradient="from-violet-500/20 to-purple-500/5"
              delay={100}
              isDark={isDark}
            />
            <FeatureCard
              icon={Zap}
              title={t.home.prompt}
              description={t.home.promptDesc}
              gradient="from-cyan-500/20 to-blue-500/5"
              delay={200}
              isDark={isDark}
            />
          </div>

          {/* Additional features */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Code2, title: t.home.additionalFeatures.codeGen.title, desc: t.home.additionalFeatures.codeGen.desc },
              { icon: Terminal, title: t.home.additionalFeatures.cli.title, desc: t.home.additionalFeatures.cli.desc },
              { icon: GitBranch, title: t.home.additionalFeatures.git.title, desc: t.home.additionalFeatures.git.desc },
              { icon: Workflow, title: t.home.additionalFeatures.workflow.title, desc: t.home.additionalFeatures.workflow.desc },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={300 + i * 50}>
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? 'bg-zinc-900/30 border border-zinc-800/30 hover:border-zinc-700/50'
                      : 'bg-white/50 border border-gray-200/30 hover:border-gray-300/50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                      {item.title}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section
        id="curriculum"
        className={`py-32 px-6 relative ${isDark ? 'border-t border-zinc-800/50' : 'border-t border-gray-200/50'}`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <AnimatedSection>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 ${
                  isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.home.badge.curriculum}</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? 'text-zinc-100' : 'text-gray-900'
                }`}
              >
                {t.home.curriculumTitle}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                {t.home.curriculum}
              </p>
            </AnimatedSection>
          </div>

          {/* Chapter cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutorialChapters.map((chapter, i) => (
              <ChapterCard key={chapter.id} chapter={chapter} index={i} isDark={isDark} isZh={isZh} lessonsCountText={t.home.stats.lessonsCount} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-24 px-6 relative ${isDark ? 'border-t border-zinc-800/50' : 'border-t border-gray-200/50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatItem
              value="09"
              label={t.home.chapters}
              icon={BookOpen}
              color="text-emerald-500"
              delay={0}
              isDark={isDark}
            />
            <StatItem
              value="45"
              label={t.home.lessons}
              icon={GraduationCap}
              color="text-cyan-500"
              delay={100}
              isDark={isDark}
            />
            <StatItem
              value="100%"
              label={t.home.free}
              icon={Target}
              color="text-violet-500"
              delay={200}
              isDark={isDark}
            />
            <StatItem
              value="∞"
              label={t.home.stats.continuous}
              icon={Rocket}
              color="text-amber-500"
              delay={300}
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-32 px-6 relative overflow-hidden ${isDark ? 'border-t border-zinc-800/50' : 'border-t border-gray-200/50'}`}>
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
              isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
            }`}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 ${
                isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.home.badge.community}</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark ? 'text-zinc-100' : 'text-gray-900'
              }`}
            >
              {t.home.readyToBegin}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className={`text-lg mb-10 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              {t.home.ctaSection.subtitle}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <Link
              to="/tutorial/L1-1"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-violet-400 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              <Sparkles className="w-6 h-6" />
              {t.home.startLearning}
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${isDark ? 'border-zinc-800/50' : 'border-gray-200/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">AI Commander</span>
            </div>

            <div className={`flex items-center gap-6 text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
              <Link to="/tutorial/L1-1" className="hover:text-emerald-500 transition-colors">
                {t.nav.tutorials}
              </Link>
              <Link to="/settings" className="hover:text-emerald-500 transition-colors">
                {t.nav.settings}
              </Link>
              <a
                href="https://github.com/AD-feiben/ai-commander-training"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 transition-colors"
              >
                GitHub
              </a>
            </div>

            <div className={`text-sm ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
              © 2024 AI Commander Training. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
