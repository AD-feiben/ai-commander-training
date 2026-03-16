import Giscus from '@giscus/react';
import { useSettingsStore } from '../store';
import { giscusConfig, validateGiscusConfig } from '../config/giscus';

interface GiscusCommentsProps {
  lessonId: string;
}

// Map our language codes to Giscus supported language codes
// Giscus supports: https://github.com/giscus/giscus/blob/main/lib/i18n.tsx
const giscusLangMap: Record<string, string> = {
  'zh': 'zh-CN',
  'en': 'en',
};

export default function GiscusComments({ lessonId }: GiscusCommentsProps) {
  const getEffectiveTheme = useSettingsStore((state) => state.getEffectiveTheme);
  const language = useSettingsStore((state) => state.language);

  const effectiveTheme = getEffectiveTheme();
  const giscusTheme = effectiveTheme === 'dark' ? 'dark' : 'light';
  const giscusLang = giscusLangMap[language] || 'en';

  // Validate configuration
  const isConfigValid = validateGiscusConfig(giscusConfig);

  if (!isConfigValid) {
    return (
      <div className="mt-12 pt-8 border-t border-zinc-200/10 dark:border-zinc-800">
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          <p className="text-sm">
            {language === 'zh'
              ? '评论系统配置不完整。请检查 giscus.ts 配置文件。'
              : 'Comment system configuration is incomplete. Please check the giscus.ts config file.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-zinc-200/10 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-6 text-zinc-800 dark:text-zinc-200">
        💬 {language === 'zh' ? '讨论区' : 'Discussion'}
      </h3>

      <Giscus
        id="comments"
        repo={giscusConfig.repo as `${string}/${string}`}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping={giscusConfig.mapping}
        term={lessonId}
        reactionsEnabled={giscusConfig.reactionsEnabled ? "1" : "0"}
        emitMetadata={giscusConfig.emitMetadata ? "1" : "0"}
        inputPosition={giscusConfig.inputPosition}
        theme={giscusTheme}
        lang={giscusLang}
        loading="lazy"
      />
    </div>
  );
}
