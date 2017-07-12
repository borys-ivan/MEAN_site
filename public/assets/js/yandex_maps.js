ymaps.ready(init);
 var myMap,myPlacemark;
function init(){  
    myMap = new ymaps.Map("api_map", {
    center: [50.474043, 30.595972], 
    zoom: 16
 });
  myPlacemark = new ymaps.Placemark([50.474043, 30.595972], { hintContent: 'Ми тут', 
  balloonContent: 'бульвар Перова, 1Б' 
 });
  myMap.geoObjects.add(myPlacemark);
}
   
  