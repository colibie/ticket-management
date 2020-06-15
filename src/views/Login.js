import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardHeader, Alert
} from "shards-react";

import "../assets/random.css";
import { useAuth } from "../context/auth";
import { validateEmail } from "../hooks/validator";
import { handlError } from "../context/util";

const API = process.env.REACT_APP_API;

const Login = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const { setAuthTokens } = useAuth();

  async function postLogin(e) {
    e.preventDefault();
    setIsError(false);
    try {
      if (emailError) throw new Error(emailError);
      const res = await axios.post(`${API}/login`, { email, password });
      if (res.status === 200) {
        setAuthTokens(res.data);
        setLoggedIn(true);
      } else {
        setIsError(res.message);
      }
    } catch (error) {
      setIsError(handlError(error));
    }
  }

  function handleChange(value) {
    if (validateEmail(value)) {
      setEmailError(false);
      setEmail(value);
    } else {
      setEmailError("email is not valid");
    }
  }

  if (isLoggedIn) {
    return <Redirect to="/sell-tickets" />;
  }

  return (
    <Container className="main-content-container px-4 mx-10" style={{ width: "45%", marginTop: "7%" }}>
      <Card style={{ maxWidth: "400px", minWidth: "300px" }}>
        <CardHeader className="border-bottom">
          <h6 className="m-0">Login</h6>
        </CardHeader>

        <ListGroup flush>
          <ListGroupItem className="p-3">
            {isError && <Alert theme="danger">{isError}</Alert>}
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <label htmlFor="feEmailAddress">Email</label>
                    <FormInput
                      id="feEmailAddress"
                      type="email"
                      placeholder="Email"
                      onChange={e => handleChange(e.target.value)}
                    />
                    <span className="text-danger error-message">{emailError}</span>
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="fePassword">Password</label>
                    <FormInput
                      id="fePassword"
                      type="password"
                      placeholder="Password"
                      onChange={e => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <Button type="submit" onClick={(e) => postLogin(e)}>Login</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </Container>
  );
}

export default Login;
