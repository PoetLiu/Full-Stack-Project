"strict"

$(document).ready(function () {
    const today = new Date().toLocaleDateString('en-ca');
    $("#date").attr("min", today);
    console.log(today);
    
    $('#date').change(async function () {
        var date = $("#date").val();
        const appointments = await fetch(`/appointment_query?date=${date}`)
            .then(response => response.json());
        console.log(appointments);
        $('#time').empty();

        $.each(appointments, (i, app) => {
            // skip unavailable slot
            if (!app.isTimeSlotAvailable) {
                return;
            }
            $('#time').append($('<option>', {
                value: app._id,
                text: app.time 
            }))
        })
    })
});