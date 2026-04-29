import Link from 'next/link';
import Publications from './components/Publications';
import Projects from './components/Projects';

export default function Home() {
  return (
    <>
      <div className="grid-bg"></div>
      <div className="min-h-screen p-8 max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-tech)' }}>
            <span className="text-[var(--neon-cyan)]">🦋</span> Shengqi Dang
          </h1>
          <h2 className="text-3xl mb-6" style={{ fontFamily: 'var(--font-cn)' }}>
            党圣奇
          </h2>
          <p className="text-[var(--text-secondary)]">
            dangsq123@163.com &nbsp;&nbsp;|&nbsp;&nbsp; dangsq123@tongji.edu.cn
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-6 mb-12 flex-wrap">
          <Link href="#about" className="px-6 py-2 border-2 border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black transition-all">
            About
          </Link>
          <Link href="#publications" className="px-6 py-2 border-2 border-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)] hover:text-black transition-all">
            Publications
          </Link>
          <Link href="#projects" className="px-6 py-2 border-2 border-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-black transition-all">
            Projects
          </Link>
        </nav>

        {/* About Section */}
        <section id="about" className="mb-16 bg-[var(--bg-panel)] p-8 rounded-lg backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-[var(--neon-cyan)]">About Me</h2>
          <div className="space-y-4 text-[var(--text-primary)]">
            <p>
              我是党圣奇（Shengqi Dang），是
              <a href="https://srias.tongji.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                同济大学上海自主智能无人系统科学中心
              </a>
              的在读博士生（专业：智能科学与技术，导师：
              <a href="http://nancao.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                曹楠
              </a>
              ），同时，也在
              <a href="https://www.sii.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                上海创智学院
              </a>
              进行培养。我本科毕业于
              <a href="https://math.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                同济大学数学科学学院
              </a>
              ，获得了数学与应用数学学士学位。硕士就读于
              <a href="https://tjdi.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                同济大学设计创意学院
              </a>
              的人工智能与数据设计专业，并通过硕转博进入博士阶段的学习。
            </p>
            <p>
              我自许具有复合学科背景，并对多学科交叉研究具有浓厚兴趣。我对计算机图形学、智能计算设计、心理学以及人工智能领域具有着浓厚的兴趣，并期待在未来的研究中能够将这些兴趣转化为实际的创造性成果。我是INFP，我喜欢做白日梦。如果你对我以及我的研究有兴趣，欢迎与我联系。
            </p>
            <hr className="my-6 border-[var(--text-secondary)]" />
            <p>
              I am Shengqi Dang, a Ph.D. candidate at the{' '}
              <a href="https://srias.tongji.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                Shanghai Research Institute for Intelligent Autonomous Systems
              </a>
              , Tongji University (major: Intelligent Science and Technology, advisor:{' '}
              <a href="http://nancao.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                Prof. Nan Cao
              </a>
              ). Additionally, I am also undergoing training at the{' '}
              <a href="https://www.sii.edu.cn/main.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                Shanghai Innovation Institute
              </a>
              . I obtained my Bachelor&apos;s degree in Mathematics and Applied Mathematics from the{' '}
              <a href="https://math.tongji.edu.cn/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:text-[var(--neon-cyan)]">
                School of Mathematical Sciences
              </a>
              {' '}at Tongji University.
            </p>
          </div>
        </section>

        {/* Publications Section */}
        <Publications />

        {/* Projects Section */}
        <Projects />

        {/* Footer */}
        <footer className="text-center mt-16 text-[var(--text-secondary)] text-sm">
          <p>© 2025 Shengqi Dang. All rights reserved.</p>
          <p>版权所有 © 2025 党圣奇</p>
        </footer>
      </div>
    </>
  );
}
