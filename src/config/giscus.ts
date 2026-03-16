/**
 * Giscus 评论系统配置
 *
 * ⚠️ 重要提示：作为开源项目，请勿在代码中提交真实的 Giscus 配置！
 *
 * 配置方式（按优先级）：
 * 1. 环境变量（推荐用于生产环境）
 * 2. 运行时配置 API（适合动态配置）
 * 3. 默认空配置（代码中保持为空，由用户自行配置）
 *
 * 获取配置：https://giscus.app/
 */

export interface GiscusConfig {
  /** GitHub 仓库（格式：用户名/仓库名） */
  repo: string;
  /** 仓库 ID（从 giscus.app 获取） */
  repoId: string;
  /** Discussion 分类名称 */
  category: string;
  /** 分类 ID（从 giscus.app 获取） */
  categoryId: string;
  /** 映射方式：pathname | url | title | og:title | specific */
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific';
  /** 是否启用反应（表情） */
  reactionsEnabled: boolean;
  /** 是否发送元数据 */
  emitMetadata: boolean;
  /** 输入框位置：top | bottom */
  inputPosition: 'top' | 'bottom';
}

/**
 * 默认配置 - 保持为空，强制用户通过环境变量配置
 * 这样可以防止开源代码中的配置被滥用
 */
export const defaultGiscusConfig: GiscusConfig = {
  repo: '',
  repoId: '',
  category: 'General',
  categoryId: '',
  mapping: 'specific',
  reactionsEnabled: true,
  emitMetadata: false,
  inputPosition: 'top',
};

/**
 * 从环境变量读取配置
 * Vite 环境变量必须以 VITE_ 开头
 *
 * 使用方式：
 * 1. 复制 .env.example 为 .env
 * 2. 填写你的 Giscus 配置
 * 3. 重新构建项目
 */
function getConfigFromEnv(): Partial<GiscusConfig> {
  return {
    repo: import.meta.env.VITE_GISCUS_REPO,
    repoId: import.meta.env.VITE_GISCUS_REPO_ID,
    category: import.meta.env.VITE_GISCUS_CATEGORY,
    categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID,
    mapping: import.meta.env.VITE_GISCUS_MAPPING,
    reactionsEnabled: import.meta.env.VITE_GISCUS_REACTIONS_ENABLED !== undefined
      ? import.meta.env.VITE_GISCUS_REACTIONS_ENABLED !== 'false'
      : undefined,
    emitMetadata: import.meta.env.VITE_GISCUS_EMIT_METADATA !== undefined
      ? import.meta.env.VITE_GISCUS_EMIT_METADATA === 'true'
      : undefined,
    inputPosition: import.meta.env.VITE_GISCUS_INPUT_POSITION,
  };
}

/**
 * 合并配置：默认值 < 环境变量
 */
export const giscusConfig: GiscusConfig = {
  ...defaultGiscusConfig,
  ...Object.fromEntries(
    Object.entries(getConfigFromEnv()).filter(([, v]) => v !== undefined)
  ),
} as GiscusConfig;

/**
 * 验证 Giscus 配置是否有效
 */
export function validateGiscusConfig(config: GiscusConfig): boolean {
  return !!(
    config.repo &&
    config.repoId &&
    config.category &&
    config.categoryId
  );
}

/**
 * 检查配置是否为默认空配置
 * 用于提示用户需要配置
 */
export function isDefaultConfig(): boolean {
  return !validateGiscusConfig(giscusConfig);
}
