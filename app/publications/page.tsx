export default function PublicationsPage() {
  const conferences = [
    {
      title: "DensiCrafter: Physically-Constrained Generation and Fabrication of Self-Supporting Hollow Structures",
      authors: "Shengqi Dang, Fu Chai, Jiaxin Li, Chao Yuan, Wei Ye, Nan Cao",
      venue: "Annual AAAI Conference on Artificial Intelligence (AAAI)",
      year: "2026",
      tags: ["3D生成", "物理条件嵌入", "可打印物体生成"],
      link: "./",
    },
    {
      title: "Designed to Spread: Generative Approaches to Enhance Information Diffusion",
      authors: "Ziqing Qian, Jiaying Lei, Shengqi Dang, Nan Cao",
      venue: "Annual AAAI Conference on Artificial Intelligence (AAAI)",
      year: "2026",
      tags: ["动态信息设计", "信息传播", "互联网营销"],
      link: "./",
    },
    {
      title: "EmotiCrafter: Text-to-Emotional-Image Generation based on Valence-Arousal Model",
      authors: "Shengqi Dang, Yi He, Long Ling, Ziqing Qian, Nanxuan Zhao, Nan Cao",
      venue: "International Conference on Computer Vision (ICCV)",
      year: "2025",
      tags: ["情感图像生成", "图像生成模型", "情感计算"],
      link: "https://openaccess.thecvf.com/content/ICCV2025/html/Dang_EmotiCrafter_Text-to-Emotional-Image_Generation_based_on_Valence-Arousal_Model_ICCV_2025_paper.html",
    },
    {
      title: "Supporting Product Personalization through Stylized Head Portraits",
      authors: "Yang Shi, Yechun Peng, Shengqi Dang, Nanxuan Zhao, Nan Cao",
      venue: "Conference on Human Factors in Computing Systems (CHI)",
      year: "2024",
      tags: ["个性化产品", "卡通头像生成"],
      link: "https://dl.acm.org/doi/abs/10.1145/3613904.3642391",
    },
    {
      title: "Bring Clipart to Life",
      authors: "Nanxuan Zhao, Shengqi Dang, Hexun Lin, Yang Shi, Nan Cao",
      venue: "International Conference on Computer Vision (ICCV)",
      year: "2023",
      tags: ["照片编辑", "StyleGAN图像生成", "交互方式设计"],
      link: "https://openaccess.thecvf.com/content/ICCV2023/html/Zhao_Bring_Clipart_to_Life_ICCV_2023_paper.html",
    },
  ];

  const journals = [
    {
      title: "MV-Crafter: An Intelligent System for Music-guided Video Generation",
      authors: "Chuer Chen, Shengqi Dang, Yuqi Liu, Nanxuan Zhao, Yang Shi, Nan Cao",
      venue: "ACM Transactions on Interactive Intelligent Systems",
      year: "2025",
      tags: ["音乐视频生成", "智能体"],
      link: "https://dl.acm.org/doi/10.1145/3748515",
    },
    {
      title: "FreeShell: A Context-Free 4D Printing Technique for Fabricating Complex 3D Triangle Mesh Shells",
      authors: "Chao Yuan, Shengqi Dang, Xuejiao Ma, Nan Cao",
      venue: "ACM Transactions on Graphics",
      year: "2026",
      tags: ["4D打印", "曲面展平"],
      link: "https://dlnext.acm.org/doi/10.1145/3778349",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 fade-in">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Publications</h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Selected publications in top-tier conferences and journals
            </p>
          </div>

          {/* Conference Papers */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Conference Papers</h2>
            <div className="space-y-6">
              {conferences.map((paper, index) => (
                <div key={index} className="card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        <a
                          href={paper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {paper.title}
                        </a>
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        {paper.authors}
                      </p>
                      <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">
                        {paper.venue}, {paper.year}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {paper.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Journal Papers */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Journal Papers</h2>
            <div className="space-y-6">
              {journals.map((paper, index) => (
                <div key={index} className="card fade-in" style={{ animationDelay: `${(conferences.length + index) * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        <a
                          href={paper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {paper.title}
                        </a>
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        {paper.authors}
                      </p>
                      <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">
                        {paper.venue}, {paper.year}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {paper.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="container py-12 text-center text-sm text-[var(--text-tertiary)]">
        <p>© 2025 Shengqi Dang. All rights reserved.</p>
        <p>版权所有 © 2025 党圣奇</p>
      </footer>
    </main>
  );
}
