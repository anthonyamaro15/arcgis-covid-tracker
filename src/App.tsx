import { useEffect, useRef} from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { apieKey } from './envVariables';



function App() {
   const mapDiv = useRef<HTMLInputElement>(null);
   esriConfig.assetsPath = './assets';
   esriConfig.apiKey = apieKey ? apieKey : '';

   useEffect(() => {
      if(mapDiv.current) {
         const map = new Map({
            basemap: "hybrid"

         });

         const view = new MapView({
            map,
            container: mapDiv.current,
            center: [-100.33, 25.69],
            zoom: 5
         });

         const trackerPopup = {
            "title": "{Province_State}",
            'content': 
            `
               <b>Country:</b> {Country_Region}<br>
               <b>Last Update:</b> {Last_Update}<br>
               <b>Confirmed:</b> {Confirmed}<br>
               <b>Recovered:</b> {Recovered}<br>
               <b>Deaths:</b> {Deaths}<br>
               <b>Active:</b> {Active}<br>
               <b>Tested:</b> {People_Tested}<br>
            `
         }

         const covidLayer = new FeatureLayer({
            url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/1",
            outFields: ['Province_State', 'Country_Region', 'Confirmed', 'Recovered', 'Deaths', 'Active', 'People_Tested', 'Last_Update'],
            popupTemplate: trackerPopup
         });

         map.add(covidLayer, 0);
      }

   },[]);
  return (
    <div className="mapDiv" ref={mapDiv}></div>
  );
}

export default App;
