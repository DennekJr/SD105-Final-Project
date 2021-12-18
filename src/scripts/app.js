const uList = document.querySelector(".my-trip");
const token =
  "pk.eyJ1IjoiZGVubmVranIiLCJhIjoiY2t3ejZwcnluMDI5cTJ1bXBlb2NhYWo4YiJ9.b09QMSkxPkizbvUB7ozjbg";

let destLong;
let destLat;
let originLat;
let originLong;

const getGeocode = async function (qString) {
  const targetUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${qString}.json?bbox=-97.325875%2C49.766204%2C-96.953987%2C49.99275&limit=10&access_token=${token}`;
  const response = await fetch(targetUrl);
  const data = await response.json();
  return data;
};

const tripPlanner = function (tripDetails) {

  if (tripDetails.type === "walk" && tripDetails.to.stop) {


    uList.insertAdjacentHTML(
      "beforeend",
      `<li><i class="fas fa-walking" aria-hidden="true"></i>${tripDetails.type} for ${tripDetails.times.durations.total} minutes to ${tripDetails.to.stop.key} ${tripDetails.to.stop.name}</li>`
    );
  }
  if (tripDetails.type === "ride") {
    uList.insertAdjacentHTML(
      "beforeend",
      `<li><i class="fas fa-bus" aria-hidden="true"></i>${tripDetails.type} the ${tripDetails.route.name} for ${tripDetails.times.durations.total} minutes</li> `
    );
  }
  if (tripDetails.type === "transfer") {
    uList.insertAdjacentHTML(
      "beforeend",
      `<li><i class="fas fa-ticket-alt" aria-hidden="true"></i>${tripDetails.type} the ${tripDetails.from.stop.key} ${tripDetails.from.stop.name} for ${tripDetails.times.durations.total} minutes</li> `
    );
  }

  if (tripDetails.type === "walk" && tripDetails.to.destination) {
    uList.insertAdjacentHTML(
      "beforeend",
      `<li><i class="fas fa-walking" aria-hidden="true"></i>${tripDetails.type} for ${tripDetails.times.durations.total} minutes to your destination</li> `
    );
  }
};

const getTrip = async function (
  originLat,
  originLong,
  destinationLat,
  destinationLong
) {
  const targetUrl = `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=Mx1OH71vqr1d2fiyqAaw&origin=geo/${originLat},${originLong}&destination=geo/${destinationLat},${destinationLong}`;
  const response = await fetch(targetUrl);
  const data = await response.json();
  uList.innerHTML = "";
  for (let segment of data.plans[0].segments) {
    tripPlanner(segment);
  }
  return data;
};

const htmlBuilder = function (feature) {
  if (feature.properties.address === undefined) {
    return `
  <li class="itemList" data-long="${feature.center[0]}" data-lat="${feature.center[1]}">
          <div class="name">${feature.text}</div>
          <div>${feature.context[2].text}</div>
        </li>`;
  } else {
    return `
    <li class="itemList" data-long="${feature.center[0]}" data-lat="${feature.center[1]}">
            <div class="name">${feature.text}</div>
            <div>${feature.properties.address}</div>
          </li>`;
  }
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
  const ul = e.path.filter(el => el.nodeName === 'UL')[0]
  const li = e.path.filter(el => el.nodeName === 'LI')[0]

  li.classList.add("selected")



  if (ul.className === "destinations") {
    destLong = li.dataset.long;
    destLat = li.dataset.lat;
  } else if (ul.className === "origins") {
    originLong = li.dataset.long;
    originLat = li.dataset.lat;
  }

  document.querySelector(".plan-trip").addEventListener("click", () => {
    if (originLat === undefined || destLat === undefined) {
      alert("Please input both coordinates");
    } else {
      getTrip(originLat, originLong, destLat, destLong);
    }
  });
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const qString = e.target[0].value;

  if (e.target.classList.contains("origin-form")) {
    getGeocode(qString).then((data) => {
      const featureList = [...data.features];
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
      finishLocation(featureList);
    });
  }
};

document.forms[0].addEventListener("submit", handleFormSubmit);
document.forms[1].addEventListener("submit", handleFormSubmit);

document.querySelector(".origins").addEventListener("click", (e) => {


  let originList = document.querySelector(".origins").children;
  for (let children of originList) {
    children.classList.remove("selected");
  }
  handlePOIClick(e);
});
document.querySelector(".destinations").addEventListener("click", (e) => {

  let destList = document.querySelector(".destinations").children;
  for (let children of destList) {
    children.classList.remove("selected");
  }
  handlePOIClick(e);
});

document.querySelector(".plan-trip").addEventListener("click", () => {
  if (
    !Boolean(document.getElementById("origin").value) &&
    !Boolean(document.getElementById("dest").value)
  )
    alert("Please submit locations to plan");
});
