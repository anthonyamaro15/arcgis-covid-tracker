import { useRef, useEffect } from 'react';
import MapController from '../controllers/MapController';
import ControlPanel from './controlPanel';

const MapView = () => {
   const mapViewEl = useRef(null);

   // load map
   useEffect(() => {
      MapController.initializeMap(mapViewEl);
   },[]);
   
   return (
      <div className="mapview-container">
         <div className="mapview" ref={mapViewEl}>
            <ControlPanel />
         </div>
      </div>
   );
};

export default MapView;
