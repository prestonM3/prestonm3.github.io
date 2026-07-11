// Functionality 1: Dynamically load Header and Footer components
async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        const footerRes = await fetch('components/footer.html');
        
        document.getElementById('header-placeholder').innerHTML = await headerRes.text();
        document.getElementById('footer-placeholder').innerHTML = await footerRes.text();

        // After loading header, initialize the theme toggle
        initThemeToggle();
    } catch (error) {
        console.error("Error loading components. (Note: Must be run on a local server, not directly from file://)", error);
    }
}

// Functionality 2: Interactive Element (Dark Mode Toggle)
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check sessionStorage instead of localStorage
    const savedTheme = sessionStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = "Light Mode";
    } else {
        toggleBtn.textContent = "Dark Mode";
    }
    
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
        
        // Save temporarily for this session only
        if (isDark) {
            sessionStorage.setItem('theme', 'dark');
        } else {
            sessionStorage.setItem('theme', 'light');
        }
    });
}

// Functionality 3: Slideshow for Products Page
const images = [
    'images/bookmark.jpg', 
    'images/reading-light.jpg', 
    'images/desk-mat.jpg'
];

// Match each index position directly with its respective photographer credit [cite: 49]
const credits = [
    'Photo by Kasturi Roy on Unsplash',
    'Photo by Luigy Ghost on Unsplash',
    'Photo by Oliur on Unsplash'
];

let currentSlide = 0;

function updateSlide() {
    const slideImg = document.getElementById('slide-img');
    const slideCredit = document.getElementById('slide-credit');
    
    if (slideImg) {
        slideImg.src = images[currentSlide];
    }
    // Update the figcaption text dynamically to match the current slide [cite: 49]
    if (slideCredit) {
        slideCredit.textContent = credits[currentSlide];
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    updateSlide();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", loadComponents);