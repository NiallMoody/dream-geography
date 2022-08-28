var dreams = [{url:'places/islands-off-the-coast-of-argyll', latlng:{lat:332.20000076293945, lng:97.70909038408837}}];

window.addEventListener('load', (event) => {
  var map = L.map('map', {
    crs: L.CRS.Simple
  });

  var bounds = [[0, 0], [578, 1000]];
  var image = L.imageOverlay('https://cdn.glitch.global/273ac551-9687-45bd-9f8d-1556cfa510c5/map-small.png?v=1661718723063', bounds).addTo(map);

  map.fitBounds(bounds);
  
  map.on('mousemove', (event) => {
    let mapElement = document.getElementById('map');
    let foundIndex = -1;
    
    for(let i=0;i<dreams.length;++i) {
      if(distance(dreams[i].latlng.lat, dreams[i].latlng.lng, event.latlng.lat, event.latlng.lng) < 8.0) {
        console.log(`found: ${i}`);
        foundIndex = i;
        break;
      }
    }
    
    if(foundIndex > -1) {
      mapElement.style.cursor = 'pointer';
    }
    else {
      mapElement.style.cursor = 'grab';
    }
  });
  
  map.on('click', (event) => {
    
    
    console.log(event.latlng);
  });
});
  
function distance(lat1, lng1, lat2, lng2) {
  let retval = 0.0;
  let lat = lat2 - lat1;
  let lng = lng2 - lng1;
  
  retval = Math.sqrt((lat * lat) + (lng * lng));
  
  console.log(lat1, lng1, lat2, lng2, retval);
  console.log(lat, lng);
  
  return retval;
}

//Returns -1 if no dream is under the cursor right now.
function getIndexUnderCursor(x, y) {
  let mapElement = document.getElementById('map');
  let retval = -1;
    
  for(let i=0;i<dreams.length;++i) {
    if(distance(dreams[i].latlng.lat, dreams[i].latlng.lng, event.latlng.lat, event.latlng.lng) < 8.0) {
      retval = i;
      break;
    }
  }
  
  return retval;
}
