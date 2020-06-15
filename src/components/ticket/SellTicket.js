import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  Modal, ModalBody, ModalHeader, Alert
} from "shards-react";
import axios from "axios";
import moment from 'moment';

import "../../assets/selectSearch.css";
import "../../assets/random.css";
import { useAuth } from "../../context/auth";
import { handlError } from "../../context/util";
import SelectSearch from "react-select-search";
import NumberFormat from "react-number-format";

const API = process.env.REACT_APP_API;

const SellTicket = ({ sell, toggle, data, action }) => {
  const [soldSuccess, setSoldSuccess] = useState(false);
  const [soldError, setSoldError] = useState(false);
  const [user, setUser] = useState(false);
  const [users, setUsers] = useState(false);
  const { authTokens } = useAuth();

  async function sellAction(e, ticket) {
    e.preventDefault();
    setSoldSuccess(false);
    setSoldError(false);
    try {
      if (!user || user.length !== 12) throw new Error("user is required");
      const res = await axios.put(`${API}/tickets/update/${ticket._id}`,
        {
          $push: { customers: user },
          $inc: { sold: 1 }
        }, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        },
      });

      if (res.status === 200) {
        setSoldSuccess(true);
        setSoldError(false);
        action();
      } else {
        setSoldError(res.message);
      }
    } catch (error) {
      setSoldError(handlError(error));
    }
  }

  async function fetchUsers() {
    try {
      const res = await axios.get(`${API}/customers?_select=_id email`, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      const data = res.data.map(({ _id, email }) => ({ name: email, value: _id }));
      if (res.status === 200) {
        setUsers(data);
        setSoldError(false);
      } else {
        setSoldError(res.message);
      }
    } catch (error) {
      setSoldError(handlError(error));
    }
  }

  useEffect(() => { fetchUsers() }, [])

  return (
    <Modal size="md" open={sell} toggle={toggle}>
      <ModalHeader>Sell Ticket</ModalHeader>
      <ModalBody>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            {soldError ? <Alert theme="danger">{soldError}</Alert> :
              soldSuccess && <Alert theme="primary">Ticket sold successfully!</Alert>}
            <Row>
              <Col>
                <Form>
                  <Row form>
                    <Col md="8" className="form-group">
                      <label htmlFor="movie">Movie</label>
                      <FormInput
                        id="movie"
                        type="text"
                        value={data.movie.name}
                        disabled={true}
                      />
                    </Col>
                    <Col md="4">
                      <label htmlFor="ticketType">Ticket Type</label>
                      <FormInput
                        id="ticketType"
                        type="text"
                        value={data.type}
                        disabled={true}
                      />
                    </Col>
                  </Row>

                  <Row form>
                    <Col md="8" className="form-group">
                      <label htmlFor="feInputMovieDate">Movie Date</label>
                      <FormInput id="feInputMovieDate" type="text" value={moment(data.movieDate).format("dddd, MMMM Do YYYY")} disabled={true} />
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputMovieTime">MovieTime</label>
                      <FormInput id="feInputMovieTime" type="text" value={moment(data.movieDate).format("hh:mm a")} disabled={true} />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="8" className="form-group">
                      <label htmlFor="feInputUser">Search user<span className="text-danger error-message">*</span></label>
                      <SelectSearch
                        id="ticketType"
                        options={users}
                        search
                        placeholder="Search user"
                        onChange={setUser}
                        required={true}
                      />
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputUser">Price</label>
                      <NumberFormat value={data.price} displayType={'text'} thousandSeparator={true} decimalSeparator={"."} decimalScale={2}
                      renderText={value => <FormInput id="feInputUser" value={value} disabled={true} /> }/>
                    </Col>
                  </Row>
                  <Button type="submit" onClick={(e) => sellAction(e, data)} disabled={!user}>Sell Ticket</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}

export default SellTicket;
