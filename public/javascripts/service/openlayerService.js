var map
var epsg4326
var projectTo
var feature
var vectorLayer
var controls

//Distrugge un pop-up alla chiusura
function destroyPopup(feature) {
    feature.popup.destroy();
    feature.popup = null;
}

//Creazione di un pop-up
function createPopup(feature) {
    feature.popup = new OpenLayers.Popup.FramedCloud("pop",
        feature.geometry.getBounds().getCenterLonLat(),
        null,
        '<div class="markerContent">' + feature.attributes.description + '</div>',
        null,
        true,
        function () { controls['selector'].unselectAll(); }
    );
    //feature.popup.closeOnMove = true;
    map.addPopup(feature.popup);
}

//Aggiunge un punto di riferimento sulla mappa
function addFeature(lon, lat, descrizione, iconpath) {
    // Define markers as "features" of the vector layer:
    feature = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(lon, lat).transform(epsg4326, projectTo),
        { description: descrizione },
        { externalGraphic: iconpath, graphicHeight: 110, graphicWidth: 110, graphicXOffset: -12, graphicYOffset: -25 }
    );

    vectorLayer.addFeatures(feature);

    map.addLayer(vectorLayer);
}

//Creazione della mappa nella pagina risultato
function spawnMappaMeteo(lon, lat, descrizione, iconpath) {
    map = new OpenLayers.Map("DivMappa", {interactions: [], controls: []});
    map.addLayer(new OpenLayers.Layer.OSM());

    epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)

    var lonLat = new OpenLayers.LonLat(lon, lat).transform(epsg4326, projectTo);
    var zoom = 10;
    map.setCenter(lonLat, zoom);

    vectorLayer = new OpenLayers.Layer.Vector("Overlay");

    addFeature(lon, lat, descrizione, iconpath)

    //Add a selector control to the vectorLayer with popup functions
    controls = {
        selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    };

    map.addControl(controls['selector']);

    controls['selector'].activate();
}

export {spawnMappaMeteo}