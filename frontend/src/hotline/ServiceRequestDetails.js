import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'raviger';
import Moment from 'react-moment';
import { Button, Card, ListGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan, faCalendarDay, faCar, faClipboardList, faComment, faEdit, faHouseDamage, faKey, faPlusSquare, faTimes, faTrailer
} from '@fortawesome/free-solid-svg-icons';
import ReactImageFallback from 'react-image-fallback';
import Header from '../components/Header';
import History from '../components/History';
import noImageFound from '../static/images/image-not-found.png';
import Flatpickr from 'react-flatpickr';

function ServiceRequestDetails({id}) {

  const datetime = useRef(null);
  const openCalendar = () => {
    setTimeout(() => datetime.current.flatpickr.open(), 0);
  }

  const [showModal, setShowModal] = useState(false);
  const cancelServiceRequest = () => {
    axios.patch('/hotline/api/servicerequests/' + id + '/', {status:'canceled'})
    setData(prevState => ({ ...prevState, 'status':'Canceled', 'animals':prevState['animals'].map(animal => ({...animal, status:'CANCELED'}))}));
    setShowModal(false)
  }

  const clearDate = useCallback(() => {
    if (datetime.current) {
      datetime.current.flatpickr.clear();
      axios.patch('/hotline/api/servicerequests/' + id + '/', {followup_date:null})
      .catch(error => {
        console.log(error.response);
      });
    }
  }, [id, datetime]);

  const [data, setData] = useState({
    animals: [],
    owners: [],
    owner_objects: [],
    reporter: '',
    reporter_object: {first_name:'', last_name:''},
    directions: '',
    address: '',
    full_address: '',
    apartment: '',
    city: '',
    state: '',
    zip_code: '',
    verbal_permission: false,
    key_provided: false,
    accessible: false,
    turn_around: false,
    followup_date: null,
    assigned_evac: null,
    status:'',
    action_history: [],
    visit_notes: [],
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
        Service Request Details 
        <OverlayTrigger
          key={"edit-service-request"}
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-edit-service-request`}>
              Update service request
            </Tooltip>
          }
        >
          <Link href={"/hotline/servicerequest/edit/" + id}> <FontAwesomeIcon icon={faEdit} className="mb-1" inverse /></Link>
        </OverlayTrigger>
        <OverlayTrigger
          key={"cancel-service-request"}
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-cancel-service-request`}>
              Cancel service request
            </Tooltip>
          }
        >
          <FontAwesomeIcon icon={faBan} style={{cursor:'pointer'}} className="fa-move-up" inverse onClick={() => {setShowModal(true)}}/>
        </OverlayTrigger>
        &nbsp;| <span style={{textTransform:"capitalize"}}>{data.status} {data.status === 'assigned' ? <Link href={"/evac/summary/" + data.assigned_evac}><FontAwesomeIcon icon={faClipboardList} size="sm" inverse /></Link> : ""}</span>
      </Header>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancelation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this Service Request and associated animals?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => cancelServiceRequest(showModal)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <hr/>
      <div className="row mb-2">
        <div className="col-6 d-flex">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Information
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
                <ListGroup.Item style={{marginTop:"-13px"}}><b>Address: </b>{data.full_address}</ListGroup.Item>
                <ListGroup.Item>
                  <b>Followup Date: </b>
                  <FontAwesomeIcon icon={faCalendarDay} className="ml-1 mr-1" style={{cursor:'pointer'}} onClick={() => openCalendar()} />
                  {data.followup_date ?
                  <span>
                    <Moment format="ll">{data.followup_date}</Moment>
                    <FontAwesomeIcon icon={faTimes} className="ml-1" style={{cursor:'pointer'}} onClick={clearDate} />
                  </span>
                  : "Set date"}
                  <Flatpickr
                    ref={datetime}
                    name="followup_date"
                    id="followup_date"
                    options={{clickOpens:false, altInput:true, altInputClass:"hide-input", altFormat:"F j, Y h:i K"}}
                    onChange={(date, dateStr) => {
                      setData(prevState => ({ ...prevState, "followup_date":dateStr }));
                      axios.patch('/hotline/api/servicerequests/' + id + '/', {followup_date:date[0]})
                      .catch(error => {
                        console.log(error.response);
                      });
                    }}
                    value={data.followup_date || null}>
                  </Flatpickr>
                </ListGroup.Item>
                <ListGroup.Item style={{marginBottom:"-13px"}}><b>Directions:</b> {data.directions}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <div className="col-6 d-flex pl-0">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Contacts
                  <OverlayTrigger
                    key={"add-owner"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-add-owner`}>
                        Add owner
                      </Tooltip>
                    }
                  >
                    <Link href={"/people/owner/new?servicerequest_id=" + id}><FontAwesomeIcon icon={faPlusSquare} size="sm" className="ml-1" inverse /></Link>
                  </OverlayTrigger>
                </h4>
              </Card.Title>
              <hr/>
              <ListGroup variant="flush" style={{marginTop:"-13px", marginBottom:"-20px"}}>
                {data.owner_objects.map(owner => (
                  <ListGroup.Item key={owner.id}><b>Owner: </b>{owner.first_name} {owner.last_name}
                    <OverlayTrigger
                      key={"owner-details"}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-owner-details`}>
                          Owner details
                        </Tooltip>
                      }
                    >
                      <Link href={"/people/owner/" + owner.id}><FontAwesomeIcon icon={faClipboardList} size="sm" className="ml-1" inverse /></Link>
                    </OverlayTrigger>
                    &nbsp;| {owner.display_phone||owner.email||"No Contact"}
                  </ListGroup.Item>
                ))}
                {data.reporter ?
                <ListGroup.Item><b>Reporter: </b>{data.reporter_object.first_name} {data.reporter_object.last_name} {data.reporter_object.agency ? <span>({data.reporter_object.agency})</span> : "" }
                <OverlayTrigger
                  key={"reporter-details"}
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-reporter-details`}>
                      Reporter details
                    </Tooltip>
                  }
                >
                  <Link href={"/people/reporter/" + data.reporter}><FontAwesomeIcon icon={faClipboardList} size="sm" className="ml-1" inverse /></Link>
                </OverlayTrigger>
                </ListGroup.Item> : ""}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-12 d-flex">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Animals
                  <OverlayTrigger
                    key={"add-animal"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-add-animal`}>
                        Add animal
                      </Tooltip>
                    }
                  >
                    <Link href={"/animals/new?servicerequest_id=" + id}><FontAwesomeIcon icon={faPlusSquare} className="ml-1" inverse /></Link>
                  </OverlayTrigger>
                </h4>
              </Card.Title>
              <hr style={{marginBottom:"-2px"}} />
              <span className="d-flex flex-wrap align-items-end">
              {data.animals.map(animal => (
                <Card key={animal.id} className="mr-3 mt-3" style={{border:"none"}}>
                  <ReactImageFallback style={{width:"151px"}} src={animal.front_image} fallbackImage={[animal.side_image, noImageFound]} />
                  <Card.Text className="text-center mb-0">
                    {animal.name||"Unknown"}
                    <OverlayTrigger
                      key={"animal-details"}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-animal-details`}>
                          Animal details
                        </Tooltip>
                      }
                    >
                      <Link href={"/animals/" + animal.id}> <FontAwesomeIcon icon={faClipboardList} inverse /></Link>
                    </OverlayTrigger>
                  </Card.Text>
                  <Card.Text className="text-center mb-0">
                    {animal.status}
                  </Card.Text>
                  <Card.Text className="text-center" style={{textTransform:"capitalize"}}>
                    {animal.species === 'horse' ? <span>{animal.size}</span> : <span>{animal.size} {animal.species}</span>}
                  </Card.Text>
                </Card>
              ))}
              </span>
            </Card.Body>
          </Card>
        </div>
      </div>
      {data.visit_notes.length > 0 ?
      <div className="row mb-2">
        <div className="col-12 d-flex">
          <Card className="mb-2 border rounded" style={{width:"100%"}}>
            <Card.Body>
              <Card.Title>
                <h4 className="mb-0">Visit Log</h4>
              </Card.Title>
              <hr/>
              <ListGroup variant="flush" style={{marginTop:"-13px", marginBottom:"-13px"}}>
                {data.visit_notes.map(visit_note => (
                  <ListGroup.Item key={visit_note.id}>
                    <b>Dispatch Assignment:</b> #{visit_note.evac_assignment}
                    <OverlayTrigger
                      key={"dispatch-summary"}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-dispatch-summary`}>
                          Dispatch assignment summary
                        </Tooltip>
                      }
                    >
                      <Link href={"/evac/summary/" + visit_note.evac_assignment}><FontAwesomeIcon icon={faClipboardList} size="sm" className="ml-1" inverse /></Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      key={"edit-visit-note"}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-edit-visit-note`}>
                          Update visit note
                        </Tooltip>
                      }
                    >
                      <Link href={"/evac/assignment/note/" + visit_note.id}> <FontAwesomeIcon icon={faEdit} size="sm" inverse /></Link>
                    </OverlayTrigger>
                    <div className="mt-1"><b>Date Completed:</b> <Moment format="LL">{visit_note.date_completed}</Moment>
                      {visit_note.forced_entry ?
                        <OverlayTrigger
                          key={"forced"}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-forced`}>
                              Forced entry
                            </Tooltip>
                          }
                        >
                          <FontAwesomeIcon icon={faHouseDamage} size="sm" className="ml-1" style={{marginBottom:"1px"}} />
                        </OverlayTrigger> : ""}
                    </div>
                    <div className="mt-1 mb-0"><b>Outcome:</b> {visit_note.notes||"No information available."}</div>
                  </ListGroup.Item>
                ))}
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

export default ServiceRequestDetails;