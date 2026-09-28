document.addEventListener('DOMContentLoaded', () => {

    /* Password Reveal Toggle */
    const togglePassword = document.getElementById('toggleLoginPassword');
    const passwordInput = document.getElementById('loginPassword');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePassword.classList.toggle('fa-eye', !isPassword);
            togglePassword.classList.toggle('fa-eye-slash', isPassword);
        });
    }

    /* Login Form Handling */
    const loginForm = document.getElementById('loginForm');
    const loginFeedback = document.getElementById('loginFeedback');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameVal = document.getElementById('loginUsername').value.trim();
            const passwordVal = passwordInput.value.trim();

            if (!usernameVal || !passwordVal) {
                showFeedback(loginFeedback, 'Please fill in all required fields.', 'error');
                return;
            }

            showFeedback(loginFeedback, 'Logging in... Please wait.', 'success');
        });
    }

    /* Register Form Handling */
    const registerForm = document.getElementById('registerForm');
    const registerFeedback = document.getElementById('registerFeedback');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const regEmailVal = document.getElementById('regEmail').value.trim();

            if (!regEmailVal || !validateEmail(regEmailVal)) {
                showFeedback(registerFeedback, 'Please enter a valid email address.', 'error');
                return;
            }

            showFeedback(registerFeedback, 'Registration link sent to your email!', 'success');
            registerForm.reset();
        });
    }

    /* Utility Functions */
    function showFeedback(element, text, type) {
        if (!element) return;
        element.textContent = text;
        element.className = `form-feedback ${type}`;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});