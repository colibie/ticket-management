/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  Modal, ModalBody, ModalHeader,
  InputGroup, InputGroupAddon, InputGroupText, Alert, FormGroup,
} from "shards-react";
import axios from "axios";
import SelectSearch from 'react-select-search';
import moment from 'moment';

import "../../assets/selectSearch.css";
import "../../assets/random.css";
import { useAuth } from "../../context/auth";
import { handlError } from "../../context/util";


const API = process.env.REACT_APP_API;

const AddTickets = ({ add, toggle, action }) => {
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(false);
  const [movie, setMovie] = useState(false);
  const [movies, setMovies] = useState(false);
  const [regularPrice, setRegularPrice] = useState(false);
  const [regularCapacity, setRegularCapacity] = useState(false);
  const [VIPPrice, setVIPPrice] = useState(false);
  const [VIPCapacity, setVIPCapacity] = useState(false);
  const [VVIPPrice, setVVIPPrice] = useState(false);
  const [VVIPCapacity, setVVIPCapacity] = useState(false);
  const [date, setDate] = useState(false);
  const [time, setTime] = useState(false);
  const [expiry, setExpiry] = useState(false);
  const { authTokens } = useAuth();

  function addCall(type, price, capacity) {
    if (!movie || movie.length < 12) throw new Error("movie is required");
    if (!date || !time) throw new Error("movie date/time is required");
    if (isNaN(price) || isNaN(capacity)) throw new Error("all prices/capacity must be numbers");
    return axios.post(`${API}/tickets`, {
      movie: movie,
      capacity,
      price,
      type,
      movieDate: date + "T" + time,
      expiry: moment(date + "T" + time).add(expiry, 'days')
    }, {
      headers: {
        authorization: `Bearer ${authTokens._token}`
      }
    });
  }

  async function addAction(e) {
    e.preventDefault();
    setAddSuccess(false);
    setAddError(false);
    const promises = [];
    if (regularPrice) promises.push(addCall('REGULAR', regularPrice, regularCapacity));
    if (VIPPrice) promises.push(addCall('VIP', VIPPrice, VIPCapacity));
    if (VVIPPrice) promises.push(addCall('VVIP', VVIPPrice, VVIPCapacity));

    Promise.all(promises)
      .then(() => {
        setAddSuccess(true);
        action();
      })
      .catch(error => setAddError(handlError(error)))
  }

  async function fetchMovies() {
    try {
      const res = await axios.get(`${API}/movies?_select=_id name`, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      const data = res.data.map(({ _id, name }) => ({ name, value: _id }));
      if (res.status === 200) {
        setMovies(data);
        setAddError(false);
      } else {
        setAddError(res.message);
      }
    } catch (error) {
      setAddError(handlError(error));
    }
  }

  useEffect(() => { fetchMovies() }, []);

  return (
    <Modal size="lg" open={add} toggle={toggle}>
      <ModalHeader>Add Tickets</ModalHeader>
      <ModalBody>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            {addError ? <Alert theme="danger">{addError}</Alert> :
              addSuccess && 
              <Alert theme="primary">{regularPrice && "regular, "}{VIPPrice && "VIP, "}{VVIPPrice && "VVIP "}
              ticket(s) added successfully!
              </Alert>}
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <label htmlFor="movie">Movie<span className="text-danger error-message">*</span></label>
                    <SelectSearch
                      id="ticketType"
                      options={movies}
                      search
                      placeholder="Search movie"
                      onChange={setMovie}
                      required={true}
                    />
                  </FormGroup>

                  <Row form>
                    <Col md="4" className="form-group">
                      <label htmlFor="">Regular</label>
                      <InputGroup className="mb-2">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>Capacity</InputGroupText>
                        </InputGroupAddon>
                        <FormInput id="feInputRegularCapacity" placeholder="xx" type="number" min="1" onChange={e => setRegularCapacity(e.target.value)} />
                      </InputGroup>

                      <InputGroup className="mb-2">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>Price</InputGroupText>
                        </InputGroupAddon>
                        <FormInput id="feInputRegularPrice" placeholder="xx"
                          type="number" min="1" step="any"
                          onChange={e => setRegularPrice(e.target.value)}
                          required={regularCapacity ? true : false} />
                      </InputGroup>
                      <span className="text-danger error-message">
                        {regularCapacity && (!regularPrice || isNaN(regularPrice)) ? "regular price is required" : ""}
                      </span>
                    </Col>

                    <Col md="4" className="form-group">
                      <label htmlFor="feInputVIPCapacity">VIP</label>
                      <InputGroup className="mb-2">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>Capacity</InputGroupText>
                        </InputGroupAddon>
                        <FormInput id="feInputVIPCapacity" placeholder="xx" type="number" min="1" onChange={e => setVIPCapacity(e.target.value)} />
                      </InputGroup>

                      <InputGroup className="mb-2">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>Price</InputGroupText>
                        </InputGroupAddon>
                        <FormInput id="feInputVIPPrice"
                          placeholder="xx" type="number"
                          min="1" step="any"
                          onChange={e => setVIPPrice(e.target.value)}
                          required={VIPCapacity ? true : false} />
                      </InputGroup>
                      <span className="text-danger error-message">
                        {VIPCapacity && (!VIPPrice || isNaN(VIPPrice)) ? "VIP price is required" : ""}
                      </span>
                    </Col>

                    <Col md="4" className="form-group">
                      <label htmlFor="feInputVVIPCapacity">VVIP</label>
                      <InputGroup className="mb-2">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>Capacity</InputGroupText>
                        </InputGroupAddon>
                        <FormInput id="feInputVVIPCapacity"
                          placeholder="xx"
                          type="number" min="1"
                          onChange={e => setVVIPCapacity(e.target.value)}
                        />
                      </InputGroup>

                      <InputGroup className="mb-2">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>Price</InputGroupText>
                        </InputGroupAddon>
                        <FormInput id="feInputVVIPPrice" placeholder="xx"
                          type="number" min="1" step="any"
                          onChange={e => setVVIPPrice(e.target.value)}
                          required={VVIPCapacity ? true : false} />
                      </InputGroup>
                      <span className="text-danger error-message">
                        {VVIPCapacity && (!VVIPPrice || isNaN(VVIPPrice)) ? "VVIP price is required" : ""}
                      </span>

                    </Col>
                  </Row>

                  <Row form>
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputTicketDateTime">Show Date<span className="text-danger error-message">*</span></label>
                      <FormInput id="feInputTicketDateTime" type="date" min={moment().format("YYYY-MM-DD")} onChange={e => setDate(e.target.value)} required />
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputTicketDateTime">Show Time<span className="text-danger">*</span></label>
                      <FormInput id="feInputTicketDateTime" type="time" onChange={e => setTime(e.target.value)} required />
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="expiry">Ticket is valid for _ day(s)?<span className="text-danger error-message">*</span></label>
                      <FormInput
                        id="expiry"
                        type="number"
                        min="1"
                        placeholder="number of valid days"
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                      />
                      <span className="text-danger error-message">
                        {expiry && isNaN(expiry) ? "expiry should be a number" : ""}
                      </span>
                    </Col>
                  </Row>
                  <Button 
                  type="submit" 
                  onClick={(e) => addAction(e)} 
                  disabled={!movie || !date || !time || !expiry || (!regularPrice && !VVIPPrice && !VIPPrice)}>Add Ticket</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}

export default AddTickets;
