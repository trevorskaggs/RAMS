import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from 'raviger';
import Moment from 'react-moment';
import { Card, Fade, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBandAid, faCar, faClipboardList, faComment, faEdit, faHouseDamage, faKey, faPlusSquare, faShieldAlt, faTrailer
} from '@fortawesome/free-solid-svg-icons';

const btn_style = {
  width: "50%",
  margin: "0 auto",
};

const link_style = {
  textDecoration: "none",
};

export function ServiceRequestView({id}) {

  const [data, setData] = useState({
    owner: '',
    reporter: '',
    directions: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip_code: '',
    verbal_permission: false,
    key_provided: false,
    accessible: false,
    turn_around: false,
    forced_entry: false,
    outcome: '',
    owner_notification_notes: '',
    recovery_time: null,
    owner_notification_tstamp: null,
    status:'',
  });

  // Hook for initializing data.
  useEffect(() => {
    let source = axios.CancelToken.source();
    const fetchServiceRequestData = async () => {
      // Fetch ServiceRequest data.
      await axios.get('/hotline/api/servicerequests/' + id + '/', {
        cancelToken: source.token,
      })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error.response);
      });
    };
    fetchServiceRequestData();
  }, [id]);

  return (
    <>
      <div className="row mt-4 mb-3">
        <div className="col-12 d-flex">
              <div className=""><h1>Request #{data.id}<Link href={"/hotline/servicerequest/edit/" + id}> <FontAwesomeIcon icon={faEdit} inverse /></Link> | <span style={{textTransform:"capitalize"}}>{data.status}</span></h1></div>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-6 d-flex">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Location
                  {data.verbal_permission ?
                  <OverlayTrigger
                    key={"verbal"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-verbal`}>
                        Verbal permission granted
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faComment} size="sm" className="ml-1" />
                  </OverlayTrigger> : ""}
                  {data.key_provided ?
                  <OverlayTrigger
                    key={"key"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-key`}>
                        Key provided
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faKey} size="sm" className="ml-1" />
                  </OverlayTrigger> : ""}
                  {data.accessible ?
                  <OverlayTrigger
                    key={"accessible"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-accessible`}>
                        Easily accessible
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faCar} size="sm" className="ml-1" />
                  </OverlayTrigger> : ""}
                  {data.turn_around ?
                  <OverlayTrigger
                    key={"turnaround"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-turnaround`}>
                        Room to turn around
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faTrailer} size="sm" className="ml-1" />
                  </OverlayTrigger> : ""}
                </h4>
              </Card.Title>
              <hr/>
              <ListGroup variant="flush">
                <ListGroup.Item style={{marginTop:"-13px"}}><b>Address:</b> {data.address ? <span>{data.full_address}</span> : 'N/A'}</ListGroup.Item>
                <ListGroup.Item style={{marginBottom:"-13px"}}><b>Directions:</b> {data.directions}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <div className="col-6 d-flex pl-0">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body style={{marginBottom:"-17px"}}>
              {data.owner ?
              <span>
                <Card.Title>
                  <h4 className="mb-0">Owner: <span style={{fontSize:18}}>{data.owner_object.first_name} {data.owner_object.last_name} {data.owner_object.first_name !== 'Unknown' ? <Link href={"/hotline/owner/" + data.owner}> <FontAwesomeIcon icon={faClipboardList} size="sm" inverse /></Link>:""}<Link href={"/hotline/owner/edit/" + data.owner}> <FontAwesomeIcon icon={faEdit} size="sm" inverse /></Link>
                    </span></h4>
                </Card.Title>
                <ListGroup variant="flush" style={{marginTop:"-13px", marginBottom:"-13px"}}>
                  {data.owner_object.phone ? <ListGroup.Item><b>Telephone: </b>{data.owner_object.phone}</ListGroup.Item> : ""}
                  {data.owner_object.email ? <ListGroup.Item><b>Email: </b>{data.owner_object.email}</ListGroup.Item> : ""}
                </ListGroup>
              </span> : ""}
              {data.reporter ?
              <span>
                <hr/>
                <Card.Title>
                  <h4 className="mb-0">Reporter: {data.reporter_object.first_name} {data.reporter_object.last_name} <Link href={"/hotline/reporter/" + data.reporter}> <FontAwesomeIcon icon={faClipboardList} size="sm" inverse /></Link><Link href={"/hotline/reporter/edit/" + data.reporter}> <FontAwesomeIcon icon={faEdit} size="sm" inverse /></Link>
                  </h4>
                </Card.Title>
                <ListGroup variant="flush" style={{marginTop:"-13px"}}>
                  {data.reporter_object.phone ? <ListGroup.Item><b>Telephone: </b>{data.reporter_object.phone}</ListGroup.Item> : ""}
                  {data.reporter_object.email ? <ListGroup.Item><b>Email: </b>{data.reporter_object.email}</ListGroup.Item> : ""}
                </ListGroup>
              </span>
              : ""}
            </Card.Body>
          </Card>
        </div>
      </div>
      {data.outcome || data.owner_notification_notes ?
      <div className="row mb-2">
        <div className="col-12 d-flex">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Outcome
                  {data.forced_entry ?
                  <OverlayTrigger
                    key={"forced"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-forced`}>
                        Forced entry
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faHouseDamage} size="sm" className="ml-1" />
                  </OverlayTrigger> : ""}
                </h4>
              </Card.Title>
              <hr/>
              <ListGroup variant="flush" style={{marginTop:"-13px", marginBottom:"-13px"}}>
                {data.recovery_time || data.outcome ? <ListGroup.Item>
                  <b>Recovery Time:</b> <Moment format="LLL">{data.recovery_time||""}</Moment>
                  <p className="mt-1 mb-0"><b>Outcome:</b> {data.outcome||"Not available."}</p></ListGroup.Item> : ""}
                {data.owner_notification_tstamp || data.owner_notification_notes ? <ListGroup.Item>
                  <b>Owner Notified:</b> <Moment format="LLL">{data.owner_notification_tstamp}</Moment>
                  <p className="mt-1 mb-0"><b>Owner Notification Notes:</b> {data.owner_notification_notes||"Not available."}</p></ListGroup.Item> : ""}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
      : ""}
      {data.animals && data.animals.length ?
      <div className="card card-body bg-light mx-auto">
        <p><b>Animals:</b> <Link href={"/hotline/animal/new?servicerequest_id=" + id}> <FontAwesomeIcon icon={faPlusSquare} inverse /></Link></p>
         <span>
          {data.animals.map(animal => (
            <li key={animal.id}>{animal.name} (<span style={{textTransform:"capitalize"}}>{animal.species}</span>) - {animal.status}
              <Link href={"/animals/animal/" + animal.id}> <FontAwesomeIcon icon={faClipboardList} inverse /></Link>
              <Link href={"/animals/animal/edit/" + animal.id}> <FontAwesomeIcon icon={faEdit} inverse /></Link>
            </li>
          ))}
        </span>
      </div> : ""}
      <hr/>
      <div style={btn_style}>
        <Link href={"/hotline/animal/new?servicerequest_id=" + id} style={link_style} className="btn btn-success btn-lg btn-block mb-2">ADD ANIMAL</Link>
        <br/>
        <Link href={"/hotline/servicerequest/edit/" + id} style={link_style} className="btn btn-primary btn-lg btn-block mb-2">UPDATE REQUEST</Link>
        <br/>
        <br/>
        <Link className="btn btn-secondary btn-lg btn-block"  href="/hotline">BACK</Link>
      </div>
    </>
  );
};
