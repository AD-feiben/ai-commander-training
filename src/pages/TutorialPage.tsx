import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Menu, X, Sparkles, ArrowLeft, Globe, ChevronDown, ChevronRight as ChevronRightIcon, Search } from 'lucide-react';
import { tutorialChapters, getLessonById, getChapterByLessonId, getAllLessons } from '../data/tutorials';
import { useSettingsStore, useProgressStore, getShortcutDisplay } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';
import GiscusComments from '../components/GiscusComments';
import SkeletonLoader from '../components/SkeletonLoader';

// 快捷键匹配函数
const matchShortcut = (e: KeyboardEvent, shortcut: string): boolean => {
  const keys = shortcut.split('+');
  const key = e.key.toLowerCase();

  // 检查修饰键
  const needsMod = keys.includes('mod');
  const needsCtrl = keys.includes('ctrl');
  const needsAlt = keys.includes('alt');
  const needsShift = keys.includes('shift');

  if (needsMod && !(e.metaKey || e.ctrlKey)) return false;
  if (needsCtrl && !e.ctrlKey) return false;
  if (needsAlt && !e.altKey) return false;
  if (needsShift && !e.shiftKey) return false;

  // 检查主键
  const mainKey = keys.find(k => !['mod', 'ctrl', 'alt', 'shift'].includes(k));
  if (!mainKey) return false;

  const keyMap: Record<string, string> = {
    'arrowleft': 'arrowleft',
    'arrowright': 'arrowright',
    'arrowup': 'arrowup',
    'arrowdown': 'arrowdown',
    'escape': 'escape',
    'enter': 'enter',
    'tab': 'tab',
    'space': ' ',
  };

  const expectedKey = keyMap[mainKey] || mainKey;
  return key === expectedKey;
};

// 搜索匹配项类型
interface SearchMatch {
  lessonId: string;
  lessonTitle: string;
  chapterId: string;
  chapterTitle: string;
}

