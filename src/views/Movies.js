/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Button, Alert } from "shards-react";
import moment from "moment";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

import PageTitle from "../components/common/PageTitle";
import AddMovie from "../components/movie/addMovie";
import { handlError } from "../context/util";
import { useAuth } from "../context/auth";

const API = process.env.REACT_APP_API;

const Movies = () => {
  const [open, setOpen] = useState(false);
  const [movies, setMovies] = useState(false);
  const [isError, setIsError] = useState(false);
  const { authTokens } = useAuth();

  async function fetchMovies() {
    try {
      const res = await axios.get(`${API}/movies`, {
        headers: {
          authorization: `Bearer ${authTokens._token}`
        }
      });
      if (res.status === 200) {
        setMovies(res.data);
      } else {
        setIsError(res.message);
      }
    } catch (error) {
      setIsError(handlError(error));
    }
  }
  useEffect(() => { fetchMovies() }, []);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4 justify-content-between">
        <PageTitle sm="4" title="Movies" subtitle="All Movies" className="text-sm-left" />
        <Button size="md" theme="primary" className="" onClick={() => setOpen(!open)}>
          ADD MOVIE
        </Button>
      </Row>
      {isError && <Alert theme="danger">{isError}</Alert>}

      {/* group by creation date */}
      {movies && !isEmpty(movies) &&
        <Row>
          {movies.map((movie, idx) => (
            <Col lg="6" sm="12" className="mb-4" key={idx}>
              <Card small className="card-post card-post--aside card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url('${require("../images/content-management/15.jpeg")}')` }}
                >
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a className="text-fiord-blue" href="#">
                      {movie.name}
                    </a>
                  </h5>
                  <p className="card-text d-inline-block mb-3">{movie.description !== "false" ? movie.description : "No description"}</p> <br/>
                  <span className="text-muted">{moment(movie.creationDate).format("dddd, MMMM Do YYYY")}</span>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      }

      {movies && isEmpty(movies) &&
        <Card>
          <CardBody>Create Movie</CardBody>
        </Card>
      }

      <AddMovie add={open} toggle={() => setOpen(!open)} action={() => fetchMovies()} />

    </Container>
  );
}

export default Movies;
