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
import "../../assets/random.css";
import { useAuth } from "../../context/auth";
import { handlError } from "../../context/util";
import { validateEmail, validatePhone } from "../../hooks/validator";

const API = process.env.REACT_APP_API;

const AddUser = ({ open, toggle, action }) => {
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(false);
  const [firstName, setFirstName] = useState(false);
  const [lastName, setLastName] = useState(false);
  const [email, setEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const { authTokens } = useAuth();

  async function addUser(e) {
    e.preventDefault();
    setAddSuccess(false);
    setAddError(false);
    try {
      if (emailError) throw new Error(emailError);
      if (firstName.length < 1) throw new Error("first name is required");
      if (phoneError) throw new Error(phoneError);

      const res = await axios.post(`${API}/customers`, {
        firstName, lastName, email, phone
      }, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      if (res.status === 200) {
        setAddSuccess(true);
        setAddError(false);
        action();
      } else {
        setAddError(res.message);
      }
    } catch (error) {
      setAddError(handlError(error));
    }
  }

  function handleEmailChange(value) {
    if (validateEmail(value)) {
      setEmailError(false);
      setEmail(value);
    } else {
      setEmailError("email is not valid");
      setEmail(false);
    }
  }

  function handlePhoneChange(value) {
    if (validatePhone(value)) {
      setPhoneError(false);
      setPhone(value);
    } else {
      setPhoneError("phone is not valid");
      setPhone(false);
    }
  }

  return (
    <Modal size="md" open={open} toggle={toggle}>
      <ModalHeader>Add User</ModalHeader>
      <ModalBody>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            {addError ? <Alert theme="danger">{addError}</Alert> :
              addSuccess && <Alert theme="primary">User added successfully!</Alert>}
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <label htmlFor="firstName">First Name<span className="text-danger error-message">*</span></label>
                    <FormInput
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="lastName">Last Name</label>
                    <FormInput
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormGroup>


                  <FormGroup>
                    <label htmlFor="feInputEmail">Email<span className="text-danger error-message">*</span></label>
                    <FormInput id="feInputEmail" placeholder="email" type="email"
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                    />
                    <span className="text-danger error-message">{emailError}</span>
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="feInputPhone">Phone Number</label>
                    <FormInput id="feInputPhone" placeholder="Phone Number" type="tel"
                      onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                    <span className="text-danger error-message">{phoneError}</span>
                  </FormGroup>

                  <Button type="submit" onClick={(e) => addUser(e)} disabled={!firstName || !email}>Create user</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}

export default AddUser;
