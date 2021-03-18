import { trackerPopup } from "../helperFiles";

export const layers = [
   {
      type: 'FeatureLayer',
      options: {
         url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/1",
         id: "covid-tracker",
         title: "covid tracker",
         visible: true,
         outFields: ["*"],
         popupTemplate: trackerPopup
      }
   }
];