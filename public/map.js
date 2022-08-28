window.addEventListener('load', (event) => {
  var map = L.map('map', {
    crs: L.CRS.Simple
  });

  var bounds = [[0, 0], [578, 1000]];
  var image = L.imageOverlay('https://cdn.glitch.global/273ac551-9687-45bd-9f8d-1556cfa510c5/map-small.png?v=1661718723063', bounds).addTo(map);

  map.fitBounds(bounds);
});
