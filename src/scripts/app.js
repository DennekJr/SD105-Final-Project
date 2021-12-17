const uList = document.querySelector(".my-trip");
const token =
  "pk.eyJ1IjoiZGVubmVranIiLCJhIjoiY2t3ejZwcnluMDI5cTJ1bXBlb2NhYWo4YiJ9.b09QMSkxPkizbvUB7ozjbg";

mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-97.1384, 49.8951],
  zoom: 12,
});

let destLong;
let destLat;
let originLat;
let originLong;

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

const tripPlanner = function (tripDetails) {
  if (tripDetails.type === "walk" && tripDetails.to.stop) {
    uList.insertAdjacentHTML(
      "beforeend",
      `
      
  <li><i class="fas fa-walking" aria-hidden="true"></i>${tripDetails.type} for ${tripDetails.times.durations.total} minutes to ${tripDetails.to.stop.key} ${tripDetails.to.stop.name}</li>
  `
    );
  }
  if (tripDetails.type === "ride") {
    uList.insertAdjacentHTML(
      "beforeend",
      `
    
    <li><i class="fas fa-bus" aria-hidden="true"></i>${tripDetails.type} the ${tripDetails.route.name} for ${tripDetails.times.durations.total} minutes</li> `
    );
  }
  if (tripDetails.type === "transfer") {
    uList.insertAdjacentHTML(
      "beforeend",
      `
    
    <li><i class="fas fa-ticket-alt" aria-hidden="true"></i>${tripDetails.type} the ${tripDetails.from.stop.key} ${tripDetails.from.stop.name} for ${tripDetails.times.durations.total} minutes</li> `
    );
  }

  if (tripDetails.type === "walk" && tripDetails.to.destination) {
    uList.insertAdjacentHTML(
      "beforeend",
      `
    
    <li><i class="fas fa-walking" aria-hidden="true"></i>${tripDetails.type} for ${tripDetails.times.durations.total} minutes to your destination</li> `
    );
  }
};

const getTrip = async function (
  originLat,
  originLong,
  destinationLat,
  destinationLong
) {
  // if (originLat === undefined || destinationLat === undefined) {
  //   document
  //     .querySelector(".button-container")
  //     .addEventListener("click", () => {
  //       alert("Please select an origin or destination");
  //     });
  // }
  const targetUrl = `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=Mx1OH71vqr1d2fiyqAaw&origin=geo/${originLat},${originLong}&destination=geo/${destinationLat},${destinationLong}`;
  const response = await fetch(targetUrl);
  const data = await response.json();
  console.log(data.plans);
  console.log(data.plans[0].segments);
  uList.innerHTML = "";
  for (let segment of data.plans[0].segments) {
    tripPlanner(segment);
  }
  return data;
};

const htmlBuilder = function (feature) {
  return `
  <li class="itemList" data-long="${feature.center[0]}" data-lat="${feature.center[1]}">
          <div class="name">${feature.text}</div>
          <div>${feature.properties.address}</div>
        </li>`;
};

const startingLocation = function (featureList) {
  const originList = document.querySelector(".origins");
  originList.innerHTML = "";
  for (let feature of featureList) {
    originList.innerHTML += htmlBuilder(feature);
  }
};

const finishLocation = function (featureList) {
  const destList = document.querySelector(".destinations");
  destList.innerHTML = "";
  for (let feature of featureList) {
    destList.innerHTML += htmlBuilder(feature);
  }
};

const handlePOIClick = (e) => {
  // e.target.parentElement.parentElement.children.forEach(element => {
    // console.log(e.target.parentElement.parentElement.children)
    console.log(document.querySelector('.origins').children)
  // })
  let originList = document.querySelector('.origins').children;
  let destList = document.querySelector('.destinations').children;
    for(let children of originList){
      console.log(children.classList)
    children.classList.remove('selected')
  }
    for(let children of destList){
      console.log(children.classList)
    children.classList.remove('selected')
  }
  const liElement = e.target.closest(".itemList");
  liElement.classList.add('selected');
  // console.log(  e.target.parentElement.parentElement.children)
  const long = liElement.dataset.long;
  const lat = liElement.dataset.lat;
  if (e.path[2].className === "destinations") {
    destLong = liElement.dataset.long;
    destLat = liElement.dataset.lat;
  } else if (e.path[2].className === "origins") {
    // console.log("origin");
    originLong = liElement.dataset.long;
    originLat = liElement.dataset.lat;
  }
  // console.log(originLong, originLat);
  // console.log(destLong, destLat);
  document.querySelector(".button-container").addEventListener("click", () => {
    if (
      originLat === undefined ||
      destLat === undefined
    ) {
      alert("Please input both cordinates");
    } else {
      getTrip(originLat, originLong, destLat, destLong);
    }
  });
  markerLocation.setLngLat([long, lat]);
  map.flyTo({ center: [long, lat] });
};

const handleFormSubmit = (e) => {
  // console.log(e);
  e.preventDefault();
  const qString = e.target[0].value;

  if (e.target.classList.contains("origin-form")) {
    console.log("origin");
    getGeocode(qString).then((data) => {
      const featureList = [...data.features];
      featureList.sort((a, b) => {
        return getDistance(a.center) - getDistance(b.center);
      });
      if (featureList.length === 0) {
        alert("No result found");
      }
      startingLocation(featureList);
    });
  } else {
    getGeocode(qString).then((data) => {
      const featureList = [...data.features];
      if (featureList.length === 0) {
        alert("No result found");
      }
      featureList.sort((a, b) => {
        return getDistance(a.center) - getDistance(b.center);
      });
      finishLocation(featureList);
    });
  }
};

document.forms[0].addEventListener("submit", handleFormSubmit);
document.forms[1].addEventListener("submit", handleFormSubmit);
document.querySelector(".origins").addEventListener("click", handlePOIClick);
document
  .querySelector(".destinations")
  .addEventListener("click", handlePOIClick);

document.querySelector(".plan-trip").addEventListener("click", () => {
  if (
    !Boolean(document.getElementById("origin").value) &&
    !Boolean(document.getElementById("dest").value)
  )
    alert("Please submit locations to plan");
});
