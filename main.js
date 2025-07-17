$(function() {
  window.sr = ScrollReveal();

  // Hamburger menu functionality
  const hamburger = $('.hamburger');
  const nav = $('.site-nav');
  const navLinks = $('.site-nav a');

  console.log('Hamburger element:', hamburger.length);
  console.log('Nav element:', nav.length);

  hamburger.on('click', function(e) {
    e.preventDefault();
    console.log('Hamburger clicked!');
    hamburger.toggleClass('active');
    nav.toggleClass('active');
    console.log('Nav active class:', nav.hasClass('active'));
  });

  // Close menu when clicking on a link
  navLinks.on('click', function() {
    console.log('Nav link clicked, closing menu');
    hamburger.removeClass('active');
    nav.removeClass('active');
  });

  // Close menu when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.site-header').length && nav.hasClass('active')) {
      console.log('Clicking outside, closing menu');
      hamburger.removeClass('active');
      nav.removeClass('active');
    }
  });

  // Prevent body scroll when menu is open
  hamburger.on('click', function() {
    if (nav.hasClass('active')) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', 'auto');
    }
  });

  // Contact Form Validation and Submission
  const contactForm = $('#contactForm');
  const submitBtn = $('#submitBtn');
  const formMessage = $('#formMessage');

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Clear all error messages
  function clearErrors() {
    $('.error-message').removeClass('show').text('');
    $('.contact-field input, .contact-field textarea').removeClass('error success');
    formMessage.removeClass('success error').hide();
  }

  // Show error message
  function showError(fieldId, message) {
    $(`#${fieldId}Error`).addClass('show').text(message);
    $(`#${fieldId}`).addClass('error').removeClass('success');
  }

  // Show success state
  function showSuccess(fieldId) {
    $(`#${fieldId}Error`).removeClass('show').text('');
    $(`#${fieldId}`).addClass('success').removeClass('error');
  }

  // Validate form
  function validateForm() {
    let isValid = true;
    clearErrors();

    // Validate first name
    const firstName = $('#first-name').val().trim();
    if (!firstName) {
      showError('firstName', 'First name is required');
      isValid = false;
    } else if (firstName.length < 2) {
      showError('firstName', 'First name must be at least 2 characters');
      isValid = false;
    } else {
      showSuccess('first-name');
    }

    // Validate last name
    const lastName = $('#last-name').val().trim();
    if (!lastName) {
      showError('lastName', 'Last name is required');
      isValid = false;
    } else if (lastName.length < 2) {
      showError('lastName', 'Last name must be at least 2 characters');
      isValid = false;
    } else {
      showSuccess('last-name');
    }

    // Validate email
    const email = $('#email').val().trim();
    if (!email) {
      showError('email', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    } else {
      showSuccess('email');
    }

    // Validate message
    const message = $('#message').val().trim();
    if (!message) {
      showError('message', 'Message is required');
      isValid = false;
    } else if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters');
      isValid = false;
    } else {
      showSuccess('message');
    }

    return isValid;
  }

  emailjs.init('Ly1EarmZRreZ8QF_w'); 

  contactForm.on('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show loading state
    submitBtn.addClass('loading').prop('disabled', true);
    formMessage.removeClass('success error').hide();

    // Get form data
    const formData = {
      firstName: $('#first-name').val().trim(),
      lastName: $('#last-name').val().trim(),
      email: $('#email').val().trim(),
      message: $('#message').val().trim()
    };

    // Send email to you (the original)
    emailjs.send('service_3bhy2ig', 'template_6diwj4v', {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      message: formData.message,
      title: "Portfolio Contact",
      time: new Date().toLocaleString()
    })
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      
      // Show success message - make sure this appears
      formMessage.removeClass('error').addClass('success')
        .text('Thank you! Your message has been sent to llin.winnie@gmail.com.')
        .show();
      
      // Reset form
      contactForm[0].reset();
      clearErrors();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        formMessage.removeClass('success').hide();
      }, 5000);
    })
    .catch(function(error) {
      console.log('FAILED...', error);
      
      // Show error message
      formMessage.removeClass('success').addClass('error')
        .text('Sorry, there was an error sending your message. Please try again later.')
        .show();
    })
    .finally(function() {
      // Reset button state
      submitBtn.removeClass('loading').prop('disabled', false);
    });
    
  });

  // Real-time validation
  $('#first-name, #last-name, #email, #message').on('blur', function() {
    const fieldId = $(this).attr('id');
    const value = $(this).val().trim();
    
    if (fieldId === 'email') {
      if (value && !isValidEmail(value)) {
        showError(fieldId, 'Please enter a valid email address');
      } else if (value) {
        showSuccess(fieldId);
      }
    } else if (fieldId === 'message') {
      if (value && value.length < 10) {
        showError(fieldId, 'Message must be at least 10 characters');
      } else if (value) {
        showSuccess(fieldId);
      }
    } else {
      if (value && value.length < 2) {
        showError(fieldId, `${fieldId === 'first-name' ? 'First' : 'Last'} name must be at least 2 characters`);
      } else if (value) {
        showSuccess(fieldId);
      }
    }
  });

  if ($(window).width() < 768) {
    if ($('.timeline-content').hasClass('js--fadeInLeft')) {
      $('.timeline-content').removeClass('js--fadeInLeft').addClass('js--fadeInRight');
    }
    sr.reveal('.js--fadeInRight', {
      origin: 'right',
      distance: '300px',
      easing: 'ease-in-out',
      duration: 800
    });
  } else {
    sr.reveal('.js--fadeInLeft', {
      origin: 'left',
      distance: '300px',
      easing: 'ease-in-out',
      duration: 800
    });
    sr.reveal('.js--fadeInRight', {
      origin: 'right',
      distance: '300px',
      easing: 'ease-in-out',
      duration: 800
    });
  }

  sr.reveal('.js--fadeInLeft', {
    origin: 'left',
    distance: '300px',
    easing: 'ease-in-out',
    duration: 800
  });
  sr.reveal('.js--fadeInRight', {
    origin: 'right',
    distance: '300px',
    easing: 'ease-in-out',
    duration: 800
  });
});
