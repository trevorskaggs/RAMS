import React, { useEffect, useState } from 'react';
import axios from "axios";
import { navigate } from "raviger";
import { Field, Form, Formik, } from 'formik';
import { Label } from 'reactstrap';
import { Switch } from 'formik-material-ui';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  FormGroup,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowAltCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import { DateTimePicker, TextInput } from '../components/Form';

const VisitNoteForm = ({ id }) => {

  const [data, setData] = useState({
    date_completed: '',
    notes: '',
    service_request: null,
    evac_assignment: null,
    address: '',
    forced_entry: false,
  })

  useEffect(() => {
    let source = axios.CancelToken.source();
    if (id) {
      const fetchVisitNote = async () => {
        // Fetch Visit Note data.
        await axios.get('/hotline/api/visitnote/' + id + '/', {
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
          axios.patch('/hotline/api/visitnote/' + values.id + '/', values)
            .then(
              navigate('/hotline/servicerequest/' + values.service_request)
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
          <Card.Header as="h5" className="pl-3"><span style={{ cursor: 'pointer' }} onClick={() => window.history.back()} className="mr-3"><FontAwesomeIcon icon={faArrowAltCircleLeft} size="lg" inverse /></span>{!id ? "New" : "Update"} Visit Note - {form.values.address}</Card.Header>
          <Card.Body>
            <Form>
              <FormGroup>
                <Row>
                  <DateTimePicker
                    label="Date Completed"
                    name="date_completed"
                    id="date_completed"
                    xs="7"
                    clearable={false}
                    onChange={(date, dateStr) => {
                      form.setFieldValue("date_completed", dateStr)
                    }}
                    value={form.values.date_completed || null}
                  />
                </Row>
                <Row className="mt-3 pl-0">
                  <TextInput
                    as="textarea"
                    label="Notes"
                    name="notes"
                    id="notes"
                    xs="7"
                    rows={5}
                  />
                </Row>
                <Row>
                  <Col>
                    <Label htmlFor="forced_entry" className="mt-2">Forced Entry</Label>
                    <Field component={Switch} name="forced_entry" type="checkbox" color="primary" />
                  </Col>
                </Row>
              </FormGroup>
            </Form>
          </Card.Body>
          <ButtonGroup>
            <Button type="button" className="btn btn-primary" onClick={() => { form.submitForm() }}>Save</Button>
          </ButtonGroup>
        </Card>
      )}
    </Formik>
  );
};

export default VisitNoteForm;
