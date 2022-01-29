var request = null;
var response = null;

$(function () {
    const from = sessionStorage.getItem("from");
    const to = sessionStorage.getItem("to");
    const journeyType = sessionStorage.getItem("journeyType");
    const journeyDate = sessionStorage.getItem("journeyDate");
    const returnDate = sessionStorage.getItem("returnDate");
    request = {
        "searchType": journeyType,
        "currentSearch": 1,
        "searchCriterias": [
            {
                "originCityCode": from,
                "destinationCityCode": to,
                "journeyDate": journeyDate
            }
        ],
        "selectedFlights": []
    }
    if (journeyType === 'roundtrip') {
        request.searchCriterias.push({
            "originCityCode": to,
            "destinationCityCode": from,
            "journeyDate": returnDate
        })
    }
    search(request);
});

backToSearch = () => {
    $('#booking').load("./page/flight-search.html");
}

nextSearch = () => {
    console.log($('input:radio[name=flightSelect]:checked').val());
    if ($('input:radio[name=flightSelect]:checked').val()) {
        const selectedArray = $('input:radio[name=flightSelect]:checked').val().split("-");
        request.selectedFlights.push({
            "roasterId": selectedArray[1],
            "seatType": selectedArray[2],
            "seatPrice": selectedArray[3]
        });
        request.currentSearch = response.nextSearch;
        search(request);
    } else {
        alert("Please select one flight to proceed")
    }

}

bookTrips = () => {
    sessionStorage.setItem("selectedFlights", JSON.stringify(response.selectedFlights));
    $('#booking').load("./page/booking.html");
}

search = (request) => {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/v1.0/flight/public/search",
        data: JSON.stringify(request),
        cache: false,
        contentType: 'application/json',
        success: function (flightSearchResults) {
            response = flightSearchResults;
            $('#selectedFlights').empty();
            $('#searchResult').empty();
            $('#activeSearchCriteria').empty();
            const currentSearchCriteria = flightSearchResults.request.searchCriterias[flightSearchResults.currentSearch - 1];
            if (!(flightSearchResults.currentSearch === 0 && flightSearchResults.nextSearch === 0)) {
                if (flightSearchResults.searchResults && flightSearchResults.searchResults.length > 0) {
                    $('#activeSearchCriteria').html(getSearchResultHeader(currentSearchCriteria));
                    for (let rcount = 0; rcount < flightSearchResults.searchResults.length; rcount++) {
                        const availableRoaster = flightSearchResults.searchResults[rcount];
                        const html = getRoasterFormattedHtml(availableRoaster);
                        $('#searchResult').append(html);
                    }
                } else {
                    const html = '<div class="card shadow-sm mb-1"> <div class="card-body">No flights availabe for this journey</div></div>';
                    $('#searchResult').html(html);
                    $('#bookButton').hide();
                    $('#nextTripButton').hide();
                }
            }
            if (flightSearchResults.selectedFlights && flightSearchResults.selectedFlights.length > 0) {
                for (let rcount = 0; rcount < flightSearchResults.selectedFlights.length; rcount++) {
                    const selectedFlight = flightSearchResults.selectedFlights[rcount];
                    const html = getSelectedFlightFormattedHtml(selectedFlight, rcount);
                    $('#selectedFlights').append(html);
                }
            }
            if (flightSearchResults.nextSearch === 0) {
                $('#nextTripButton').html("Preview selection");
                if (flightSearchResults.currentSearch === 0) {
                    $('#bookButton').show();
                    $('#nextTripButton').hide();
                } else {
                    $('#bookButton').hide();
                    $('#nextTripButton').show();
                }
            } else {
                $('#bookButton').hide();
                $('#nextTripButton').show();
            }
        },
        error: function (flightSearchError) {
            console.log(flightSearchError);
            const html = '<div class="card shadow-sm mb-1"> <div class="card-body">No flights availabe for this journey</div></div>';
            $('#searchResult').html(html);
            $('#bookButton').hide();
            $('#nextTripButton').hide();
        }
    })
}

