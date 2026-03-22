import { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../store';

interface GoogleAdSenseProps {
  placement?: 'sidebar' | 'footer' | 'inline' | 'banner' | 'article';
  slot?: string;
  layout?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
}

// 声明全局变量
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function GoogleAdSense({
  placement = 'sidebar',
  slot,
  layout,
  format = 'auto',
}: GoogleAdSenseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const theme = useSettingsStore((state) => state.getEffectiveTheme());
  const isDark = theme === 'dark';

  // 从环境变量获取配置
  const clientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || '';
  const envSlot = import.meta.env.VITE_GOOGLE_ADSENSE_SLOT || '';
  const finalSlot = slot || envSlot;

  useEffect(() => {
    if (!clientId) {
      console.warn('Google AdSense client ID not configured');
      setHasError(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 清除之前的内容
    container.innerHTML = '';

    // 创建广告容器
    const adIns = document.createElement('ins');
    adIns.className = 'adsbygoogle';
    adIns.style.display = 'block';
    adIns.setAttribute('data-ad-client', clientId);
    
    if (finalSlot) {
      adIns.setAttribute('data-ad-slot', finalSlot);
    }
    
    adIns.setAttribute('data-ad-format', format);
    adIns.setAttribute('data-full-width-responsive', 'true');
    
    if (layout) {
      adIns.setAttribute('data-ad-layout', layout);
    }

    container.appendChild(adIns);

    // 加载 Google AdSense 脚本
    const loadAd = () => {
      // 检查脚本是否已加载
      if (!document.getElementById('google-adsense-script')) {
        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          pushAd();
        };

        script.onerror = () => {
          setHasError(true);
        };

        document.head.appendChild(script);
      } else {
        pushAd();
      }
    };

    // 推送广告
    const pushAd = () => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('AdSense error:', error);
        setHasError(true);
      }
    };

    // 延迟加载，避免影响页面性能
    const timer = setTimeout(() => {
      loadAd();
    }, 100);

    return () => {
      clearTimeout(timer);
      // 清理
      container.innerHTML = '';
    };
  }, [clientId, finalSlot, format, layout]);

  // 如果没有配置，显示占位符
  if (hasError) {
    return (
      <div
        className={`rounded-lg p-4 text-center ${
          isDark
            ? 'bg-zinc-900/50 border border-zinc-800'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
          赞助商广告
        </p>
        <a
          href="https://github.com/sponsors/AD-feiben"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm mt-2 inline-block ${
            isDark
              ? 'text-emerald-400 hover:text-emerald-300'
              : 'text-emerald-600 hover:text-emerald-700'
          }`}
        >
          成为赞助者 →
        </a>
      </div>
    );
  }

  const placementStyles = {
    sidebar: 'w-full max-w-[300px] mx-auto min-h-[250px]',
    footer: 'w-full max-w-[728px] mx-auto min-h-[90px]',
    inline: 'w-full max-w-[728px] mx-auto my-8 min-h-[90px]',
    banner: 'w-full max-w-[970px] mx-auto min-h-[90px]',
    article: 'w-full max-w-[336px] mx-auto min-h-[280px]',
  };

  return (
    <div
      ref={containerRef}
      data-placement={placement}
      className={`google-adsense-container ${placementStyles[placement]} ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}
    >
      {/* Google AdSense 广告将在这里渲染 */}
    </div>
  );
}
