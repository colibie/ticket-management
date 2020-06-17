import React from "react";
import { Container, Row, Col, Card, CardBody } from "shards-react";
import moment from 'moment';

import PageTitle from "../components/common/PageTitle";

const PrintPreview = () => {

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4 justify-content-between">
        <PageTitle sm="4" title="Preview" subtitle="Receipt" className="text-sm-left" />
      </Row>
      <Row>
        <Col md="4">
          <Card small className="mb-4">
            <CardBody className="pb-3 text-center">
              SHOWBOX filmhouse <br/>
              Contact: 07067461403 <br/>
              {moment().format("ddd, DD-MM-YYYY HH:MM a")} <br/>
              ************************** <br/>
              TICKET DETAILS <br/>
                           
              Owner: user.email <br/>
              Movie: movie.name <br/>
              Movie Date: ticket.movieDate <br/>
              Ticket Type: <strong>TICKET.TYPE</strong> <br/>
              Price: N ticket.price <br/>
              *************************** <br/>
              Thanks for your patronage <br/>
              Enjoy the movie!


            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PrintPreview;
