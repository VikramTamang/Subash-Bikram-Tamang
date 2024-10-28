// Handle form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the input fields
    let fullName = document.getElementById('full-name').value;
    let email = document.getElementById('email').value;
    let phoneNumber = document.getElementById('phone-number').value;
    let subject = document.getElementById('subject').value;
    let message = document.getElementById('message').value;

    // Create an object to store the data
    let clientInfo = {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        subject: subject,
        message: message
    };

    // Save the object to localStorage
    localStorage.setItem('clientInfo', JSON.stringify(clientInfo));

    // Optionally, you can alert the user that their message has been sent
    alert('Message sent successfully!');

    // Reset the form fields
    document.getElementById('contact-form').reset();
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
