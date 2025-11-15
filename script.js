// -------------------- CONTACT FORM SUBMIT (GMAIL ONLY) --------------------
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone-number').value;
    const subject = document.getElementById('subject').value;   // <-- MUST MATCH HTML ID
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

    window.open(gmailUrl, "_blank");
    document.getElementById('contact-form').reset();
});

// -------------------- GMAIL ICON CLICK (HEADER + FOOTER) --------------------
function openGmailDirect() {
    const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=subastv.04@gmail.com` +
        `&su=${encodeURIComponent("Contact via Portfolio")}` +
        `&body=${encodeURIComponent("Hello Subash, I want to connect with you.")}`;

    window.open(gmailUrl, "_blank");
}

// Make sure IDs exist in your HTML
document.querySelectorAll('#gmail-icon').forEach(icon => {
    icon.addEventListener('click', openGmailDirect);
});


// -------------------- MOBILE NAV --------------------
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


// -------------------- NAV ACTIVE LINK HIGHLIGHT --------------------
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));

            let activeLink = document.querySelector(`header nav a[href*=${id}]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
};
