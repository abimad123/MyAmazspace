// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            clearErrors();
            
            // Validate form
            if (validateForm()) {
                submitForm();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    function validateForm() {
        let isValid = true;
        
        // First Name
        const firstName = document.getElementById('first-name');
        if (!firstName.value.trim()) {
            showFieldError(firstName, 'First name is required');
            isValid = false;
        }
        
        // Last Name
        const lastName = document.getElementById('last-name');
        if (!lastName.value.trim()) {
            showFieldError(lastName, 'Last name is required');
            isValid = false;
        }
        
        // Email
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            showFieldError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject
        const subject = document.getElementById('subject');
        if (!subject.value) {
            showFieldError(subject, 'Please select a subject');
            isValid = false;
        }
        
        // Message
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            showFieldError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showFieldError(message, 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        
        clearFieldError(field);
        
        switch (fieldName) {
            case 'firstName':
                if (!value) {
                    showFieldError(field, 'First name is required');
                    return false;
                }
                break;
                
            case 'lastName':
                if (!value) {
                    showFieldError(field, 'Last name is required');
                    return false;
                }
                break;
                
            case 'email':
                if (!value) {
                    showFieldError(field, 'Email is required');
                    return false;
                } else if (!isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    showFieldError(field, 'Please select a subject');
                    return false;
                }
                break;
                
            case 'message':
                if (!value) {
                    showFieldError(field, 'Message is required');
                    return false;
                } else if (value.length < 10) {
                    showFieldError(field, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = 'var(--error-red)';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function clearErrors() {
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            clearFieldError(input);
        });
    }
    
    function submitForm() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(contactForm);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on'
        };
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            console.log('Form submitted:', data);
            
            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth' });
            
            // You would typically send this data to your server here
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     // Handle success
            // })
            // .catch(error => {
            //     // Handle error
            // });
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                formSuccess.style.display = 'none';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 5000);
            
        }, 2000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.875rem;
            color: var(--gray-500);
            text-align: right;
            margin-top: 0.5rem;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = messageField.value.length;
            counter.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = 'var(--warning-yellow)';
            } else if (length >= maxLength) {
                counter.style.color = 'var(--error-red)';
            } else {
                counter.style.color = 'var(--gray-500)';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initialize counter
    }
    
    // Auto-resize textarea
    if (messageField) {
        messageField.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});