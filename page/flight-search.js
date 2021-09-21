$(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-operating-cities",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (response) {
            if (response) {
                for (let cityCount = 0; cityCount < response.length; cityCount++) {
                    $('#cityList').append(new Option(response[cityCount].cityName, response[cityCount].cityCode));
                }
            }
        }
    });
    $("#journeyDate").datepicker();
    $("#returnDate").datepicker();
    $('input:radio[name=journeyType][value=oneway]').prop('checked', true);
    $("input[type='text'][name='returnDate']").prop("disabled", true);
    $("input[type='radio'][name='journeyType']").click(function () {
        if ($('input:radio[name=journeyType]:checked').val() === "oneway") {
            $("input[type='text'][name='returnDate']").prop("disabled", true);
        } else {
            $("input[type='text'][name='returnDate']").prop("disabled", false);
        }
    });
});

flightSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("errorMessage").innerText = "";
    const from = flightSearchForm.from.value;
    const to = flightSearchForm.to.value;
    const journeyDate = flightSearchForm.journeyDate.value;
    const returnDate = flightSearchForm.returnDate.value;
    const journeyType = flightSearchForm.journeyType.value;
    if (!from || !to || !journeyDate) {
        document.getElementById("errorMessage").innerText = "Please provide required inputs";
    } else if (journeyType === "roundtrip" && !returnDate) {
        document.getElementById("errorMessage").innerText = "Please provide required inputs";
    } else {
        console.log(from)
        console.log(journeyDate)
        alert("search flight");
    }
});