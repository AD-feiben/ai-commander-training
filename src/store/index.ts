import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n';

interface ProgressState {
  completedLessons: string[];
  currentLessonId: string | null;
  completedChapters: string[];
  markLessonComplete: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  markChapterComplete: (chapterId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      currentLessonId: null,
      completedChapters: [],
      markLessonComplete: (lessonId) =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        })),
      setCurrentLesson: (lessonId) => set({ currentLessonId: lessonId }),
      markChapterComplete: (chapterId) =>
        set((state) => ({
          completedChapters: state.completedChapters.includes(chapterId)
            ? state.completedChapters
            : [...state.completedChapters, chapterId],
        })),
      resetProgress: () =>
        set({
          completedLessons: [],
          currentLessonId: null,
          completedChapters: [],
        }),
    }),
    {
      name: 'ai-commander-progress',
    }
  )
);

export type ThemeMode = 'light' | 'dark' | 'system';

// 快捷键配置类型
export interface KeyboardShortcuts {
  search: string;      // 搜索
  toggleSidebar: string; // 切换侧边栏
  prevLesson: string;  // 上一课
  nextLesson: string;  // 下一课
  closeModal: string;  // 关闭弹窗
}

// 默认快捷键配置
export const defaultShortcuts: KeyboardShortcuts = {
  search: 'mod+k',      // Cmd/Ctrl + K
  toggleSidebar: 'mod+b', // Cmd/Ctrl + B
  prevLesson: 'mod+arrowleft',  // Cmd/Ctrl + ←
  nextLesson: 'mod+arrowright', // Cmd/Ctrl + →
  closeModal: 'escape', // ESC
};

// 快捷键显示文本
export const getShortcutDisplay = (shortcut: string, isMac: boolean): string => {
  return shortcut
    .replace('mod', isMac ? '⌘' : 'Ctrl')
    .replace('arrowleft', '←')
    .replace('arrowright', '→')
    .replace('escape', 'ESC')
    .split('+')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('+');
};

interface SettingsState {
  theme: ThemeMode;
  fontSize: number;
  language: Language;
  shortcuts: KeyboardShortcuts;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: number) => void;
  setLanguage: (lang: Language) => void;
  setShortcut: (key: keyof KeyboardShortcuts, value: string) => void;
  resetShortcuts: () => void;
  // 获取实际生效的主题（处理 system 模式）
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      fontSize: 16,
      language: 'zh',
      shortcuts: { ...defaultShortcuts },
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLanguage: (language) => set({ language }),
      setShortcut: (key, value) =>
        set((state) => ({
          shortcuts: { ...state.shortcuts, [key]: value },
        })),
      resetShortcuts: () => set({ shortcuts: { ...defaultShortcuts } }),
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'ai-commander-settings',
    }
  )
);
