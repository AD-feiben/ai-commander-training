export type Language = 'en' | 'zh';

export interface Translations {
  nav: {
    tutorials: string;
    settings: string;
  };
  home: {
    subtitle: string;
    title: string;
    titleHighlight: string;
    description: string;
    cta: string;
    learnMore: string;
    features: string;
    featuresTitle: string;
    curriculum: string;
    curriculumTitle: string;
    chapters: string;
    lessons: string;
    free: string;
    readyToBegin: string;
    startLearning: string;
    sdd: string;
    sddDesc: string;
    skills: string;
    skillsDesc: string;
    prompt: string;
    promptDesc: string;
    badge: {
      features: string;
      curriculum: string;
      community: string;
    };
    trust: {
      free: string;
      systematic: string;
      practical: string;
    };
    additionalFeatures: {
      codeGen: { title: string; desc: string };
      cli: { title: string; desc: string };
      git: { title: string; desc: string };
      workflow: { title: string; desc: string };
    };
    stats: {
      lessonsCount: string;
      continuous: string;
    };
    ctaSection: {
      subtitle: string;
    };
  };
  tutorial: {
    previous: string;
    next: string;
    markDone: string;
    completed: string;
    progress: string;
    welcome: string;
    selectLesson: string;
    startTraining: string;
    loading: string;
    fetchingData: string;
  };
  settings: {
    title: string;
    appearance: string;
    language: string;
    fontSize: string;
    fontPreview: string;
    progress: string;
    completedLessons: string;
    progressPercent: string;
    dataManagement: string;
    warning: string;
    reset: string;
    version: string;
    system: string;
    mode: string;
  };
}

const en: Translations = {
  nav: {
    tutorials: 'Tutorials',
    settings: 'Settings',
  },
  home: {
    subtitle: 'Essential Skills for the AI Era',
    title: 'Become an',
    titleHighlight: 'AI Commander',
    description: 'Stop competing with AI. Learn to command it. Transform from "code monkey" to "commander" with SDD methodology, prompt engineering, and Agent orchestration.',
    cta: 'Start Learning',
    learnMore: 'Learn More',
    features: 'Why This Course?',
    featuresTitle: 'Master the Future of Development',
    curriculum: 'Curriculum',
    curriculumTitle: '9 Chapters, 45+ Lessons',
    chapters: 'Chapters',
    lessons: 'Lessons',
    free: 'Free',
    readyToBegin: 'Ready to begin?',
    startLearning: 'Start Learning',
    sdd: 'SDD Methodology',
    sddDesc: 'Spec-driven Development: Learn specification-first development to ensure AI-generated code always meets expectations.',
    skills: 'Skills & Agents',
    skillsDesc: 'Master custom AI skills and multi-Agent orchestration to become a true AI commander.',
    prompt: 'Prompt Engineering',
    promptDesc: 'Core techniques for efficient communication with large language models.',
    // Additional translations for new homepage
    badge: {
      features: 'Key Features',
      curriculum: 'Course Curriculum',
      community: 'Join the Community',
    },
    trust: {
      free: 'Completely Free',
      systematic: 'Systematic Learning',
      practical: 'Practice Oriented',
    },
    additionalFeatures: {
      codeGen: { title: 'Code Generation', desc: 'AI-assisted Programming' },
      cli: { title: 'CLI', desc: 'Automation Scripts' },
      git: { title: 'Version Control', desc: 'Git Workflow' },
      workflow: { title: 'Workflow', desc: 'AI Orchestration' },
    },
    stats: {
      lessonsCount: '{{count}} Lessons',
      continuous: 'Continuous Updates',
    },
    ctaSection: {
      subtitle: 'Start today, master AI-era development skills, and become a true AI Commander.',
    },
  },
  tutorial: {
    previous: 'Previous',
    next: 'Next',
    markDone: 'Mark Done',
    completed: 'Completed',
    progress: 'Progress',
    welcome: 'Welcome to AI Commander Training',
    selectLesson: 'Select a lesson from the sidebar to begin',
    startTraining: 'Start Training',
    loading: 'Loading',
    fetchingData: 'Fetching lesson data...',
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    fontSize: 'Font Size',
    fontPreview: 'Preview text: Hello, AI Commander!',
    progress: 'Learning Progress',
    completedLessons: 'Completed Lessons',
    progressPercent: 'Progress',
    dataManagement: 'Data Management',
    warning: 'Warning: This will reset all progress and settings. This action cannot be undone.',
    reset: 'Reset All Data',
    version: 'AI Commander Training v1.0.0',
    system: 'Online',
    mode: 'Training',
  },
};

const zh: Translations = {
  nav: {
    tutorials: '教程',
    settings: '设置',
  },
  home: {
    subtitle: 'AI 时代必备技能',
    title: '成为',
    titleHighlight: 'AI 指挥官',
    description: '不再与 AI 竞争，学会指挥 AI。从「码农」转型为「指挥官」，掌握 SDD 规范驱动开发 + 提示工程 + Agent 编排。',
    cta: '开始学习',
    learnMore: '了解更多',
    features: '为什么选择这门课程？',
    featuresTitle: '掌握开发的未来',
    curriculum: '课程大纲',
    curriculumTitle: '9 大章节，45+ 课时',
    chapters: '章节',
    lessons: '课时',
    free: '免费',
    readyToBegin: '准备好开始了吗？',
    startLearning: '开始学习',
    sdd: 'SDD 方法论',
    sddDesc: '规范驱动开发：学习以规范为核心的开发方法论，让 AI 生成的代码始终符合预期。',
    skills: 'Skills 与代理',
    skillsDesc: '掌握创建自定义 AI 技能和多 Agent 编排的艺术，成为真正的 AI 指挥官。',
    prompt: '提示工程',
    promptDesc: '与大型语言模型高效沟通的核心技巧。',
    // Additional translations for new homepage
    badge: {
      features: '核心特色',
      curriculum: '课程体系',
      community: '加入学习者社区',
    },
    trust: {
      free: '完全免费',
      systematic: '系统化学习',
      practical: '实战导向',
    },
    additionalFeatures: {
      codeGen: { title: '代码生成', desc: 'AI 辅助编程' },
      cli: { title: '命令行', desc: '自动化脚本' },
      git: { title: '版本控制', desc: 'Git 工作流' },
      workflow: { title: '工作流', desc: 'AI 编排' },
    },
    stats: {
      lessonsCount: '{{count}} 课时',
      continuous: '持续更新',
    },
    ctaSection: {
      subtitle: '从今天开始，掌握 AI 时代的开发技能，成为真正的 AI 指挥官',
    },
  },
  tutorial: {
    previous: '上一课',
    next: '下一课',
    markDone: '标记完成',
    completed: '已完成',
    progress: '进度',
    welcome: '欢迎来到 AI 指挥官训练营',
    selectLesson: '从侧边栏选择一个课时开始学习',
    startTraining: '开始训练',
    loading: '加载中',
    fetchingData: '正在获取课程数据...',
  },
  settings: {
    title: '设置',
    appearance: '外观',
    language: '语言',
    fontSize: '字体大小',
    fontPreview: '预览文字：你好，AI 指挥官！',
    progress: '学习进度',
    completedLessons: '已完成课时',
    progressPercent: '进度',
    dataManagement: '数据管理',
    warning: '警告：这将重置所有进度和设置。此操作无法撤销。',
    reset: '重置所有数据',
    version: 'AI 指挥官训练营 v1.0.0',
    system: '在线',
    mode: '训练模式',
  },
};

export const translations: Record<Language, Translations> = { en, zh };

export const getTranslation = (lang: Language): Translations => translations[lang];
