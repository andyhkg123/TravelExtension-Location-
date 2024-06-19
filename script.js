//--------------------Weather App JS--------------------------------
let weather = {
  apiKey: "9af87bcfc91fbc8841f67b36e9267e65",
  locationweather: function () {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;

      console.log(crd.latitude);
      console.log(crd.longitude);
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
          crd.latitude +
          "&lon=" +
          crd.longitude +
          "&units=metric&appid=" +
          weather.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then(function (currentData) {
          weather.fetchWeather(currentData.name);
        });

      // console.log("Your current position is:");
      // console.log(`Latitude : ${crd.latitude}`);
      // console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  },
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((currentData) => this.displayWeather(currentData));
    /////api fetching Forecast weather
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No Forecast weather found.");
        }
        return response.json();
      })
      .then((forecastData) => this.displayForecast(forecastData));
    /////api fetching background image with DOM
    fetch(
      "https://api.pexels.com/v1/search?query=" +
        city +
        " city" +
        "&per_page=80&per_page=1",
      {
        headers: {
          Authorization:
            "wioZFBAQnKOfK7T9duA409Af8ijfhAl9yL3psPnrXtrrJMA1DqcsWhCN",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No Photo found.");
        }
        return response.json();
      })
      .then((res) => this.getPhoto(res));
  },
  getPhoto: function (res) {
    document.body.style.backgroundImage =
      "url('" + res.photos[Math.floor(Math.random() * 81)].src.landscape + "')";
  },
  getWeatherIcon: function (id, icon) {
    if (id >= 200 && id <= 232) {
      return "/weather_icon/thunderstorm.png";
    } else if ((id >= 300 && id <= 301) || id == 500 || id == 520) {
      return "/weather_icon/light_drizzle.png";
    } else if ((id >= 302 && id <= 313) || id == 501) {
      return "/weather_icon/moderate_rain.png";
    } else if (
      (id >= 314 && id <= 321) ||
      (id >= 502 && id <= 504) ||
      (id >= 521 && id <= 531)
    ) {
      return "/weather_icon/heavy_rain.png";
    } else if (id >= 600 && id <= 622) {
      return "/weather_icon/cold.png";
    } else if (id == 701) {
      return "/weather_icon/mist.png";
    } else if (id == 721) {
      return "/weather_icon/haze.png";
    } else if (id == 741) {
      return "/weather_icon/fog.png";
    } else if (id == 800 && icon == "01d") {
      return "/weather_icon/clear_daysky.png";
    } else if (id == 800 && icon == "01n") {
      return "/weather_icon/clear_nightsky.png";
    } else if ((id == 801 && icon == "02d") || (id == 802 && icon == "03d")) {
      return "/weather_icon/fewcloudsday.png";
    } else if ((id == 801 && icon == "02n") || (id == 802 && icon == "03n")) {
      return "/weather_icon/fewcloudsnight.png";
    } else if ((id == 803 && icon == "04d") || (id == 804 && icon == "04d")) {
      return "/weather_icon/manycloudsday.png";
    } else if ((id == 803 && icon == "04n") || (id == 804 && icon == "04n")) {
      return "/weather_icon/manycloudsnight.png";
    } else {
      return "https://openweathermap.org/img/wn/" + icon + ".png";
    } // missing 711,731,751,761,762,771,781 not making it
  },
  displayWeather: function (data) {
    console.log(data);
    const { name } = data;
    const { id } = data.weather[0];
    console.log(id);

    const { icon, description } = data.weather[0];
    const { temp, humidity, temp_min, temp_max } = data.main;
    document.querySelector(".city").innerText = name;
    document.querySelector(".icon").src = this.getWeatherIcon(id, icon);
    // "https://openweathermap.org/img/wn/" + icon + ".png";

    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText =
      (Math.round(temp * 10) / 10).toFixed(1) + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".weather").classList.remove("loading");
  },
  displayForecast: function (data) {
    ////function for each DOM　day
    function updateForecastDay(i, dayTime) {
      const myDate = new Date(dayTime * 1000); // convert timestamp to milliseconds and construct Date object
      const DD = myDate.toString().split("").slice(8, 10);
      DD.push(" "); //
      const MM = myDate.toString().split("").slice(4, 7);
      const newDate = DD.concat(MM).join("");

      document.querySelector(`.forcast${i}Day`).innerText = newDate;
    }
    ////function for each time

    function updateForecastTime(i, dayTime) {
      const myDate = new Date(dayTime * 1000); // convert timestamp to milliseconds and construct Date object
      const TT = myDate.toString().split("").slice(16, 21).join("");
      document.querySelector(`.forcast${i}Time`).innerText = TT;
    }

    ////function to update Temp
    function updateForecastTemp(i, temp) {
      document.querySelector(`.forcast${i}Temp`).innerText = temp + "° C";
    }
    ////function to update Weather Description
    function updateForecastDescription(i, description) {
      document.querySelector(`.forcast${i}Description`).innerText = description;
    }

    ////function to update Weather Icon
    function updateForecastIcon(i, id, icon) {
      document.querySelector(`.forcast${i}Icon`).src = weather.getWeatherIcon(
        id,
        icon
      );
    }
    ////looping for each DOM
    for (let i = 0; i < 5; i++) {
      const dayTime = data.list[i].dt;
      const { icon, description } = data.list[i].weather[0];
      const { temp } = data.list[i].main;
      const { id } = data.list[i].weather[0];
      console.log(id);

      updateForecastDescription(i, description);
      updateForecastTemp(i, Math.round(temp));
      updateForecastDay(i, dayTime);
      updateForecastTime(i, dayTime);
      updateForecastIcon(i, id, icon);
    }
  },
  getPhoto: function (res) {
    document.body.style.backgroundImage =
      "url('" + res.photos[Math.floor(Math.random() * 81)].src.landscape + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.locationweather();

const refresh = document.querySelector(".refresh");

refresh.addEventListener("click", function () {});

const forecastBtn = document.querySelector(".forecastbtn");
const forecastRow = document.querySelector(".forecastrow");

forecastBtn.addEventListener("click", function () {
  if (forecastRow.classList.contains("show")) {
    forecastRow.classList.remove("show");
    setTimeout(() => {
      forecastBtn.innerHTML = "click to show forcast weather";
      forecastRow.style.display = "none";
    }, 500); // Match the transition duration
  } else {
    forecastBtn.innerHTML = "click to hide forcast weather";
    forecastRow.style.display = "flex";
    setTimeout(() => {
      forecastRow.classList.add("show");
    }, 10); // Small timeout to trigger transition
  }
});

//--------------------FlipCard JS--------------------------------
//--------------------FlipCard JS--------------------------------
const flipcard = document.querySelector(".middle");
const stockBtn = document.querySelector(".stockbtn");
const weatherBtn = document.querySelector(".weatherbtn");

stockBtn.addEventListener("click", function () {
  if (flipcard.classList.contains("show")) {
    flipcard.classList.remove("show");
  } else {
    flipcard.classList.add("show");
  }
});
weatherBtn.addEventListener("click", function () {
  if (flipcard.classList.contains("show")) {
    flipcard.classList.remove("show");
  } else {
    flipcard.classList.add("show");
  }
});

//--------------------FlipCard JS--------------------------------//
const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i == 0
        ? currency_code == "HKD"
          ? "selected"
          : ""
        : currency_code == "USD"
        ? "selected"
        : "";
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/b1c4b38ea7c13da34873fd17/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
