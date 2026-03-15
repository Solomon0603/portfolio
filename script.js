// 1. Mouse Glow Effect
const glow = document.querySelector('.mouse-glow');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show glow after initial mouse move
    if (glow.style.opacity === '0' || glow.style.opacity === '') {
        glow.style.opacity = '1';
    }
});

// Use requestAnimationFrame for smoother glow movement
function updateGlowPosition() {
    glow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    requestAnimationFrame(updateGlowPosition);
}
requestAnimationFrame(updateGlowPosition);


// 2. Scroll Reveal Animations
const revealElements = document.querySelectorAll('.hidden-reveal');

// Function to animate skill bars when they enter viewport
const animateSkills = (element) => {
    const bars = element.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 300); // Slight delay for better visual effect after reveal
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Check if it's the skills section
            if (entry.target.id === 'skills') {
                animateSkills(entry.target);
            }
            
            observer.unobserve(entry.target); // Only reveal once
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});


// 3. Subtle Particle Background (Canvas)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let particleCount = window.innerWidth < 768 ? 20 : 50;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resizeCanvas();
    particleCount = window.innerWidth < 768 ? 20 : 50;
    initParticles();
});
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Very small particles
        this.speedX = (Math.random() - 0.5) * 0.3; // Very slow
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1; // Subtle opacity
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections (subtle)
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${(120 - distance) / 120 * 0.05})`; // Very faint lines
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
        particles[i].update();
        particles[i].draw();
    }
    
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// 4. Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
