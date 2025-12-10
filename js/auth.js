// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

// Get user role
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Update navigation based on auth state
function updateNavigation() {
    const isLoggedInUser = isLoggedIn();
    const loginItem = document.querySelector('.login-item');
    const signupItem = document.querySelector('.signup-item');
    const membersItem = document.querySelector('.members-item');
    const profileItem = document.querySelector('.profile-item');
    const logoutBtn = document.getElementById('logoutBtn');

    // Ensure members tab is always visible and properly positioned
    if (membersItem) {
        membersItem.style.display = 'block';
        // Make sure it's in the right place in the DOM
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !navLinks.contains(membersItem)) {
            const membershipLink = document.querySelector('a[href="membership.html"]');
            if (membershipLink && membershipLink.parentElement) {
                membershipLink.parentElement.after(membersItem);
            }
        }
    }
    
    if (isLoggedInUser) {
        // Hide login/signup, show profile and logout
        if (loginItem) loginItem.style.display = 'none';
        if (signupItem) signupItem.style.display = 'none';
        if (profileItem) profileItem.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        // Show login/signup, hide profile and logout
        if (loginItem) loginItem.style.display = 'block';
        if (signupItem) signupItem.style.display = 'block';
        if (profileItem) profileItem.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && (currentPage === linkHref || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref.replace('.html', '')) && linkHref !== '#'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Add click handler to all navigation links to ensure proper state
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            // If not logged in and clicking a protected page, redirect to login
            const href = this.getAttribute('href');
            const protectedPages = ['profile.html']; // Only protect profile page
            
            if (!isLoggedIn() && protectedPages.some(page => href.includes(page))) {
                e.preventDefault();
                window.location.href = 'login.html?redirect=' + encodeURIComponent(href);
            }
            // Members page is accessible to all users
        });
    });
    
    // Handle redirect after login if present in URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    if (redirectUrl && isLoggedIn()) {
        window.location.href = redirectUrl;
    }
});
