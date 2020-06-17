import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Button, Alert } from "shards-react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

import PageTitle from "../components/common/PageTitle";
import AddUser from "../components/user/addUser";
import { useAuth } from "../context/auth";
import { handlError } from "../context/util";

const API = process.env.REACT_APP_API;

const Users = () => {
  const [users, setUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const { authTokens } = useAuth();

  async function fetchUsers() {
    try {
      const res = await axios.get(`${API}/customers`, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        setIsError(res.message);
      }
    } catch (error) {
      setIsError(handlError(error));
    }
  }
  useEffect(() => { fetchUsers() }, []);
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4 justify-content-between">
        <PageTitle sm="4" title="Users" subtitle="All Users" className="text-sm-left" />
        <Button size="md" theme="primary" className="" onClick={() => setOpen(!open)}>
          ADD USER
        </Button>
      </Row>
      {isError && <Alert theme="danger">{isError}</Alert>}

      {!users &&
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>Loading users...</CardBody>
            </Card>
          </Col>
        </Row>
      }

      {users && isEmpty(users) &&
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>No users added yet</CardBody>
            </Card>
          </Col>
        </Row>
      }

      {/* Default Light Table */}
      {users && !isEmpty(users) &&
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                  </th>
                      <th scope="col" className="border-0">
                        First Name
                  </th>
                      <th scope="col" className="border-0">
                        Last Name
                  </th>
                      <th scope="col" className="border-0">
                        Email
                  </th>
                      <th scope="col" className="border-0">
                        Phone
                  </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      }

      <AddUser open={open} toggle={() => setOpen(!open)} action={() => fetchUsers()} />

    </Container>
  );
}

export default Users;
