var map = null;
var bounds = null;
var imageLayer = null;

window.addEventListener('load', (event) => {
  map = L.map('map', {crs: L.CRS.Simple});
  
  bounds = [[0, 0], [1000, 1000]];
  imageLayer = L.imageOverlay('https://cdn.glitch.global/273ac551-9687-45bd-9f8d-1556cfa510c5/map.jpg?v=1661703228321').addTo(map);
  
  map.fitBounds(bounds);
});
