/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  Modal, ModalBody, ModalHeader,
  Alert, FormGroup,
} from "shards-react";
import axios from "axios";

import "../../assets/selectSearch.css";
import { useAuth } from "../../context/auth";
import { handlError } from "../../context/util";

const API = process.env.REACT_APP_API;

const AddMovie = ({ add, toggle, action }) => {
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(false);
  const [name, setName] = useState(false);
  const [description, setDescription] = useState(false);
  const { authTokens } = useAuth();

  async function addMovie(e) {
    e.preventDefault();
    setAddSuccess(false);
    setAddError(false);
    try {
      if (!name || name.length < 1) throw new Error("movie name is required")
      const res = await axios.post(`${API}/movies`, {
        name, description
      }, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      if (res.status === 200) {
        setAddSuccess(true);
        setAddError(false);
        setName(false);
        action();
      } else {
        setAddError(res.message);
      }
    } catch (error) {
      setAddError(handlError(error));
    }
  }

  return (
    <Modal size="md" open={add} toggle={toggle}>
      <ModalHeader>Add Movie</ModalHeader>
      <ModalBody>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            {addError ? <Alert theme="danger">{addError}</Alert> :
              addSuccess && <Alert theme="primary">Movie added successfully!</Alert>}
            <Row>
              <Col>
                <Form>
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="movie">Name<span className="text-danger error-message">*</span></label>
                      <FormInput
                        id="movie"
                        type="text"
                        placeholder="movie"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Col>
                  </Row>

                  <FormGroup>
                    <label htmlFor="feInputUser">Description</label>
                    <FormInput id="feInputUser" placeholder="add movie description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormGroup>

                  <Button type="submit" onClick={(e) => addMovie(e)} disabled={!name}>Create Movie</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}

export default AddMovie;
