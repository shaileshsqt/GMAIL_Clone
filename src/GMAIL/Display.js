import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Table,
} from "react-bootstrap";
import "./GmailInbox.css";
import moment from "moment";
import { Link } from "react-router-dom";

const Display = ({ ThreadList, labels, errorMessage, getMessage }) => {
  const [first, setfirst] = useState([]);
  const [getData, setgetData] = useState([]);
  // const [errorMessage, setErrorMessage] = useState("");
  let result = [];

  useEffect(() => {
    getMessage.forEach((el1) => {
      console.log("el1 ::", el1);
      const fromvalue = el1.payload.headers.find(
        (item) => item.name === "From"
      );
      const fetchId = el1.id;
      const subjectvalue = el1.payload.headers.find(
        (item) => item.name === "Subject"
      );
      const datevalue = el1.payload.headers.find(
        (item) => item.name === "Date"
      );
      result.push({
        id: fetchId,
        from: fromvalue.value,
        subject: subjectvalue.value,
        date: datevalue.value,
      });
      setfirst([...first, result]);
    });
  }, [getMessage]);

  return (
    <>
      <Container fluid className="inbox-container">
        <Row>
          <Col sm={2} className="sidebar">
            <pre className="labels" style={{ whiteSpace: "pre-wrap" }}>
              {errorMessage || labels.map((label) => label.name).join("\n")}
            </pre>
          </Col>
          <Col sm={10} className="inbox">
            <ListGroup>
              <Table striped bordered hover>
                <thead>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
                </thead>
                <tbody>
                  {first !== undefined &&
                    first !== null &&
                    first.length &&
                    first.map((itm) => {
                      return (
                        <tr>
                          <Link
                            to={{
                              pathname: "/getBody/" + itm[0].id,
                            }}
                            state={{ some: "value" }}
                          >
                            <td>{itm[0].from}</td>{" "}
                          </Link>
                          <td>{itm[0].subject}</td>
                          {/* <td>{itm[0].date}</td> */}
                          <td>{moment(itm[0].date).format("DD-MM")}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>

              {/* Add more ListGroupItems for emails */}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Display;
