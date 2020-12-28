import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'raviger';
import { Col, ListGroup, Row } from 'react-bootstrap'
import { Circle, CircleMarker, Map, TileLayer, Tooltip as MapTooltip, useLeaflet } from "react-leaflet";
import L from "leaflet";
import Moment from 'react-moment';
import shield from "../static/images/shield-alt-solid.png";
import bandaid from "../static/images/band-aid-solid.png";
import car from "../static/images/car-solid.png";
import trailer from "../static/images/trailer-solid.png";
import { ServiceRequestForm } from "./HotlineForms";
import { ServiceRequestTable } from "./HotlineTables"
import { ServiceRequestView } from "./HotlineViews";

const header_style = {
  textAlign: "center",
};

const Legend = (props) => {
  const { map } = useLeaflet();

  useEffect(() => {
    const legend = L.control.scale(props);
    legend.addTo(map);
  }, []);
  return null;
};

function Hotline() {

  const [data, setData] = useState({service_requests: [], isFetching: false, bounds:L.latLngBounds([[0,0]])});
  const [mapState, setMapState] = useState({});
  const [statusOptions, setStatusOptions] = useState({status:'open'});

  // Takes in animal size, species, and count and returns a pretty string combination.
  const prettyText = (size, species, count) => {
    if (count <= 0) {
      return "";
    }
    var plural = ""
    if (count > 1) {
      plural = "s"
    }

    var size_and_species = size + " " + species + plural;
    // Exception for horses since they don't need an extra species output.
    if (species === 'horse') {
      // Exception for pluralizing ponies.
      if (size === 'pony' && count > 1) {
        size_and_species = 'ponies'
      }
      else {
        size_and_species = size + plural;
      }
    }

    var text = count + " " + size_and_species;
    return text;
  }

  // Counts the number of size/species matches for a service request by status.
  const countMatches = (service_request) => {
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

  // Show or hide list of SRs based on current map zoom
  const onMove = event => {
    for (const service_request of data.service_requests) {
      if (mapState[service_request.id]) {
        if (!event.target.getBounds().contains(L.latLng(service_request.latitude, service_request.longitude))) {
          setMapState(prevState => ({ ...prevState, [service_request.id]: {...prevState[service_request.id], hidden:true} }));
        }
        else {
          setMapState(prevState => ({ ...prevState, [service_request.id]: {...prevState[service_request.id], hidden:false} }));
        }
      }
    }
  }

  // Hook for initializing data.
  useEffect(() => {
    let source = axios.CancelToken.source();

    const fetchServiceRequests = async () => {
      // Fetch ServiceRequest data.
      await axios.get('/hotline/api/servicerequests/', {
        params: {
          status: 'open',
          map: true
        },
        cancelToken: source.token,
      })
      .then(response => {
        setData({service_requests: response.data, isFetching: false, bounds:data.bounds});
        const map_dict = mapState;
        const bounds = [];
        for (const service_request of response.data) {
            const total_matches = countMatches(service_request);
            const matches = total_matches[0];
            let color = 'green';
            if  (service_request.status === 'assigned') {
              color = 'yellow';
            }
            else if (service_request.status === 'closed') {
              color = 'red';
            }
            map_dict[service_request.id] = {color:color, matches:matches, latitude:service_request.latitude, longitude:service_request.longitude};
          bounds.push([service_request.latitude, service_request.longitude]);
        }
        setMapState(map_dict);
        if (bounds.length > 0) {
          setData(prevState => ({ ...prevState, ["bounds"]:L.latLngBounds(bounds) }));
        }
      })
      .catch(error => {
        console.log(error.response);
        setData({service_requests: [], isFetching: false, bounds:L.latLngBounds([[0,0]])});
      });
    };

    fetchServiceRequests();

    // Cleanup.
    return () => {
      source.cancel();
    };
  }, [statusOptions]);

  return (
    <>
    <ListGroup className="p-5">
      <Link href="/hotline/owner/new">
      <ListGroup.Item action>OWNER CALLING</ListGroup.Item>
      </Link>
      <Link href="/hotline/reporter/new">
      <ListGroup.Item action>NON-OWNER CALLING</ListGroup.Item>
      </Link>
      <Link href="/hotline/first_responder/new">
      <ListGroup.Item action>FIRST RESPONDER CALLIING</ListGroup.Item>
      </Link>
      <Link href="/hotline/servicerequest/list">
      <ListGroup.Item action>SEARCH SERVICE REQUEST</ListGroup.Item>
      </Link>
    </ListGroup>
    <Row className="d-flex flex-wrap">
    <Col xs={10} className="border rounded pl-0 pr-0 m-auto">
      <Map className="d-block" style={{marginRight:"0px"}} bounds={data.bounds} onMoveEnd={onMove}>
        <Legend position="bottomleft" metric={false} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.service_requests.map(service_request => (
          <CircleMarker
            key={service_request.id}
            center={{lat:service_request.latitude, lng: service_request.longitude}}
            color="black"
            weight="1"
            fillColor={mapState[service_request.id] ? mapState[service_request.id].color : ""}
            fill={true}
            fillOpacity="1"
            // onClick={() => handleMapState(service_request.id)}
            radius={5}
          >
            <MapTooltip autoPan={false}>
              <span>
                {mapState[service_request.id] ?
                  <span>
                    {Object.keys(mapState[service_request.id].matches).map((key,i) => (
                      <span key={key} style={{textTransform:"capitalize"}}>
                        {i > 0 && ", "}{prettyText(key.split(',')[1], key.split(',')[0], mapState[service_request.id].matches[key])}
                      </span>
                    ))}
                  </span>
                :""}
                <br />
                {service_request.full_address}
                {service_request.followup_date ? <div>Followup Date: <Moment format="L">{service_request.followup_date}</Moment></div> : ""}
                <div>
                  {service_request.aco_required ? <img width={16} height={16} src={shield} alt="" className="mr-1" /> : ""}
                  {service_request.injured ? <img width={16} height={16} src={bandaid} alt="" className="mr-1" /> : ""}
                  {service_request.accessible ? <img width={16} height={16} src={car} alt="" className="mr-1" /> : ""}
                  {service_request.turn_around ? <img width={16} height={16} src={trailer} alt="" /> : ""}
                </div>
              </span>
            </MapTooltip>
          </CircleMarker>
        ))}
        {Object.entries(mapState).filter(([key, value]) => value.radius === "enabled").map(([key, value]) => (
          <Circle key={key} center={{lat:value.latitude, lng: value.longitude}} radius={805} interactive={false} />
        ))}
      </Map>
    </Col>
    </Row>
  </>
  )
}

export const ServiceRequestList = () => (
  <div>
    <h1 style={header_style}>Service Requests</h1>
    <br/>
    <ServiceRequestTable />
  </div>
)

export const NewServiceRequest = () => (
  <div>
    <h1 style={header_style}>Service Request Form</h1>
    <br/>
    <ServiceRequestForm />
  </div>
)

export const UpdateServiceRequest = ({id}) => (
  <div>
    <ServiceRequestForm id={id} />
  </div>
)

export const ServiceRequestDetail = ({id}) => (
  <div>
    <ServiceRequestView id={id} />
  </div>
)

export default Hotline
