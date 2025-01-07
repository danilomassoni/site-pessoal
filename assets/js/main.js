document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    menuButton.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuButton.classList.toggle('active');
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.testimonial-container');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    
    // Criar dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        const offset = -(index * 100);
        container.style.transform = `translateX(${offset}%)`;
        updateDots();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        goToSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        goToSlide(currentIndex);
    }
    
    // Auto-play
    function autoPlay() {
        setTimeout(() => {
            nextSlide();
            autoPlay();
        }, 8000);
    }
    
    // Inicia o autoplay após um pequeno delay
    setTimeout(autoPlay, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
});

// Adicionar toggle de modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Verificar preferência salva
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        if (category === 'todos' || project.dataset.category === category) {
            project.style.display = 'block';
            project.classList.add('fade-in');
        } else {
            project.style.display = 'none';
            project.classList.remove('fade-in');
        }
    });
}

function animateNumbers() {
    const numbers = document.querySelectorAll('.result-card h3');
    
    numbers.forEach(number => {
        const target = parseInt(number.innerText);
        let count = 0;
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                number.innerText = target + '+';
                clearInterval(timer);
            } else {
                number.innerText = Math.floor(count) + '+';
            }
        }, 16);
    });
}

function showNewsletterPopup() {
    if (!localStorage.getItem('newsletterShown')) {
        setTimeout(() => {
            // Mostrar popup
            document.querySelector('.newsletter-popup').classList.add('show');
            localStorage.setItem('newsletterShown', 'true');
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('backToTop');

    // Mostrar/ocultar botão baseado na posição do scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Rolar suavemente para o topo quando clicar
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
