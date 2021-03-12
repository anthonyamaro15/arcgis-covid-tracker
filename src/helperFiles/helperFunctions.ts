function filterByDeath(event: any, floodLayerView: any) {
   const selectedNode = event.target.getAttribute('data-count');
   floodLayerView.filter = {
      where: "Country_Region = '" + selectedNode + "'" 
   };
}

export {
   filterByDeath
}
