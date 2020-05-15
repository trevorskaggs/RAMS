import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, navigate, useQueryParams } from 'raviger';
import { Field, Form, Formik } from "formik";
import { Button, Col, FormGroup, Label, Input, Option, Container, Row } from "reactstrap";
import * as Yup from 'yup';
import { DateTimePicker, DropDown, TextInput } from '.././components/Form.js';
import { catAgeChoices, dogAgeChoices, catColorChoices, dogColorChoices, speciesChoices, sexChoices, dogSizeChoices, catSizeChoices } from './constants'


const AnimalForm = ({id}) => {

  // Identify any query param data.
  const [queryParams] = useQueryParams();
  const {
    owner_id = '',
    servicerequest_id = '',
  } = queryParams;

  // Track species selected and update choice lists accordingly.
  const [species, setSpecies] = useState('');
  const selectRef = useRef(null);
  const ageChoices = {'':[], 'dog':dogAgeChoices, 'cat':catAgeChoices}
  const colorChoices = {'':[], 'dog':dogColorChoices, 'cat':catColorChoices}
  const sizeChoices = {'':[], 'dog':dogSizeChoices, 'cat':catSizeChoices}

  // Track whether or not to add another animal after saving.
  const [addAnother, setAddAnother] = useState(false);

  // Initial Animal data.
  const [data, setData] = useState({
    owner: owner_id,
    request: servicerequest_id,
    name: '',
    species: '',
    sex: '',
    size: '',
    age: '',
    pcolor: '',
    scolor: '',
    color_notes: '',
    behavior_notes: '',
    last_seen: null,
  });
  
  return (
    <>
      <Formik
        initialValues={data}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(50, 'Must be 50 characters or less.'),
          species: Yup.string(),
            // .oneOf(speciesChoices.map(x => x['value'])),
          size: Yup.string()
            .max(10, 'Must be 10 characters or less'),
          age: Yup.string(),
          sex: Yup.string()
            .oneOf(['M', 'F']),
          pcolor: Yup.string(),
          scolor: Yup.string(),
          color_notes: Yup.string()
            .max(200, 'Must be 200 characters or less'),
          behavior_notes: Yup.string()
            .max(200, 'Must be 200 characters or less'),
          last_seen: Yup.date()
            .nullable(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          // console.log(values);
          if (id) {
            axios.put('http://localhost:3000/animals/api/animal/' + id + '/', values)
            .then(function() {
              // If we have an SR ID, redirect to the SR.
              if (servicerequest_id) {
                navigate('/hotline/servicerequest/' + servicerequest_id);
              }
              // If we have an owner ID, redirect to the owner details.
              else if (owner_id) {
                navigate('/hotline/owner/' + owner_id);
              }
              else {
                navigate('/animals/animal/' + id);
              }
            })
            .catch(error => {
              console.log(error.response);
            });
          }
          else {
            axios.post('http://localhost:3000/animals/api/animal/', values)
            .then(response => {
              if (addAnother) {
                navigate('/animals/animal/new?servicerequest_id=' + servicerequest_id + '&owner=' + owner_id)
              }
              else {
                // If SR already exists, update it with animal info and redirect to the SR details.
                if (servicerequest_id) {
                  navigate('/hotline/servicerequest/' + servicerequest_id);
                }
                // If we have a owner ID, redirect to the owner details.
                else if (owner_id) {
                  navigate('/hotline/owner/' + owner_id);
                }
                // Else redirect to animal details.
                else {
                  navigate('/animals/animal/' + response.data.id);
                }
              }
            })
            .catch(error => {
              console.log(error.response);
            });
            setSubmitting(false);
          }
        }}
      >
        {props => (
          <Form>
            <Container>
              <Field type="hidden" value={owner_id||""} name="owner" id="owner"></Field>
              <Field type="hidden" value={servicerequest_id||""} name="request" id="request"></Field>
              <FormGroup>
                <Row>
                  <Col xs="10">
                    <TextInput
                      id="name"
                      name="name"
                      type="text"
                      label="Name"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="2">
                    <DropDown
                      label="Species"
                      id="speciesDropdown"
                      name="species"
                      type="text"
                      options={speciesChoices}
                      // value={props.values.species||''}
                      isClearable={false}
                      onChange={(instance) => {
                        selectRef.current.select.clearValue();
                        props.setFieldValue("species", instance.value);
                      }}
                    />
                  </Col>
                  <Col xs="2">
                    <DropDown
                      label="Sex"
                      id="sexDropDown"
                      name="sex"
                      type="text"
                      options={sexChoices}
                      value={props.values.sex||''}
                    />
                  </Col>
                  <Col xs="3">
                    <DropDown
                      label="Size"
                      id="sizeDropdown"
                      name="size"
                      type="text"
                      ref={selectRef}
                      options={sizeChoices[props.values.species]}
                      // value={props.values.size||''}
                    />
                  </Col>
                  <Col xs="3">
                    <DropDown
                      label="Age"
                      id="age"
                      name="age"
                      type="text"
                      ref={selectRef}
                      options={ageChoices[props.values.species]}
                      value={props.values.age||''}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="3">
                    <DropDown
                      label="Primary Color"
                      id="pcolor"
                      name="pcolor"
                      type="text"
                      ref={selectRef}
                      options={colorChoices[props.values.species]}
                      value={props.values.pcolor||''}
                    />
                    <DropDown
                      label="Secondary Color"
                      id="scolor"
                      name="scolor"
                      type="text"
                      ref={selectRef}
                      options={colorChoices[props.values.species]}
                      value={props.values.scolor||''}
                    />
                  </Col>
                  <Col xs="7">
                    <TextInput
                      id="color_notes"
                      name="color_notes"
                      type="textarea"
                      rows={5}
                      label="Description"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <TextInput
                      id="behavior_notes"
                      name="behavior_notes"
                      type="textarea"
                      rows={5}
                      label="Behavior Notes"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <DateTimePicker
                    label="Last Seen"
                    name="last_seen"
                    id="last_seen"
                    onChange={(date, dateStr) => {
                      props.setFieldValue("last_seen", dateStr)
                    }}
                    value={data.last_seen||null}
                  />
                </Row>
              </FormGroup>

              <Button type="submit" className="btn-success mr-1">Save</Button>
              <button type="button" className="btn btn-primary mr-1" onClick={() => {setAddAnother(true); props.submitForm()}}>Add Another</button>
              <Link className="btn btn-secondary" href={servicerequest_id ? "/hotline/servicerequest/" + servicerequest_id : "/"}>Cancel</Link>
            </Container>
          </Form>
        )}
      </Formik>
    </>
  );
};
  
  export default AnimalForm;
