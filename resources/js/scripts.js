// Add 'scrolling' class to navbar when not on top of page
$(window).scroll(function() {
    if ($(window).scrollTop() > 50) {
        $('.navbar').addClass('scrolling');
    } else {
        $('.navbar').removeClass('scrolling');
    }
});

$(window).resize(function() {
    // Fix scrollspy offset for navigation transition
    setNavOffset();
});

$(document).ready(function() {
    // Smooth scrolling for navigating sections
    $('a.page-scroll').click(function(event) {
        $('html, body').stop().animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    // Fix scrollspy offset for navigation transition
    setNavOffset();

    init_home();
    init_portfolio();
    init_resume();
    init_contact();
});

// Sets the offset used by scrollspy for setting active navigation links
function setNavOffset() {
    $('body').attr('data-offset', $(window).height() / 2);
}

// Initializes the home section
function init_home() {
    // Hook up down arrow
    var target = $('.navbar-nav').children()[1];
    $('a.down-arrow').attr('href', $(target).find('a').attr('href'));

    // Shake arrow on home section very 5 seconds
    window.setInterval(function() {
        var home_bottom = $('#home').position().top + $('#home').outerHeight(true);

        if ($(window).scrollTop() < home_bottom) {
            $('a.down-arrow').effect('shake', {
                direction: 'up',
                times: 2,
                distance: 8
            }, 1000);
        }
    }, 5000);
}

// Initializes the portfolio section
function init_portfolio() {
    var showcase = $('.showcase');

    $.getJSON('resources/json/portfolio.json', function(data) {
        // Create each item based on json data
        $.each(data, function(index, val) {
            // Build base object with data all already added
            var item = $('\
                <div class="col-md-4">\
                    <a class="col-md-12 item" href="' + val.link + '" title="' + val.link_text + '" target="_blank">\
                        <img src="resources/img/portfolio/' + val.img + '" alt="' + val.title + '">\
                        <div class="caption">\
                            <h3>' + val.title + ' (' + val.year + ')</h3>\
                            <h4>' + val.short_desc + '</h4>\
                        </div>\
                    </a>\
                </div>\
            ');

            // Add it to the showcase
            showcase.append(item);
        });
    });
}

function init_resume() {
    var resume = $('#resume');

    $.getJSON('resources/json/resume.json', function(data) {
        // Create the sections
        $.each(data.sections, function(key, val) {
            // Build base object with section title
            var section = $('\
                <div class="row entry">\
                    <div class="col-md-3">\
                        <h2>' + key + '</h2>\
                        <div class="clearfix"></div>\
                    </div>\
                    <div class="col-md-9">\
                    </div>\
                </div>\
            ');

            // Build the each of the items to go into the sections
            var container = section.find('.col-md-9');
            $.each(val, function(index, value) {
                var item;

                // There are different types of items that have different formatting
                switch (value.type) {
                    case 'school':
                        {
                            item = $('\
                                <div class="col-md-12 item">\
                                    <h4>' + value.degree + '</h4>\
        							<h5><a href="' + value.link + '" target="_blank">' + value.school + '</a>, <i>' + value.location + ', ' + value.graduation + '</i></h5>\
                                </div>\
                            ');
                            break;
                        }

                    case 'company':
                        {
                            item = $('\
                                <div class="col-md-12 item">\
        							<h4><a href="' + value.link + '" target="_blank">' + value.company + '</a></h4>\
        							<h5>' + value.position + ', <i>' + value.date + '</i></h5>\
        						</div>\
                            ');
                            break;
                        }

                    case 'charity':
                        {
                            item = $('\
                                <div class="col-md-12 item">\
                                    <h4><a href="' + value.link + '" target="_blank">' + value.organization + '</a>, ' + value.location + '</h4>\
                                    <h5>' + value.role + ', <i>' + value.date + '</i></h5>\
                                </div>\
                            ');
                            break;
                        }
                    default:
                        {
                            item = $('\
                                <div class="col-md-12 item">\
                                    <h4></h4>\
                                </div\
                            ');

                            var string = "";
                            $.each(val, function(index, skill) {
                                if (index == 0)
                                    string += skill;
                                else
                                    string += ', ' + skill;
                            });
                            item.find('h4').text(string);

                            break;
                        }
                }

                if (value.desc) {
                    var list = $('<ul></ul>');

                    // Fetch each description and add it to the list
                    $.each(value.desc, function(index, description) {
                        list.append('<li>' + description + '</li>');
                    });

                    // Add the list to the item
                    item.append(list);
                }

                // Add the item to the container
                container.append(item);

                // Break out of loop if no type specified
                if (!value.type) {
                    return false;
                }
            });

            // Add the section to the resume
            resume.find('.container').append(section);
        });

        resume.append('\
            <div class="row download">\
                <a href="resources/files/' + data.link + '" download>Download Full Resume</a>\
            </div>\
        ');
    });
}

// Again from https://bootstrapious.com/p/how-to-build-a-working-bootstrap-contact-form
function init_contact() {
    $('#contact-form').validator();

    $('#contact-form').on('submit', function(e) {
        if (!e.isDefaultPrevented()) {
            var script = $('#contact-form').attr('action');

            $.ajax({
                type: "POST",
                url: script,
                data: $(this).serialize(),
                success: function(data) {
                    var type = 'alert-' + data.type;
                    var message = data.message;

                    if (type && message) {
                        var alert_box = '<div class="alert ' + type + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>';
                        $('#contact-form').find('.messages').html(alert_box);
                        $('#contact-form')[0].reset();
                    }
                }
            });

            return false;
        }
    });
}
