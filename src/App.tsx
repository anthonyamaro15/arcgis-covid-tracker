import { useEffect, useRef} from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import BaseMapGallery from '@arcgis/core/widgets/BasemapGallery';
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable';
import FatureFilter from '@arcgis/core/views/layers/support/FeatureFilter';
import WebMap from '@arcgis/core/WebMap';
import Expand from '@arcgis/core/widgets/Expand';
import { apieKey } from './envVariables/index';
import { trackerPopup } from './helperFiles';
import { filterByDeath } from './helperFiles/helperFunctions';
import { FloodLayerProps } from './interfaces';


function App() {
   const mapDiv = useRef<HTMLInputElement>(null);
   esriConfig.assetsPath = './assets';
   esriConfig.apiKey = apieKey;
   let floodLayerView: FloodLayerProps | any ;

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

         const covidLayer = new FeatureLayer({
            url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/1",
            outFields: ['*'],
            popupTemplate: trackerPopup,
         });

         // map.addMany([ covidLayer ],0);
         const nodes = document.querySelectorAll(".testing");
         const node = document.getElementById('dead-filter');

         node?.addEventListener('click', (e) => filterByDeath(e, floodLayerView));

         view.whenLayerView(covidLayer).then((layerView) => {
            floodLayerView = layerView;
            if(node) {
               node.style.visibility = 'visible';
               const nodesExpand = new Expand({
                  view,
                  content: node,
                  expandIconClass: "esri-icon-filter",
                  group: 'top-left'
               })

               nodesExpand.watch("expanded", () => {
                  if(!nodesExpand.expanded) {
                     floodLayerView.filter = null;
                  }
               });
               view.ui.add(nodesExpand, 'top-left');   
            }
         });

         const baseMapGallery = new BaseMapGallery({
            view,
            container: document.createElement('div')
         });
         const bgExpand = new Expand({
            view,
            content: baseMapGallery
         })

         view.ui.add(bgExpand, 'top-right');
   
         map.addMany([ covidLayer ],0);

      }         

   },[]);
  return (
    <div className="mapDiv" ref={mapDiv}>
       <div id="dead-filter" className="esri-widget">
          <div className="testing visible-testing" data-count="US">US</div>
          <div className="testing visible-testing" data-count="Venezuela">Venezuela</div>
          <div className="testing visible-testing" data-count="Zambia">Zambia</div>
       </div>
    </div>
  );
}

export default App;
