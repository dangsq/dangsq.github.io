
          (function(){
            function openDetails(el){
                el.style.height = el.scrollHeight + 'px';
                el.classList.add('open');
                el.setAttribute('aria-hidden','false');
                setTimeout(() => {
                    if(el.classList.contains('open')) {
                        el.style.height = 'auto';
                    }
                }, 400); 
            }
            function closeDetails(el){
                el.style.height = el.scrollHeight + 'px';
                void el.offsetHeight;
                el.style.height = '0px';
                el.classList.remove('open');
                el.setAttribute('aria-hidden','true');
            }

            function toggleDetails(container, details, toggleBtn){
                const isOpen = details.classList.contains('open');
                if(isOpen){
                    closeDetails(details);
                    toggleBtn.setAttribute('aria-expanded','false');
                    toggleBtn.textContent = 'ACCESS DATA / 详情';
                } else {
                    document.querySelectorAll('.project-details.open').forEach(openEl=>{
                        const parent = openEl.closest('.project');
                        const btn = parent && parent.querySelector('.project-toggle');
                        if(openEl !== details){ 
                            closeDetails(openEl); 
                            if(btn){ btn.setAttribute('aria-expanded','false'); btn.textContent = 'ACCESS DATA / 详情'; } 
                        }
                    });
                    openDetails(details);
                    toggleBtn.setAttribute('aria-expanded','true');
                    toggleBtn.textContent = 'MINIMIZE / 收起 ';
                }
            }

            function initProjectBlock(project){
                if(project.dataset._initProject) return;
                project.dataset._initProject = '1';

                const details = project.querySelector('.project-details');
                if(!details) return;
                if(!details.id){
                    details.id = 'proj-' + Math.random().toString(36).slice(2,9);
                }

                let toggleBtn = project.querySelector('.project-toggle');
                if(!toggleBtn){
                    toggleBtn = document.createElement('button');
                    toggleBtn.className = 'project-toggle';
                    toggleBtn.textContent = 'ACCESS DATA / 详情';
                    toggleBtn.setAttribute('aria-expanded','false');
                    toggleBtn.setAttribute('aria-controls', details.id);
                    let header = project.querySelector('.project-header');
                    if(!header){ 
                        header = document.createElement('div');
                        header.className = 'project-header';
                        project.insertBefore(header, details);
                    }
                    header.appendChild(toggleBtn);
                } else {
                    toggleBtn.setAttribute('aria-controls', details.id);
                    toggleBtn.setAttribute('aria-expanded','false');
                }

                details.style.height = '0px';
                details.setAttribute('aria-hidden','true');

                toggleBtn.addEventListener('click', function(){
                    toggleDetails(project, details, toggleBtn);
                });

                toggleBtn.addEventListener('keydown', function(e){
                    if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
                        e.preventDefault(); this.click();
                    }
                });

                window.addEventListener('resize', function(){
                    if(details.classList.contains('open')){
                        if(details.style.height !== 'auto') {
                             details.style.height = details.scrollHeight + 'px';
                        }
                    }
                });
            }

            function initAllProjects(){
                document.querySelectorAll('.project').forEach(initProjectBlock);
            }

            if(window.$docsify){
                window.$docsify.plugins = window.$docsify.plugins || [];
                window.$docsify.plugins.push(function(hook, vm){
                    hook.doneEach(function(){
                        initAllProjects();
                    });
                });
            } else {
                document.addEventListener('DOMContentLoaded', initAllProjects);
            }
        })();