export default function TutorialPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // 章节折叠状态：默认全部展开
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    () => new Set(tutorialChapters.map(c => c.id))
  );

  // 搜索状态
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const shortcuts = useSettingsStore((state) => state.shortcuts);
  const isZh = language === 'zh';

  const { completedLessons, markLessonComplete, setCurrentLesson } = useProgressStore();
  const { fontSize, theme, getEffectiveTheme } = useSettingsStore();

  // 获取快捷键显示文本
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
  const searchShortcutDisplay = getShortcutDisplay(shortcuts.search, isMac);
  
  const [effectiveTheme, setEffectiveTheme] = useState(getEffectiveTheme());
  const isDark = effectiveTheme === 'dark';

  // 构建搜索索引
  const searchIndex = useMemo(() => {
    const index: SearchMatch[] = [];
    tutorialChapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        index.push({
          lessonId: lesson.id,
          lessonTitle: isZh ? lesson.title : lesson.titleEn,
          chapterId: chapter.id,
          chapterTitle: isZh ? chapter.title : chapter.titleEn,
        });
      });
    });
    return index;
  }, [isZh]);

  // 搜索过滤
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return searchIndex.filter(match => 
      match.lessonTitle.toLowerCase().includes(query) ||
      match.chapterTitle.toLowerCase().includes(query) ||
      match.lessonId.toLowerCase().includes(query)
    );
  }, [searchQuery, searchIndex]);

  // 打开搜索
  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setSearchQuery('');
    setSelectedIndex(0);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  // 关闭搜索
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  // 选择搜索结果
  const selectResult = useCallback((match: SearchMatch) => {
    navigate(`/tutorial/${match.lessonId}`);
    closeSearch();
    // 自动展开包含选中课程的章节
    setExpandedChapters(prev => new Set([...prev, match.chapterId]));
  }, [navigate, closeSearch]);
  
  // 监听系统主题变化
  useEffect(() => {
    const updateTheme = () => {
      setEffectiveTheme(getEffectiveTheme());
    };
    
    // 初始设置
    updateTheme();
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getEffectiveTheme]);

  const currentLesson = lessonId ? getLessonById(lessonId) : null;
  const currentChapter = lessonId ? getChapterByLessonId(lessonId) : null;
  const allLessons = getAllLessons();

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // 移动端自动展开当前章节
  useEffect(() => {
    if (currentChapter && window.innerWidth < 768) {
      setExpandedChapters(prev => {
        const newSet = new Set(prev);
        newSet.add(currentChapter.id);
        return newSet;
      });
    }
  }, [currentChapter, lessonId]);

  // 键盘快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 搜索快捷键
      if (matchShortcut(e, shortcuts.search)) {
        e.preventDefault();
        openSearch();
        return;
      }

      // 关闭弹窗快捷键
      if (matchShortcut(e, shortcuts.closeModal)) {
        if (searchOpen) {
          e.preventDefault();
          closeSearch();
          return;
        }
        // 在移动端关闭侧边栏
        if (window.innerWidth < 768 && sidebarOpen) {
          setSidebarOpen(false);
          return;
        }
      }

      // 搜索打开时的导航
      if (searchOpen) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(prev =>
              prev < searchResults.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
            break;
          case 'Enter':
            e.preventDefault();
            if (searchResults[selectedIndex]) {
              selectResult(searchResults[selectedIndex]);
            }
            break;
        }
        return;
      }

      // 上一课快捷键
      if (matchShortcut(e, shortcuts.prevLesson)) {
        e.preventDefault();
        if (prevLesson) {
          navigate(`/tutorial/${prevLesson.id}`);
        }
        return;
      }

      // 下一课快捷键
      if (matchShortcut(e, shortcuts.nextLesson)) {
        e.preventDefault();
        if (nextLesson) {
          navigate(`/tutorial/${nextLesson.id}`);
        }
        return;
      }

      // 切换侧边栏快捷键
      if (matchShortcut(e, shortcuts.toggleSidebar)) {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, searchResults, selectedIndex, sidebarOpen, prevLesson, nextLesson, navigate, openSearch, closeSearch, selectResult]);

  useEffect(() => {
    if (lessonId) {
      setCurrentLesson(lessonId);
      setLoading(true);
      // 根据语言加载对应文件
      const baseFile = currentLesson?.file || '';
      const langFile = language === 'en' 
        ? baseFile.replace('.md', '.en.md')
        : baseFile;
      
      fetch(langFile)
        .then(res => {
          if (!res.ok && language === 'en') {
            // 如果英文版不存在，回退到中文版
            return fetch(baseFile);
          }
          return res;
        })
        .then(res => res.text())
        .then(text => setContent(text))
        .catch(() => setContent(language === 'en' 
          ? '# Tutorial Loading Failed\n\nPlease check if the file path is correct.'
          : '# 教程加载失败\n\n请检查文件路径是否正确。'
        ))
        .finally(() => setLoading(false));
    }
  }, [lessonId, currentLesson, setCurrentLesson, language]);

  // 自动标记完成：当用户滚动到底部时
  useEffect(() => {
    if (!lessonId || loading || isCompleted(lessonId)) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        // 当滚动到距离底部 100px 以内时，自动标记完成
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          markLessonComplete(lessonId);
        }
      }, 500); // 防抖 500ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lessonId, loading, markLessonComplete]);

  const isCompleted = (id: string) => completedLessons.includes(id);

  // 切换章节折叠状态
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // 展开所有章节
  const expandAllChapters = () => {
    setExpandedChapters(new Set(tutorialChapters.map(c => c.id)));
  };

  // 折叠所有章节
  const collapseAllChapters = () => {
    setExpandedChapters(new Set());
  };

  // Theme-aware styles
  const styles = {
    h1: isDark ? 'text-2xl font-bold text-zinc-100 mt-10 mb-5 pb-3 border-b border-zinc-800' : 'text-2xl font-bold text-gray-900 mt-10 mb-5 pb-3 border-b border-gray-200',
    h2: isDark ? 'text-xl font-bold text-zinc-200 mt-8 mb-4' : 'text-xl font-bold text-gray-800 mt-8 mb-4',
    h3: isDark ? 'text-lg font-semibold text-zinc-300 mt-6 mb-3' : 'text-lg font-semibold text-gray-700 mt-6 mb-3',
    p: isDark ? 'text-zinc-300 leading-8 my-5' : 'text-gray-700 leading-8 my-5',
    ul: isDark ? 'text-zinc-300 my-5 ml-5 list-disc space-y-2' : 'text-gray-700 my-5 ml-5 list-disc space-y-2',
    ol: isDark ? 'text-zinc-300 my-5 ml-5 list-decimal space-y-2' : 'text-gray-700 my-5 ml-5 list-decimal space-y-2',
    li: isDark ? 'leading-7 text-zinc-300' : 'leading-7 text-gray-700',
    blockquote: isDark 
      ? 'border-l-4 border-emerald-500 pl-5 my-6 text-zinc-400 italic bg-zinc-900/30 py-3 pr-4 rounded-r-lg' 
      : 'border-l-4 border-emerald-500 pl-5 my-6 text-gray-600 italic bg-gray-100 py-3 pr-4 rounded-r-lg',
    a: isDark ? 'text-emerald-400 hover:text-emerald-300 underline underline-offset-2' : 'text-emerald-600 hover:text-emerald-700 underline underline-offset-2',
    table: isDark 
      ? 'overflow-x-auto my-6 rounded-xl border border-zinc-700' 
      : 'overflow-x-auto my-6 rounded-xl border border-gray-300',
    tableInner: isDark ? 'w-full border-collapse border border-zinc-700' : 'w-full border-collapse border border-gray-300',
    thead: isDark ? 'bg-zinc-800/80' : 'bg-gray-100',
    tr: isDark ? 'border-b border-zinc-700 last:border-b-0' : 'border-b border-gray-300 last:border-b-0',
    th: isDark 
      ? 'border border-zinc-700 px-4 py-3 text-zinc-200 text-left text-sm font-semibold' 
      : 'border border-gray-300 px-4 py-3 text-gray-800 text-left text-sm font-semibold',
    td: isDark 
      ? 'border border-zinc-700/50 px-4 py-3 text-zinc-300 text-sm' 
      : 'border border-gray-300 px-4 py-3 text-gray-700 text-sm',
    hr: isDark ? 'my-10 border-zinc-800' : 'my-10 border-gray-200',
    strong: isDark ? 'text-zinc-200 font-semibold' : 'text-gray-900 font-semibold',
  };

  // 高亮匹配文本
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? 
        <mark key={i} className={isDark ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-200 text-emerald-800'}>{part}</mark> : 
        part
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-gray-900'}`}>
      {/* 搜索对话框 */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div className={`w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-gray-200'}`}>
            {/* 搜索输入框 */}
            <div className={`flex items-center gap-3 px-4 py-4 border-b ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
              <Search size={20} className={isDark ? 'text-zinc-400' : 'text-gray-400'} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={isZh ? '搜索课程...' : 'Search lessons...'}
                className={`flex-1 bg-transparent outline-none text-base ${isDark ? 'text-zinc-100 placeholder-zinc-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>{getShortcutDisplay(shortcuts.closeModal, isMac)}</kbd>
                <span>{isZh ? '关闭' : 'close'}</span>
              </div>
            </div>

            {/* 搜索结果 */}
            <div className={`max-h-[60vh] overflow-y-auto ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
              {searchQuery.trim() && searchResults.length === 0 ? (
                <div className={`px-4 py-8 text-center ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                  {isZh ? '没有找到匹配的课程' : 'No lessons found'}
                </div>
              ) : (
                <div className="py-2">
                  {searchResults.map((match, index) => (
                    <button
                      key={match.lessonId}
                      onClick={() => selectResult(match)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        index === selectedIndex
                          ? isDark ? 'bg-zinc-800' : 'bg-gray-100'
                          : 'hover:bg-zinc-800/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                          {match.chapterId}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                            {highlightMatch(match.lessonTitle, searchQuery)}
                          </div>
                          <div className={`text-xs truncate ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            {highlightMatch(match.chapterTitle, searchQuery)}
                          </div>
                        </div>
                        {isCompleted(match.lessonId) && (
                          <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className={`flex items-center justify-between px-4 py-3 text-xs border-t ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-gray-200 text-gray-400'}`}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>↑</kbd>
                  <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>↓</kbd>
                  <span>{isZh ? '导航' : 'navigate'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>↵</kbd>
                  <span>{isZh ? '选择' : 'select'}</span>
                </span>
              </div>
              <span>{searchResults.length} {isZh ? '个结果' : 'results'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 md:hidden bg-inherit border-b ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} backdrop-blur-lg`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">AI Commander</span>
          </Link>
          <Link to="/settings" className="p-2 -mr-2">
            <span className="text-sm">⚙️</span>
          </Link>
        </div>
      </header>

      {/* Desktop Header */}
      <header className={`hidden md:flex fixed top-0 left-0 right-0 z-50 bg-inherit border-b ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} backdrop-blur-lg px-6 py-3 items-center justify-between`}>
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">AI Commander</span>
          </Link>
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            <span>/</span>
            <span>{currentChapter?.id}</span>
            <span>:</span>
            <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>{isZh ? currentChapter?.title : currentChapter?.titleEn}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* 搜索按钮 */}
          <button
            onClick={openSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isDark
                ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            title={`${isZh ? '搜索' : 'Search'} (${searchShortcutDisplay})`}
          >
            <Search size={16} />
            <span className="hidden lg:inline">{isZh ? '搜索' : 'Search'}</span>
            <kbd className={`hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs rounded ${isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-gray-100 text-gray-400'}`}>
              {searchShortcutDisplay}
            </kbd>
          </button>

          {/* 语言切换 - 下拉选择 */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe size={16} />
              <span className="font-medium">{language === 'zh' ? '中文' : 'English'}</span>
              <ChevronDown size={14} className="opacity-60" />
            </button>
            {/* 下拉菜单 */}
            <div className={`absolute right-0 top-full mt-1 w-32 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
              isDark 
                ? 'bg-zinc-900 border-zinc-700' 
                : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => setLanguage('zh')}
                className={`w-full text-left px-4 py-2 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  language === 'zh' 
                    ? 'bg-emerald-500/10 text-emerald-600' 
                    : isDark 
                      ? 'text-zinc-300 hover:bg-zinc-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-4 py-2 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  language === 'en' 
                    ? 'bg-emerald-500/10 text-emerald-600' 
                    : isDark 
                      ? 'text-zinc-300 hover:bg-zinc-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                English
              </button>
            </div>
          </div>
          <Link to="/settings" className="text-sm hover:text-emerald-500 transition-colors">
            ⚙️ {t.nav.settings}
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-80 overflow-y-auto border-r ${isDark ? 'border-zinc-200/10' : 'border-gray-200'} bg-inherit backdrop-blur-sm transition-transform pt-16 md:pt-12 pb-8
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 展开/收起侧边栏按钮 - 仅在桌面端显示 */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hidden md:flex absolute -right-3 top-20 w-6 h-12 rounded-r-lg border ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'border-gray-200 bg-white text-gray-400 hover:text-gray-600'} shadow-md items-center justify-center transition-all hover:scale-110`}
          title={sidebarOpen ? (isZh ? '收起目录' : 'Collapse') : (isZh ? '展开目录' : 'Expand')}
        >
          <ChevronRightIcon 
            size={14} 
            className={`transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <div className="p-4">
          {/* Back to home */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-700'} mb-4 px-2`}
          >
            <ArrowLeft size={14} />
            {isZh ? '返回首页' : 'Back to Home'}
          </Link>

          {/* Chapter list header with expand/collapse button */}
          <div className={`flex items-center justify-between mb-4 px-2`}>
            <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
              {isZh ? '课程目录' : 'Curriculum'}
            </span>
            <button
              onClick={expandedChapters.size === tutorialChapters.length ? collapseAllChapters : expandAllChapters}
              className={`p-1.5 rounded text-xs transition-colors ${
                isDark 
                  ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={expandedChapters.size === tutorialChapters.length 
                ? (isZh ? '折叠全部' : 'Collapse All') 
                : (isZh ? '展开全部' : 'Expand All')
              }
            >
              {expandedChapters.size === tutorialChapters.length 
                ? <ChevronRightIcon size={16} /> 
                : <ChevronDown size={16} />
              }
            </button>
          </div>
          
          {tutorialChapters.map(chapter => {
            const isExpanded = expandedChapters.has(chapter.id);
            const isCurrentChapter = currentChapter?.id === chapter.id;
            
            return (
              <div key={chapter.id} className="mb-2">
                {/* Chapter header - clickable to toggle */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className={`
                    w-full flex items-center justify-between px-2 py-2 rounded-lg text-left
                    transition-colors group
                    ${isCurrentChapter
                      ? isDark 
                        ? 'bg-zinc-800/50 text-zinc-200' 
                        : 'bg-gray-100 text-gray-800'
                      : isDark
                        ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-sm font-semibold">
                    {chapter.id}: {isZh ? chapter.title : chapter.titleEn}
                  </span>
                  <ChevronRightIcon 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {/* Lesson list - collapsible */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                  `}
                >
                  <ul className="ml-1 space-y-0.5">
                    {chapter.lessons.map(lesson => (
                      <li key={lesson.id}>
                        <button
                          onClick={() => {
                            navigate(`/tutorial/${lesson.id}`);
                            if (window.innerWidth < 768) setSidebarOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 rounded-lg transition-all
                            ${lessonId === lesson.id
                              ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                              : isDark
                                ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }
                          `}
                        >
                          {isCompleted(lesson.id)
                            ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                            : <Circle size={14} className={`flex-shrink-0 ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
                          }
                          <span className="truncate">{isZh ? lesson.title : lesson.titleEn}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

        </div>
      </aside>

      {/* 侧边栏收起时的展开按钮 - 仅在桌面端显示 */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`hidden md:flex fixed left-0 top-20 z-30 w-6 h-12 rounded-r-lg border ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'border-gray-200 bg-white text-gray-400 hover:text-gray-600'} shadow-md items-center justify-center transition-all hover:scale-110`}
          title={isZh ? '展开目录' : 'Expand'}
        >
          <ChevronRightIcon size={14} />
        </button>
      )}

      {/* Main content */}
      <main className={`pt-16 md:pt-12 min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:pl-80' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {loading ? (
            <SkeletonLoader />
          ) : currentLesson ? (
            <>
              {/* Lesson header with fade-in animation */}
              <div className={`mb-8 pb-6 border-b animate-fade-in ${isDark ? 'border-zinc-200/10' : 'border-gray-200'}`}>
                <div className={`flex items-center gap-2 text-sm mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 rounded text-xs font-medium">
                    {currentChapter?.id}
                  </span>
                  <span>{isZh ? currentChapter?.title : currentChapter?.titleEn}</span>
                </div>
                <h1 className={`text-2xl md:text-3xl font-bold mt-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>{isZh ? currentLesson.title : currentLesson.titleEn}</h1>
                <p className={`mt-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{isZh ? currentLesson.description : currentLesson.descriptionEn}</p>

                {/* Progress indicator with animation */}
                <div className="mt-4 flex items-center gap-3">
                  <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                    {currentIndex + 1} / {allLessons.length} {isZh ? '课时' : 'lessons'}
                  </span>
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden max-w-xs ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out"
                      style={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Content with fade-in animation */}
              <div
                className="max-w-none animate-fade-in-up"
                style={{ fontSize: `${fontSize}px` }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const inline = !match;
                      return !inline ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: '1.5rem 0',
                            borderRadius: '12px',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                            background: '#1e1e1e',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code 
                          className={`px-1.5 py-0.5 rounded text-sm ${
                            isDark 
                              ? 'bg-emerald-500/15 text-emerald-400' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({children}) => <h1 className={styles.h1}>{children}</h1>,
                    h2: ({children}) => <h2 className={styles.h2}>{children}</h2>,
                    h3: ({children}) => <h3 className={styles.h3}>{children}</h3>,
                    p: ({children}) => <p className={styles.p}>{children}</p>,
                    ul: ({children}) => <ul className={styles.ul}>{children}</ul>,
                    ol: ({children}) => <ol className={styles.ol}>{children}</ol>,
                    li: ({children}) => <li className={styles.li}>{children}</li>,
                    blockquote: ({children}) => <blockquote className={styles.blockquote}>{children}</blockquote>,
                    a: ({children, href}) => <a href={href} className={styles.a}>{children}</a>,
                    table: ({children}) => <div className={styles.table}><table className={styles.tableInner}>{children}</table></div>,
                    thead: ({children}) => <thead className={styles.thead}>{children}</thead>,
                    tbody: ({children}) => <tbody>{children}</tbody>,
                    tr: ({children}) => <tr className={styles.tr}>{children}</tr>,
                    th: ({children}) => <th className={styles.th}>{children}</th>,
                    td: ({children}) => <td className={styles.td}>{children}</td>,
                    hr: () => <hr className={styles.hr} />,
                    strong: ({children}) => <strong className={styles.strong}>{children}</strong>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* 评论系统 */}
              {lessonId && <GiscusComments lessonId={lessonId} />}

              {/* Navigation */}
              <div className={`flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t gap-4 ${isDark ? 'border-zinc-200/10' : 'border-gray-200'}`}>
                {prevLesson ? (
                  <button
                    onClick={() => navigate(`/tutorial/${prevLesson.id}`)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm group ${
                      isDark
                        ? 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    title={`${isZh ? '上一课' : 'Previous'} (${getShortcutDisplay(shortcuts.prevLesson, isMac)})`}
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline truncate max-w-[200px]">{isZh ? prevLesson.title : prevLesson.titleEn}</span>
                    <kbd className={`hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs rounded ml-2 ${isDark ? 'bg-zinc-700 text-zinc-200 border border-zinc-600' : 'bg-gray-200 text-gray-700 border border-gray-300'}`}>
                      {getShortcutDisplay(shortcuts.prevLesson, isMac)}
                    </kbd>
                  </button>
                ) : <div />}

                <div />

                {nextLesson ? (
                  <button
                    onClick={() => navigate(`/tutorial/${nextLesson.id}`)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm group ${
                      isDark
                        ? 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    title={`${isZh ? '下一课' : 'Next'} (${getShortcutDisplay(shortcuts.nextLesson, isMac)})`}
                  >
                    <kbd className={`hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs rounded mr-2 ${isDark ? 'bg-zinc-700 text-zinc-200 border border-zinc-600' : 'bg-gray-200 text-gray-700 border border-gray-300'}`}>
                      {getShortcutDisplay(shortcuts.nextLesson, isMac)}
                    </kbd>
                    <span className="hidden sm:inline truncate max-w-[200px]">{isZh ? nextLesson.title : nextLesson.titleEn}</span>
                    <ChevronRight size={16} />
                  </button>
                ) : <div />}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>{t.tutorial.welcome}</h2>
              <p className={`mb-8 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{t.tutorial.selectLesson}</p>
              <button
                onClick={() => navigate('/tutorial/L1-1')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition-all"
              >
                {t.tutorial.startTraining}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
