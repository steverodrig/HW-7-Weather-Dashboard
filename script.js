

var date = moment().format("(MMM Do, 20YY)");

$("#searchBtn").on("click", function() {
    var apiKey = "&appid=ad4cc1a0ad4af623c86d138e16616b18";
    var query = document.getElementById("searchBox").value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + apiKey;
    var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + apiKey;
    
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    .then(function(response) {
       
        var temp = (response.main.temp - 273.15) * 1.80 + 32;
        var speed = (response.wind.speed * 2.23694);
        var deg = "\u00B0";
        var iconCode = response.weather[0].icon
        var wIconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        $(".city").html("<h2>" + response.name + " " + date + " " + "<img src =" + wIconUrl+ " sameSite = none Secure></img>" + "</h2>");
        $(".temp").text("Temp: " + temp.toFixed(0) + "\u00B0 F");
        $(".humidity").text("Humidity: " + response.main.humidity + "\u0025");
        $(".wind").text("Wind speed: " + speed.toFixed(0) + " MPH");
        console.log(response);
    
    $.ajax({
        url: forecastQueryURL,
        method: "GET",
    })
    .then(function(responde) {
        
        var results = responde.list;
        console.log(results);
        for(var i = 1; i < 6; i++) {

           var foreDiv = document.getElementById("fiveDay");
           var newFore = document.createElement("div");
           foreDiv.append(newFore);
           $(newFore).addClass("foreBox");

           var dateDiv = document.createElement("div");
           newFore.append(dateDiv);
           $(dateDiv).addClass("fdate");
           var newDate = results[i].dt_txt;
           var utcDate = new Date(newDate);
           var date = utcDate.getDate();
           var month = utcDate.getMonth();
           var year = utcDate.getFullYear();
           var displayDate = (month+1) + "/" + date + "/" + year;
           console.log(newDate);
           console.log(displayDate);
           dateDiv.innerHTML = displayDate;
           
           var iconDiv = document.createElement("div");
           newFore.append(iconDiv);
           $(iconDiv).addClass("icon");
           var iconInfo = results[i].weather[0].icon;
           var iconURL = "http://openweathermap.org/img/wn/" + iconInfo + ".png";
           $(".icon").html("<img src =" + iconURL + " sameSite = none secure></img>");
           
           var tempDiv = document.createElement("div");
           newFore.append(tempDiv);
           $(tempDiv).addClass("fcast");
           var tempe = (results[i].main.temp - 273.15) * 1.80 + 32;
           tempDiv.innerHTML = ("Temp: " + tempe.toFixed(0) + "\u00B0 F");
           
           var humidityDiv = document.createElement("div");
           newFore.append(humidityDiv);
           $(humidityDiv).addClass("fcast");
           var humidityInfo = results[i].main.humidity;
           humidityDiv.innerHTML = ("Humidity: " + humidityInfo + "\u0025");
           
           
           
          
        }

    })

    });
});
