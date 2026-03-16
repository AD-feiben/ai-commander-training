import { useSettingsStore } from '../store';

export default function SkeletonLoader() {
  const getEffectiveTheme = useSettingsStore((state) => state.getEffectiveTheme);
  const isDark = getEffectiveTheme() === 'dark';

  return (
    <div className="animate-pulse space-y-6">
      {/* 标题骨架 */}
      <div className={`h-8 rounded-lg w-3/4 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
      
      {/* 描述骨架 */}
      <div className={`h-4 rounded-lg w-1/2 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
      
      {/* 进度条骨架 */}
      <div className={`h-2 rounded-full w-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
      
      {/* 内容骨架 */}
      <div className="space-y-4 mt-8">
        <div className={`h-4 rounded-lg w-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded-lg w-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded-lg w-5/6 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded-lg w-4/5 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
      </div>
      
      {/* 代码块骨架 */}
      <div className={`h-32 rounded-xl mt-8 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
      
      {/* 更多内容骨架 */}
      <div className="space-y-4 mt-8">
        <div className={`h-4 rounded-lg w-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded-lg w-3/4 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded-lg w-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
      </div>
    </div>
  );
}
