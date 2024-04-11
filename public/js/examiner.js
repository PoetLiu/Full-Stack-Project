"strict"

$(document).ready(function () {
    $('#search').on("submit", (async function () {
        const testType = $("#testType").val();
        const drivers = await fetch(`/driver_appointed?testType=${testType}`)
            .then(response => response.json());

        $.each(drivers, (i, driver) => {
        });
    }));
});