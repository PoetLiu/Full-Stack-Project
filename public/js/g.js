$(document).ready(function () {
  const today = new Date().toLocaleDateString('en-ca');
  $("#date").attr("min", today);

  $('#date').change(async function () {
    const date = $("#date").val();
    const appointments = await fetch(`/appointment_query?date=${date}`)
      .then(response => response.json());

    $('#time').empty();
    $('#time').append('<option value="">Select a time slot</option>');

    appointments.forEach(app => {
      if (app.isTimeSlotAvailable) {
        $('#time').append($('<option>', {
          value: app._id,
          text: app.time
        }));
      }
    });
  });
});