getSearchResultHeader = (currentSearchCriteria) => {
    return '<div class="card m-1"><div class="card-body">' +
        '<div class="row">' +
        '<div class="col d-none d-md-block">' +
        '<div class="fs-4">' + getDisplayDate(currentSearchCriteria.journeyDate) + '</div>' +
        '<div class="fs-6">' + currentSearchCriteria.originCityCode + ' - ' + currentSearchCriteria.destinationCityCode + '</div>' +
        '</div>' +
        '<div class="col my-auto text-center"><div class="row">' +
        '<div class="col"><div><object data="icons/airline_seat_recline_normal.svg" type="image/svg+xml"></object></div>Economy</div>' +
        '<div class="col"><div><object data="icons/airline_seat_recline_extra.svg" type="image/svg+xml"></object></div>Business</div>' +
        '</div></div>' +
        '</div>' +
        '</div></div>';
}

getRoasterFormattedHtml = (availableRoaster) => {
    return '<div class="card m-1" id="rs-' + availableRoaster.roasterId + '">' +
        '<div class="card-body">' +
        '<div class="row">' +
        '<div class="col-md mb-3 mb-md-0">' +
        '<div>' +
        '<div class="d-inline-block"><img src=data:image/' + availableRoaster.flight.airline.airlineLogoType + ';base64,' + availableRoaster.flight.airline.airlineLogo + ' class="img-fluid align-middle img-logo me-3" alt="logo"></div>' +
        '<div class="d-inline-block align-middle">' +
        '<div class="fs-7">' + availableRoaster.flight.airline.airlineName + '</div>' +
        '<div>' + availableRoaster.flight.flightNumber + '</div>' +
        '</div>' +
        '<div class="d-inline-block float-end fs-7">' + availableRoaster.flight.meal.mealType + '</div>' +
        '</div>' +
        '<div class="d-flex justify-content-between">' +
        '<div>' +
        '<div class="fs-2">' + availableRoaster.depurture + '</div>' +
        '<div>' + availableRoaster.from.cityCode + '(' + availableRoaster.from.cityName + ')</div>' +
        '</div>' +
        '<div class="text-center my-auto">' +
        '<div>' +
        '<object data="icons/flight.svg" type="image/svg+xml"></object>' +
        '</div>' +
        '<div class="fs-6">' + availableRoaster.flight.duration + '</div>' +
        '</div>' +
        '<div class="text-end">' +
        '<div class="fs-2">' + availableRoaster.arrival + '</div>' +
        '<div>' + availableRoaster.to.cityCode + '(' + availableRoaster.to.cityName + ')</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md my-auto">' +
        '<div class="row">' +
        '<div class="col">' +
        '<div class="text-center fs-3">' +
        '&#8377;<span class="fs-1">' + availableRoaster.nonBusinessClassSeatsPrice + '</span>' +
        '</div>' +
        '<div class="d-flex justify-content-center">' +
        '<div class="form-check">' +
        '<input class="form-check-input" type="radio" name="flightSelect" id="flightSelect" value="r-' + availableRoaster.roasterId + '-ECONOMY-' + availableRoaster.nonBusinessClassSeatsPrice + '">' +
        '<label class="form-check-label" for="flightSelect">Select </label>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col">' +
        '<div class="text-center fs-3">' +
        '&#8377;<span class="fs-1">' + availableRoaster.businessClassSeatsPrice + '</span>' +
        '</div>' +
        '<div class="d-flex justify-content-center">' +
        '<div class="form-check">' +
        '<input class="form-check-input" type="radio" name="flightSelect" id="flightSelect" value="r-' + availableRoaster.roasterId + '-BUSINESS-' + availableRoaster.businessClassSeatsPrice + '">' +
        '<label class="form-check-label" for="flightSelect">Select </label>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
}

getSelectedFlightFormattedHtml = (selectedFlight, flightCount) => {
    return '<div class="card m-1 id="fl-' + selectedFlight.roasterId + '">' +
        '<div class="card-body">' +
        '<div class="row">' +
        '<div class="col my-auto">Flight ' + (flightCount + 1) + '</div>' +
        '<div class="col my-auto text-center">' + selectedFlight.roaster.from.cityCode + ' - ' + selectedFlight.roaster.to.cityCode + '</div>' +
        '<div class="col my-auto text-center">' + getDisplayDate(selectedFlight.roaster.roasterDate) + '</div>' +
        '<div class="col my-auto text-center">' + selectedFlight.roaster.depurture + ' - ' + selectedFlight.roaster.arrival + '</div>' +
        '<div class="col my-auto text-center">' + selectedFlight.roaster.flight.flightNumber + '</div>' +
        '<div class="col my-auto text-center">' + selectedFlight.seatType + '</div>' +
        '<div class="col my-auto text-center"> &#8377; ' + selectedFlight.seatPrice + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

getDisplayDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date(date);
    return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}