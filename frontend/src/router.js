import React from "react";
import Home from "./Home";
import Animals, { AnimalDetail, NewAnimal, UpdateAnimal } from "./animals/Animals"
import { AnimalSearch } from "./animals/AnimalTables"
import Evac, { NewTeam, TeamList } from "./evac/Evac";
import Hotline, { NewOwner, NewReporter, NewServiceRequest, OwnerDetail, ReporterDetail, ServiceRequestDetail, ServiceRequestList, UpdateOwner, UpdateReporter, UpdateServiceRequest } from "./hotline/Hotline";
import Intake, { IntakeSummary } from "./intake/Intake";
import { NewOwner, NewReporter, OwnerDetail, ReporterDetail,  UpdateOwner, UpdateReporter } from "./people/People";
import Shelter, { NewShelter, UpdateShelter, ShelterList } from "./shelter/Shelter";
import { ShelterDetails} from "./shelter/ShelterTables";
import { NewBuilding, UpdateBuilding, BuildingDetails } from "./shelter/Building";
import { NewRoom, UpdateRoom, RoomDetails } from "./shelter/Room";
import { Login } from "./accounts/Accounts";
import { EvacTeamTable } from "./evac/EvacTables";
import { EvacTeamForm } from "./evac/EvacForms";

const routes = {
  "/": () => <Home />,
  "/animals": () => <Animals />,
  "/animals/animal/edit/:id": ({id}) => <UpdateAnimal id={id} />,
  "/animals/search": () => <AnimalSearch />,
  "/animals/animal/:id": ({id}) => <AnimalDetail id={id} />,
  "/evac": () => <Evac />,
  "/evac/evacteam/new": () => <EvacTeamForm />,
  "/evac/evacteam/list": () => <EvacTeamTable />,
  "/hotline": () => <Hotline />,
  "/hotline/animal/new": () => <NewAnimal />,
  "/hotline/first_responder/new": () => <NewReporter />,
  "/hotline/owner/edit/:id": ({id}) => <UpdateOwner id={id}/>,
  "/hotline/owner/new": () => <NewOwner />,
  "/hotline/owner/:id": ({id}) => <OwnerDetail id={id}/>,
  "/hotline/reporter/edit/:id": ({id}) => <UpdateReporter id={id}/>,
  "/hotline/reporter/new": () => <NewReporter />,
  "/hotline/reporter/:id": ({id}) => <ReporterDetail id={id}/>,
  "/hotline/servicerequest/edit/:id": ({id}) => <UpdateServiceRequest id={id}/>,
  "/hotline/servicerequest/list": () => <ServiceRequestList />,
  "/hotline/servicerequest/new": () => <NewServiceRequest />,
  "/hotline/servicerequest/:id": ({id}) => <ServiceRequestDetail id={id}/>,
  "/shelter": () => <Shelter />,
  "/shelter/new": () => <NewShelter />,
  "/shelter/edit/:sid": ({sid}) => <NewShelter sid={sid} />,
  "/shelter/list": () => <ShelterList />,
  "/shelter/:sid": ({sid}) => <ShelterDetails sid={sid} />,
  "/shelter/:sid/building/new": ({sid}) => <NewBuilding sid={sid} />,
  "/shelter/building/edit/:bid": ({bid}) => <UpdateBuilding bid={bid} />,
  "/shelter/building/:bid": ({bid}) => <BuildingDetails bid={bid} />,
  "/shelter/building/:bid/room/new": ({bid}) => <NewRoom bid={bid} />,
  "/shelter/room/edit/:rid": ({rid}) => <UpdateRoom rid={rid} />,
  "/shelter/room/:rid": ({rid}) => <RoomDetails rid={rid} />,
  "/intake": () => <Intake />,
  "/intake/animal/new": () => <NewAnimal />,
  "/intake/owner/new": () => <NewOwner />,
  "/intake/reporter/new": () => <NewReporter />,
  "/intake/summary": () => <IntakeSummary />,
  "/login": () => <Login />,
};

export default routes;
