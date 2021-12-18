// const uList = document.querySelector(".my-trip");

const token =
  "pk.eyJ1IjoiZGVubmVranIiLCJhIjoiY2t3ejZwcnluMDI5cTJ1bXBlb2NhYWo4YiJ9.b09QMSkxPkizbvUB7ozjbg";


const getGeocode = async function (qString) {
  const targetUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${qString}.json?bbox=-97.325875%2C49.766204%2C-96.953987%2C49.99275&limit=10&access_token=${token}`;
  const response = await fetch(targetUrl);
  const data = await response.json();
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

export const handleFormSubmit = (e) => {
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