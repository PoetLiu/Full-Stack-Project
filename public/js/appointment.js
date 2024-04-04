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
        const times = appointments.map(appointment => appointment.time);

        // disable times that already exist.
        $('#time option').each(function() {
            if (times.includes($(this).val())) {
                $(this).attr("disabled","disabled");
            } else {
                $(this).removeAttr("disabled");
            }
        })
    })
});