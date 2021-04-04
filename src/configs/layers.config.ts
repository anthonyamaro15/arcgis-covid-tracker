import { trackerPopup } from "../helperFiles";

const color = {
   type: "color",
   field: "Deaths",
   legendOptions: {
      title: "number of death by color",
      showLegend: true,
   },
   stops: [
      { value: 10, color: "black", label: "test" },
      { value: 1000, color: "red", label: "test" },
      { value: 2000, color: "purple", label: "test" },
      { value: 5000, color: "black", label: "test" },
      { value: 10000, color: "green", label: "test" },
   ],
};

const size = {
   type: "size",
   field: "Deaths",
   valueExpression: "$feature.Deaths",
   legendOptions: {
      title: "number of deaths by size",
   },
   stops: [
      { value: 10, size: 9, label: "100" },
      { value: 1000, size: 8, label: "1000" },
      { value: 2000, size: 16, label: "2000" },
      { value: 5000, size: 20, label: "5000" },
      { value: 10000, size: 25, label: "10000" },
   ],
};

const renderer = {
   type: "simple",
   symbol: {
      type: "simple-marker",
      outline: {
         width: 1,
         color: "white",
      },
   },
   visualVariables: [color, size],
};

export const layers = [
   {
      type: "FeatureLayer",
      options: {
         url:
            "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/1",
         id: "covid-tracker",
         title: "covid tracker",
         visible: true,
         outFields: ["*"],
         popupTemplate: trackerPopup,
         renderer,
      },
   },
];
