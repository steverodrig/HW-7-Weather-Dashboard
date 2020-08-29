
var date = moment().format("(MMM Do, 20YY)");

var searchArray = [];
var historyDiv = document.getElementById("searchHistory");
var butDiv = document.createElement("div");
historyDiv.append(butDiv);
$(butDiv).addClass("histBtnBox");

$("#searchBtn").on("click", function weather() {
    var apiKey = "&appid=ad4cc1a0ad4af623c86d138e16616b18";
    var uvApiKey = "ad4cc1a0ad4af623c86d138e16616b18";
    var query = document.getElementById("searchBox").value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + apiKey;

    $("#fiveDay").empty();
    $(".histBtnBox").empty();
    //Local storage of historic searches
    var searchItem = $("#searchBox").get().map(function (el) { return el.value });
    localStorage.setItem(history, JSON.stringify(searchItem));

    function retSearch(searchRet) {
        var searchRet = JSON.parse(localStorage.getItem(history));
        $.each(searchRet, function (index, value) {
            searchArray.push(value);
        });
    };
    retSearch();
    console.log(searchArray);

    for (var i = 0; i < searchArray.length; i++) {

        var histButts = document.createElement("button");
        butDiv.append(histButts);
        $(histButts).addClass("histBtn")
        var btnLbl = searchArray[i];
        histButts.innerHTML = btnLbl;
    };

    $(".histBtn").on("click", function () {
        $("#fiveDay").empty();
        weatherHist();
    });

    function weatherHist() {
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
                lat = response.coord.lat;
                long = response.coord.lon;

                var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + uvApiKey + "&lat=" + lat + "&lon=" + long;

                $.ajax({
                    url: uvQueryURL,
                    method: "GET",
                })

                    .then(function (respondUV) {
                        var uvValue = respondUV.value
                        $(".uv").text("UV Index: " + uvValue);
                        if (uvValue <= 2) {
                            $("#uv").addClass("uvFav");
                        } else if (uvValue >= 3 && uvValue <= 5) {
                            $("#uv").addClass("uvMod");
                        } else if (uvValue >= 6) {
                            $("#uv").addClass("uvSev");
                        };
                    });

                var forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,hourly" + apiKey;

                $.ajax({
                    url: forecastQueryURL,
                    method: "GET",
                })
                    .then(function (responde) {

                        var results = responde.daily;
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
                            var date = utcDate.getDate();
                            var month = utcDate.getMonth();
                            var year = utcDate.getFullYear();
                            var displayDate = (month + 1) + "/" + date + "/" + year;
                            dateDiv.innerHTML = displayDate;

                            var iconDiv = document.createElement("img");
                            newFore.append(iconDiv);
                            $(iconDiv).addClass("icon");
                            var iconInfo = results[i].weather[0].icon;
                            var iconURL = "http://openweathermap.org/img/wn/" + iconInfo + ".png";
                            $(iconDiv).attr("src", iconURL);

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
    };
    weatherHist();
});








