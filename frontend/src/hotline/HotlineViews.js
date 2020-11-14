import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'raviger';
import Moment from 'react-moment';
import { Card, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay, faCar, faClipboardList, faComment, faEdit, faHouseDamage, faKey, faPlusSquare, faTimes, faTrailer
} from '@fortawesome/free-solid-svg-icons';
import ReactImageFallback from 'react-image-fallback';
import Header from '../components/Header';
import History from '../components/History';
import noImageFound from '../static/images/image-not-found.png';
import Flatpickr from 'react-flatpickr';

export function ServiceRequestView({id}) {

  const datetime = useRef(null);
  const openCalendar = () => {
    setTimeout(() => datetime.current.flatpickr.open(), 0);
  }
  const clearDate = useCallback(() => {
    if (datetime.current) {
      datetime.current.flatpickr.clear();
      axios.patch('/hotline/api/servicerequests/' + id + '/', {followup_date:null})
      .catch(error => {
        console.log(error.response);
      });
    }
  }, [datetime]);

  const [data, setData] = useState({
    animals: [],
    owner: '',
    owner_object: {first_name:'', last_name:''},
    reporter: '',
    reporter_object: {first_name:'', last_name:''},
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
    followup_date: null,
    status:'',
    action_history: [],
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
      <Header>
        Service Request #{data.id}<Link href={"/hotline/servicerequest/edit/" + id}> <FontAwesomeIcon icon={faEdit} inverse /></Link> | <span style={{textTransform:"capitalize"}}>{data.status}</span>
      </Header>
      <hr/>
      <div className="row mb-2">
        <div className="col-5 d-flex">
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
        <div className="col-4 d-flex pl-0">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body style={{}}>
              <Card.Title>
                <h4 className="mb-0">Owner <Link href={"/hotline/owner/" + data.owner}><FontAwesomeIcon icon={faClipboardList} size="sm" inverse /></Link><Link href={"/hotline/owner/edit/" + data.owner}> <FontAwesomeIcon icon={faEdit} size="sm" inverse /></Link></h4>
              </Card.Title>
              <hr/>
              <ListGroup variant="flush" style={{marginTop:"-13px", marginBottom:"-20px"}}>
                <ListGroup.Item><b>Name: </b>{data.owner_object.first_name} {data.owner_object.last_name}</ListGroup.Item>
                {data.owner_object.phone ? <ListGroup.Item><b>Telephone: </b>{data.owner_object.display_phone}</ListGroup.Item> : ""}
                {data.owner_object.email ? <ListGroup.Item><b>Email: </b>{data.owner_object.email}</ListGroup.Item> : ""}
                {data.reporter ? <ListGroup.Item><b>Reporter: </b>{data.reporter_object.first_name} {data.reporter_object.last_name} <Link href={"/hotline/reporter/" + data.reporter}><FontAwesomeIcon icon={faClipboardList} size="sm" inverse /></Link><Link href={"/hotline/reporter/edit/" + data.reporter}> <FontAwesomeIcon icon={faEdit} size="sm" inverse /></Link></ListGroup.Item> : ""}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <div className="col-3 d-flex pl-0">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body style={{marginBottom:"-17px"}}>
              <Card.Title>
                <h4 className="mb-0">Followup Date</h4>
              </Card.Title>
              <hr/>
              <FontAwesomeIcon icon={faCalendarDay} className="ml-1 mr-1" style={{cursor:'pointer'}} onClick={() => openCalendar()} />
              {data.followup_date ?
              <span>
                <Moment format="lll">{data.followup_date}</Moment>
                <FontAwesomeIcon icon={faTimes} className="ml-1" style={{cursor:'pointer'}} onClick={clearDate} />
              </span>
              : "Set date"}
              <Flatpickr
                ref={datetime}
                name="followup_date"
                id="followup_date"
                options={{clickOpens:false, altInput:true, altInputClass:"hide-input", altFormat:"F j, Y h:i K"}}
                onChange={(date, dateStr) => {
                  setData(prevState => ({ ...prevState, ["followup_date"]:dateStr }));
                  axios.patch('/hotline/api/servicerequests/' + id + '/', {followup_date:date[0]})
                  .catch(error => {
                    console.log(error.response);
                  });
                }}
                value={data.followup_date || null}>
              </Flatpickr>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-12 d-flex">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Animals<Link href={"/hotline/animal/new?servicerequest_id=" + id}> <FontAwesomeIcon icon={faPlusSquare} inverse /></Link></h4>
              </Card.Title>
              <hr/>
              <span className="d-flex flex-wrap align-items-end">
              {data.animals.map(animal => (
                <Card key={animal.id} className="mr-3" style={{border:"none"}}>
                  <ReactImageFallback style={{width:"151px"}} src={animal.front_image} fallbackImage={[animal.side_image, noImageFound]} />
                  <Card.Text className="text-center mb-0">
                    {animal.name||"Unknown"}
                    <Link href={"/animals/animal/" + animal.id}> <FontAwesomeIcon icon={faClipboardList} inverse /></Link>
                    <Link href={"/animals/animal/edit/" + animal.id}> <FontAwesomeIcon icon={faEdit} inverse /></Link>
                  </Card.Text>
                  <Card.Text className="text-center mb-0">
                    {animal.status}
                  </Card.Text>
                  <Card.Text className="text-center" style={{textTransform:"capitalize"}}>
                    {animal.size} {animal.species}
                  </Card.Text>
                </Card>
              ))}
              </span>
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
                  <div className="mt-1 mb-0"><b>Outcome:</b> {data.outcome||"Not available."}</div></ListGroup.Item> : ""}
                {data.owner_notification_tstamp || data.owner_notification_notes ? <ListGroup.Item>
                  <b>Owner Notified:</b> <Moment format="LLL">{data.owner_notification_tstamp}</Moment>
                  <div className="mt-1 mb-0"><b>Owner Notification Notes:</b> {data.owner_notification_notes||"Not available."}</div></ListGroup.Item> : ""}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
      : ""}
      <History action_history={data.action_history} />
    </>
  );
};
