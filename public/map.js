var dreams = [{url:'places/islands-off-the-coast-of-argyll', latlng:{lat:332.20000076293945, lng:97.70909038408837}}];

window.addEventListener('load', (event) => {
  var map = L.map('map', {
    crs: L.CRS.Simple
  });

  var bounds = [[0, 0], [578, 1000]];
  var image = L.imageOverlay('https://cdn.glitch.global/273ac551-9687-45bd-9f8d-1556cfa510c5/map-small.png?v=1661718723063', bounds).addTo(map);

  map.fitBounds(bounds);
  
  map.on('mousemove', (event) => {
    let foundIndex = -1;
    
    for(int i=0;i<dreams.length;++i) {
      if()
    }
  });
  
  map.on('click', (event) => {
    console.log(event.latlng);
  });
});
  
function distance(lat1, lng1, lat2, lng2) {
  let retval = 0.0;
  
  retval = Math.sqrt()
  
  return retval;
}
