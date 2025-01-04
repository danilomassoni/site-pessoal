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
