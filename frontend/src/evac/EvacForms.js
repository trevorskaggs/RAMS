import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, navigate } from "raviger";
import { Form, Formik } from 'formik';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  FormGroup,
  Row,
  Container,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { DateTimePicker, TextInput, DropDown} from '.././components/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';


export const EvacTeamMemberForm = ({id}) => {

  // Track whether or not to add another evac team member after saving.
  const [addAnother, setAddAnother] = useState(false);
  // Regex validators.
  const phoneRegex = /^[0-9]{10}$/

    return (
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            phone: '',
            agency_id: '',
          }}
          validationSchema={Yup.object({
            first_name: Yup.string()
              .max(50, 'Must be 50 characters or less')
              .required('Required'),
            last_name: Yup.string()
              .max(50, 'Must be 50 characters or less')
              .required('Required'),
            phone: Yup.string()
              .matches(phoneRegex, "Phone number is not valid")
              .required('Required'),
            agency_id: Yup.string(),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              axios.post('/evac/api/evacteammember/', values)
              .then(function() {
                if (addAnother){
                  resetForm();
                }
                else{
                  navigate('/evac');
                }
              })
              .catch(error => {
                console.log(error.response);
              });
              setSubmitting(false);
            }, 500);
          }}
        >
        {form => (
          <Card border="secondary" className="mt-5">
            <Card.Header as="h5" className="pl-3"><span style={{cursor:'pointer'}} onClick={() => window.history.back()} className="mr-3"><FontAwesomeIcon icon={faArrowAltCircleLeft} size="lg" inverse /></span>{!id ? "New" : "Update"} Team Member</Card.Header>
            <Card.Body>
              <Form>
                  <FormGroup>
                    <Row>
                      <Col xs={{size: 5, offset: 1}}>
                        <TextInput
                          type="text"
                          label="First Name*"
                          name="first_name"
                          id="first_name"
                        />
                      </Col>
                      <Col xs="5">
                        <TextInput
                          type="text"
                          label="Last Name*"
                          name="last_name"
                          id="last_name"
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col xs={{size: 5, offset: 1}}>
                        <TextInput
                          type="text"
                          label="Phone*"
                          name="phone"
                          id="phone"
                        />
                      </Col>
                      <Col xs="5">
                        <TextInput
                          type="text"
                          label="Agency ID"
                          name="agency_id"
                          id="agency_id"
                        />
                      </Col>
                    </Row>
                  </FormGroup>
              </Form>
            </Card.Body>
            <ButtonGroup>
              <Button type="button" className="btn btn-primary mr-1" onClick={() => {setAddAnother(false); form.submitForm()}}>Save</Button>
              <Button type="button" className="btn btn-success mr-1" onClick={() => {setAddAnother(true); form.submitForm()}}>Add Another</Button>
              <Link className="btn btn-secondary" href="/evac">Cancel</Link>
            </ButtonGroup>
            </Card>
          )}
        </Formik>
    );
};

export const VisitNoteForm = ({id}) => {

    const [data, setData] = useState({
      date_completed: '',
      owner_contacted: false,
      notes: '',
      service_request: null,
      evac_assignment: null,
      address: '',
    })

    useEffect(() => {
      let source = axios.CancelToken.source();
      if (id) {
        const fetchVisitNote = async () => {
          // Fetch Visit Note data.
          await axios.get('/evac/api/visitnote/' + id + '/', {
            cancelToken: source.token,
          })
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.log(error.response);
          });
        };
      fetchVisitNote();
      };
      return () => {
        source.cancel();
      };
    }, [id]);

    return (
        <Formik
          initialValues={data}
          enableReinitialize={true}
          validationSchema={Yup.object({
            date_completed: Yup.date(),
            notes: Yup.string(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              axios.patch('/evac/api/visitnote/' + values.id + '/', values)
              .then(
                  navigate('/evac')
              )
              .catch(error => {
                console.log(error.response);
              });
            setSubmitting(false);
            }, 500);
          }}
        >
        {form => (
          <Card border="secondary" className="mt-5">
          <Card.Header as="h5" className="pl-3"><span style={{cursor:'pointer'}} onClick={() => window.history.back()} className="mr-3"><FontAwesomeIcon icon={faArrowAltCircleLeft} size="lg" inverse /></span>{!id ? "New" : "Update"} Visit Note - { form.values.address }</Card.Header>
          <Card.Body>
          <Form>
              <FormGroup>
                <Row>
                  <Col xs={{size: 2}}>
                  <DateTimePicker
                    label="Date Completed"
                    name="date_completed"
                    id="date_completed"
                    xs="7"
                    clearable={false}
                    onChange={(date, dateStr) => {
                      form.setFieldValue("date_completed", dateStr)
                    }}
                    value={form.values.date_completed||null}
                  />
                  </Col>
                </Row>
                <Row>
                  <Col xs={{size: 2}}>
                    <TextInput
                      as="textarea"
                      label="Notes"
                      name="notes"
                      id="notes"
                      xs="7"
                      rows={5}
                    />
                  </Col>
                </Row>
              </FormGroup>
          </Form>
          </Card.Body>
          <ButtonGroup>
            <Button type="button" className="btn btn-primary" onClick={() => {form.submitForm()}}>Save</Button>
          </ButtonGroup>
          </Card>
          )}
        </Formik>
    );
};

