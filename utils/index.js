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