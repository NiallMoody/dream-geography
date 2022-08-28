var dreams = [{url:'places/islands-off-the-coast-of-argyll', latlng:{lat:332.20000076293945, lng:97.70909038408837}},
              {url:'places/ayr', latlng:{lat:218.4000015258789, lng:221.90936699961873}},
              {url:'places/south-of-the-clyde', latlng:{lat:318.9000015258789, lng:313.8460804860573}},
              {url:'places/byres-road', latlng:{lat:385.20000076293945, lng:336.8845180173825}},
              {url:'places/red-desert', latlng:{lat:414.20000076293945, lng:416.8294862664595}},
              {url:'places/rare-books', latlng:{lat:318.45000076293945, lng:405.3373970806547}},
              {url:'places/glasgow', latlng:{lat:406.45000076293945, lng:468.1051104254831}},
              {url:'places/the-queer-underground-railroad', latlng:{lat:255.22500038146973, lng:444.68099469717424}},
              {url:'places/the-hospital', latlng:{lat:283.6000003814697, lng:551.1644851718974}},
              {url:'places/on-the-edge-of-the-metropolis', latlng:{lat:373.70000076293945, lng:618.5977155339529}},
              {url:'places/decay', latlng:{lat:244.20000076293945, lng:629.8449639464067}},
              {url:'places/bridge-end', latlng:{lat:28.200000762939453, lng:718.37161995076}},
              {url:'places/dundee', latlng:{lat:529.2250003814697, lng:890.1757494834144}}];

window.addEventListener('load', (event) => {
  var map = L.map('map', {
    crs: L.CRS.Simple
  });

  var bounds = [[0, 0], [578, 1000]];
  var image = L.imageOverlay('https://cdn.glitch.global/273ac551-9687-45bd-9f8d-1556cfa510c5/map-small.png?v=1661718723063', bounds).addTo(map);

  map.fitBounds(bounds);
  
  map.on('mousemove', (event) => {
    let mapElement = document.getElementById('map');
    let foundIndex = getIndexUnderCursor(event.latlng.lat, event.latlng.lng);
    
    if(foundIndex > -1) {
      mapElement.style.cursor = 'pointer';
    }
    else {
      mapElement.style.cursor = 'grab';
    }
  });
  
  map.on('click', (event) => {
    let foundIndex = getIndexUnderCursor(event.latlng.lat, event.latlng.lng);
    
    if(foundIndex > -1) {
      window.location.href = dreams[foundIndex].url;
    }
    
    console.log(event.latlng);
  });
  
  map.on('mouseup', (event) => {
    let foundIndex = getIndexUnderCursor(event.latlng.lat, event.latlng.lng);
    
    if(foundIndex > -1) {
      if(event.originalEvent.button == 1) {
        window.open(dreams[foundIndex].url, '_blank');
        window.focus();
      }
    }
    
    console.log(event.latlng);
  });
});
  
function distance(lat1, lng1, lat2, lng2) {
  let retval = 0.0;
  let lat = lat2 - lat1;
  let lng = lng2 - lng1;
  
  retval = Math.sqrt((lat * lat) + (lng * lng));
  
  return retval;
}

//Returns -1 if no dream is under the cursor right now.
function getIndexUnderCursor(lat, lng) {
  let retval = -1;
    
  for(let i=0;i<dreams.length;++i) {
    if(distance(dreams[i].latlng.lat, dreams[i].latlng.lng, lat, lng) < 8.0) {
      retval = i;
      break;
    }
  }
  
  return retval;
}
