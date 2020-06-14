import React from "react";
import {
  Container,
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormCheckbox,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";

const CreateAdmin = () => (
  <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4 justify-content-between">
          <PageTitle sm="4" title="Create Admin" subtitle="Admin" className="text-sm-left" />
        </Row>
  <Card small>
  <ListGroup flush>
    <ListGroupItem className="p-3">
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
                />
              </Col>
              <Col md="6">
                <label htmlFor="feLastName">Last Name</label>
                <FormInput
                  id="feLastName"
                  type="text"
                  placeholder="Last Name"
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
                />
              </Col>
              <Col md="6">
                <label htmlFor="fePassword">Password</label>
                <FormInput
                  id="fePassword"
                  type="password"
                  placeholder="Password"
                />
              </Col>
            </Row>

            <Row form>
              <Col md="12" className="form-group">
                <FormCheckbox>
                  Give Super Admin Priviledges?
                </FormCheckbox>
              </Col>
            </Row>
            <Button type="submit">Create Admin</Button>
          </Form>
        </Col>
      </Row>
    </ListGroupItem>
  </ListGroup>
  </Card>
  </Container>
);

export default CreateAdmin;
