const proj4 = require("proj4");


// proj4.defs("EPSG:31370", "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs");
// proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

const LambertToMercator = (c) => {
	const lambert = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs";

	console.log(c);
	// const result = proj4(new proj4.Proj('EPSG:31370'), 'WGS84', c);
	const result = proj4(new proj4.Proj(lambert), 'WGS84', c);
	console.log(result);
	return result;
}
const MercatorToLambert = (c) => {
	console.log('transformFromMercator');
	const lambert = '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 ' +
		'+x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs';

	console.log(c);
	const result = proj4(lambert, c);
	console.log(result);
	return result;
}

const MToM = (c) => {
	const lambert = '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 ' +
		'+x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs';

	console.log(c);
	const result = proj4('WGS84', 'WGS84', c);
	console.log(result);
	return result;
}

var lambert72toWGS84 = function (x, y) {

	var newLongitude, newLatitude;

	var n = 0.77164219,
		F = 1.81329763,
		thetaFudge = 0.00014204,
		e = 0.08199189,
		a = 6378388,
		xDiff = 149910,
		yDiff = 5400150,
		theta0 = 0.07604294;

	var xReal = xDiff - x,
		yReal = yDiff - y;

	var rho = Math.sqrt(xReal * xReal + yReal * yReal),
		theta = Math.atan(xReal / -yReal);

	newLongitude = (theta0 + (theta + thetaFudge) / n) * 180 / Math.PI;
	newLatitude = 0;

	for (var i = 0; i < 5; ++i) {
		newLatitude = (2 * Math.atan(Math.pow(F * a / rho, 1 / n) * Math.pow((1 + e * Math.sin(newLatitude)) / (1 - e * Math.sin(newLatitude)), e / 2))) - Math.PI / 2;
	}
	newLatitude *= 180 / Math.PI;
	// return [newLatitude, newLongitude];
	return [newLongitude, newLatitude];

}

const featureCollection = require('./data/geoserver_getfeature.json');
const getFilters = (featureCollection) => {
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
// filters=getFilters(featureCollection);
// console.log(filters['status']);

const lambert = [151877,169992];


const google = [489321.196879,6593338.630128]

const converted = LambertToMercator(lambert);
console.log(converted);
