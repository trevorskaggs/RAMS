import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'raviger';
import { Card, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList, faEdit, faPlusSquare, faWarehouse,
} from '@fortawesome/free-solid-svg-icons';
import ReactImageFallback from 'react-image-fallback';
import History from '../components/History';
import Header from '../components/Header';
import noImageFound from '../static/images/image-not-found.png';

function ShelterDetails({id}) {

  const [data, setData] = useState({
    name: '',
    address: '',
    full_address: '',
    city: '',
    state: '',
    zip_code: '',
    description: '',
    image: '',
    phone: '',
    display_phone: '',
    buildings: [],
    action_history: [],
    unroomed_animals: [],
    animal_count: 0,
    room_count: 0,
  });

  // Hook for initializing data.
  useEffect(() => {
    let source = axios.CancelToken.source();
    const fetchShelterData = async () => {
      // Fetch Shelter Details data.
      await axios.get('/shelter/api/shelter/' + id + '/', {
        cancelToken: source.token,
      })
      .then(response => {
        setData(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    };
    fetchShelterData();
  }, [id]);

  return (
    <>
      <Header>
        Shelter Details
        <OverlayTrigger
          key={"edit-shelter"}
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-edit-shelter`}>
              Update shelter
            </Tooltip>
          }
        >
          <Link href={"/shelter/edit/" + id}><FontAwesomeIcon icon={faEdit} className="ml-1" inverse /></Link>
        </OverlayTrigger>
      </Header>
      <hr/>
      <Card className="border rounded d-flex" style={{width:"100%"}}>
        <Card.Body>
          <Card.Title>
            <h4>Information</h4>
          </Card.Title>
          <hr/>
          <ListGroup variant="flush" style={{marginTop:"-13px", marginBottom:"-13px"}}>
            <ListGroup.Item>
              <b>Name:</b> {data.name}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Address:</b> {data.full_address}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Phone:</b> {data.display_phone || "No contact number listed"}
            </ListGroup.Item>
            {data.description ? <ListGroup.Item>
            <b>Description: </b>{data.description}
          </ListGroup.Item> : ""}
          </ListGroup>
        </Card.Body>
      </Card>
      <Card className="border rounded d-flex mt-3" >
        <Card.Body>
          <Card.Title className="">
            <h4 className="mb-0">Buildings
              <OverlayTrigger
                key={"add-building"}
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-add-building`}>
                    Add a building
                  </Tooltip>
                }
              >
                <Link href={"/shelter/building/new?shelter_id=" + id}><FontAwesomeIcon icon={faPlusSquare} className="ml-1" inverse /></Link>
              </OverlayTrigger>
            </h4>
          </Card.Title>
          <hr/>
          <span className="d-flex flex-wrap align-items-end">
            {data.buildings.map(building => (
              <Card key={building.id} className="border rounded mr-3" style={{width:"202px"}}>
                <Card.Title className="text-center mb-0 mt-3">
                  {building.name}
                  <OverlayTrigger
                    key={"building-details"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-building-details`}>
                        Building details
                      </Tooltip>
                    }
                  >
                    <Link href={"/shelter/building/" + building.id}><FontAwesomeIcon icon={faClipboardList} className="ml-1" inverse /></Link>
                  </OverlayTrigger>
                </Card.Title>
                <hr style={{marginBottom:"0px"}} />
                <span className="d-flex flex-wrap align-items-end">
                  {building.rooms.map(room => (
                    <Card key={room.id} className="border rounded" style={{width:"100px", height:"100px"}}>
                      <Card.Text className="text-center mb-0">
                        {room.name}
                        <OverlayTrigger
                          key={"room-details"}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-room-details`}>
                              Room details
                            </Tooltip>
                          }
                        >
                          <Link href={"/shelter/room/" + room.id}><FontAwesomeIcon icon={faClipboardList} className="ml-1" inverse /></Link>
                        </OverlayTrigger>
                      </Card.Text>
                      <Card.Text className="text-center mb-0">
                        {room.animals.length} Animals
                      </Card.Text>
                    </Card>
                  ))}
                  <OverlayTrigger
                    key={"add-room"}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-add-room`}>
                        Add a room
                      </Tooltip>
                    }
                  >
                    <Link href={"/shelter/building/room/new?building_id=" + building.id}> <FontAwesomeIcon icon={faPlusSquare} style={{width:"100px", height:"100px", verticalAlign:"middle"}} inverse /></Link>
                  </OverlayTrigger>
                </span>
              </Card>
            ))}
          </span>
        </Card.Body>
      </Card>
      <div className="row mt-3">
        <div className="col-12 d-flex">
          <Card className="border rounded" style={{width:"100%"}}>
            <Card.Body style={{marginBottom:"-15px"}}>
              <Card.Title>
                <h4 className="mb-0">Animals Needing Room ({data.unroomed_animals.length})
                <OverlayTrigger key={"assign"} placement="top" overlay={<Tooltip id={`tooltip-assign`}>Assign animals to rooms</Tooltip>}>
                  <Link href={"/shelter/" + id + "/assign"}><FontAwesomeIcon className="ml-1" icon={faWarehouse} inverse/></Link>
                </OverlayTrigger></h4>
              </Card.Title>
              <hr/>
              <span className="d-flex flex-wrap align-items-end">
              {data.unroomed_animals.map(animal => (
                <Card key={animal.id} className="border rounded mr-3 mb-3" style={{border:"none"}}>
                  <ReactImageFallback style={{width:"151px", height:"151px", objectFit: "cover", overflow: "hidden"}} src={animal.front_image} fallbackImage={[animal.side_image, noImageFound]} />
                  <Card.Text className="text-center mb-0" style={{textTransform:"capitalize"}}>
                  {animal.species === 'horse' ? animal.size : animal.species} - {animal.name||"Unknown"}
                    <OverlayTrigger
                      key={"animal-details"}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-animal-details`}>
                          Animal details
                        </Tooltip>
                      }
                    >
                      <Link href={"/animals/" + animal.id}><FontAwesomeIcon icon={faClipboardList} className="ml-1" inverse /></Link>
                    </OverlayTrigger>
                  </Card.Text>
                </Card>
              ))}
              {data.unroomed_animals.length < 1 ? <span className="mb-2">All animals are assigned rooms.</span> : ""}
              </span>
            </Card.Body>
          </Card>
        </div>
      </div>
      <History action_history={data.action_history} />
    </>
  );
};

export default ShelterDetails;
