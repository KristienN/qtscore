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
            url: "admin.qtscore.com",
            data: data,
            success: function (response) {
                console.log(response);
            }
        });
    });
});