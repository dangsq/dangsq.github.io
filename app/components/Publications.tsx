export default function Publications() {
  return (
    <section id="publications" className="mb-16 bg-[var(--bg-panel)] p-8 rounded-lg backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-6 text-[var(--neon-magenta)]">Publications</h2>
      
      {/* Conference Papers */}
      <h3 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Conference</h3>
      
      <div className="space-y-8">
        {/* Paper 1 */}
        <div className="border-l-4 border-[var(--neon-cyan)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="./" className="hover:text-[var(--neon-cyan)]">
              DensiCrafter: Physically-Constrained Generation and Fabrication of Self-Supporting Hollow Structures
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">3D生成</span>
            <span className="tag">物理条件嵌入</span>
            <span className="tag">可打印物体生成</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            Annual AAAI Conference on Artificial Intelligence (AAAI), 2026
          </p>
          <p className="text-[var(--text-secondary)]">
            Shengqi Dang, Fu Chai, Jiaxin Li, Chao Yuan, Wei Ye, Nan Cao
          </p>
        </div>

        {/* Paper 2 */}
        <div className="border-l-4 border-[var(--neon-cyan)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="./" className="hover:text-[var(--neon-cyan)]">
              Designed to Spread: Generative Approaches to Enhance Information Diffusion
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">动态信息设计</span>
            <span className="tag">信息传播</span>
            <span className="tag">互联网营销</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            Annual AAAI Conference on Artificial Intelligence (AAAI), 2026
          </p>
          <p className="text-[var(--text-secondary)]">
            Ziqing Qian, Jiaying Lei, Shengqi Dang, Nan Cao
          </p>
        </div>

        {/* Paper 3 */}
        <div className="border-l-4 border-[var(--neon-cyan)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="https://openaccess.thecvf.com/content/ICCV2025/html/Dang_EmotiCrafter_Text-to-Emotional-Image_Generation_based_on_Valence-Arousal_Model_ICCV_2025_paper.html" 
               target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-cyan)]">
              EmotiCrafter: Text-to-Emotional-Image Generation based on Valence-Arousal Model
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">情感图像生成</span>
            <span className="tag">图像生成模型</span>
            <span className="tag">情感计算</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            International Conference on Computer Vision (ICCV), 2025
          </p>
          <p className="text-[var(--text-secondary)]">
            Shengqi Dang, Yi He, Long Ling, Ziqing Qian, Nanxuan Zhao, Nan Cao
          </p>
        </div>

        {/* Paper 4 */}
        <div className="border-l-4 border-[var(--neon-cyan)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="https://dl.acm.org/doi/abs/10.1145/3613904.3642391" 
               target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-cyan)]">
              Supporting Product Personalization through Stylized Head Portraits
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">个性化产品</span>
            <span className="tag">卡通头像生成</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            Conference on Human Factors in Computing Systems (CHI), 2024
          </p>
          <p className="text-[var(--text-secondary)]">
            Yang Shi, Yechun Peng, Shengqi Dang, Nanxuan Zhao, Nan Cao
          </p>
        </div>

        {/* Paper 5 */}
        <div className="border-l-4 border-[var(--neon-cyan)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="https://openaccess.thecvf.com/content/ICCV2023/html/Zhao_Bring_Clipart_to_Life_ICCV_2023_paper.html" 
               target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-cyan)]">
              Bring Clipart to Life
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">照片编辑</span>
            <span className="tag">StyleGAN图像生成</span>
            <span className="tag">交互方式设计</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            International Conference on Computer Vision (ICCV), 2023
          </p>
          <p className="text-[var(--text-secondary)]">
            Nanxuan Zhao, Shengqi Dang, Hexun Lin, Yang Shi, Nan Cao
          </p>
        </div>
      </div>

      {/* Journal Papers */}
      <h3 className="text-2xl font-semibold mb-4 mt-12 text-[var(--text-primary)]">Journals</h3>
      
      <div className="space-y-8">
        {/* Journal 1 */}
        <div className="border-l-4 border-[var(--neon-pink)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="https://dl.acm.org/doi/10.1145/3748515" 
               target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-cyan)]">
              MV-Crafter: An Intelligent System for Music-guided Video Generation
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">音乐视频生成</span>
            <span className="tag">智能体</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            ACM Transactions on Interactive Intelligent Systems, 2025
          </p>
          <p className="text-[var(--text-secondary)]">
            Chuer Chen, Shengqi Dang, Yuqi Liu, Nanxuan Zhao, Yang Shi, Nan Cao
          </p>
        </div>

        {/* Journal 2 */}
        <div className="border-l-4 border-[var(--neon-pink)] pl-6">
          <h4 className="text-xl font-semibold mb-2">
            <a href="https://dlnext.acm.org/doi/10.1145/3778349" 
               target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-cyan)]">
              FreeShell: A Context-Free 4D Printing Technique for Fabricating Complex 3D Triangle Mesh Shells
            </a>
          </h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="tag">4D打印</span>
            <span className="tag">曲面展平</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-2">
            ACM Transactions on Graphics, 2026
          </p>
          <p className="text-[var(--text-secondary)]">
            Chao Yuan, Shengqi Dang, Xuejiao Ma, Nan Cao
          </p>
        </div>
      </div>
    </section>
  );
}
