import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import mapController from "../controllers/MapController";
import { countriesSelector } from "../redux/slices/mapSlice";

const ControlPanel = () => {
   const [filterBy, setFilterBy] = useState("");
   const countries = useSelector(countriesSelector);

   useEffect(() => {
      mapController.filterByDeath(filterBy);
   }, [filterBy]);

   return (
      <div id="dead-filter" className="esri-widget">
         {countries.length ? (
            <select
               name="countries"
               id="countries"
               onChange={(e) => setFilterBy(e.target.value)}
            >
               <option value="">Filter by Country</option>
               {countries.map((country, index) => (
                  <option value={country} key={index}>
                     {country}
                  </option>
               ))}
            </select>
         ) : (
            <h1>loading...</h1>
         )}
      </div>
   );
};

export default ControlPanel;
