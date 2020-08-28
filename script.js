
var date = moment().format("(MMM Do, 20YY)");

$("#searchBtn").on("click", function () {
    var apiKey = "&appid=ad4cc1a0ad4af623c86d138e16616b18";
    var uvApiKey = "ad4cc1a0ad4af623c86d138e16616b18";
    var query = document.getElementById("searchBox").value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + apiKey;

    $("#fiveDay").empty();

    $.ajax({
        url: queryURL,
        method: "GET",
    })
        .then(function (response) {

            var temp = (response.main.temp - 273.15) * 1.80 + 32;
            var speed = (response.wind.speed * 2.23694);
            var iconCode = response.weather[0].icon
            var wIconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
            $(".city").html("<h2>" + response.name + " " + date + " " + "<img src =" + wIconUrl + " sameSite = none Secure></img>" + "</h2>");
            $(".temp").text("Temp: " + temp.toFixed(0) + "\u00B0 F");
            $(".humidity").text("Humidity: " + response.main.humidity + "\u0025");
            $(".wind").text("Wind speed: " + speed.toFixed(0) + " MPH");
            console.log(response)
            lat = response.coord.lat;
            long = response.coord.lon;

            var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + uvApiKey + "&lat=" + lat + "&lon=" + long;

            $.ajax({
                url: uvQueryURL,
                method: "GET",
            })

                .then(function (respondUV) {
                    $(".uv").text("UV Index: " + respondUV.value);
                });

            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,hourly" + apiKey;

            $.ajax({
                url: forecastQueryURL,
                method: "GET",
            })
                .then(function (responde) {

                    var results = responde.daily;
                    console.log(results);
                    for (var i = 1; i < 6; i++) {

                        var foreDiv = document.getElementById("fiveDay");
                        var newFore = document.createElement("div");
                        foreDiv.append(newFore);
                        $(newFore).addClass("foreBox");

                        var dateDiv = document.createElement("div");
                        newFore.append(dateDiv);
                        $(dateDiv).addClass("fdate");
                        var epochDate = results[i].dt;
                        var utcDate = new Date(0);
                        utcDate.setUTCSeconds(epochDate);
                        console.log(utcDate);
                        var date = utcDate.getDate();
                        var month = utcDate.getMonth();
                        var year = utcDate.getFullYear();
                        var displayDate = (month + 1) + "/" + date + "/" + year;
                        dateDiv.innerHTML = displayDate;
                        console.log(displayDate);

                        var iconDiv = document.createElement("div");
                        newFore.append(iconDiv);
                        $(iconDiv).addClass("icon");
                        var iconInfo = results[i].weather[0].icon;
                        var iconURL = "http://openweathermap.org/img/wn/" + iconInfo + ".png";
                        $(".icon").html("<img src =" + iconURL + " sameSite = none secure></img>");

                        var tempDiv = document.createElement("div");
                        newFore.append(tempDiv);
                        $(tempDiv).addClass("fcast");
                        var tempe = (results[i].temp.max - 273.15) * 1.80 + 32;
                        tempDiv.innerHTML = ("Temp: " + tempe.toFixed(0) + "\u00B0 F");

                        var humidityDiv = document.createElement("div");
                        newFore.append(humidityDiv);
                        $(humidityDiv).addClass("fcast");
                        var humidityInfo = results[i].humidity;
                        humidityDiv.innerHTML = ("Humidity: " + humidityInfo + "\u0025");
                    };
                });
        });
});
