document.addEventListener('DOMContentLoaded', () => {
    // Fire up the JSON loader for my projects, and attach the form validation
    // wait for DOM to load so nothing breaks.
    loadProjectCards();
    
    const contactForm = document.getElementById('contact_form');
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
});

function validateForm(e) {
    // preventDefault stops the page from jumping straight to the action URL 
    // before the validation script can actually run.
    e.preventDefault();

    const name = document.getElementById('user_name');
    const phone = document.getElementById('user_phone');
    const email = document.getElementById('user_email');
    const message = document.getElementById('user_message');

    // Wipe any old error messages from a previous failed submit attempt.
    document.querySelectorAll('.error_msg').forEach(span => {
        span.style.display = 'none';
        span.textContent = "";
    });

    let hasErrors = false;
    let firstErrorField = null;

    // RegEx patterns: Rubric asked for a 10-digit phone check, and standard email check.
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if name is blank
    // Uses trim to remove whitespace so a user can't slam the spacebar to pass validation
    if (name.value.trim() === "") {
        showError('name_error', "Name is required.");
        if (!firstErrorField) firstErrorField = name;
        hasErrors = true;
    }

    // Run the phone number against the 10-digit regex
    if (!phoneRegex.test(phone.value.trim())) {
        showError('phone_error', "Needs to be exactly a 10 digit number.");
        if (!firstErrorField) firstErrorField = phone;
        hasErrors = true;
    }

    // Run the email against the regex
    if (!emailRegex.test(email.value.trim())) {
        showError('email_error', "Please enter a valid email.");
        if (!firstErrorField) firstErrorField = email;
        hasErrors = true;
    }

    if (hasErrors) {
        // Rubric requirement: set focus to the field in error and highlight the text.
        firstErrorField.focus();
        firstErrorField.select();
    } else {
        // If all checks pass, actually submit the form to index.html
        e.target.submit(); 
    }
}

function showError(id, msg) {
    // Helper function to grab the span and display the error text
    const el = document.getElementById(id);
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
    }
}

function loadProjectCards() {
    // Fetching from projects.json so I can pull in all my Ubuntu and PaperMC 
    // server details dynamically instead of hardcoding a massive HTML file.
    const container = document.getElementById('project_container');
    const template = document.getElementById('project_template');
    if (!container || !template) return;

    fetch('projects.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(project => {
                // Clone the HTML template for each project in the JSON array
                // cloneNode basically lets me reuse the template instead of repeatedly creating a new set of objects
                const clone = template.content.cloneNode(true);
                clone.querySelector('.p_title').textContent = project.title;
                clone.querySelector('.p_desc').textContent = project.desc;
                clone.querySelector('.p_tag').textContent = project.tag;
                
                // Event listener so when a card is clicked, it shows the full_details string
                clone.querySelector('.project-card').addEventListener('click', () => {
                    document.getElementById('detail_display').textContent = project.full_details;
                });
                container.appendChild(clone);
            });
        });
}