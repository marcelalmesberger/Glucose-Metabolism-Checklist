$(document).ready(function () {
    console.log("Document ready");
    $('.errormsg').hide();
    var socket = io();

    // Place the remaining code of this article here...
    $("#assessment_form").submit(function(e){
        // Hide previous error message in case it's still visible
        $('.errormsg').hide();
    
        // Retrieve text entered into text box
        var enteredText = $("#assessment_text").val();
        console.log("Form submitted - entered text: " + enteredText);
        
        // Send the message to the server via socket.io
        socket.emit('assessment', enteredText);
    
        // Clear the entered text from the text box
        $('#assessment_text').val('');
    
        // Do not reload page
        e.preventDefault();
    });

    socket.on('Glucose', function(msg){
        $('.result_glucose').html(msg);
        $('#complete').append('<p>Field Glucose Complete</p>');
    });
    socket.on('HbA1c', function(msg){
        $('.result_hba1c').html(msg);
        $('#complete').append('<p>Field HbA1c Complete</p>');
    });
    socket.on('Name', function(msg){
        $('.result_name').html(msg);
        $('#complete').append('<p>Field Name Complete</p>');
    });
    socket.on('Error', function(msg){
        $('.errormsg').html(msg);
        $('.errormsg').show();
    });
});