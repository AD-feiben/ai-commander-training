import { useSettingsStore, useProgressStore, getShortcutDisplay } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { Moon, Sun, Type, Trash2, Sparkles, Globe, Monitor, Keyboard, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// 快捷键输入组件
function ShortcutInput({
  label,
  value,
  onChange,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDisplayValue(getShortcutDisplay(value, isMac));
  }, [value, isMac]);

  // 使用全局键盘事件监听
  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setIsRecording(false);
        return;
      }

      const keys: string[] = [];

      // 记录修饰键
      if (e.metaKey) keys.push('mod');
      if (e.ctrlKey) keys.push('ctrl');
      if (e.altKey) keys.push('alt');
      if (e.shiftKey) keys.push('shift');

      // 添加主键
      const key = e.key.toLowerCase();
      // 排除单独的修饰键
      if (!['control', 'alt', 'shift', 'meta', 'os'].includes(key)) {
        if (key === 'arrowleft') keys.push('arrowleft');
        else if (key === 'arrowright') keys.push('arrowright');
        else if (key === 'arrowup') keys.push('arrowup');
        else if (key === 'arrowdown') keys.push('arrowdown');
        else if (key === 'escape') keys.push('escape');
        else if (key === 'enter') keys.push('enter');
        else if (key === 'tab') keys.push('tab');
        else if (key === ' ') keys.push('space');
        else if (key.length === 1) keys.push(key);
      }

      // 必须有至少一个非修饰键，或者纯修饰键组合（如 Ctrl+Shift）
      const hasModifier = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
      const hasMainKey = keys.some(k => !['mod', 'ctrl', 'alt', 'shift'].includes(k));

      if (hasMainKey || (hasModifier && keys.length >= 2)) {
        onChange(keys.join('+'));
        setIsRecording(false);
      }
    };

    // 延迟添加监听器，避免立即触发当前按键
    const timeoutId = setTimeout(() => {
      window.addEventListener('keydown', handleKeyDown, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isRecording, onChange]);

  // 点击外部取消录制
  useEffect(() => {
    if (!isRecording) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsRecording(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRecording]);

  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{label}</span>
      <button
        ref={buttonRef}
        onClick={() => setIsRecording(true)}
        className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
          isRecording
            ? 'ring-2 ring-emerald-500 bg-emerald-500/10 text-emerald-600 animate-pulse'
            : isDark
            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {isRecording ? '按快捷键...' : displayValue || '点击设置'}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const { theme, fontSize, language, shortcuts, setTheme, setFontSize, setLanguage, setShortcut, resetShortcuts, getEffectiveTheme } = useSettingsStore();
  const { completedLessons, resetProgress } = useProgressStore();

  const totalLessons = 45;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  const effectiveTheme = getEffectiveTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-inherit border-b ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} backdrop-blur-lg`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">AI Commander</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isDark ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={16} />
              <span>{language === 'zh' ? '返回' : 'Back'}</span>
            </button>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
              <span>/</span>
              <span>{t.settings.title}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Language */}
            <div className={`rounded-2xl border ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                <Globe className="w-5 h-5 text-emerald-500" />
                {t.settings.language}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setLanguage('zh')}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    language === 'zh'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : isDark ? 'border-zinc-800 hover:border-zinc-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    language === 'en'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : isDark ? 'border-zinc-800 hover:border-zinc-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className={`rounded-2xl border ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                {theme === 'dark' ? <Moon className="w-5 h-5 text-emerald-500" /> : theme === 'light' ? <Sun className="w-5 h-5 text-emerald-500" /> : <Monitor className="w-5 h-5 text-emerald-500" />}
                {t.settings.appearance}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : isDark ? 'border-zinc-800 hover:border-zinc-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Sun size={18} />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : isDark ? 'border-zinc-800 hover:border-zinc-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Moon size={18} />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    theme === 'system'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : isDark ? 'border-zinc-800 hover:border-zinc-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Monitor size={18} />
                  <span className="text-sm">Auto</span>
                </button>
              </div>
              {theme === 'system' && (
                <p className={`mt-3 text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  当前跟随系统: {effectiveTheme === 'dark' ? '深色模式' : '浅色模式'}
                </p>
              )}
            </div>

            {/* Font Size */}
            <div className={`rounded-2xl border ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                <Type className="w-5 h-5 text-emerald-500" />
                {t.settings.fontSize}
              </h2>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>A</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className={`text-lg ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>A</span>
                <span className={`text-sm font-mono w-16 text-right ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{fontSize}px</span>
              </div>
              <div
                className={`mt-4 p-4 rounded-xl border ${isDark ? 'border-zinc-200/10' : 'border-gray-200'}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>{t.settings.fontPreview}</span>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className={`rounded-2xl border ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                  <Keyboard className="w-5 h-5 text-emerald-500" />
                  {language === 'zh' ? '快捷键设置' : 'Keyboard Shortcuts'}
                </h2>
                <button
                  onClick={resetShortcuts}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                    isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <RotateCcw size={12} />
                  {language === 'zh' ? '重置' : 'Reset'}
                </button>
              </div>
              <div className="space-y-1">
                <ShortcutInput
                  label={language === 'zh' ? '搜索课程' : 'Search Lessons'}
                  value={shortcuts.search}
                  onChange={(value) => setShortcut('search', value)}
                  isDark={isDark}
                />
                <ShortcutInput
                  label={language === 'zh' ? '切换侧边栏' : 'Toggle Sidebar'}
                  value={shortcuts.toggleSidebar}
                  onChange={(value) => setShortcut('toggleSidebar', value)}
                  isDark={isDark}
                />
                <ShortcutInput
                  label={language === 'zh' ? '上一课' : 'Previous Lesson'}
                  value={shortcuts.prevLesson}
                  onChange={(value) => setShortcut('prevLesson', value)}
                  isDark={isDark}
                />
                <ShortcutInput
                  label={language === 'zh' ? '下一课' : 'Next Lesson'}
                  value={shortcuts.nextLesson}
                  onChange={(value) => setShortcut('nextLesson', value)}
                  isDark={isDark}
                />
                <ShortcutInput
                  label={language === 'zh' ? '关闭弹窗' : 'Close Modal'}
                  value={shortcuts.closeModal}
                  onChange={(value) => setShortcut('closeModal', value)}
                  isDark={isDark}
                />
              </div>
              <p className={`mt-4 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                {language === 'zh'
                  ? '点击快捷键按钮，然后按下想要的组合键即可设置。支持 ⌘/Ctrl、Alt、Shift 组合键。'
                  : 'Click the shortcut button and press your desired key combination. Supports ⌘/Ctrl, Alt, Shift combinations.'}
              </p>
            </div>

            {/* Progress */}
            <div className={`rounded-2xl border ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>{t.settings.progress}</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-zinc-500' : 'text-gray-500'}>{t.settings.completedLessons}</span>
                  <span className={isDark ? 'text-zinc-300' : 'text-gray-700'}>{completedLessons.length} / {totalLessons}</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className={`text-right text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {t.settings.progressPercent}: {progressPercent}%
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="rounded-2xl border border-red-900/20 p-6">
              <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>{t.settings.dataManagement}</h2>
              <p className={`text-sm mb-4 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                {t.settings.warning}
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure? This will delete all progress data.')) {
                    resetProgress();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 border border-red-900/50 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all"
              >
                <Trash2 size={16} />
                {t.settings.reset}
              </button>
            </div>

            {/* Version */}
            <div className={`text-center text-sm pt-4 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
              <p>{t.settings.version}</p>
              <p className="mt-1">{t.settings.system}: Online | {t.settings.mode}: Training</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
