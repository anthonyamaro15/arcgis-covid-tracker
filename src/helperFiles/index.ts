function getPopupData({ graphic }: __esri.Graphic | any) {
   const div = document.createElement("div");

   return (div.innerHTML = `
      <b>Country:</b> ${graphic.attributes.Country_Region ?? "N/A"}<br>
      <b>Last Update:</b> ${graphic.attributes.Last_Update ?? "N/A"}<br>
      <b>People tested:</b> ${graphic.attributes.People_Tested ?? "N/A"}<br>
      <b>Confirmed:</b> ${graphic.attributes.Confirmed ?? "N/A"}<br>
      <b>Recovered:</b> ${graphic.attributes.Recovered ?? "N/A"}<br>
      <b>Deaths:</b> ${graphic.attributes.Deaths ?? "N/A"}<br>
      <b>Active:</b> ${graphic.attributes.Active ?? "N/A"}<br>
      <b>Tested:</b> ${graphic.attributes.People_Tested ?? "N/A"}<br>
      <b>Stimate of people with Covid: </b> Around {expression/Deaths}% of population has got sick in {Province_State} <br>
   `);
}
const trackerPopup = {
   title: "State of: {Province_State}",
   expressionInfos: [
      {
         // simply create an expression by the name of the given name below to have access to it
         name: "Deaths",
         title: "with no virus",
         expression: "Round(($feature.Deaths / $feature.Confirmed) * 100)",
      },
   ],
   content: getPopupData,
};

const colorVisVar = {
   type: "color",
   field: "Deaths",
   stops: [
      { value: 30, color: "#FFFCD4", label: "30" },
      { value: 100, color: "#0D2644", label: "100" },
      { value: 500, color: "#1a1d20", label: "500" },
      { value: 1000, color: "#7fdf27", label: "1000" },
   ],
   legendOptions: {
      title: "Population per square",
   },
};

const renderer = {
   type: "simple",
   symbol: {
      type: "simple-marker",
      outline: {
         width: 1,
         color: [128, 128, 128],
      },
   },
   label: "test",
   visualVariables: [colorVisVar],
};

export { trackerPopup, renderer };
