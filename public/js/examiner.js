"strict"

let drivers = null;
var myModal = new bootstrap.Modal(document.getElementById('mark-modal'), {
  keyboard: false
})
$(document).ready(function () {
  loadDrivers();
  $('#search').on("submit", (async function (evt) {
    evt.preventDefault();
    loadDrivers();
  }));
});

const loadDrivers = async () => {
  const testType = $("#testType").val();
  drivers = await fetch(`/driver_appointed?testType=${testType}`)
    .then(response => response.json());

  $("#result").empty();
  $.each(drivers, (i, driver) => {
    $("#result").append(`
      <div class="card">
        <img src="/images/user.jpeg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${driver.firstName} ${driver.lastName}-${driver.testType}</h5>
          <p class="card-text">
            <b>Car: </b>${driver.carDetails.make}-${driver.carDetails.model}-${driver.carDetails.year}<br/>
            <b>Platno: </b>${driver.carDetails.platno} <br/>
            <b>Test Time: </b>${driver.appointment.date} ${driver.appointment.time} 
          </p>
          <a href="#" class="btn btn-primary" onclick="markDriver(${i})">Mark</a>
        </div>
      </div>
    `)
  });
}

const markDriver = (i) => {
  console.log(drivers[i]);
  $("#driverId").val(drivers[i]._id);
  $("input[name=testPassed][value=" + drivers[i].testPassed + "]").prop('checked', true);
  $("#comment").val(drivers[i].testComment);

  if (drivers[i].testPassed != null) {
    $("#submit").attr("disabled", true);
    $("#comment").attr("disabled", true);
    $("input[name=testPassed]").attr("disabled", true);
  }
  myModal.show();
}