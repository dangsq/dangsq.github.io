'use client';

import { useState } from 'react';

export default function ProjectsPage() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const projects = [
    {
      title: "LLM长短期记忆存储及任务规划",
      titleEn: "Research on LLM Long Short Term Memory Storage and Task Planning",
      team: "李雪琛，刘雨绮，党圣奇",
      teamEn: "Xuechen Li, Yuqi Liu, Shengqi Dang",
      year: "2023 fall",
      tags: ["交互设计", "智能体", "大语言模型", "用户界面设计"],
      tagsEn: ["Interaction Design", "Agents", "Large Language Models", "User Interface Design"],
      description: "大语言模型的出现让人们看到了解决复杂问题的可能。然而，受限于其自身的限制（幻觉,记忆有限，以及交互方式单一等问题），其在实际应用中往往会遇到一些挑战。我们通过设计交互方式，让人类可以参与到大语言模型的记忆管理，并使用工作流的方式对模型的记忆进行整理和规划，从而实现更高效的记忆管理和任务规划。",
      descriptionEn: "The emergence of large language models has shown the potential to solve complex problems. However, due to their inherent limitations (such as hallucinations, limited memory, and single interaction methods), they often face challenges in practical applications. We designed interaction methods that allow humans to participate in the memory management of large language models, using workflow approaches to organize and plan the model's memory, thereby achieving more efficient memory management and task planning.",
    },
    {
      title: "EmotiCrafter 情感化图像生成系统",
      titleEn: "EmotiCrafter Emotional Image Generation System",
      team: "党圣奇，何毅，凌龙，钱子晴，赵南轩，曹楠",
      teamEn: "Shengqi Dang, Yi He, Long Ling, Ziqing Qian, Nanxuan Zhao, Nan Cao",
      year: "2024 spring",
      tags: ["情感图像生成", "扩散模型", "情感计算"],
      tagsEn: ["Emotional Image Generation", "Diffusion Models", "Affective Computing"],
      description: "情感是人类交流的重要组成部分，然而现有的文本到图像生成模型在生成情感化图像时往往表现不佳。我们提出了EmotiCrafter，一个基于Valence-Arousal模型的情感化图像生成系统，能够根据用户输入的文本和情感参数生成符合预期情感的图像。",
      descriptionEn: "Emotion is an important part of human communication, but existing text-to-image generation models often perform poorly when generating emotional images. We propose EmotiCrafter, an emotional image generation system based on the Valence-Arousal model, which can generate images that match the expected emotions based on user input text and emotional parameters.",
    },
    {
      title: "MV-Crafter 音乐视频生成系统",
      titleEn: "MV-Crafter Music Video Generation System",
      team: "陈楚尔，党圣奇，刘雨绮，赵南轩，石洋，曹楠",
      teamEn: "Chuer Chen, Shengqi Dang, Yuqi Liu, Nanxuan Zhao, Yang Shi, Nan Cao",
      year: "2023 fall",
      tags: ["音乐视频生成", "智能体", "多模态生成"],
      tagsEn: ["Music Video Generation", "Agents", "Multimodal Generation"],
      description: "音乐视频（MV）是音乐和视觉艺术的结合，能够增强音乐的表现力和感染力。我们开发了MV-Crafter，一个智能音乐视频生成系统，能够根据音乐的节奏、情感和歌词内容自动生成与之匹配的视频内容。",
      descriptionEn: "Music videos (MVs) are a combination of music and visual art that can enhance the expressiveness and appeal of music. We developed MV-Crafter, an intelligent music video generation system that can automatically generate video content that matches the rhythm, emotion, and lyrical content of music.",
    },
    {
      title: "Bring Clipart to Life 照片编辑系统",
      titleEn: "Bring Clipart to Life Photo Editing System",
      team: "赵南轩，党圣奇，林鹤勋，石洋，曹楠",
      teamEn: "Nanxuan Zhao, Shengqi Dang, Hexun Lin, Yang Shi, Nan Cao",
      year: "2022 fall",
      tags: ["照片编辑", "StyleGAN", "交互设计"],
      tagsEn: ["Photo Editing", "StyleGAN", "Interaction Design"],
      description: "传统的照片编辑工具往往需要用户具备专业的图像处理知识。我们提出了一种基于拼贴画交互的照片编辑方法，用户可以通过简单的拖拽和组合clipart元素来编辑照片，系统会自动将这些元素融合到照片中，生成自然逼真的效果。",
      descriptionEn: "Traditional photo editing tools often require users to have professional image processing knowledge. We propose a clipart-based interactive photo editing method where users can edit photos by simply dragging and combining clipart elements, and the system automatically integrates these elements into the photo to generate natural and realistic effects.",
    },
    {
      title: "Picme 个性化内容定制系统",
      titleEn: "Picme Personalized Content Customization System",
      team: "彭也纯，党圣奇，石洋，曹楠，赵南轩",
      teamEn: "Yechun Peng, Shengqi Dang, Yang Shi, Nan Cao, Nanxuan Zhao",
      year: "2022 fall",
      tags: ["交互设计", "内容定制", "卡通头像生成"],
      tagsEn: ["Interaction Design", "Content Customization", "Cartoon Avatar Generation"],
      description: "个性化产品帮助我们提升自我认识以及有助于自我表达，基于此，我们利用深度学习模型设计了头像照片到卡通头像的转化系统，并应用到个性化内容定制系统中。",
      descriptionEn: "Personalized products help us enhance self-awareness and facilitate self-expression. Based on this, we designed a system using deep learning models to transform profile photos into cartoon avatars and applied it to a personalized content customization system.",
    },
  ];

  const toggleProject = (index: number) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 fade-in">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Projects</h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Research projects in AI, computer graphics, and human-computer interaction
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Project Header */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
                    {project.title}
                  </h2>
                  <p className="text-lg text-[var(--text-secondary)] mb-3">
                    {project.titleEn}
                  </p>
                  <div className="text-sm text-[var(--text-tertiary)] mb-4">
                    <p>{project.team} | {project.year}</p>
                    <p>{project.teamEn} | {project.year}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tagsEn.map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 text-[var(--text-secondary)]">
                  <p>{project.description}</p>
                  <p>{project.descriptionEn}</p>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => toggleProject(index)}
                  className="mt-6 btn btn-secondary w-full md:w-auto"
                >
                  {expandedProject === index ? 'Show Less / 收起' : 'Learn More / 了解更多'}
                </button>

                {/* Expanded Content */}
                {expandedProject === index && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-color)] fade-in">
                    <p className="text-[var(--text-secondary)]">
                      详细内容展示区域 - 可以添加图片、视频和更多描述
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container py-12">
        <div className="max-w-5xl mx-auto text-center text-sm text-[var(--text-tertiary)]">
          <p>© 2025 Shengqi Dang. All rights reserved.</p>
          <p>版权所有 © 2025 党圣奇</p>
        </div>
      </footer>
    </main>
  );
}
