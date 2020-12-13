/* const dotenv = require('dotenv').config();
const CLIENT_ID = dotenv.FOURSQUARE_CLIENT_ID;
const CLIENT_SECRET = dotenv.FOURSQUARE_CLIENT_SECRET; */

function loadPlaces(position) {
  const params = {
    radius: 2000,
    clientId: "BAVW34WNTJEZ2HC1HIB4R5VCGAORU2N0GNGZ1OOPCYWSBD1Y",
    clientSecret: "5AEIKFIMLUVNRTWXDLOVWHE3BVMXIOCQH2DX4BGXLLEIW0H4",
    version: "20300101"
  };

  const corsProxy = "https://cors-anywhere.herokuapp.com/";
  const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=20 
        &v=${params.version}`;
  return fetch(endpoint)
    .then(res => {
      return res.json().then(resp => {
        return resp.response.venues;
      });
    })
    .catch(err => {
      console.error("Error with places API", err);
    });
}

window.onload = () => {
  const scene = document.querySelector("a-scene");

  // Get current user location
  return navigator.geolocation.getCurrentPosition(
    function(position) {
      // Then use it to load from remote APIs some places nearby
      loadPlaces(position.coords).then(places => {
        places.forEach(place => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;

          // Place Marker Attributes
          const placeText = document.createElement("a-entity");
          placeText.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`,
            "link", "backgroundColor: #00ffff; borderColor: #ffffff;"
          );
          const placeName = document.createElement("a-text");
          
          placeName.setAttribute("value", place.name);
          placeName.setAttribute("align", "center");
          placeText.appendChild(placeName);

          const placePin = document.createElement("a-ring");
          placePin.setAttribute("color", "teal");
          placePin.setAttribute("radius-inner", "1.5");
          placePin.setAttribute("radius-outer", "2");
          placeText.appendChild(placePin);
          placeText.setAttribute("title", place.name);
          placeText.setAttribute("scale", "7 7 7");
          

          placeText.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          scene.appendChild(placeText);
          console.log(places);
          console.log(placeName);
          console.log(placePin);
        });
      });
    },
    err => console.error("I'm sorry, we were unable to retrieve your position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 3000
    }
  );
};
