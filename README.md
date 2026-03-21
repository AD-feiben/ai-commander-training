# AI Commander 训练营

成为 AI 指挥官，掌握基于 Spec 驱动开发（SDD）、提示词工程和多代理协作的 AI 编程技能。

[English](./README.en.md) | 简体中文

[![](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev)
[![](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org)
[![](https://img.shields.io/badge/Vite-8.0.0-purple?logo=vite)](https://vitejs.dev)
[![](https://img.shields.io/badge/License-MIT-green)](#license)

## 项目活跃度

[![Star History Chart](https://api.star-history.com/svg?repos=AD-feiben/ai-commander-training&type=Date)](https://star-history.com/#AD-feiben/ai-commander-training&type=Date)

## 贡献者

感谢所有参与 AI Commander 训练营建设的贡献者们！

[![All Contributors](https://allcontributors.org/images/client/contributorsv3.png)](https://allcontributors.org)
[![@AD-feiben](https://images.weserv.nl/?url=github.com/AD-feiben.png?size=64&output=webp)](https://github.com/AD-feiben)

> 通过 [All Contributors](https://allcontributors.org/docs/zh-CN/specification) 规范管理贡献者列表

## 项目简介

AI Commander 训练营是一个免费开源的 AI 编程技能学习平台，帮助开发者从传统编码者转型为能够有效指挥 AI 工具完成复杂编程任务的 AI 指挥官。

### 核心技能

- **Spec 驱动开发 (SDD)**：通过编写高质量技术规范，引导 AI 生成符合预期的代码
- **提示词工程**：掌握与 AI 高效沟通的核心技术
- **多代理协作**：设计和管理多个 AI Agent 的协作系统

## 在线访问

- **网站**：https://ai-commander-training.netlify.app/
- **在线课程**：9 个章节，45 节课程

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 课程体系

| 章节 | 主题 | 课程数 |
|------|------|--------|
| L1 | AI 时代与开发模式变革 | 5 |
| L2 | 规范写作（SDD 核心） | 5 |
| L3 | 任务分解与需求分析 | 5 |
| L4 | 提示工程核心技巧 | 5 |
| L5 | AI 代码生成与审查 | 5 |
| L6 | 复杂项目多任务协调 | 5 |
| L7 | AI Skills 设计 | 5 |
| L8 | Sub-agent 编排艺术 | 5 |
| L9 | 高级 AI 指挥官 | 5 |

## 技术栈

- **框架**：React 19 + React Router 7
- **语言**：TypeScript 5.9
- **构建工具**：Vite 8
- **样式**：Tailwind CSS 3.4
- **状态管理**：Zustand 5
- **Markdown 渲染**：react-markdown + remark-gfm
- **代码高亮**：react-syntax-highlighter
- **图表**：Mermaid
- **评论系统**：Giscus
- **部署**：Netlify / Vercel

## 项目结构

```
├── public/
│   ├── tutorials/          # 教程内容 (Markdown)
│   └── images/            # 静态图片资源
├── src/
│   ├── components/        # React 组件
│   ├── data/              # 教程数据定义
│   ├── hooks/             # 自定义 Hooks
│   ├── i18n/              # 国际化配置
│   ├── pages/             # 页面组件
│   └── store/             # Zustand 状态管理
├── index.html             # 入口 HTML
├── package.json
└── vite.config.ts
```

## 参与贡献

欢迎提交 Issue 和 Pull Request！

## License

MIT
