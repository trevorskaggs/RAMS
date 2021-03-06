import React, { useEffect } from "react";
import ReactDOMServer from 'react-dom/server';
import L from "leaflet";
import { Map as LeafletMap, TileLayer, useLeaflet } from "react-leaflet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle, faExclamationCircle, faHome, faMapMarkerAlt, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle, faQuestionCircle as faQuestionCircleDuo } from '@fortawesome/pro-duotone-svg-icons';
import { faHomeAlt as faHomeAltReg } from '@fortawesome/pro-regular-svg-icons';
import { faHomeAlt, faDoNotEnter } from '@fortawesome/pro-solid-svg-icons';

export const Legend = (props) => {
  const { map } = useLeaflet();

  useEffect(() => {
    const legend = L.control.scale(props);
    legend.addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  return null;
};

const pinIconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon color="red" size="lg" className="icon-border" icon={faMapMarkerAlt} />);
export const pinMarkerIcon = new L.DivIcon({
  html: pinIconHTML,
  iconSize: [0, 0],
  iconAnchor: [9, 10],
  className: "pin-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const starIconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon color="gold" size="lg" className="icon-border" icon={faStar} />);
export const starMarkerIcon = new L.DivIcon({
  html: starIconHTML,
  iconSize: [0, 0],
  iconAnchor: [9, 10],
  className: "star-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const reportedIconHTML = ReactDOMServer.renderToString(
  <span className="fa-layers">
    <FontAwesomeIcon icon={faCircle} color="white" size="lg" />
    <FontAwesomeIcon icon={faExclamationCircle} className="icon-border" color="#ff4c4c" size="lg" />
  </span>
);
export const reportedMarkerIcon = new L.DivIcon({
  html: reportedIconHTML,
  iconSize: [0, 0],
  iconAnchor: [8, 9],
  className: "reported-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const SIPIconHTML = ReactDOMServer.renderToString(
  <span className="fa-layers">
    <FontAwesomeIcon icon={faCircle} className="icon-border" color="#f5ee0f" size="lg" transform={'grow-2'} />
    <FontAwesomeIcon icon={faHomeAlt} style={{color:"white"}} transform={'shrink-3 left-1'} size="lg" inverse />
    <FontAwesomeIcon icon={faHomeAltReg} style={{color:"#444"}} transform={'shrink-3 left-1'} size="lg" inverse />
  </span>
);
export const SIPMarkerIcon = new L.DivIcon({
  html: SIPIconHTML,
  iconSize: [0, 0],
  iconAnchor: [8, 9],
  className: "SIP-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const UTLIconHTML = ReactDOMServer.renderToString(
  <span className="fa-layers">
    <FontAwesomeIcon icon={faCircle} color="white" size="lg" />
    <FontAwesomeIcon icon={faQuestionCircleDuo} className="icon-border" size="lg" style={{"--fa-primary-color":'white', "--fa-secondary-color":'#5f5fff', "--fa-secondary-opacity": 1}}  />
  </span>
);
export const UTLMarkerIcon = new L.DivIcon({
  html: UTLIconHTML,
  iconSize: [0, 0],
  iconAnchor: [8, 9],
  className: "UTL-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const checkIconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faCheckCircle} className="icon-border" size="lg" style={{"--fa-primary-color":'white', "--fa-secondary-color":'green', "--fa-secondary-opacity": 1}} />);
export const checkMarkerIcon = new L.DivIcon({
  html: checkIconHTML,
  iconSize: [0, 0],
  iconAnchor: [8, 9],
  className: "check-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const shelterIconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faHome} className="icon-border" size="lg" color="#b18662" />);
export const shelterMarkerIcon = new L.DivIcon({
  html: shelterIconHTML,
  iconSize: [0, 0],
  iconAnchor: [8, 9],
  className: "shelter-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

const closedIconHTML = ReactDOMServer.renderToString(
  <span className="fa-layers">
    <FontAwesomeIcon icon={faCircle} color="white" size="lg" />
    <FontAwesomeIcon icon={faDoNotEnter} className="icon-border" size="lg" color="#af7051" />
  </span>
);
export const closedMarkerIcon = new L.DivIcon({
  html: closedIconHTML,
  iconSize: [0, 0],
  iconAnchor: [8, 9],
  className: "closed-icon",
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

// Counts the number of size/species matches for a service request by status.
export const countMatches = (service_request) => {
  var matches = {};
  var status_matches = {'REPORTED':{}, 'SHELTERED IN PLACE':{}, 'UNABLE TO LOCATE':{}};

  service_request.animals.forEach((animal) => {
    if (['REPORTED', 'SHELTERED IN PLACE', 'UNABLE TO LOCATE'].indexOf(animal.status) > -1) {
      if (!matches[[animal.species,animal.size]]) {
        matches[[animal.species,animal.size]] = 1;
      }
      else {
        matches[[animal.species,animal.size]] += 1;
      }
      if (!status_matches[animal.status][[animal.species,animal.size]]) {
        status_matches[animal.status][[animal.species,animal.size]] = 1;
      }
      else {
        status_matches[animal.status][[animal.species,animal.size]] += 1;
      }
    }
  });
  return [matches, status_matches]
}

// Takes in animal size, species, and count and returns a pretty string combination.
export const prettyText = (size, species, count) => {
  if (count <= 0) {
    return "";
  }
  let plural = ""
  if (count > 1) {
    plural = "s"
  }

  let size_and_species = size + " " + species + plural;
  // Exception for horses since they don't need an extra species output.
  if (species === 'horse') {
    // Exception for pluralizing ponies.
    if (size === 'pony' && count > 1) {
      size_and_species = 'ponies'
    }
    else if (size) {
      size_and_species = size + plural;
    }
  }

  let text = count + " " + size_and_species;
  return text;
}

const Map = (props) => {

  return (
    <>
    <LeafletMap className={props.className || "d-block"} bounds={props.bounds} boundsOptions={props.boundsOptions} zoomControl={props.zoomControl === false ? false : true} onMoveEnd={props.onMoveEnd}>
      <Legend position={props.legend_position || "bottomleft"} metric={false} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {props.children}
    </LeafletMap>
    </>
  );
};

export default Map;
