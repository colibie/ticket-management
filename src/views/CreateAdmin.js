import React, {useState} from "react";
import {
  Container,
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  Button,
  Alert
} from "shards-react";
import axios from 'axios';

import PageTitle from "../components/common/PageTitle";
import { validateEmail } from "../hooks/validator";
import { handlError } from "../context/util";
import { useAuth } from "../context/auth";

const API = process.env.REACT_APP_API;

const CreateAdmin = () => {
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(false);
  const [firstName, setFirstName] = useState(false);
  const [lastName, setLastName] = useState(false);
  const [email, setEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState(false);
  const { authTokens } = useAuth();

  async function addAdmin(e) {
    e.preventDefault();
    setAddSuccess(false);
    setAddError(false);
    try {
      if (emailError) throw new Error(emailError);
      if (password.length < 1) throw new Error("password is required");

      const res = await axios.post(`${API}/users`, {
        firstName, lastName, email, role: 'admin'
      }, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      if (res.status === 200) {
        setAddSuccess(true);
        setAddError(false);
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
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4 justify-content-between">
        <PageTitle sm="4" title="Create Admin" subtitle="Admin" className="text-sm-left" />
      </Row>
      <Card small>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            {addError ? <Alert theme="danger">{addError}</Alert> :
              addSuccess && <Alert theme="primary">Admin added successfully!</Alert>}
            <Row>
              <Col>
                <Form>
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">First Name</label>
                      <FormInput
                        id="feFirstName"
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Col>
                    <Col md="6">
                      <label htmlFor="feLastName">Last Name</label>
                      <FormInput
                        id="feLastName"
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="feEmailAddress">Email</label>
                      <FormInput
                        id="feEmailAddress"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => handleEmailChange(e.target.value)}
                      />
                      <span className="text-danger error-message">{emailError}</span>
                    </Col>
                    <Col md="6">
                      <label htmlFor="fePassword">Password</label>
                      <FormInput
                        id="fePassword"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Button type="submit" onClick={(e) => addAdmin(e)} disabled={!password || !email}>Create Admin</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </Container>
  )
};

export default CreateAdmin;
