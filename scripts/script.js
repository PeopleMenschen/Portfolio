/**
 * ERP Dashboard Interaction Logic
 * Handles Sidebar Toggling, Accordion Cards, and Sidebar Footer interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initAccordion();
    initFooterToggle();
});

/* --- 1. Sidebar Logic --- */
function initSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    // Toggle Logic
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            // On mobile this toggles between 60px (default) and 250px (expanded)
            sidebar.classList.toggle('mobile-expanded');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            // If sidebar is expanded and click is outside sidebar
            if (sidebar.classList.contains('mobile-expanded') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-expanded');
            }
        }
    });

    // Handle Active Link State
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all
            menuLinks.forEach(l => l.classList.remove('active'));
            // Add to clicked
            link.classList.add('active');
        });
    });
}

/* --- 2. Accordion Dashboard Logic --- */
function initAccordion() {
    const cards = document.querySelectorAll('.accordion-card');

    cards.forEach(card => {
        const header = card.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            // 2.a. Close all other cards first (Single Open Policy)
            cards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                    // Reset max-height on others to ensure smooth animation
                    const content = c.querySelector('.accordion-content');
                    content.style.maxHeight = null;
                }
            });

            // 2.b. Toggle current card
            if (isActive) {
                card.classList.remove('active');
                card.querySelector('.accordion-content').style.maxHeight = null;
            } else {
                card.classList.add('active');
                // Calculate height for smooth animation
                const content = card.querySelector('.accordion-content');
                // Adding a buffer (e.g. +50px) to account for:
                // 1. Padding transitions (scrollHeight reads the value BEFORE padding fully expands)
                // 2. Paragraph margins that might be collapsed
                content.style.maxHeight = (content.scrollHeight + 50) + "px";
            }
        });
    });

    // Initialize the active card's height if any
    const activeCard = document.querySelector('.accordion-card.active');
    if (activeCard) {
        // Since we want all closed by default, we can actually just remove 'active' class here if found,
        // or effectively do nothing if we removed it in HTML.
        // But to be safe and clean, let's just leave this empty or remove the block.
        // If the user manually adds 'active' in HTML later, we might want it to work?
        // The user active requirement was "default all closed", so we cleaned HTML.
        // If we leave this, it helps if they ever revert HTML.
        // But for "default closed", this code does nothing if no active class.
        // I will remove it to avoid confusion or auto-opening unintendedly.
    }

    // 2.c. Handle Resize to prevent clipping
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.accordion-card.active');
        if (currentActive) {
            const content = currentActive.querySelector('.accordion-content');
            // Reset to auto/null momentarily to get new natural height if needed, 
            // but usually scrollHeight works directly if overflow is visible/hidden appropriately.
            // A safer way for responsive text wrapping:
            content.style.maxHeight = 'none'; // Allow it to flow to measure
            const newHeight = content.scrollHeight;
            content.style.maxHeight = newHeight + "px"; // SNAP to new height
        }
    });
}

/* --- 3. Sidebar Footer Toggle (Intelligent Sidebar) --- */
function initFooterToggle() {
    const toggleBtn = document.getElementById('footerToggle');
    const content = document.getElementById('footerContent');
    const arrow = document.getElementById('footerArrow');

    if (toggleBtn && content) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = content.classList.contains('open');

            if (isOpen) {
                content.classList.remove('open');
                arrow.style.transform = 'rotate(0deg)';
                arrow.innerHTML = '▼';
            } else {
                content.classList.add('open');
                arrow.style.transform = 'rotate(180deg)';
                arrow.innerHTML = '▲';
            }
        });
    }
}
