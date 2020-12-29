import React from "react";
import { Redirect } from "raviger";
import Home from "./Home";
import Animals, { AnimalDetail, NewAnimal, UpdateAnimal } from "./animals/Animals"
import { AnimalSearch } from "./animals/AnimalTables"
import Evac, {EvacuationAssignmentSearch} from "./evac/Evac";
import Hotline, { NewServiceRequest, ServiceRequestDetail, ServiceRequestList, UpdateServiceRequest } from "./hotline/Hotline";
import Intake, { IntakeSummary, OwnerSearch } from "./intake/Intake";
import { NewOwner, NewOwnerContact, NewReporter, OwnerDetail, ReporterDetail,  UpdateOwner, UpdateOwnerContact, UpdateReporter } from "./people/People";
import Shelter, { NewShelter, UpdateShelter } from "./shelter/Shelter";
import { ShelterDetails } from "./shelter/ShelterDetails"
import { NewBuilding, UpdateBuilding, BuildingDetails } from "./shelter/Building";
import { NewRoom, UpdateRoom, RoomDetails } from "./shelter/Room";
import { Login } from "./accounts/Accounts";
import { Dispatch, EvacSummary } from "./evac/EvacViews";
import { EvacResolution, EvacTeamMemberForm, VisitNoteForm } from "./evac/EvacForms";

export const publicRoutes = {
  "/login": () => <Login />,
}

const routes = {
  "/": () => <Home />,
  "/animals": () => <Animals />,
  "/animals/animal/edit/:id": ({id}) => <UpdateAnimal id={id} />,
  "/animals/search": () => <AnimalSearch />,
  "/animals/animal/:id": ({id}) => <AnimalDetail id={id} />,
  "/evac": () => <Evac />,
  "/evac/evacteammember/new": () => <EvacTeamMemberForm />,
  "/evac/evacuationassignment/search": () => <EvacuationAssignmentSearch />,
  "/evac/summary/:id": ({id}) => <EvacSummary id={id} />,
  "/evac/resolution/:id": ({id}) => <EvacResolution id={id} />,
  "/evac/assignment/note/:id": ({id}) => <VisitNoteForm id={id} />,
  "/evac/deploy": () => <Dispatch />,
  "/hotline": () => <Hotline />,
  "/hotline/animal/new": () => <NewAnimal />,
  "/hotline/first_responder/new": () => <NewReporter />,
  "/hotline/owner/edit/:id": ({id}) => <UpdateOwner id={id}/>,
  "/hotline/owner/new": () => <NewOwner />,
  "/hotline/owner/:id": ({id}) => <OwnerDetail id={id}/>,
  "/hotline/ownercontact/new": () => <NewOwnerContact />,
  "/hotline/ownercontact/:id": ({id}) => <UpdateOwnerContact id={id}/>,
  "/hotline/reporter/edit/:id": ({id}) => <UpdateReporter id={id}/>,
  "/hotline/reporter/new": () => <NewReporter />,
  "/hotline/reporter/:id": ({id}) => <ReporterDetail id={id}/>,
  "/hotline/servicerequest/edit/:id": ({id}) => <UpdateServiceRequest id={id}/>,
  "/hotline/servicerequest/list": () => <ServiceRequestList />,
  "/hotline/servicerequest/new": () => <NewServiceRequest />,
  "/hotline/servicerequest/:id": ({id}) => <ServiceRequestDetail id={id}/>,
  "/shelter": () => <Shelter />,
  "/shelter/new": () => <NewShelter />,
  "/shelter/edit/:id": ({id}) => <UpdateShelter id={id} />,
  "/shelter/:id": ({id}) => <ShelterDetails id={id} />,
  "/shelter/building/new": () => <NewBuilding />,
  "/shelter/building/edit/:id": ({id}) => <UpdateBuilding id={id} />,
  "/shelter/building/:id": ({id}) => <BuildingDetails id={id} />,
  "/shelter/building/room/new": () => <NewRoom />,
  "/shelter/room/edit/:id": ({id}) => <UpdateRoom id={id} />,
  "/shelter/room/:id": ({id}) => <RoomDetails id={id} />,
  "/intake": () => <Intake />,
  "/intake/animal/new": () => <NewAnimal />,
  "/intake/owner/new": () => <NewOwner />,
  "/intake/owner/search": () => <OwnerSearch />,
  "/intake/reporter/new": () => <NewReporter />,
  "/intake/summary": () => <IntakeSummary />,
  "/login": () => <Redirect to='/' />
};

export default routes;
