import { trackerPopup } from "../helperFiles";

const color = {
   type: "color",
   field: "Deaths",
   legendOptions: {
      title: "Number of deaths representing by color",
   },
   stops: [
      { value: 10, color: "black", label: "> 100" },
      { value: 1000, color: "red", label: "> 1000" },
      { value: 2000, color: "purple", label: "> 2000" },
      // { value: 10000, color: "orange", label: "> 10000" },
      { value: 5000, color: "green", label: "> 5000" },
   ],
};

const size = {
   type: "size",
   field: "Deaths",
   // valueExpression: "$view.scale",

   legendOptions: {
      title: "Higher deaths represent a bigger symbol",
   },
   stops: [
      { value: 10, size: 4, label: "> 100" },
      { value: 1000, size: 8, label: "> 1000" },
      { value: 2000, size: 16, label: "> 2000" },
      // { value: 10000, size: 25, label: "> 10000" },
      { value: 5000, size: 20, label: "> 5000" },
   ],
   // minSize: "20px",
   // maxSize: "60px",
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
      // { value: 10000, opacity: 1 },
      { value: 5000, opacity: 0.9 },
   ],
};

export const renderer = {
   type: "simple",
   symbol: {
      type: "simple-marker",
      // style: "triangle",
      outline: {
         // type: "simple-line",
         width: 1,
         color: "rgba(0,0,0,0.5)",
         style: "short-dot",
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
