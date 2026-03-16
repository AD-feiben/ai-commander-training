export interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  file: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  lessons: Lesson[];
}

export const tutorialChapters: Chapter[] = [
  {
    id: 'L1',
    title: 'AI 时代与开发模式变革',
    titleEn: 'AI Era & Development Revolution',
    description: '了解 AI 时代程序员角色的转变，以及 SDD 开发模式',
    descriptionEn: 'Understanding the transformation of programmer roles in the AI era and SDD development model',
    lessons: [
      { id: 'L1-1', title: '程序员角色转变：从码农到 AI 指挥官', titleEn: 'Role Transformation: From Coder to AI Commander', description: '认识 AI 带来的变革', descriptionEn: 'Understanding the AI revolution', file: '/tutorials/L1/L1-1.md' },
      { id: 'L1-2', title: 'AI 能做什么 vs 不能做什么', titleEn: 'What AI Can vs Cannot Do', description: '理解 AI 的能力边界', descriptionEn: 'Understanding AI capabilities and limitations', file: '/tutorials/L1/L1-2.md' },
      { id: 'L1-3', title: '主流 AI 编程工具对比', titleEn: 'AI Coding Tools Comparison', description: 'Copilot、Claude、Cursor 等工具', descriptionEn: 'Copilot, Claude, Cursor and other tools', file: '/tutorials/L1/L1-3.md' },
      { id: 'L1-4', title: 'SDD 规范驱动开发', titleEn: 'SDD: Spec-driven Development', description: '什么是 Spec-driven Development', descriptionEn: 'What is Spec-driven Development', file: '/tutorials/L1/L1-4.md' },
      { id: 'L1-5', title: '写出你的第一个 AI 指令', titleEn: 'Write Your First AI Prompt', description: '开始你的 AI 指挥官之旅', descriptionEn: 'Start your AI Commander journey', file: '/tutorials/L1/L1-5.md' },
    ],
  },
  {
    id: 'L2',
    title: '规范写作（SDD 核心）',
    titleEn: 'Spec Writing (SDD Core)',
    description: '学习如何编写高质量的技术规范',
    descriptionEn: 'Learn to write high-quality technical specifications',
    lessons: [
      { id: 'L2-1', title: '规范的重要性', titleEn: 'Importance of Specifications', description: '代码是规范的马后炮', descriptionEn: 'Code is the aftermath of specs', file: '/tutorials/L2/L2-1.md' },
      { id: 'L2-2', title: '如何写好技术规范', titleEn: 'How to Write Good Specs', description: '清晰定义输入输出和边界', descriptionEn: 'Clearly define inputs, outputs, and boundaries', file: '/tutorials/L2/L2-2.md' },
      { id: 'L2-3', title: '规范模板与案例', titleEn: 'Spec Templates & Examples', description: 'API、函数、项目规范模板', descriptionEn: 'API, function, and project spec templates', file: '/tutorials/L2/L2-3.md' },
      { id: 'L2-4', title: '让 AI 帮你审查规范', titleEn: 'AI-Assisted Spec Review', description: '用 AI 提升规范质量', descriptionEn: 'Use AI to improve spec quality', file: '/tutorials/L2/L2-4.md' },
      { id: 'L2-5', title: '实战：写一个完整的功能规范', titleEn: 'Practice: Write a Complete Spec', description: '综合练习', descriptionEn: 'Comprehensive practice', file: '/tutorials/L2/L2-5.md' },
    ],
  },
  {
    id: 'L3',
    title: '任务分解与需求分析',
    titleEn: 'Task Decomposition & Requirements',
    description: '掌握任务分解的核心技能',
    descriptionEn: 'Master the core skills of task decomposition',
    lessons: [
      { id: 'L3-1', title: '为什么要分解任务', titleEn: 'Why Decompose Tasks?', description: '分解是 AI 协作的基础', descriptionEn: 'Decomposition is the foundation of AI collaboration', file: '/tutorials/L3/L3-1.md' },
      { id: 'L3-2', title: 'MECE 原则', titleEn: 'MECE Principle', description: '相互独立，完全穷尽', descriptionEn: 'Mutually Exclusive, Collectively Exhaustive', file: '/tutorials/L3/L3-2.md' },
      { id: 'L3-3', title: '用 AI 进行需求分析', titleEn: 'AI-Assisted Requirements Analysis', description: '让 AI 帮你理解需求', descriptionEn: 'Let AI help you understand requirements', file: '/tutorials/L3/L3-3.md' },
      { id: 'L3-4', title: '规范分解', titleEn: 'Spec Decomposition', description: '从大规范到小规范', descriptionEn: 'From large specs to small specs', file: '/tutorials/L3/L3-4.md' },
      { id: 'L3-5', title: '实战：分解一个完整需求', titleEn: 'Practice: Decompose a Complete Requirement', description: '综合练习', descriptionEn: 'Comprehensive practice', file: '/tutorials/L3/L3-5.md' },
    ],
  },
  {
    id: 'L4',
    title: '提示工程核心技巧',
    titleEn: 'Prompt Engineering Core Skills',
    description: '掌握与 AI 高效沟通的核心技术',
    descriptionEn: 'Master core techniques for efficient AI communication',
    lessons: [
      { id: 'L4-1', title: '结构化提示词', titleEn: 'Structured Prompts', description: 'Role/Context/Task/Constraint', descriptionEn: 'Role/Context/Task/Constraint', file: '/tutorials/L4/L4-1.md' },
      { id: 'L4-2', title: 'Few-shot 示例技巧', titleEn: 'Few-shot Examples', description: '用示例引导 AI', descriptionEn: 'Guide AI with examples', file: '/tutorials/L4/L4-2.md' },
      { id: 'L4-3', title: '思维链 CoT', titleEn: 'Chain of Thought (CoT)', description: 'Chain of Thought', descriptionEn: 'Chain of Thought reasoning', file: '/tutorials/L4/L4-3.md' },
      { id: 'L4-4', title: '迭代式提示', titleEn: 'Iterative Prompting', description: '多轮对话优化结果', descriptionEn: 'Multi-turn dialogue optimization', file: '/tutorials/L4/L4-4.md' },
      { id: 'L4-5', title: '提示词模板库', titleEn: 'Prompt Template Library', description: '常用模板收藏', descriptionEn: 'Collection of common templates', file: '/tutorials/L4/L4-5.md' },
    ],
  },
  {
    id: 'L5',
    title: 'AI 代码生成与审查',
    titleEn: 'AI Code Generation & Review',
    description: '学会高效生成和审查 AI 代码',
    descriptionEn: 'Learn to efficiently generate and review AI code',
    lessons: [
      { id: 'L5-1', title: '把规范交给 AI', titleEn: 'Give Specs to AI', description: '基于规范生成代码', descriptionEn: 'Generate code based on specs', file: '/tutorials/L5/L5-1.md' },
      { id: 'L5-2', title: '代码审查要点', titleEn: 'Code Review Essentials', description: '安全、性能、规范', descriptionEn: 'Security, performance, standards', file: '/tutorials/L5/L5-2.md' },
      { id: 'L5-3', title: '让 AI 根据规范自查', titleEn: 'AI Self-Review by Spec', description: '自动化审查', descriptionEn: 'Automated review', file: '/tutorials/L5/L5-3.md' },
      { id: 'L5-4', title: '持续优化技巧', titleEn: 'Continuous Optimization', description: '迭代提升代码质量', descriptionEn: 'Iterative code quality improvement', file: '/tutorials/L5/L5-4.md' },
      { id: 'L5-5', title: 'AI 辅助 Debug', titleEn: 'AI-Assisted Debugging', description: '高效定位和修复问题', descriptionEn: 'Efficiently locate and fix issues', file: '/tutorials/L5/L5-5.md' },
    ],
  },
  {
    id: 'L6',
    title: '复杂项目多任务协调',
    titleEn: 'Complex Project Coordination',
    description: '掌握大型项目的 AI 协作方法',
    descriptionEn: 'Master AI collaboration methods for large projects',
    lessons: [
      { id: 'L6-1', title: '大型项目的规范架构', titleEn: 'Spec Architecture for Large Projects', description: '分层规范设计', descriptionEn: 'Hierarchical spec design', file: '/tutorials/L6/L6-1.md' },
      { id: 'L6-2', title: '模块划分与依赖管理', titleEn: 'Module Division & Dependencies', description: '解耦与组合', descriptionEn: 'Decoupling and composition', file: '/tutorials/L6/L6-2.md' },
      { id: 'L6-3', title: '多 AI 协作多个模块', titleEn: 'Multi-AI Multi-Module Collaboration', description: '并行与串行', descriptionEn: 'Parallel and serial execution', file: '/tutorials/L6/L6-3.md' },
      { id: 'L6-4', title: '代码整合与集成测试', titleEn: 'Code Integration & Testing', description: '合并与验证', descriptionEn: 'Merge and validate', file: '/tutorials/L6/L6-4.md' },
      { id: 'L6-5', title: '版本控制与 AI', titleEn: 'Version Control & AI', description: 'Git 工作流', descriptionEn: 'Git workflow', file: '/tutorials/L6/L6-5.md' },
    ],
  },
  {
    id: 'L7',
    title: 'AI 技能（Skills）设计',
    titleEn: 'AI Skills Design',
    description: '创建和管理自定义 AI 技能',
    descriptionEn: 'Create and manage custom AI skills',
    lessons: [
      { id: 'L7-1', title: '什么是 AI Skills', titleEn: 'What are AI Skills?', description: '技能 vs 通用助手', descriptionEn: 'Skills vs general assistant', file: '/tutorials/L7/L7-1.md' },
      { id: 'L7-2', title: '如何设计专业 Skill', titleEn: 'How to Design Professional Skills', description: '角色、能力边界、指令', descriptionEn: 'Role, capabilities, and instructions', file: '/tutorials/L7/L7-2.md' },
      { id: 'L7-3', title: 'Skill 优化技巧', titleEn: 'Skill Optimization Tips', description: '迭代与边界处理', descriptionEn: 'Iteration and edge case handling', file: '/tutorials/L7/L7-3.md' },
      { id: 'L7-4', title: '实战：设计代码审查 Skill', titleEn: 'Practice: Design Code Review Skill', description: '综合练习', descriptionEn: 'Comprehensive practice', file: '/tutorials/L7/L7-4.md' },
      { id: 'L7-5', title: 'Skill 库管理', titleEn: 'Skill Library Management', description: '整理与复用', descriptionEn: 'Organization and reuse', file: '/tutorials/L7/L7-5.md' },
    ],
  },
  {
    id: 'L8',
    title: 'Sub-agent 编排艺术',
    titleEn: 'Sub-agent Orchestration',
    description: '掌握多 AI 协作系统设计',
    descriptionEn: 'Master multi-AI collaborative system design',
    lessons: [
      { id: 'L8-1', title: '什么是 Sub-agent', titleEn: 'What is Sub-agent?', description: '指挥官与执行者', descriptionEn: 'Commander and executor', file: '/tutorials/L8/L8-1.md' },
      { id: 'L8-2', title: '设计 Sub-agent 系统', titleEn: 'Designing Sub-agent Systems', description: '主从 Agent 架构', descriptionEn: 'Master-slave agent architecture', file: '/tutorials/L8/L8-2.md' },
      { id: 'L8-3', title: '复杂任务分解为子任务', titleEn: 'Decomposing Complex Tasks', description: '任务树设计', descriptionEn: 'Task tree design', file: '/tutorials/L8/L8-3.md' },
      { id: 'L8-4', title: '实战：构建代码审查团队', titleEn: 'Practice: Build Code Review Team', description: '多 Agent 协作', descriptionEn: 'Multi-agent collaboration', file: '/tutorials/L8/L8-4.md' },
      { id: 'L8-5', title: '高级：Agent 网络', titleEn: 'Advanced: Agent Networks', description: '复杂协作模式', descriptionEn: 'Complex collaboration patterns', file: '/tutorials/L8/L8-5.md' },
    ],
  },
  {
    id: 'L9',
    title: '高级 AI 指挥官',
    titleEn: 'Advanced AI Commander',
    description: '成为真正的 AI 指挥官',
    descriptionEn: 'Become a true AI Commander',
    lessons: [
      { id: 'L9-1', title: '设计 AI 工作流', titleEn: 'Design AI Workflows', description: '自动化流程设计', descriptionEn: 'Automated workflow design', file: '/tutorials/L9/L9-1.md' },
      { id: 'L9-2', title: '多 AI 协作模式', titleEn: 'Multi-AI Collaboration Patterns', description: '专家模型组合', descriptionEn: 'Expert model composition', file: '/tutorials/L9/L9-2.md' },
      { id: 'L9-3', title: '自动化实践', titleEn: 'Automation Practice', description: 'CI/CD + AI', descriptionEn: 'CI/CD + AI', file: '/tutorials/L9/L9-3.md' },
      { id: 'L9-4', title: '构建团队 AI 开发规范', titleEn: 'Build Team AI Development Standards', description: '流程与标准', descriptionEn: 'Processes and standards', file: '/tutorials/L9/L9-4.md' },
      { id: 'L9-5', title: '持续学习与演进', titleEn: 'Continuous Learning & Evolution', description: '保持竞争力', descriptionEn: 'Stay competitive', file: '/tutorials/L9/L9-5.md' },
    ],
  },
];

export const getAllLessons = () => {
  return tutorialChapters.flatMap(chapter => chapter.lessons);
};

export const getLessonById = (id: string) => {
  for (const chapter of tutorialChapters) {
    const lesson = chapter.lessons.find(l => l.id === id);
    if (lesson) return lesson;
  }
  return null;
};

export const getChapterByLessonId = (lessonId: string) => {
  return tutorialChapters.find(chapter =>
    chapter.lessons.some(l => l.id === lessonId)
  );
};
