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

const Display = () => {
  const [Data, setData] = useState([]);
  const [getData, setgetData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [Threds, setThreds] = useState([]);
  const [getMessage, setgetmessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [labelId, setLabelId] = useState("");

  let result = [];

  useEffect(() => {
    getMessage.forEach((el1) => {
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
      setData([...Data, result]);
    });
  }, [getMessage]);

  const listLabels = async () => {
    try {
      const response = await window.gapi.client.gmail.users.labels.list({
        userId: "me",
      });
      const labels = response.result.labels || [];

      setLabels(labels);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  const listThreads = async () => {
    try {
      const response = await window.gapi.client.gmail.users.threads.list({
        userId: "me",
        labelIds: labelId === "" ? "INBOX" : labelId,
      });

      await getmessageArray(response.result.threads);
      const threads = response.result || [];
      setThreds(threads);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const getmessageArray = async (item) => {
    // setgetmessage();
    item.forEach(async (element) => {
      try {
        const response = await window.gapi.client.gmail.users.threads.get({
          userId: "me",
          id: element.id,
        });
        setgetmessage(response.result.messages);
        // console.log("get message List @!@!@!@!@!@", response);
      } catch (error) {
        setErrorMessage(error.message);
      }
    });
  };

  useEffect(() => {
    listLabels();
    // listThreads();
    // GetHeader();
  }, []);

  useEffect(() => {
    listThreads();
  }, [labelId]);

  // console.log(
  //   "sortedData::",
  //   Data.sort(function compare(a, b) {
  //     var dateA = new Date(a[0].date);
  //     var dateB = new Date(b[0].date);
  //     return dateB - dateA;
  //   })
  // );
  return (
    <>
      <Container fluid className="inbox-container">
        <Row>
          <Col sm={2} className="sidebar">
            <pre className="labels" style={{ whiteSpace: "pre-wrap" }}>
              {/* {errorMessage || labels.map((label) => label.name).join("\n")} */}
              {errorMessage ||
                labels?.map((item) => (
                  <button
                    onClick={() => {
                      setLabelId(item?.id);
                      setData("");
                    }}
                  >
                    {item?.name}
                  </button>
                ))}
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
                  {Data !== undefined &&
                    Data !== null &&
                    Data.length &&
                    Data.sort(function compare(a, b) {
                      var dateA = new Date(a[0].date);
                      var dateB = new Date(b[0].date);
                      return dateB - dateA;
                    })?.map((itm) => {
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

                          {/* <td>{moment(itm[0].date).format("DD-MM")}</td> */}
                          <td>
                            {moment(itm[0].date).format("DD-MM") ===
                            moment(new Date()).format("DD-MM")
                              ? moment(itm[0].date).format("LT")
                              : moment(itm[0].date).format("DD-MM")}
                          </td>
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
