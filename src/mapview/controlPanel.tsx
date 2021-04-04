import { useEffect, useState } from "react";
import mapController from "../controllers/MapController";

const ControlPanel = () => {
   const [filterBy, setFilterBy] = useState("");

   useEffect(() => {
      mapController.filterByDeath(filterBy);
   }, [filterBy]);
   return (
      <div id="dead-filter" className="esri-widget">
         <div
            className="testing visible-testing"
            onClick={() => setFilterBy("US")}
            data-count="US"
         >
            US
         </div>
         <div
            className="testing visible-testing"
            onClick={() => setFilterBy("Venezuela")}
            data-count="Venezuela"
         >
            Venezuela
         </div>
         <div
            className="testing visible-testing"
            onClick={() => setFilterBy("Zambia")}
            data-count="Zambia"
         >
            Zambia
         </div>
      </div>
   );
};

export default ControlPanel;
