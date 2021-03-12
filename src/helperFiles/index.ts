const trackerPopup = {
   "title": "{Province_State}",
   'content': 
   `
      <b>Country:</b> {Country_Region}<br>
      <b>Last Update:</b> {Last_Update}<br>
      <b>Confirmed:</b> {Confirmed}<br>
      <b>Recovered:</b> {Recovered}<br>
      <b>Deaths:</b> {Deaths}<br>
      <b>Active:</b> {Active}<br>
      <b>Tested:</b> {People_Tested}<br>
   `
}


const colorVisVar = {
   type: "color",
   field: 'Deaths',
   stops: [
      { value: 30, color: '#FFFCD4', label: '30' },
      { value: 100, color: '#0D2644', label: '100' },
      { value: 500, color: '#1a1d20', label: '500' },
      { value: 1000, color: '#7fdf27', label: '1000' },

   ],
   legendOptions: {
      title: 'Population per square'
   }
}


const renderer = {
   type: "simple",
   symbol: {
      type: "simple-marker",
      // color: [ 255, 128, 0, 0.5 ],
      outline: {
         width: 1,
         color: [128, 128, 128],
      }
   },
   label: "test",
   visualVariables: [colorVisVar]
}

export {
   trackerPopup,
   renderer
}
