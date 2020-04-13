

export const getFilters = (featureCollection) => {
	const taxa = {};
	const status = {};
	const rarete = {};
	featureCollection.features.forEach((e) => {
		const taxon = e.properties['TAX_LA']
		if (taxon in taxa) {
			taxa[taxon] = taxa[taxon] + 1;
		} else {
			taxa[taxon] = 0;
		}
		const statusStr = `${e.properties['STATUS']}-${e.properties['LEGENDEFR']}-${e.properties['LEGENDENL']}`;
		if (statusStr in status) {
			status[statusStr] = status[statusStr] + 1;
		} else {
			status[statusStr] = 0;
		}
		const rareteStr = e.properties['RARETE'];
		if (rareteStr in rarete) {
			rarete[rareteStr] = rarete[rareteStr] + 1;
		} else {
			rarete[rareteStr] = 0;
		}
	})
	const taxaSorted = Object.keys(taxa).sort((a, b) => {
		if (a < b) {
			return -1;
		}
		if (a === b) {
			return 0;
		}
		return 1
	})
	return {
		taxaSorted,
		taxa,
		status,
		rarete
	}
}

export const getStyleForFeature = (feature) => {
	const Circle = require("ol/style").Circle;
	const RegularShape = require("ol/style").RegularShape;
	const Fill = require("ol/style").Fill;
	const Stroke = require("ol/style").Stroke;
	const Style = require("ol/style/Style").default; 
	
	const circonf = feature.get('CIRCONFERENCE');
    const status = feature.get('STATUS');
    const styleDisappeard =  new Style({
      image: new RegularShape({
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({color: 'black', width: 2}),
        points: 4,
        radius: 10,
        radius2: 0,
        angle: Math.PI / 4
      })
    });
  
    let treeColor = "yellow";
    if (circonf > 500){
      treeColor = "purple";
    } else if (circonf > 400){
      treeColor = "red";
    } else if (circonf > 300){
      treeColor = "orange";
    } else if (circonf > 200){
      treeColor = "green";
    };
    const style = new Style({
      image: new Circle({
        "radius": 8,
        "fill": new Fill({ color: treeColor }),
        "stroke": new Stroke({ color: "grey", width: 1 })
      })
    })
    if (status === '1' || status === '7'|| status === '9' || status === '13' || status === '15'){
      return [style,styleDisappeard]
    } else {
      return style
    }
}