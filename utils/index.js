import proj4 from "proj4";


export const LambertToMercator  = ( c ) => {
  const orig =  '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 ' +
  '+x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs';

  const result = proj4(orig,'GOOGLE',c);
  console.log(result);
  return result;
}
export const MercatorToLambert  = ( c ) => {
  console.log('transformFromMercator');
  const lambert =  '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 ' +
  '+x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs';

  const result = proj4('GOOGLE',lambert,c);
  console.log(result);
  return result;
}

const convertFeature = (feature, toMercator) => {
  const { type, id , properties, geometry_name } = feature;
  const geometry =  feature.geometry ? {
    "type": feature.geometry.type,
    "coordinates": feature.geometry.coordinates.map(
      (c)=> {
        console.log(`transforming ${c}`);
        const trans = toMercator ? LambertToMercator(c) : MercatorToLambert(c);
        console.log(trans);
        return trans;
      })
  } : null;
  return {
    type,
    id,
    geometry,
    geometry_name,
    properties,
  }
}

export const convertFeatureCollection = (featureCollection, toMercator = true) => {
  return {
    ...featureCollection,
    features: featureCollection.features.map((f)=>convertFeature(f, toMercator)),
  }
}

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
