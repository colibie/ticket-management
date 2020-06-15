/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Badge, Button, Alert } from "shards-react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import groupBy from "lodash/groupBy";
import NumberFormat from 'react-number-format';
import moment from 'moment';

import PageTitle from "../components/common/PageTitle";
import { useAuth } from "../context/auth";
import { handlError } from "../context/util";
import SellTicket from "../components/ticket/SellTicket";
import AddTickets from "../components/ticket/AddTickets";

const API = process.env.REACT_APP_API;

const SellTickets = () => {
  const [add, setAdd] = useState(false);
  const [sell, setSell] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tickets, setTickets] = useState(false);
  const [ticketData, setTicketData] = useState(false);
  const { authTokens } = useAuth();

  async function fetchTickets() {
    try {
      const res = await axios({
        url: `${API}/tickets`,
        params: { _populate: 'movie', movieDate: { $gte: new Date() } },
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      if (res.status === 200) {
        setTickets(res.data);
      } else {
        setIsError(res.message);
      }
    } catch (error) {
      setIsError(handlError(error));
    }
  }

  function handleSell(ticket) {
    setTicketData(ticket);
    setSell(!sell);
  }

  useEffect(() => { fetchTickets() }, []);

  function groupByMovie(listTicket) {
    const data = groupBy(listTicket, 'movie._id');
    return (
      map(data, (movieSet, key) => {
        let title;
        for (let el of movieSet) {
          title = el.movie.name;
          break;
        }
        const head = <span style={{ fontSize: "16px" }} className="d-block mb-2 text-muted">
          <strong>{title}</strong>
        </span>;
        const ticketSet = map(movieSet, (ticket, idx) => {
          const remaining = ticket.capacity - ticket.sold;
          let color = remaining < 6 ? 'warning' : 'dark';
          let text = remaining + " left";
          if (remaining === 0) {
            color = 'danger';
            text = 'sold out';
          }

          return (
            <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
              <Card small className="card-post card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${require("../images/content-management/6.jpeg")})` }}
                >
                  <Badge
                    pill
                    className={`card-post__category bg-${color}`}
                  >
                    {text}
                  </Badge>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a href="#" className="text-fiord-blue">
                      {ticket.type}
                    </a>
                  </h5>
                  <p className="card-text d-block mb-3">
                    N<NumberFormat value={ticket.price} displayType={'text'} thousandSeparator={true} decimalSeparator={"."} decimalScale={2} />
                  </p>
                  <Button size="sm" theme="secondary" className="mb-2 mr-auto" onClick={() => handleSell(ticket)}>
                    SELL TICKET
                  </Button>
                  {/* <span className="text-muted">{post.date}</span> */}
                </CardBody>
              </Card>
            </Col>
          )
        })
        return (
          <Col lg="12" key={key}>
            <Row noGutters className="page-header">{head}</Row>

            <Row>
              {ticketSet}
            </Row>
          </Col>
        )
      })
    )
  }

  function returnTickets() {
    if (tickets) {
      if (isEmpty(tickets)) return <Col lg="12"><Card><CardBody>Please create Ticket</CardBody></Card></Col>;
      let listTickets = map(tickets, data => {
        const setByTime = moment().calendar(data.movieDate, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'ddd, MMM Do YYYY'
        })
        data.setByTime = setByTime;
        return data;
      });
      // Group Ticket based on time
      listTickets = groupBy(listTickets, "setByTime");
      return (
        map(listTickets, (listTicket, key) => {
          const header = <PageTitle sm="4" subtitle={key} className="text-sm-left" />
          const body = groupByMovie(listTicket);
          return (
            <Col lg="12" key={key}>
              <Row>{header}</Row>
              <Row>{body}</Row>
            </Col>
          );
        })
      )
    } else {
      return <Col lg="12"><Card><CardBody>Loading tickets</CardBody></Card></Col>;
    }
  }
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4 justify-content-between">
        <PageTitle sm="4" title="Tickets" className="text-sm-left" />
        <Button size="md" theme="primary" className="" onClick={() => setAdd(!add)}>
          ADD TICKET
          </Button>
      </Row>
      {isError && <Alert theme="danger">{isError}</Alert>}

      {/* Group by date and then by movies */}
      <Row>{returnTickets()}</Row>

      {ticketData && <SellTicket sell={sell} toggle={() => setSell(!sell)} data={ticketData} action={() => fetchTickets()} />}

      <AddTickets add={add} toggle={() => setAdd(!add)} action={() => fetchTickets()} />
    </Container>
  );
}

export default SellTickets;
