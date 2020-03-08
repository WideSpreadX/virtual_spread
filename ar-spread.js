// getting places from APIs
function loadPlaces(position) {
  const params = {
    radius: 1500, // search places not farther than this value (in meters)
    clientId: "BAVW34WNTJEZ2HC1HIB4R5VCGAORU2N0GNGZ1OOPCYWSBD1Y",
    clientSecret: "5AEIKFIMLUVNRTWXDLOVWHE3BVMXIOCQH2DX4BGXLLEIW0H4",
    version: "20300101"
  };

  // CORS Proxy
  const corsProxy = "https://cors-anywhere.herokuapp.com/";

  // Foursquare API (limit param: number of maximum places to fetch)
  const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=50 
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

          // add place name
          const placeText = document.createElement("a-link");
          placeText.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          placeText.setAttribute("title", place.name);
          placeText.setAttribute("scale", "15 15 15");

          placeText.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          scene.appendChild(placeText);
        });
      });
    },
    err => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
};
