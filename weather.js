const API_KEY = "82b02a82eeb8bea0a364f93b26e64520";

const state = {
  dataWeather: {},
  allWeathers: [],
};

class CityMyWeaher {
  resultLocal = document.querySelector(".main_header");
  headerTime = document.querySelector(".header_time");
  headerCity = document.querySelector(".header_city");

  constructor(key) {
    this.key = key;
    this.getPosition();
    setInterval(() => {
      this.getTime();
      this.getDate();
    }, 1000);
  }

  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
  }

  setPosition = async function (position) {
    const { latitude, longitude } = position.coords;

    await this.getWeatherCoordinates(latitude, longitude);

    const mark = await this.myCityWeather();

    this.headerCity.children[0].innerText = state.dataWeather.name;

    this.headerCity.children[1].innerText = state.dataWeather.country;

    this.resultLocal.insertAdjacentHTML("beforeend", mark);
  };

  getDate() {
    let date = new Date();
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    this.headerTime.children[1].innerText = new Intl.DateTimeFormat(
      "en-US",
      options
    ).format(date);
  }

  getTime() {
    let date = new Date();
    let minutes = date.getMinutes();
    let hour = date.getHours();

    this.headerTime.children[0].innerText = `${hour}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  }

  correctDescription() {
    const description = state.dataWeather.description.toLowerCase();
    return description[0].toUpperCase("en-US") + description.slice(1);
  }

  getWeatherCoordinates = async function (lat, lon) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${this.key}`
      );

      if (!res.ok) throw new Error(`${(data, message)} ${res.status}`);

      const data = await res.json();

      state.dataWeather = {
        name: data.name,
        country: data.sys.country,
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        sea_level: data.main.sea_level,
        temp: Math.round(data.main.temp),
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
      console.log(state);
    } catch (err) {
      console.log(err);
    }
  };

  myCityWeather() {
    return `

   <div class="temperature_myWeather">
    <!-- Temperature -->
    <div class="temperature">
      <div class="temperature_weather">
      <div class="temperature_img">
        <img src="http://openweathermap.org/img/w/${
          state.dataWeather.icon
        }.png" alt="weather_icon">
          <h3>${this.correctDescription()}</h3>
      </div>
       <div>
        <div class="temperature_degree">
          <h1>${
            state.dataWeather.temp
          } °C  </h1> <div class="line_deg"></div><h1> There is</h1>
        </div>
        <div class="temperature_degree">
          <h1>${
            state.dataWeather.feels_like
          } °C  </h1><div class="line_deg"></div><h1> Feels like</h1>
        </div>
        </div>
       
       
      </div>
      <!-- Temperature Indicators -->
      <div class="temperature_indicators">
         <div class="indicator">
          <img src="img/humidity.png" alt="">
          <div class="line_ind"></div>
          <h2>${state.dataWeather.humidity}</h2>
         </div>
         <div class="indicator">
          <img src="img/sea-level.png" alt="">
          <div class="line_ind"></div>
          <h2>${state.dataWeather.sea_level}</h2>
         </div>
         <div class="indicator">
          <img src="img/blood-pressure.png" alt="">
          <div class="line_ind"></div>
          <h2>${state.dataWeather.pressure}</h2>
         </div>
      </div>
    </div>
   </div>
    `;
  }
}

const cityMyWeaher = new CityMyWeaher(API_KEY);

class SearchCity {
  _btn = document.querySelector(".search_weather");
  _allWether = [];

  constructor(dataWeather) {
    this.dataWeather = dataWeather;
  }

  setLocalStorage() {
    this._allWether[
      this._allWether.filter((el) => el.name !== this.dataWeather.name)
    ];
    console.log(this._allWether);
  }

  getCity() {
    const city = document.querySelector(".search__input_city").value;
    this.clearInput();
    this.setLocalStorage();
    return city;
  }
  clearInput() {
    document.querySelector(".search__input_city").value = "";
  }

  getDataWeater(dataWeather) {
    this.dataWeather = dataWeather;
  }

  addSerch(controler) {
    this._btn.addEventListener("submit", function (e) {
      e.preventDefault();
      controler();
    });
  }
}

class Views extends SearchCity {
  _btnDelete;
  constructor(dataWeather) {
    super(dataWeather);
    this.dataWeather = dataWeather;
  }
  addToResult() {
    const resultWeather = document.querySelector(".result__weather");
    const mark = this.render();
    resultWeather.insertAdjacentHTML("afterbegin", mark);

    this._btnDelete = document.querySelectorAll(".btn__delete");

    console.log(this._btnDelete);
  }

  correctDescription() {
    const description = this.dataWeather.description.toLowerCase();
    return description[0].toUpperCase() + description.slice(1);
  }
  render() {
    return `
      <div class="box_weather">
      <div class="weather_city">
        <h2>${this.dataWeather.name} / ${this.dataWeather.country}</h2>
      </div>
  
      <img
        class="weather_icon"
        src="http://openweathermap.org/img/w/${this.dataWeather.icon}.png"
        alt="weather_icon"
      />
      <p>${this.correctDescription()}</p>
      <h2>${this.dataWeather.temp} °C</h2>
      <ul>
        <li><p>Feels like: ${this.dataWeather.feels_like} °C</p></li>
        <li><p>Pressure: ${this.dataWeather.pressure}</p></li>
        <li><p>Humidity: ${this.dataWeather.humidity}</p></li>
      </ul>

      <button class="btn__delete"><span>Видалити</span></button>
    </div>
      `;
  }

  deleteWeather() {
    this._btnDelete.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.target.closest(".box_weather").remove();
      });
    });
  }
}

const views = new Views();

const getWeather = async function (city, API_KEY) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&lang=en&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error(`${(data, message)} ${res.status}`);

    const data = await res.json();

    state.dataWeather = {
      name: data.name,
      country: data.sys.country,
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      sea_level: data.main.sea_level,
      temp: Math.round(data.main.temp),
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    //state.allWeathers.push(state.dataWeather);

    return state.dataWeather;
  } catch (err) {
    console.log(err);
  }
};

const controler = async function () {
  try {
    const city = views.getCity();

    if (!city) return;

    const state = await getWeather(city, API_KEY);

    views.getDataWeater(state);

    views.addToResult();

    views.deleteWeather();
  } catch (error) {
    console.log(error);
  }
};

const init = function () {
  views.addSerch(controler);
};
init();
