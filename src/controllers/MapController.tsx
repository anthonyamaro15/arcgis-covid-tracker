import { RefObject } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "../configs/config";
import layerFactory from "../utils/layerFactory.utils";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import BaseMapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search";
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import Query from "@arcgis/core/tasks/support/Query";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import Graphic from "@arcgis/core/Graphic";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import store from "../redux/store";
import { setCountries, setMapLoaded } from "../redux/slices/mapSlice";

enum LayerIds {
   COVID_ID = "covid-tracker",
}

class MapController {
   #map?: Map;
   #mapview?: MapView;
   #mapLayers?: FeatureLayer[] | any;
   #baseMapGallery?: BaseMapGallery;
   #bgExpand?: Expand;
   #sketchExpand?: Expand;
   #searchWidget?: Search;
   #layer?: GraphicsLayer | any;
   #sketch?: Sketch;
   #layerView?: FeatureLayerView | any;
   #test?: any;
   #updateGemotries?: any;
   #highlight?: any;
   #layerList?: LayerList;
   #casesLayer?: FeatureLayer;
   #groupLayers?: GroupLayer;
   #graphic?: Graphic | any;

   initializeMap = async (domRef: RefObject<HTMLDivElement>) => {
      if (!domRef.current) {
         return;
      }

      this.#casesLayer = new FeatureLayer({
         url:
            "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases2_v1/FeatureServer/1",
         visible: true,
         title: "cases",
      });

      this.#layer = new GraphicsLayer();

      this.#groupLayers = new GroupLayer({
         title: "covid",
         visible: false,
         visibilityMode: "exclusive",
         layers: [this.#casesLayer],
      });
      this.#map = new Map({
         basemap: "gray",
         layers: [this.#groupLayers],
      });

      this.#mapview = new MapView({
         map: this.#map,
         container: domRef.current,
         center: [-100.33, 25.69],
         zoom: 5,
         highlightOptions: {
            color: "white",
            haloColor: "blue",
            haloOpacity: 0.9,
            fillOpacity: 0.2,
         },
      });

      this.#baseMapGallery = new BaseMapGallery({
         view: this.mapView,
         container: document.createElement("div"),
      });
      this.#bgExpand = new Expand({
         view: this.#mapview,
         content: this.#baseMapGallery,
      });

      this.#searchWidget = new Search({ view: this.#mapview });

      this.#sketch = new Sketch({
         layer: this.#layer,
         view: this.#mapview,
         creationMode: "update",
         visibleElements: {
            createTools: {
               point: false,
               polyline: false,
            },
            selectionTools: {
               "lasso-selection": false,
               "rectangle-selection": false,
            },
         },
      });

      this.#sketch.on("create", (event) => {
         if (event.state === "complete") {
            this.#layer?.remove(event.graphic);
            this.#updateGemotries = this.getSketchUpdate(
               event.graphic.geometry,
               geometryEngine,
            );
            this.updateView();
         }
      });

      this.#mapview.ui.add(this.#searchWidget, "top-right");
      this.#mapview.ui.add(this.#bgExpand, "top-right");
      this.#mapview.ui.add(new Legend({ view: this.#mapview }), "bottom-left");

      this.#mapview?.when(async () => {
         this.#mapLayers = [];

         for (let i = 0; i < config.layers.length; i++) {
            const layer = await layerFactory(config.layers[i]);
            if (layer) {
               this.#mapLayers.push(layer);
               this.#map?.add(layer);
            }
         }

         const node = document.getElementById("dead-filter");

         const layer = this.#map?.findLayerById(
            LayerIds.COVID_ID,
         ) as FeatureLayer;

         this.#layerList = new LayerList({
            view: this.#mapview,
            // iconClass: "esri-expand--drawer",
            listItemCreatedFunction: this.listItemCreatedFunction,
         });

         this.#mapview?.whenLayerView(layer)?.then((featureLayerView) => {
            this.#layerView = featureLayerView;
            this.#layerList?.on("trigger-action", (event) => {
               this.listenForTriggerEvents(event);
            });

            if (node) {
               node.style.visibility = "visible";
               const nodesExpand = new Expand({
                  view: this.#mapview,
                  content: node,
                  expandIconClass: "esri-icon-filter",
                  group: "top-left",
               });

               nodesExpand.watch("expanded", () => {
                  if (!nodesExpand.expanded) {
                     this.#layerView.filter = null;
                     // if menu closes restet go back to defaul view
                     this.recenterMap([-100.33, 25.69]);
                     // remove highligh after side menu is close
                     this.#highlight.remove();
                     // remove graphic symbol from selected country
                     this.#layer?.removeAll();
                  }
               });
               this.#mapview?.ui.add(nodesExpand, "top-left");
            }
            const sketchExpand = new Expand({
               view: this.#mapview,
               content: this.#sketch,
               expandIconClass: "esri-icon-edit",
            });

            sketchExpand.watch("expanded", () => {
               if (!sketchExpand.expanded) {
                  this.#layerView.filter = null;
               }
            });

            this.#mapview?.ui.add(sketchExpand, "bottom-right");
         });

         const expandListLayer = new Expand({
            view: this.#mapview,
            content: this.#layerList,
            expandIconClass: "esri-icon-layers",
         });

         this.#mapview?.ui.add(expandListLayer, "top-right");
         store.dispatch(setMapLoaded(true));
         this.filterByCountry();
      });
   };

   getSketchUpdate = (geometry: any, fn: __esri.geometryEngine) => {
      return fn.union(geometry);
   };

   recenterMap = async (coor: any) => {
      this.#mapview?.goTo(
         { zoom: 5, target: coor },
         { animate: true, duration: 100 },
      );
   };

   updateView = () => {
      if (this.#layerView) {
         this.#layerView.filter = {
            geometry: this.#updateGemotries,
         };
      }
   };

   filterByCountry = async () => {
      if (this.#mapLayers) {
         const countries = await this.#mapLayers[0].queryFeatures({
            outFields: ["Country_Region", "OBJECTID"],
            where: "Country_Region IS NOT NULL ",
         });
         if (countries.features.length) {
            let allCountries: string[] = [];
            const removeInvalidCountries = countries.features.map(
               (country: any) => country.attributes,
            );

            for (let i = 0; i < removeInvalidCountries.length; i++) {
               const country = removeInvalidCountries[i].Country_Region;

               if (!allCountries.includes(country)) {
                  allCountries.push(country);
               }
            }
            store.dispatch(setCountries(allCountries));
         }
      }
   };

   filterByDeath = async (value: string) => {
      const layer = this.#map?.findLayerById(
         LayerIds.COVID_ID,
      ) as __esri.FeatureLayer;
      if (this.#layerView) {
         const query = new Query();

         query.where = "Country_Region = '" + value + "'";
         query.returnGeometry = true;
         this.#layerView.filter = {
            where: "Country_Region = '" + value + "'",
            outFields: ["Country_Region", "OBJECTID"],
         };
         const extend = await layer.queryExtent(query);
         const queryResult = await layer.queryFeatures(query);
         this.displayResults(queryResult);
         this.highlightState(query, layer);
         this.recenterMap(extend.extent);
      }
   };

   highlightState = (query: __esri.Query, layer: __esri.FeatureLayer) => {
      this.#mapview?.whenLayerView(layer).then((layerView) => {
         layer.queryObjectIds(query).then((res) => {
            if (this.#highlight) {
               this.#highlight.remove();
            }
            this.#highlight = layerView.highlight(res);
         });
      });
   };

   listItemCreatedFunction = (event: any) => {
      const item = event.item;
      // if(!this.#mapview) return;
      // console.log("wha is event? ", event);
      // console.log("how many layers? ", this.#map?.layers);

      if (item.title === "covid-tracker") {
         item.actionSections = [
            [
               {
                  title: "cases",
                  className: "esri-icon-up",
                  id: "confirmed",
               },
            ],
            [
               {
                  title: "cases cases country",
                  className: "esri-icon-up",
                  id: "confirmed",
               },
            ],
         ];
      }
   };

   listenForTriggerEvents = (event: any) => {
      if (!this.#casesLayer) return;
      console.log("what is event here ?? ", event);
      if (event.action.id === "cases") {
         this.#casesLayer.visible = !this.#casesLayer.visible;
      }
   };

   // draw diamond icon for selected country
   displayResults = (result: __esri.FeatureSet) => {
      this.#graphic = result.features.map((graphic: __esri.Graphic | any) => {
         graphic.symbol = {
            type: "simple-marker",
            style: "diamond",
            size: 50,
            color: "rgba(0,0,0,0.7)",
         };
         return graphic;
      });
      this.#layer?.addMany(this.#graphic);
      this.#map?.add(this.#layer);
   };

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
if (process.env.NODE_ENV === "development") {
   window.mapController = mapController;
}

export default mapController;
