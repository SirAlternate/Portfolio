<?php
// Credit to https://bootstrapious.com/p/how-to-build-a-working-bootstrap-contact-form

// Variables
$FROM = 'Website Contact Form <info@eriksaulnier.com>';
$TO = 'Erik Saulnier <info@eriksaulnier.com>';
$SUBJECT = 'New Message From Contact Form';
$FIELDS = array('name' => 'Name', 'email' => 'Email', 'message' => 'Message');
$SUCCESS = 'Your message was successfully sent, I\'ll try to get back to you as soon as I can!';
$ERROR = 'There appears to have been an error while sending your message, please try again later.';

// Send the message
try {
    // Build the message
    $MESSAGE = "You have a new message on your website contact form:\n";
    foreach($_POST as $key => $value) {
        if(isset($FIELDS[$key])) {
            $MESSAGE .= "$FIELDS[$key]: $value\n";
        }
    }

    // Send the message using internal PHP mail function
    mail($TO, $SUBJECT, $MESSAGE, "From: " . $FROM);

    // Send response back
    $response = array('type' => 'success', 'message' => $SUCCESS);
} catch(Exception $e) {
    // Send response back
    $response = array('type' => 'danger', 'message' => $ERROR);
}

if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($response);
    header('Content-Type: application/json');
    echo $encoded;
} else {
    echo $response['message'];
}
