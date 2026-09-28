document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
    initScrollToTop();
});

// Form Validation & Interaction Handling
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            feedback.style.color = '#d9383a';
            feedback.textContent = 'Please fill out all required fields.';
            return;
        }

        // Simulate form submission
        feedback.style.color = '#28a745';
        feedback.textContent = 'Thank you! Your message has been sent successfully.';
        
        form.reset();

        setTimeout(() => {
            feedback.textContent = '';
        }, 5000);
    });
}

// Scroll To Top Button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}