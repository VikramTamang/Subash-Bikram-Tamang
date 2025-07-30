document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const clientInfo = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phone-number').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientInfo)
        });

        const data = await response.json();
        if (data.success) {
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset();
        } else {
            alert('Failed to send message.');
        }
    } catch (error) {
        alert('Error sending message.');
        console.error(error);
    }
});


// Retrieve and display stored client information on page load
window.onload = function () {
    let clientInfo = JSON.parse(localStorage.getItem('clientInfo'));

    if (clientInfo) {
        console.log('Client Information:', clientInfo);
        // You can update the UI with the client's information if needed
    }
};

// Handle menu icon click for mobile view
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Highlight the active section in the navbar
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
};
