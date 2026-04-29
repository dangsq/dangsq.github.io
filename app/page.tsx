export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[var(--text-primary)]">
            Shengqi Dang
          </h1>
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--text-secondary)]">
            党圣奇
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8">
            PhD Candidate at Tongji University
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[var(--text-secondary)]">
            <a href="mailto:dangsq123@163.com" className="hover:text-[var(--accent-primary)]">
              dangsq123@163.com
            </a>
            <span>•</span>
            <a href="mailto:dangsq123@tongji.edu.cn" className="hover:text-[var(--accent-primary)]">
              dangsq123@tongji.edu.cn
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="card fade-in">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">About Me</h2>
            
            <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
              <p>
                我是党圣奇（Shengqi Dang），是
                <a href="https://srias.tongji.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  同济大学上海自主智能无人系统科学中心
                </a>
                的在读博士生（专业：智能科学与技术，导师：
                <a href="http://nancao.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  曹楠
                </a>
                ），同时，也在
                <a href="https://www.sii.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  上海创智学院
                </a>
                进行培养。
              </p>

              <p>
                我本科毕业于
                <a href="https://math.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  同济大学数学科学学院
                </a>
                ，获得了数学与应用数学学士学位。硕士就读于
                <a href="https://tjdi.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  同济大学设计创意学院
                </a>
                的人工智能与数据设计专业，并通过硕转博进入博士阶段的学习。
              </p>

              <p>
                我自许具有复合学科背景，并对多学科交叉研究具有浓厚兴趣。我对计算机图形学、智能计算设计、心理学以及人工智能领域具有着浓厚的兴趣，并期待在未来的研究中能够将这些兴趣转化为实际的创造性成果。我是INFP，我喜欢做白日梦。如果你对我以及我的研究有兴趣，欢迎与我联系。
              </p>

              <div className="divider"></div>

              <p>
                I am Shengqi Dang, a Ph.D. candidate at the{' '}
                <a href="https://srias.tongji.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  Shanghai Research Institute for Intelligent Autonomous Systems
                </a>
                , Tongji University (major: Intelligent Science and Technology, advisor:{' '}
                <a href="http://nancao.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  Prof. Nan Cao
                </a>
                ). Additionally, I am also undergoing training at the{' '}
                <a href="https://www.sii.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  Shanghai Innovation Institute
                </a>
                .
              </p>

              <p>
                I obtained my Bachelor&apos;s degree in Mathematics and Applied Mathematics from the{' '}
                <a href="https://math.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  School of Mathematical Sciences
                </a>
                {' '}at Tongji University. I pursued my Master&apos;s degree in AI and Data Design at the{' '}
                <a href="https://tjdi.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                  College of Design and Innovation
                </a>
                , Tongji University, and later transferred to the Ph.D. program.
              </p>

              <p>
                I consider myself to have an interdisciplinary background and have a strong interest in cross-disciplinary research. My research interests include computer graphics, intelligent computational design, psychology and artificial intelligence. I enjoy engaging in creative activities and look forward to translating these interests into practical and innovative outcomes in my future research. I am an INFP and I enjoy daydreaming. If you are interested in my research, please feel free to contact me.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-[var(--text-primary)]">Research Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-lg mb-2 text-[var(--text-primary)]">Computer Graphics</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                3D generation, physically-constrained fabrication, computational design
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2 text-[var(--text-primary)]">Generative AI</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Emotional image generation, music video generation, diffusion models
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2 text-[var(--text-primary)]">Human-AI Interaction</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                LLM memory management, intelligent agents, user interface design
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2 text-[var(--text-primary)]">Affective Computing</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Emotion recognition, emotional content generation, psychology
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
