import { RefObject } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import config from '../configs/config';
import layerFactory from '../utils/layerFactory.utils';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import BaseMapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Search from '@arcgis/core/widgets/Search';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import store from '../redux/store';
import { setMapLoaded } from '../redux/slices/mapSlice';

class MapController {
   #map?: Map;
   #mapview?: MapView;
   #mapLayers?: any;
   #baseMapGallery?: BaseMapGallery;
   #bgExpand?: Expand;
   #searchWidget?: Search;
   #layer?: GraphicsLayer;
   #sketch?: Sketch;
   layerView?: FeatureLayerView | any;
   
   initializeMap = async (domRef: RefObject<HTMLDivElement>) => {
      if(!domRef.current) {
         return;
      }

      this.#layer = new GraphicsLayer();

      this.#map = new Map({
         basemap: "hybrid",
         layers: [this.#layer]
      });

      this.#mapview = new MapView({
         map: this.#map,
         container: domRef.current,
         center: [-100.33, 25.69],
         zoom: 5
      });

      this.#baseMapGallery = new BaseMapGallery({ view: this.mapView, container: document.createElement('div') });
      this.#bgExpand = new Expand({
         view: this.#mapview, content: this.#baseMapGallery,
      });

      this.#searchWidget = new Search({ view: this.#mapview });
      this.#sketch = new Sketch({ layer: this.#layer, view: this.#mapview, creationMode: 'update' });

      this.#mapview.ui.add(this.#sketch, 'bottom-right');
      this.#mapview.ui.add(this.#searchWidget, 'top-right');
      this.#mapview.ui.add(this.#bgExpand, 'top-right');

      this.#mapview?.when(async () => {
         this.#mapLayers = [];
         
         for(let i = 0; i < config.layers.length; i++) {
            const layer = await layerFactory(config.layers[i]);
            if(layer) {
               this.#mapLayers.push(layer);
               this.#map?.add(layer);
            }
         }

         // const nodes = document.querySelectorAll(".testing");
         const node = document.getElementById("dead-filter");

         node?.addEventListener('click', (e) => this.filterByDeath(e, this.layerView))

         const layer = this.#map?.findLayerById('covid-tracker') as FeatureLayer;

         
        
         this.#mapview?.whenLayerView(layer)?.then((featureLayerView) => {
            this.layerView = featureLayerView;

            if(node) {
               node.style.visibility = 'visible';
               const nodesExpand = new Expand({
                  view: this.#mapview,
                  content: node,
                  expandIconClass: 'esri-icon-filter',
                  group: 'top-left'
               });

               nodesExpand.watch('expanded', () => {
                  if(!nodesExpand.expanded) {
                     this.layerView.filter = null;
                  }
               });
               this.#mapview?.ui.add(nodesExpand, 'top-left');
            }
         });
         store.dispatch(setMapLoaded(true));
      })
   }

   // cast types as any for the moment
   filterByDeath(e: any, layerView: any) {
      const selectedNode = e.target.getAttribute('data-count');
      layerView.filter = {
         where: "Country_Region = '" + selectedNode + "'" 
      }
   }

   get map() {
      return this.#map;
   }
   get mapView() {
      return this.#mapview;
   }
   get mapLayer() {
      return this.#mapLayers;
   } 
}

const mapController = new MapController();

declare global {
   interface Window {
      mapController: typeof mapController;
   }
}
if(process.env.NODE_ENV === 'development') {
   window.mapController = mapController;
}

export default mapController;
