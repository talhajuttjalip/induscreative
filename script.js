document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animating
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => scrollObserver.observe(el));

    // Stagger children
    const staggerContainers = document.querySelectorAll('.stagger-children');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // 4. Smooth scroll
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Animated counter
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            current = Math.floor(easeProgress * target);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // 6. Parallax effect
    const hero = document.querySelector('.hero');
    const heroOrbs = document.querySelectorAll('.hero-orb');

    if (hero && heroOrbs.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            heroOrbs.forEach(orb => {
                const speed = orb.getAttribute('data-speed') || 20;
                const xOffset = (window.innerWidth / 2 - e.pageX) * speed / 1000;
                const yOffset = (window.innerHeight / 2 - e.pageY) * speed / 1000;

                // Max movement 20px
                const clampedX = Math.max(-20, Math.min(20, xOffset));
                const clampedY = Math.max(-20, Math.min(20, yOffset));

                orb.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
            });
        });
    }

    // 7. Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);

    // 8. Testimonial auto-rotation
    const testimonials = document.querySelectorAll('.testimonial-slide');
    if (testimonials.length > 0) {
        let currentTestimonial = 0;
        
        setInterval(() => {
            testimonials[currentTestimonial].classList.remove('active');
            testimonials[currentTestimonial].style.opacity = '0';
            
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            
            testimonials[currentTestimonial].classList.add('active');
            testimonials[currentTestimonial].style.opacity = '1';
        }, 5000);
    }

    // 9. Typing effect
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const phrases = ['More Views.', 'More Leads.', 'More Sales.'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing new phrase
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing
        setTimeout(type, 1000);
    }

    // 10. River particle animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 50;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 + 0.5; // Move right
                this.speedY = 0;
                this.angle = Math.random() * Math.PI * 2;
                this.amplitude = Math.random() * 0.5 + 0.1; // Wave amplitude
                this.baseY = this.y;
                
                // Palette: #81A8BA (Stream Teal/Blue) & #D1AB9B (Sand Rose) with soft opacity
                const isTeal = Math.random() > 0.3;
                if (isTeal) {
                    // #81A8BA -> rgb(129, 168, 186)
                    const opacity = Math.random() * 0.4 + 0.15;
                    this.color = `rgba(129, 168, 186, ${opacity})`;
                } else {
                    // #D1AB9B -> rgb(209, 171, 155)
                    const opacity = Math.random() * 0.3 + 0.15;
                    this.color = `rgba(209, 171, 155, ${opacity})`;
                }
            }

            update() {
                this.x += this.speedX;
                this.angle += 0.05;
                this.y = this.baseY + Math.sin(this.angle) * this.amplitude * 20;

                if (this.x > canvas.width) {
                    this.x = -10;
                    this.baseY = Math.random() * canvas.height;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 11. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all other FAQs
            faqItems.forEach(other => other.classList.remove('active'));
            // Toggle current
            if (!isActive) item.classList.add('active');
        });
    });

    // 12. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            portfolioCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.removeAttribute('data-visible');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('data-visible', 'false');
                }
            });
        });
    });

    // 13. Contact Form Submission (Web3Forms AJAX)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let valid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--c-sand)';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!valid) return;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';

            const formData = new FormData(contactForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    alert('Thank you! We\'ll be in touch within one business day.');
                    contactForm.reset();
                } else {
                    alert(json.message || 'Something went wrong. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Something went wrong. Please check your connection.');
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});
document.addEventListener('DOMContentLoaded',()=>{
 const items=[...document.querySelectorAll('.ic-page-aboutindus .faq-item')];
 const sync=()=>items.forEach(item=>{const expanded=item.classList.contains('active');item.querySelector('.faq-question').setAttribute('aria-expanded',String(expanded));item.querySelector('.faq-answer').setAttribute('aria-hidden',String(!expanded));});
 items.forEach((item,i)=>{const question=item.querySelector('.faq-question'),answer=item.querySelector('.faq-answer');question.id='about-faq-question-'+i;answer.id='about-faq-answer-'+i;question.setAttribute('role','button');question.setAttribute('tabindex','0');question.setAttribute('aria-controls',answer.id);answer.setAttribute('role','region');answer.setAttribute('aria-labelledby',question.id);question.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();question.click();}});question.addEventListener('click',()=>queueMicrotask(sync));});sync();
});
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.p2-jump a').forEach(link=>link.addEventListener('click',event=>{
  const target=document.getElementById(link.hash.slice(1));if(!target)return;
  event.preventDefault();event.stopImmediatePropagation();
  const offset=Math.max(110,(document.querySelector('nav.navbar, .navbar')?.getBoundingClientRect().height||0)+24);
  window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-offset,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  target.focus({preventScroll:true});history.replaceState(null,'',link.hash);
 },true));
 const icons={play:'<path d="m8 5 11 7-11 7z"/>',pause:'<path d="M8 5v14M16 5v14"/>',muted:'<path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6M21 9l-5 6"/>',sound:'<path d="M11 5 6 9H3v6h3l5 4zM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',full:'<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>'};
 const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
 const format=t=>{if(!Number.isFinite(t)||t<0)return '0:00';const secs=Math.floor(t);return Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0');};
 const entries=[];
 function mount(box,title,adapter){
  box.tabIndex=0;box.setAttribute('role','group');box.setAttribute('aria-label',title+' player');
  const bar=document.createElement('div');bar.className='p2-controls';
  const seek=document.createElement('input');seek.type='range';seek.min='0';seek.max='100';seek.step='.1';seek.value='0';seek.setAttribute('aria-label','Seek '+title);bar.append(seek);
  const row=document.createElement('div');row.className='p2-controls__row';bar.append(row);
  const button=(name,label)=>{const b=document.createElement('button');b.type='button';b.innerHTML=svg(name);b.setAttribute('aria-label',label);b.title=label;row.append(b);return b;};
  const play=button('pause','Pause '+title),mute=button('muted','Enable sound for '+title);
  const time=document.createElement('span');time.className='p2-controls__time';time.textContent='0:00 / 0:00';row.append(time);
  const full=button('full','Full screen '+title);full.disabled=!box.requestFullscreen;
  const setButton=(b,name,label)=>{if(b.dataset.icon!==name){b.innerHTML=svg(name);b.dataset.icon=name;}b.setAttribute('aria-label',label);b.title=label;};
  let dragging=false;
  const update=()=>{
   const ready=adapter.ready();play.disabled=!ready;mute.disabled=!ready;
   if(!ready){seek.disabled=true;return;}
   const playing=adapter.playing(),muted=adapter.muted(),duration=adapter.duration(),position=adapter.time();
   setButton(play,playing?'pause':'play',(playing?'Pause ':'Play ')+title);setButton(mute,muted?'muted':'sound',(muted?'Enable sound for ':'Mute ')+title);
   time.textContent=format(position)+' / '+format(duration);seek.disabled=!(Number.isFinite(duration)&&duration>0);
   if(!dragging&&!seek.disabled){seek.value=String(position/duration*100);seek.style.setProperty('--progress',seek.value+'%');seek.setAttribute('aria-valuetext',format(position)+' of '+format(duration));}
  };
  play.addEventListener('click',()=>{if(adapter.playing())adapter.pause();else adapter.play();update();});
  mute.addEventListener('click',()=>{adapter.setMuted(!adapter.muted());update();});
  seek.addEventListener('pointerdown',()=>{dragging=true;});
  const finish=()=>{dragging=false;update();};seek.addEventListener('pointerup',finish);seek.addEventListener('pointercancel',finish);seek.addEventListener('blur',finish);
  seek.addEventListener('input',()=>{adapter.seek(adapter.duration()*Number(seek.value)/100);seek.style.setProperty('--progress',seek.value+'%');time.textContent=format(adapter.duration()*Number(seek.value)/100)+' / '+format(adapter.duration());});
  full.addEventListener('click',()=>{const promise=document.fullscreenElement?document.exitFullscreen():box.requestFullscreen();promise?.catch(()=>{});});
  box.append(bar);box.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')box.setAttribute('data-controls-visible','');});
  adapter.subscribe(update);update();entries.push({box,adapter,update});return update;
 }
 const videos=[...document.querySelectorAll('.p2-showcase video')];
 videos.forEach(video=>{video.controls=false;video.tabIndex=-1;video.muted=true;video.defaultMuted=true;video.autoplay=true;video.loop=true;
  mount(video.closest('.p2-media'),video.getAttribute('aria-label')||'Video',{ready:()=>true,playing:()=>!video.paused,muted:()=>video.muted,time:()=>video.currentTime,duration:()=>video.duration,play:()=>video.play().catch(()=>{}),pause:()=>video.pause(),setMuted:value=>{video.muted=value;},seek:seconds=>{if(Number.isFinite(seconds))video.currentTime=seconds;},subscribe:fn=>['play','pause','timeupdate','loadedmetadata','volumechange','durationchange'].forEach(name=>video.addEventListener(name,fn))});video.play().catch(()=>{});
 });
 const frames=[...document.querySelectorAll('.p2-inline-player')];const youtube=[];
 frames.forEach((frame,i)=>{frame.id='p2-youtube-'+i;frame.tabIndex=-1;
  if(location.protocol==='https:'||location.protocol==='http:'){const url=new URL(frame.src);url.searchParams.set('origin',location.origin);frame.src=url.href;}
  const state={player:null,ready:false,changed:()=>{}};
  const update=mount(frame.closest('.p2-media'),frame.title,{ready:()=>state.ready,playing:()=>state.player.getPlayerState()===1,muted:()=>state.player.isMuted(),time:()=>state.player.getCurrentTime(),duration:()=>state.player.getDuration(),play:()=>state.player.playVideo(),pause:()=>state.player.pauseVideo(),setMuted:value=>value?state.player.mute():state.player.unMute(),seek:seconds=>state.player.seekTo(seconds,true),subscribe:fn=>{state.changed=fn;}});youtube.push({frame,state,update});
 });
 const setup=()=>youtube.forEach(({frame,state,update})=>{if(state.player)return;state.player=new YT.Player(frame.id,{events:{onReady:event=>{state.player=event.target;state.ready=true;state.player.mute();state.player.playVideo();update();},onStateChange:()=>state.changed()}});});
 if(frames.length){if(window.YT?.Player)setup();else{const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();setup();};if(!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')){const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';document.head.append(script);}}}
 setInterval(()=>{if(!document.hidden)entries.forEach(entry=>{if(entry.box.matches(':hover')||entry.box.contains(document.activeElement)||entry.box.hasAttribute('data-controls-visible'))entry.update();});},400);
 document.addEventListener('pointerdown',event=>{document.querySelectorAll('.p2-media[data-controls-visible]').forEach(box=>{if(!box.contains(event.target))box.removeAttribute('data-controls-visible');});});
 const resume=new Set();document.addEventListener('visibilitychange',()=>{if(document.hidden){entries.forEach(entry=>{if(entry.adapter.ready()&&entry.adapter.playing()){resume.add(entry);entry.adapter.pause();}});}else{resume.forEach(entry=>entry.adapter.play());resume.clear();}});
});
