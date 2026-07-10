// -------------------- CONTACT FORM SUBMIT (GMAIL) --------------------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone-number').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        const body = encodeURIComponent(
            `From: ${fullName} (${email})\n` +
            `Phone: ${phone}\n\n` +
            `Message:\n${message}`
        );

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1&to=subastv.04@gmail.com` +
            `&su=${encodeURIComponent(subject)}` +
            `&body=${body}`;

        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        contactForm.reset();
    });
}

// -------------------- MOBILE NAV --------------------
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        });
    });
}

// -------------------- NAV ACTIVE LINK HIGHLIGHT --------------------
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
};
