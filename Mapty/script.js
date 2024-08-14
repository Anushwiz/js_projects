//'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const btnClearAll = document.querySelector('.deleteAll');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords; //[lat,lng]
  }
  _workoutDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  //counting number of clicks happening on the workouts in the UI
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this._calcPace();
    this._workoutDescription();
  }
  _calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this._calcSpeed();
    this._workoutDescription(); //calling this method in child calss bcuz child class contained the 'type' property which is used in the logic of the method
  }
  _calcSpeed() {
    //km/hr
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

//wrapping the project architecture code in APP class
class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 11;
  constructor() {
    //get position
    this._getPosition();
    //get data from local storage
    this._getLocalStorage();
    //event listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    //changing the input field cadence to elevation when we switch to cycling from running
    inputType.addEventListener('change', this._toggleElevationField);
    //addebentlistners to workout parent div to implement 'go to workout marker after click'
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    //event listners to deleteALL button
    btnClearAll.addEventListener('click', this.reset);
  }
  _getPosition() {
    //USING GEOLOCATION API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('could not find the co-ordinates');
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    //console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //handling click event on map
    //1. we need to select the location by clicing on the map [but marker wont be displyed on the click instead it will displayed after submiting the form which will be appeared after selecting the loacation on the map]
    //2. then form appears and after submitting the form marker will be displayed
    this.#map.on('click', this._showForm.bind(this));

    //renderig workouts data from the local storage on the map when page loads
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }
  _showForm(mE) {
    //mE = map Event
    this.#mapEvent = mE;
    //to enable form on click within map
    form.classList.remove('hidden');
    //just to focus on input field of distance field on loading the form
    inputDistance.focus();
  }
  _hideForm(workout) {
    //empty the input field
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    form.style.display = 'grid';
    //setTimeout(() => (form.style.display = 'grid'), 100);
  }
  _toggleElevationField() {
    // we have to toggle 'form__row--hidden'
    //have to select the input fields and then find its closest parent and then toggle the hidden class
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    //creating helper function for va;idating the input data
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    //creating helper funtion for checking positive number
    const isPositive = (...inputs) => inputs.every(inp => inp > 0);

    //after submitting the form it reloads so we need to preventthe default behavior
    e.preventDefault();
    //create a attributes for inputs
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    //getting lat and lng from mapEvent
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //if type is runnig create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      //check if data is valid by creating creating guard for checking condition if false return the funtion
      if (
        !validInputs(distance, duration, cadence) ||
        !isPositive(distance, duration, cadence)
      ) {
        return alert('please enter a valid positive number');
      }

      workout = new Running(distance, duration, [lat, lng], cadence);
    }
    //if type is cycling create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !isPositive(distance, duration)
      ) {
        return alert('please enter a valid positive number');
      }
      workout = new Cycling(distance, duration, [lat, lng], elevation);
    }
    //push new objects into workout array
    this.#workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);

    //hide from and clear input fields
    this._hideForm(workout);

    //adding the workouts data to local staage
    this._setLocalStorage();
  }
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          maxHeight: 40,
          autoClose: false,
          closeOnClick: false,
          //for adding color to popup based on type of  activity
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}${workout.description}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    `;

    if (workout.type === 'running') {
      html += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;
    }

    if (workout.type === 'cycling') {
      html += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `;
    }
    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutElement = e.target.closest('.workout');
    //console.log(workoutElement);
    if (!workoutElement) return;
    //Finding the workout object from workouts array based on dataset id

    const workout = this.#workouts.find(
      work => work.id === workoutElement.dataset.id
    );
    //console.log(workout);
    //logic for moving to popup based on the coordinates
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 0.5,
      },
    });

    //Using the public interface
    //workout.click();//comenting this because it will give error reason is when we convert the objects to string to store in localstorage and convertback to ojects it will loose its prototypic ehaviour which it had earlier and as the click method wasin the parent class 'workout' so it will give error as it do ot have access to it after converting back to object from the str
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    //getting workouts data from local storage by convering it to object
    const workoutsData = JSON.parse(localStorage.getItem('workouts'));
    //guard class
    if (!workoutsData) return;
    //sdding data from local storage to workout array
    this.#workouts = workoutsData;

    //rendering the each workout from the workouts array in the UI left side when page loads
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
    //below is the code fror rendering the workout data on the map ut this will give error because the tim this code is rendered at that time map wont e loaded so the #map will be undefied so it will give error hence we have added below code inside the _loadMap method at the end so this line will be rendered after the map loaded and no eror is given by the browser
    // this.#workouts.forEach(work => {
    // this._renderWorkoutMarker(work);
    // });
  }
  //method to reset the data from local storage
  reset() {
    localStorage.removeItem('workouts');
    //to relaod the age after calling this method
    location.reload();
  }
}

//Creating an oject out of class App
const app = new App();
