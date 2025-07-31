
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login');
    const authStatus = document.getElementById('auth-status');

    authStatus.textContent = 'Sign in to get started.';

    loginButton.addEventListener('click', function() {
        // This is a placeholder for the OAuth flow that would be needed.
        // For a real extension, we would use chrome.identity API.
        alert('This would initiate the Google Sign-In process!');
    });
});
