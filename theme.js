// Typewriter and micro-interactions

(function() {
    const typeTarget = document.getElementById('typewriter');
    const cursor = document.querySelector('.cursor');
    const roles = [
        'Full‑Stack Developer',
        'UI/UX Enthusiast',
        'Creative Coder',
        'Problem Solver'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        if (!typeTarget) return;
        const full = roles[roleIndex % roles.length];
        if (!deleting) {
            typeTarget.textContent = full.slice(0, ++charIndex);
            if (charIndex === full.length) {
                deleting = true;
                setTimeout(tick, 1200);
                return;
            }
        } else {
            typeTarget.textContent = full.slice(0, --charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex++;
            }
        }
        setTimeout(tick, deleting ? 40 : 90);
    }

    document.addEventListener('DOMContentLoaded', () => {
        tick();

        // Parallax float for hero image cards
        const container = document.querySelector('.image-container');
        const floaters = document.querySelectorAll('.floating-card');
        if (container && floaters.length) {
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                floaters.forEach((el, i) => {
                    const intensity = (i + 1) * 6;
                    el.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
                });
            });
            container.addEventListener('mouseleave', () => {
                floaters.forEach((el) => (el.style.transform = 'translate(0, 0)'));
            });
        }

        // Soft reveal on scroll
        const revealEls = document.querySelectorAll('.project-card, .link-item, .about-image, .about-text');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'transform .5s ease, opacity .5s ease';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach((el) => {
            el.style.transform = 'translateY(10px)';
            el.style.opacity = '0';
            io.observe(el);
        });

        // Ripple on clickable elements
        function attachRipple(selector) {
            document.querySelectorAll(selector).forEach((el) => {
                el.addEventListener('click', (e) => {
                    const rect = el.getBoundingClientRect();
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple';
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    el.appendChild(ripple);
                    ripple.addEventListener('animationend', () => ripple.remove());
                });
            });
        }
        attachRipple('.btn, .btnn, .link-item, .nav-link, button');

        // 3D tilt for cards and profile
        function attachTilt(selector, maxTilt) {
            document.querySelectorAll(selector).forEach((el) => {
                let raf = null;

                function onMove(e) {
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const rx = (y * maxTilt).toFixed(2);
                    const ry = (-x * maxTilt).toFixed(2);
                    if (!raf) {
                        raf = requestAnimationFrame(() => {
                            el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
                            raf = null;
                        });
                    }
                }

                function reset() { el.style.transform = ''; }
                el.addEventListener('mousemove', onMove);
                el.addEventListener('mouseleave', reset);
            });
        }
        attachTilt('.project-card, .profile-frame, .link-item', 6);

        // Sparkle/confetti on profile blob
        const blob = document.querySelector('.profile-blob');
        if (blob) {
            function spawnParticle(x, y, emoji) {
                const particle = document.createElement('span');
                particle.textContent = emoji;
                particle.style.position = 'absolute';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.pointerEvents = 'none';
                particle.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,.6))';
                blob.appendChild(particle);
                const dx = (Math.random() - 0.5) * 120;
                const dy = (Math.random() - 0.5) * 120;
                const rot = (Math.random() - 0.5) * 120;
                const scale = 0.6 + Math.random() * 0.8;
                particle.animate([
                        { transform: `translate(0,0) rotate(0deg) scale(${scale})`, opacity: 1 },
                        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.2)`, opacity: 0 }
                    ], { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.2,.6,.2,1)', fill: 'forwards' })
                    .addEventListener('finish', () => particle.remove());
            }
            const confetti = ['✨', '💡', '⚙️', '🔧', '🧠', '🚀'];
            blob.addEventListener('mousemove', (e) => {
                if (Math.random() > 0.35) return;
                const rect = blob.getBoundingClientRect();
                spawnParticle(e.clientX - rect.left, e.clientY - rect.top, confetti[Math.floor(Math.random() * confetti.length)]);
            });
            blob.addEventListener('click', (e) => {
                const rect = blob.getBoundingClientRect();
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        spawnParticle(e.clientX - rect.left, e.clientY - rect.top, confetti[i % confetti.length]);
                    }, i * 30);
                }
            });
        }
    });
})();