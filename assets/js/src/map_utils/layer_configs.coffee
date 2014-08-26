layer_configs =
  mapbox_streets: {
    name: 'MapBox Streets'
    url: 'https://{s}.tiles.mapbox.com/v3/spatialnetworks.map-6l9yntw9/{z}/{x}/{y}.png'
    options: {
      attribution: "Tiles Courtesy of <a href='http://www.mapbox.com/' target='_blank'>MapBox</a> &mdash; <a target='_blank' href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a> 2014 <a target='_blank' href='http://openstreetmap.org'>OpenStreetMap.org</a> contributors",
      minZoom: 2
      maxZoom: 19
    }
  }
  mapbox_satellite: {
    name: 'MapBox Satellite'
    url: 'https://api.tiles.mapbox.com/v3/spatialnetworks.map-xkumo5oi/{z}/{x}/{y}.png'
    options: {
      attribution: "Tiles Courtesy of <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>"
      minZoom: 2
      maxZoom: 19
    }
  }

module.exports = layer_configs
