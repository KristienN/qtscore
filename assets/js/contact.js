$(document).ready(function () {

    $('#contact-btn').submit((e)=>{

        e.preventDefault();

        let name = $('#name').val();
        let email = $('#email').val();
        let subject = $('#subject').val();
        let message = $('#message').val();

        let data = {
            name,
            email,
            subject,
            message
        }

        $.ajax({
            type: "POST",
            url: "https://qtscore.herokuapp.com/contact/send_msg",
            data: data,
            success: function (response) {
                let success = `<div class="alert alert-success" role="alert">
                            Message has been sent!
                            </div>`
            
                $('#success').append(success);
                $('#name').val() = '';
                $('#email').val() = '';
                $('#subject').val() = '';
                $('#message').val() = '';

            }
        });
    });
});