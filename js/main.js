$(document).ready(function () {
    // Mobile navigation toggle
    $('.menu-toggle').click(function () {
        $('nav').toggleClass('active');
    });

    // Smooth scrolling for navigation links
    $('nav a').on('click', function (event) {
        if (this.hash !== '') {
            event.preventDefault();
            const hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70
            }, 300);

            // Close mobile menu if open
            $('nav').removeClass('active');
        }
    });

    // Header scroll effect
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

    // Fade in elements on scroll
    $(window).scroll(function () {
        $('.expertise-card, .project-card, .service-card').each(function () {
            const elementTop = $(this).offset().top;
            const viewportBottom = $(window).scrollTop() + $(window).height();

            if (elementTop < viewportBottom - 100) {
                $(this).css('opacity', '1');
                $(this).css('transform', 'translateY(0)');
            }
        });
    });

    // Initialize elements with starting opacity
    $('.expertise-card, .project-card, .service-card').css({
        'opacity': '0',
        'transform': 'translateY(20px)',
        'transition': 'opacity 0.6s ease, transform 0.6s ease'
    });

    // Trigger the scroll function on page load
    $(window).trigger('scroll');

    $('.contact-form').on('submit', function (e) {
        e.preventDefault();
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };

        $.ajax({
            url: 'contact.php',
            type: 'POST',
            data: formData,
            success: function (response) {
                $('.form-status').text(response);
                $('.contact-form')[0].reset();
            },
            error: function () {
                $('.form-status').text('An error occurred. Please try again.');
            }
        });
    });

    // Update copyright year in footer
    const currentYear = new Date().getFullYear();
    $('footer p').html(function(i, text) {
        return text.replace(/\d{4}/, currentYear);
    });
});
