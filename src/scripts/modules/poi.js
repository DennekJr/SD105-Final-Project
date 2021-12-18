const uList = document.querySelector(".my-trip");
const token =
  "pk.eyJ1IjoiZGVubmVranIiLCJhIjoiY2t3ejZwcnluMDI5cTJ1bXBlb2NhYWo4YiJ9.b09QMSkxPkizbvUB7ozjbg";

  let destLong;
let destLat;
let originLat;
let originLong;

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

const handlePOIClick = (e) => {
  const ul = e.path.filter((el) => el.nodeName === "UL")[0];
  const li = e.path.filter((el) => el.nodeName === "LI")[0];

  li.classList.add("selected");

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

export {handlePOIClick};