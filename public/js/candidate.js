"strict"

let drivers = null;
$(document).ready(function () {
    loadDrivers();
    $('#search').on("submit", (async function (evt) {
        evt.preventDefault();
        loadDrivers();
    }));
});

const loadDrivers = async () => {
  const testType = $("#testType").val();
  drivers = await fetch(`/candidate_query?testType=${testType}`)
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
            <b>Test Time: </b>${driver.appointment.date} ${driver.appointment.time} <br/>
            <b>Test Result: </b>${driver.testPassed ? 'Pass': 'Fail'}
          </p>
        </div>
      </div>
    `)
  });
}
