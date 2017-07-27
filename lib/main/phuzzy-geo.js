
const L = require('leaflet');

const S_MODULE = 'phuzzy-geo';

const HHP_GEOMETRY_TYPS = {
	point: Symbol('point'),
	linestring: Symbol('linestring'),
	polygon: Symbol('polygon'),
	multipoint: Symbol('multipoint'),
	multilinestring: Symbol('multilinestring'),
	multipolygon: Symbol('multipolygon'),
};

const R_WKT = /^\s*(<[^>]+>)?\s*(\w+)\s*\(\s*(.+)\s*\)\s*$/;
function parse_wkt(s_wkt) {
	// match wkt
	let m_wkt = R_WKT.exec(s_wkt);

	// invalid
	if(!m_wkt) {
		return null;
	}

	// extract CRS
	let p_crs = m_wkt[1] || 'http://www.opengis.net/def/crs/OGC/1.3/CRS84';

	// geometry type
	let hp_geometry_type = HHP_GEOMETRY_TYPS[m_wkt[2].toLowerCase()];

	// bad wkt
	if(!hp_geometry_type) {
		return null;
	}

	// parse data
	let s_data = m_wkt[3];
	switch(hp_geometry_type) {
		case HHP_GEOMETRY_TYPS.point: {
			let [s_lng, s_lat] = s_data.split(/\s+/);
			return L.marker(L.latLng(+s_lat, +s_lng), {
				// ...
			});
		}

		default: {
			throw 'not yet implemented';
		}
	}
}


module.exports = function(h_settings, h_args) {

	// create a map
	let d_map = Object.assign(document.createElement('div'), {
		id: `${S_MODULE}_map`,
	});
	let y_map;
	let y_feature_group;
	let b_dom = false;

	let f_geo_wkt = (a_values, d_row) => {
		// each value
		a_values.forEach((h_literal) => {
			// parse well known text
			let y_feature = parse_wkt(h_literal.value);

			// valid feature
			if(y_feature) {
				// add to feature group
				y_feature_group.addLayer(y_feature);
			}
		});

		// fit map viewport to features
		if(y_feature_group.getLayers().length) {
			y_map.fitBounds(y_feature_group.getBounds().pad(1.125));

			// zoom out enough to see a city
			if(y_map.getZoom() > 11) {
				y_map.setZoom(11);
			}

			// full opacity
			d_map.style.opacity = '1';
		}
	};


	let h_plugin = {
		predicates: {},

		abstract(d_space) {
			if(!b_dom) {
				y_map = L.map(d_map, {
					layers: [
						// initialize tile layer
						L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
							maxZoom: 19,
							detectRetina: true,
						}),
					],
				});
				d_space.appendChild(d_map);

				b_dom = true;
			}

			y_map.invalidateSize();

			// make map semi-transparent until we load something
			d_map.style.display = 'block';
			d_map.style.opacity = '0.4';

			// remove feature group
			if(y_feature_group) {
				y_map.removeLayer(y_feature_group);
			}

			// reset feature group
			y_feature_group = L.featureGroup();
			y_feature_group.addTo(y_map);
		},

		resource() {
			// no geometry, hide map!
			if(!y_feature_group.getLayers().length) {
				d_map.style.display = 'none';
			}
		},
	};

	// wkt predicates
	if(h_args.wkt_predicates) {
		h_args.wkt_predicates.forEach((p_predicate) => {
			h_plugin.predicates[p_predicate] = f_geo_wkt;
		});
	}

	return h_plugin;
};
