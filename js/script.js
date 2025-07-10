// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Testimonial Slider
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
let testimonialWidth;
let interval;

// Responsive slider setup
function setupSlider() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
        testimonialWidth = testimonialSlider.clientWidth;
    } else {
        testimonialWidth = testimonialSlider.clientWidth / 3;
    }
    
    // Set initial position
    updateSliderPosition();
    
    // Auto slide
    startAutoSlide();
}

function updateSliderPosition() {
    // For mobile view, show one testimonial at a time
    if (window.innerWidth < 768) {
        testimonialCards.forEach((card, index) => {
            card.style.transform = `translateX(${100 * (index - currentIndex)}%)`;
            card.style.opacity = index === currentIndex ? '1' : '0.5';
        });
    } 
    // For desktop, show 3 testimonials side by side
    else {
        testimonialCards.forEach((card) => {
            card.style.opacity = '1';
        });
        testimonialSlider.style.transform = `translateX(${-currentIndex * (testimonialWidth + 20)}px)`;
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonialCards.length;
    updateSliderPosition();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
    updateSliderPosition();
}

function startAutoSlide() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
}

// Event listeners
nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoSlide(); // Reset the timer when manually changing slides
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoSlide(); // Reset the timer when manually changing slides
});

// Setup slider on load and resize
window.addEventListener('load', setupSlider);
window.addEventListener('resize', setupSlider);

// Stop auto slide when user interacts with the slider
testimonialSlider.addEventListener('mouseenter', () => clearInterval(interval));
testimonialSlider.addEventListener('mouseleave', startAutoSlide);

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill all the fields');
            return;
        }
        
        // Since this is a static portfolio, we'll just show a success message
        // In a real application, you would send this data to a server
        alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
        
        // Clear the form
        contactForm.reset();
    });
}

// Scroll Animations
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.section-title, .about-content, .skills-content, .project-card, .testimonial-card, .contact-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('fade-in');
        }
    });
    
    // Special transition effect for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        // Make sure all timeline items are visible by default
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
        item.classList.add('show');
        
        // Still add the class for animation effect
        setTimeout(() => {
            item.classList.add('show');
        }, index * 50);
    });
}

