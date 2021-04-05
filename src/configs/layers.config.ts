import { trackerPopup } from "../helperFiles";

const color = {
   type: "color",
   field: "Deaths",
   legendOptions: {
      title: "number of deaths representing by color",
      showLegend: true,
   },
   stops: [
      { value: 10, color: "black", label: "> Black" },
      { value: 1000, color: "red", label: "> Red" },
      { value: 2000, color: "purple", label: "> Purple" },
      { value: 10000, color: "orange", label: "> Orange" },
      { value: 5000, color: "green", label: "> Green" },
   ],
};

const size = {
   type: "size",
   field: "Deaths",
   legendOptions: {
      title: "Number of deaths by representing by size",
      showLegend: true,
   },
   stops: [
      { value: 10, size: 9, label: "> 100" },
      { value: 1000, size: 8, label: "> 1000" },
      { value: 2000, size: 16, label: "> 2000" },
      { value: 10000, size: 25, label: "> 10000" },
      { value: 5000, size: 20, label: "> 5000" },
   ],
};

const opacity = {
   type: "opacity",
   field: "Deaths",
   stops: [
      { value: 10, opacity: 0.15 },
      { value: 1000, opacity: 0.7 },
      { value: 2000, opacity: 0.8 },
      { value: 10000, opacity: 1 },
      { value: 5000, opacity: 0.9 },
   ],
};

const renderer = {
   type: "simple",
   symbol: {
      type: "simple-marker",
      outline: {
         width: 1,
         color: "rgba(0,0,0,0.5)",
      },
   },
   visualVariables: [color, size, opacity],
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
