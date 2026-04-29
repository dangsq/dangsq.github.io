'use client';

import { useState } from 'react';

export default function Projects() {
  const [openProject, setOpenProject] = useState<string | null>(null);

  const toggleProject = (projectId: string) => {
    setOpenProject(openProject === projectId ? null : projectId);
  };

  return (
    <section id="projects" className="mb-16 bg-[var(--bg-panel)] p-8 rounded-lg backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-6 text-[var(--neon-pink)]">Projects</h2>
      
      <div className="space-y-12">
        {/* Project 1 */}
        <div className="project">
          <div className="project-header mb-4">
            <h3 className="text-2xl font-bold mb-2">
              LLM长短期记忆存储及任务规划
            </h3>
            <p className="text-xl mb-2">
              Research on LLM Long Short Term Memory Storage and Task Planning
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              李雪琛，刘雨绮，党圣奇 | 2023 fall<br />
              Xuechen Li, Yuqi Liu, Shengqi Dang | 2023 fall
            </p>
          </div>
          
          <div className="project-summary mb-4">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">交互设计</span>
              <span className="tag">智能体</span>
              <span className="tag">大语言模型</span>
              <span className="tag">用户界面设计</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">Interaction Design</span>
              <span className="tag">Agents</span>
              <span className="tag">Large Language Models</span>
              <span className="tag">User Interface Design</span>
            </div>
            <p className="text-[var(--text-primary)] mb-3">
              大语言模型的出现让人们看到了解决复杂问题的可能。然而，受限于其自身的限制（幻觉,记忆有限，以及交互方式单一等问题），其在实际应用中往往会遇到一些挑战。
              我们通过设计交互方式，让人类可以参与到大语言模型的记忆管理，并使用工作流的方式对模型的记忆进行整理和规划，从而实现更高效的记忆管理和任务规划。
            </p>
            <p className="text-[var(--text-primary)]">
              The emergence of large language models has shown the potential to solve complex problems. However, due to their inherent limitations (such as hallucinations, limited memory, and single interaction methods), they often face challenges in practical applications.
              We designed interaction methods that allow humans to participate in the memory management of large language models, using workflow approaches to organize and plan the model&apos;s memory, thereby achieving more efficient memory management and task planning.
            </p>
          </div>
          
          <button 
            className="project-toggle"
            onClick={() => toggleProject('llm')}
            aria-expanded={openProject === 'llm'}
          >
            About More / 详情
          </button>
          
          <div className={`project-details ${openProject === 'llm' ? 'open' : ''}`}>
            <p className="text-[var(--text-secondary)]">
              详细内容展示区域 - 可以添加图片和更多描述
            </p>
          </div>
        </div>

        {/* Project 2 */}
        <div className="project">
          <div className="project-header mb-4">
            <h3 className="text-2xl font-bold mb-2">
              EmotiCrafter 情感化图像生成系统
            </h3>
            <p className="text-xl mb-2">
              EmotiCrafter Emotional Image Generation System
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              党圣奇，何毅，凌龙，钱子晴，赵南轩，曹楠 | 2024 spring<br />
              Shengqi Dang, Yi He, Long Ling, Ziqing Qian, Nanxuan Zhao, Nan Cao | 2024 spring
            </p>
          </div>
          
          <div className="project-summary mb-4">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">情感图像生成</span>
              <span className="tag">扩散模型</span>
              <span className="tag">情感计算</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">Emotional Image Generation</span>
              <span className="tag">Diffusion Models</span>
              <span className="tag">Affective Computing</span>
            </div>
            <p className="text-[var(--text-primary)] mb-3">
              情感是人类交流的重要组成部分，然而现有的文本到图像生成模型在生成情感化图像时往往表现不佳。我们提出了EmotiCrafter，一个基于Valence-Arousal模型的情感化图像生成系统，能够根据用户输入的文本和情感参数生成符合预期情感的图像。
            </p>
            <p className="text-[var(--text-primary)]">
              Emotion is an important part of human communication, but existing text-to-image generation models often perform poorly when generating emotional images. We propose EmotiCrafter, an emotional image generation system based on the Valence-Arousal model, which can generate images that match the expected emotions based on user input text and emotional parameters.
            </p>
          </div>
          
          <button 
            className="project-toggle"
            onClick={() => toggleProject('emoticrafter')}
            aria-expanded={openProject === 'emoticrafter'}
          >
            About More / 详情
          </button>
          
          <div className={`project-details ${openProject === 'emoticrafter' ? 'open' : ''}`}>
            <p className="text-[var(--text-secondary)]">
              详细内容展示区域 - 可以添加图片和更多描述
            </p>
          </div>
        </div>

        {/* Project 3 */}
        <div className="project">
          <div className="project-header mb-4">
            <h3 className="text-2xl font-bold mb-2">
              MV-Crafter 音乐视频生成系统
            </h3>
            <p className="text-xl mb-2">
              MV-Crafter Music Video Generation System
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              陈楚尔，党圣奇，刘雨绮，赵南轩，石洋，曹楠 | 2023 fall<br />
              Chuer Chen, Shengqi Dang, Yuqi Liu, Nanxuan Zhao, Yang Shi, Nan Cao | 2023 fall
            </p>
          </div>
          
          <div className="project-summary mb-4">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">音乐视频生成</span>
              <span className="tag">智能体</span>
              <span className="tag">多模态生成</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">Music Video Generation</span>
              <span className="tag">Agents</span>
              <span className="tag">Multimodal Generation</span>
            </div>
            <p className="text-[var(--text-primary)] mb-3">
              音乐视频（MV）是音乐和视觉艺术的结合，能够增强音乐的表现力和感染力。我们设计了MV-Crafter，一个智能的音乐视频生成系统，能够根据音乐的节奏、情感和歌词内容自动生成匹配的视频内容。
            </p>
            <p className="text-[var(--text-primary)]">
              Music videos (MVs) are a combination of music and visual art that can enhance the expressiveness and appeal of music. We designed MV-Crafter, an intelligent music video generation system that can automatically generate matching video content based on the rhythm, emotion, and lyrical content of music.
            </p>
          </div>
          
          <button 
            className="project-toggle"
            onClick={() => toggleProject('mvcrafter')}
            aria-expanded={openProject === 'mvcrafter'}
          >
            About More / 详情
          </button>
          
          <div className={`project-details ${openProject === 'mvcrafter' ? 'open' : ''}`}>
            <p className="text-[var(--text-secondary)]">
              详细内容展示区域 - 可以添加图片和更多描述
            </p>
          </div>
        </div>

        {/* Project 4 */}
        <div className="project">
          <div className="project-header mb-4">
            <h3 className="text-2xl font-bold mb-2">
              Bring Clipart to Life 照片编辑系统
            </h3>
            <p className="text-xl mb-2">
              Bring Clipart to Life Photo Editing System
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              赵南轩，党圣奇，林鹤勋，石洋，曹楠 | 2022 fall<br />
              Nanxuan Zhao, Shengqi Dang, Hexun Lin, Yang Shi, Nan Cao | 2022 fall
            </p>
          </div>
          
          <div className="project-summary mb-4">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">照片编辑</span>
              <span className="tag">StyleGAN图像生成</span>
              <span className="tag">交互方式设计</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">Photo Editing</span>
              <span className="tag">StyleGAN Image Generation</span>
              <span className="tag">Interaction Design</span>
            </div>
            <p className="text-[var(--text-primary)] mb-3">
              传统的照片编辑工具往往需要专业的技能和大量的时间。我们提出了一种基于拼贴画交互的照片编辑方法，用户可以通过简单的拖拽和放置clipart元素来编辑照片，系统会自动将这些元素融合到照片中。
            </p>
            <p className="text-[var(--text-primary)]">
              Traditional photo editing tools often require professional skills and a lot of time. We propose a clipart-based interactive photo editing method where users can edit photos by simply dragging and placing clipart elements, and the system will automatically integrate these elements into the photo.
            </p>
          </div>
          
          <button 
            className="project-toggle"
            onClick={() => toggleProject('clipart')}
            aria-expanded={openProject === 'clipart'}
          >
            About More / 详情
          </button>
          
          <div className={`project-details ${openProject === 'clipart' ? 'open' : ''}`}>
            <p className="text-[var(--text-secondary)]">
              详细内容展示区域 - 可以添加图片和更多描述
            </p>
          </div>
        </div>

        {/* Project 5 */}
        <div className="project">
          <div className="project-header mb-4">
            <h3 className="text-2xl font-bold mb-2">
              Picme 个性化内容定制系统
            </h3>
            <p className="text-xl mb-2">
              Picme Personalized Content Customization System
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              彭也纯，党圣奇，石洋，曹楠，赵南轩 | 2022 fall<br />
              Yechun Peng, Shengqi Dang, Yang Shi, Nan Cao, Nanxuan Zhao | 2022 fall
            </p>
          </div>
          
          <div className="project-summary mb-4">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">交互设计</span>
              <span className="tag">内容定制</span>
              <span className="tag">卡通头像生成</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag">Interaction Design</span>
              <span className="tag">Content Customization</span>
              <span className="tag">Cartoon Avatar Generation</span>
            </div>
            <p className="text-[var(--text-primary)] mb-3">
              个性化产品帮助我们提升自我认识以及有助于自我表达，基于此，我们利用深度学习模型设计了头像照片到卡通头像的转化系统，并应用到个性化内容定制系统中。
            </p>
            <p className="text-[var(--text-primary)]">
              Personalized products help us enhance self-awareness and facilitate self-expression. Based on this, we designed a system using deep learning models to transform profile photos into cartoon avatars and applied it to a personalized content customization system.
            </p>
          </div>
          
          <button 
            className="project-toggle"
            onClick={() => toggleProject('picme')}
            aria-expanded={openProject === 'picme'}
          >
            About More / 详情
          </button>
          
          <div className={`project-details ${openProject === 'picme' ? 'open' : ''}`}>
            <p className="text-[var(--text-secondary)]">
              详细内容展示区域 - 可以添加图片和更多描述
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