// Add the fade-in class to elements as they come into view
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// Video Modal Functionality for Demo Video
document.addEventListener('DOMContentLoaded', function() {
    // Handle embedded video in projects section with robust error handling and loading
    const projectVideo = document.getElementById('projectVideo');
    if (projectVideo) {
        console.log('Project video element found, setting up handlers');
        
        // Enhanced error handling
        projectVideo.addEventListener('error', function(e) {
            console.error('Video error occurred:', e);
            // Try alternative approach - recreate video element
            tryAlternativeVideoLoading();
        });
        
        // Log when video is ready to play
        projectVideo.addEventListener('canplay', function() {
            console.log('Video can now play');
            document.getElementById('video-status-message')?.remove();
        });
        
        // Log when video is loaded
        projectVideo.addEventListener('loadeddata', function() {
            console.log('Video data loaded successfully');
        });
        
        // Force reload video with exponential backoff retries
        let attempts = 0;
        const maxAttempts = 3;
        
        function attemptVideoLoad() {
            if (attempts < maxAttempts) {
                console.log(`Attempting to load video (attempt ${attempts + 1}/${maxAttempts})`);
                projectVideo.load();
                attempts++;
                
                // Check if video loaded successfully after a delay
                setTimeout(() => {
                    if (projectVideo.readyState === 0) {
                        console.log('Video still not loading, trying again...');
                        attemptVideoLoad();
                    }
                }, 1000 * Math.pow(2, attempts)); // Exponential backoff
            } else {
                console.log('Maximum video load attempts reached');
                // Add fallback message
                if (!document.getElementById('video-status-message')) {
                    const statusMsg = document.createElement('p');
                    statusMsg.id = 'video-status-message';
                    statusMsg.style.color = 'var(--primary-color)';
                    statusMsg.style.textAlign = 'center';
                    statusMsg.style.padding = '10px';
                    statusMsg.style.fontFamily = 'monospace';
                    statusMsg.innerHTML = 'Video loading issue detected. <a href="images/Demovideo.mp4" target="_blank" style="color: var(--secondary-color);">Click here to view video directly</a>';
                    projectVideo.parentNode.insertBefore(statusMsg, projectVideo.nextSibling);
                }
            }
        }
        
        // Alternative approach - recreate video element
        function tryAlternativeVideoLoading() {
            console.log('Trying alternative video loading approach');
            const videoContainer = projectVideo.parentNode;
            const originalVideo = projectVideo.cloneNode(true);
            videoContainer.removeChild(projectVideo);
            
            // Create fresh video element
            const newVideo = document.createElement('video');
            newVideo.id = 'projectVideo';
            newVideo.controls = true;
            newVideo.autoplay = true;
            newVideo.muted = true;
            newVideo.preload = 'auto';
            newVideo.width = '100%';
            newVideo.style = 'border-radius: 5px; border: 1px solid var(--primary-color); box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);';
            
            // Create source
            const source = document.createElement('source');
            source.src = 'images/Demovideo.mp4';
            source.type = 'video/mp4';
            newVideo.appendChild(source);
            
            // Add fallback text
            newVideo.appendChild(document.createTextNode('Your browser does not support the video tag.'));
            
            // Insert the new video
            videoContainer.appendChild(newVideo);
            console.log('Video element recreated');
        }
        
        // Start video loading process
        setTimeout(attemptVideoLoad, 500);
    }
    
    // Legacy modal video code (can be removed if modal is no longer needed)
    const videoModal = document.getElementById('videoModal');
    const videoBtn = document.getElementById('demo-video');
    const videoPlayer = document.getElementById('demoVideo');
    const closeModal = document.querySelector('.close-modal');

    // Only proceed with modal code if all elements exist
    if (!videoModal || !videoBtn || !videoPlayer || !closeModal) {
        console.log('Modal video elements not found or not needed anymore');
        return;
    }

    console.log('Video modal elements loaded successfully');
    
    // Function to open modal and play video
    function openVideoModal(e) {
        if (e) e.preventDefault();
        console.log('Opening video modal');
        videoModal.style.display = 'block';
        
        // Ensure video has correct path
        videoPlayer.src = 'demovideo.mp4';
        
        // Load the video
        videoPlayer.load();
        
        // Add event listener for when video is ready to play
        videoPlayer.oncanplay = function() {
            console.log('Video can now play');
            const playPromise = videoPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    console.log('Video playing successfully');
                }).catch(error => {
                    console.error('Error playing video:', error);
                    // Try playing one more time after a longer delay
                    setTimeout(() => {
                        videoPlayer.play().catch(err => {
                            console.error('Second attempt to play video failed:', err);
                        });
                    }, 1000);
                });
            }
        };
    }

    // Function to close modal and stop video
    function closeVideoModal() {
        console.log('Closing video modal');
        videoModal.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }

    // Add event listeners
    videoBtn.addEventListener('click', openVideoModal);
    closeModal.addEventListener('click', closeVideoModal);
    
    // Close modal if clicked outside of modal content
    window.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Log that event listeners have been attached
    console.log('Video modal event listeners attached');
});

// Contact Form with EmailJS
(function() {
    // Initialize EmailJS with your public key - getting a free account at emailjs.com is required
    emailjs.init('USER_PUBLIC_KEY'); // You'll need to sign up at emailjs.com and replace with your actual key

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const statusDiv = document.getElementById('form-status');
        statusDiv.textContent = 'Sending message...';
        statusDiv.style.color = 'var(--primary-color)';
        
        const templateParams = {
            to_email: 'varunagarwal0964@gmail.com', // Your email address
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // EmailJS service and template IDs (you'll need to create these in your EmailJS account)
        emailjs.send('service_id', 'template_id', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                statusDiv.textContent = 'Message sent successfully!';
                statusDiv.style.color = 'green';
                document.getElementById('contactForm').reset();
            }, function(error) {
                console.log('FAILED...', error);
                statusDiv.textContent = 'Failed to send message. Please try again.';
                statusDiv.style.color = 'red';
            });
    });
})();

// Add scroll-to-top button functionality
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-top-btn';
document.body.appendChild(scrollToTopBtn);

// Style the button with CSS in JS (could also be added to the CSS file)
scrollToTopBtn.style.position = 'fixed';
scrollToTopBtn.style.bottom = '20px';
scrollToTopBtn.style.right = '20px';
scrollToTopBtn.style.width = '50px';
scrollToTopBtn.style.height = '50px';
scrollToTopBtn.style.borderRadius = '50%';
scrollToTopBtn.style.backgroundColor = 'var(--primary-color)';
scrollToTopBtn.style.color = 'white';
scrollToTopBtn.style.border = 'none';
scrollToTopBtn.style.fontSize = '1.2rem';
scrollToTopBtn.style.cursor = 'pointer';
scrollToTopBtn.style.display = 'none';
scrollToTopBtn.style.zIndex = '999';
scrollToTopBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
