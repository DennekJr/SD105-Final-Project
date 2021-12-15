const token =
  "pk.eyJ1IjoiZGVubmVranIiLCJhIjoiY2t3ejZwcnluMDI5cTJ1bXBlb2NhYWo4YiJ9.b09QMSkxPkizbvUB7ozjbg";

mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-97.1384, 49.8951],
  zoom: 12,
});

const coords = {
  longitude: 0,
  latitude: 0,
};

const markerLocation = new mapboxgl.Marker();

navigator.geolocation.getCurrentPosition((position) => {
  coords.longitude = position.coords.longitude;
  coords.latitude = position.coords.latitude;

  markerLocation.setLngLat([coords.longitude, coords.latitude]).addTo(map);
});

const getGeocode = async function (qString) {
  const targetUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${qString}.json?bbox=-97.325875%2C49.766204%2C-96.953987%2C49.99275&limit=10&access_token=${token}`;
  const response = await fetch(targetUrl);
  const data = await response.json();
  return data;
};

const getDistance = function (arr) {
  const [long, lat] = arr;
  const longDiffKM = Math.abs(long - coords.longitude) * 111.319;
  const latDiffKM = Math.abs(lat - coords.latitude) * 111.319;
  const distance = Math.sqrt(longDiffKM ** 2 + latDiffKM ** 2);

  return distance;
};

const featureHtmlBuilder = function (feature) {
  return `
  <li class="selected" data-long="${feature.center[0]}" data-lat="${feature.center[1]}">
          <div class="name">${feature.text}</div>
          <div>${feature.properties.address}</div>
        </li>`;
};

const startingLocation = function (featureList) {
  const ulList = document.querySelector(".origins");
  ulList.innerHTML = "";
  for (let feature of featureList) {
    // console.log(feature)
    ulList.innerHTML += featureHtmlBuilder(feature);
  }
};
const finishLocation = function (featureList) {
  const ulList = document.querySelector(".destinations");
  ulList.innerHTML = "";
  for (let feature of featureList) {
    // console.log(feature)
    ulList.innerHTML += featureHtmlBuilder(feature);
  }
};

const handlePOIClick = (e) => {
  const liElement = e.target.closest(".selected");
  const long = liElement.dataset.long;
  const lat = liElement.dataset.lat;
  markerLocation.setLngLat([long, lat]);
  map.flyTo({ center: [long, lat] });
};

const handleFormSubmit = (e) => {
  console.log(e);
  e.preventDefault();
  const qString = e.target[0].value;
    
  if(e.target.classList.contains("origin-form")){
    console.log('origin')
    getGeocode(qString).then((data) => {
      const featureList = [...data.features];
      featureList.sort((a, b) => {
        return getDistance(a.center) - getDistance(b.center);
      });
    startingLocation(featureList);
    });

  } else {
    console.log('dest')
    getGeocode(qString).then((data) => {
      const featureList = [...data.features];
      featureList.sort((a, b) => {
        console.log(featureList)
        return getDistance(a.center) - getDistance(b.center);
      });
      finishLocation(featureList);
    });
  }
  
};

document.forms[0].addEventListener("submit", handleFormSubmit);
document.forms[1].addEventListener("submit", handleFormSubmit);
document
  .querySelector(".origins")
  .addEventListener("click", handlePOIClick);
document
  .querySelector(".destinations")
  .addEventListener("click", handlePOIClick);
