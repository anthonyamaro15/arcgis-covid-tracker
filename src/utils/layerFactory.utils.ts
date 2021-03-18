import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';

const layerFactory = async (layer: any) => {
   let esriLayer = null;

   switch(layer.type) {
      case 'FeatureLayer':
         esriLayer = new FeatureLayer(layer.options);
         break;
      case 'ImageryLayer':
         esriLayer = new ImageryLayer(layer.options);
         break;
      case 'MapImageLayer':
         esriLayer = new MapImageLayer(layer.options);
         break;
      case 'VectorTileLayer':
         esriLayer = new VectorTileLayer(layer.options);
         break;
      default:
         console.log('no matches for ', layer);
   }
   return esriLayer;
}

export default layerFactory;
