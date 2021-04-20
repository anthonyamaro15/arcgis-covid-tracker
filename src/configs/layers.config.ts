import { trackerPopup } from "../helperFiles";

const color = {
   type: "color",
   field: "Confirmed",
   legendOptions: {
      title: "Cases Confirmed by color",
   },
   stops: [
      { value: 20000, color: "black", label: "> 100" },
      { value: 40000, color: "red", label: "> 1000" },
      { value: 60000, color: "purple", label: "> 2000" },
      { value: 100000, color: "green", label: "> 5000" },
      { value: 300000, color: "rgba(150,50,90,0.9)", label: "> 20000" },
   ],
};

const size = {
   type: "size",
   field: "Deaths",

   valueExpression: "($feature.Confirmed / $feature.Deaths) * 100",

   legendOptions: {
      title: "Higher deaths represent a bigger symbol",
   },
   stops: [
      { value: 10, size: 4, label: "> 100" },
      { value: 1000, size: 8, label: "> 1000" },
      { value: 2000, size: 16, label: "> 2000" },
      { value: 5000, size: 22, label: "> 5000" },
   ],
};

const opacity = {
   type: "opacity",
   field: "Deaths",
   legendOptions: {
      title: "Higher deaths have a higher opacity",
   },
   stops: [
      { value: 10, opacity: 0.25 },
      { value: 1000, opacity: 0.7 },
      { value: 2000, opacity: 0.8 },
      { value: 5000, opacity: 0.9 },
   ],
};

export const renderer = {
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

// confirmed - deaths
export const layers = [
   {
      type: "FeatureLayer",
      options: {
         url:
            "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/0",
         id: "covid-tracker",
         title: "covid tracker",
         visible: true,
         outFields: ["*"],
         popupTemplate: trackerPopup,
         renderer,
      },
   },
];
