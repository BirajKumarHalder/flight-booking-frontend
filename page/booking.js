$(function () {
    const loggedIn = sessionStorage.getItem("loggedIn");
    sessionStorage.setItem("loginRedirect", 'booking');
    if (!sessionStorage.getItem("loggedIn") || sessionStorage.getItem("loggedIn") !== 'true') {
        $('#main').load("./page/login.html");
    } else {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        const selectedFlights = JSON.parse(sessionStorage.getItem("selectedFlights"));
        console.log(loggedIn);
        console.log(userId);
        console.log(token);
        console.log(selectedFlights);
        const html = getPassengerFormFormatted(1);
        document.getElementById("passengerFormDiv").innerHTML = html;
    }
})

applyCoupon = (e) => {
    e.preventDefault();
    document.getElementById("copunApplyStatusSuccess").innerHTML = '';
    document.getElementById("copunApplyStatusError").innerHTML = '';
    const couponName = document.getElementById("coupon").value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/get-by-coupon-name",
        data: { "name": couponName },
        success: function (coupons) {
            if (coupons && coupons.length > 0) {
                const coupon = coupons[0];
                document.getElementById("copunApplyStatusSuccess").innerHTML = '<input type="hidden" id="couponId" value="' + coupon.couponId + '"></span><i class="fa fa-check" aria-hidden="true"></i> Coupon applied successfully.';
            } else {
                document.getElementById("copunApplyStatusError").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Not able to apply coupon.';
            }
        },
        error: function (error) {
            console.log(error);
            document.getElementById("copunApplyStatusError").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Not able to apply coupon.';
        }
    });
}

getPassengerForm = (e) => {
    e.preventDefault();
    const numberOfPassenger = e.target.value;
    var html = ''
    for (var i = 0; i < numberOfPassenger; i++) {
        html = html + getPassengerFormFormatted(i + 1);
    }
    document.getElementById("passengerFormDiv").innerHTML = html;
}

getPassengerFormFormatted = (id) => {
    return '<div id="pass-' + id + '" class="row mb-1 g-3">' +
        '<div class="col-3">' +
        '<input type="text" class="form-control" id="name" name="name">' +
        '</div>' +
        '<div class="col-1">' +
        '<input type="text" class="form-control" id="age" name="age">' +
        '</div>' +
        '<div class="col-2">' +
        '<input type="text" class="form-control" id="phone" name="phone">' +
        '</div>' +
        '<div class="col-2">' +
        '<select class="form-select" aria-label="Security Type" id="securityType" name="securityType">' +
        '<option value="AADHAR" selected>AADHAR</option>' +
        '<option value="PAN">PAN</option>' +
        '<option value="VOTAR">VOTAR</option>' +
        '</select>' +
        '</div>' +
        '<div class="col-4">' +
        '<input type="text" class="form-control" id="securityNumber" name="securityNumber">' +
        '</div>' +
        '</div >'
}

bookTrips = () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    const selectedFlights = JSON.parse(sessionStorage.getItem("selectedFlights"));
    var couponId = document.getElementById("couponId") ? document.getElementById("couponId").value : null;
    var passengerCount = document.getElementById("passengerCount").value;
    console.log(passengerCount)
}
