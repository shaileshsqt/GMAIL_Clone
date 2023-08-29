import React, { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Gmail_Body = () => {
  const [first, setfirst] = useState([]);
  const [getData, setgetData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [List, setList] = useState([]);
  let result = [];
  let Decode = "";
  let param = useParams();
  console.log("param ::", param);

  const fetchData = async () => {
    try {
      const response = await window.gapi.client.gmail.users.threads.get({
        userId: "me",
        id: param.id,
      });
      // setgetmessage(response.result.messages);
      setgetData(response.result.messages);
      // console.log("get message List @!@!@!@!@!@", response);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const listLabels = async () => {
    try {
      const response = await window.gapi.client.gmail.users.labels.list({
        userId: "me",
      });
      const labels_get = response.result.labels || [];
      setLabels(labels_get);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  //   const GetHeader = () => {
  //     //   getData.forEach((el1) => {
  //     //     console.log("Loop Body ::", el1);
  //     //     const fromvalue = el1.payload.headers.find(
  //     //       (item) => item.name === "From"
  //     //     );
  //     //     const fetchId = el1.id;
  //     //     const subjectvalue = el1.payload.headers.find(
  //     //       (item) => item.name === "Subject"
  //     //     );
  //     //     const datevalue = el1.payload.headers.find(
  //     //       (item) => item.name === "Date"
  //     //     );
  //     //     result.push({
  //     //       id: fetchId,
  //     //       from: fromvalue.value,
  //     //       subject: subjectvalue.value,
  //     //       date: datevalue.value,
  //     //     });
  //     //     setList([...List, result]);
  //     //   });
  //   };
  useEffect(() => {
    for (let index = 0; index < getData.length; index++) {
      const el1 = getData[index];
      console.log("Loop Body ::", el1);
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

      const To = el1.payload.headers.find((item) => item.name === "To");
      const getBody = el1?.payload?.parts;

      result.push({
        id: fetchId,
        from: fromvalue.value,
        to: To.value,
        subject: subjectvalue.value,
        date: datevalue.value,
        body: getBody,
      });
    }
    setList([result]);
  }, [getData]);

  useEffect(() => {
    fetchData();
    listLabels();
    // GetHeader();
  }, []);
  console.log("Get Data::", getData);
  console.log("List::::::::::::::::", List);

  const getDatafn = (item) => {
    console.log("Item", item);
    const base64 = item[1].body.data.replaceAll("-", "+");
    // const ooo4 = item?.map((item, index) => item);
    console.log("clg", base64);
    Decode = atob(base64);
    console.log("Decode Data", Decode);
    return Decode;
  };

  //   const base64 = List.map((item, index) => item[index]?.body[1].body.data);

  //   let res = () => {
  //     let data =
  //       base64[0] !== undefined &&
  //       base64[0] !== null &&
  //       base64[0].length !== 0 &&
  //       base64[0]?.replaceAll("-", "+");
  //     console.log("Response", data);

  //     Decode = atob(data);
  //     return Decode;
  //   };
  //   console.log("Resposne", res());

  //   var str = atob("" + base64[0] + "");
  //   var part = message.parts.filter(function (part) {
  //     return part.mimeType == "text/html";
  //   });
  //   var html = urlSafeBase64Decode(base64);
  // const get11 = base64.decode(base64[0].replace(/-/g, "+").replace(/_/g, "/"));
  //   let body = Utilities.base64Decode(base64[0]);
  //  const decodedHtml = base64url.decode(base64[0], "utf-8");
  //   console.log("base64", base64[0]);
  //   const encoded = btoa(base64[0]);
  //   //   var decodedHTML = window.atob(base64[0]);
  //   const decoded = atob("" + base64[0] + "");

  //   const decodedData = btoa(
  //     "PCFET0NUWVBFIGh0bWw-PGh0bWw-PHN0eWxlPnB7bWFyZ2luLXRvcDowcHg7IG1hcmdpbi1ib3R0b206MHB4O308L3N0eWxlPjxib2R5IGJnY29sb3I9IiNGRkZGRkYiIG1hcmdpbndpZHRoPSIyIiBtYXJnaW5oZWlnaHQ9IjIiIHN0eWxlPSJmb250LWZhbWlseTpBcmlhbDtmb250LXNpemU6MTBwdDtjb2xvcjowMDAwMDAiPjxodG1sPjxib2R5PjxzcGFuIHN0eWxlPSJmb250LXZhcmlhbnQtbGlnYXR1cmVzOiBub25lOyB3aGl0ZS1zcGFjZS1jb2xsYXBzZTogcHJlc2VydmU7Ij5IZWxsbyBTaGFpbGVzaCw8L3NwYW4-PGJyIGNsZWFyPSJub25lIiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgcG9pbnRlci1ldmVudHM6IGFsbDsgZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-PGJyIGNsZWFyPSJub25lIiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgcG9pbnRlci1ldmVudHM6IGFsbDsgZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-PHNwYW4gc3R5bGU9ImZvbnQtdmFyaWFudC1saWdhdHVyZXM6IG5vbmU7IHdoaXRlLXNwYWNlLWNvbGxhcHNlOiBwcmVzZXJ2ZTsiPkp1c3QgYSBmb2xsb3ctdXAgb24gdGhpcyBjYXNlLjwvc3Bhbj48YnIgY2xlYXI9Im5vbmUiIHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBwb2ludGVyLWV2ZW50czogYWxsOyBmb250LXZhcmlhbnQtbGlnYXR1cmVzOiBub25lOyB3aGl0ZS1zcGFjZS1jb2xsYXBzZTogcHJlc2VydmU7Ij48c3BhbiBzdHlsZT0iZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-UGxlYXNlIGJlIGFkdmlzZWQgdGhhdCB3ZSB3aWxsIGJlIGNsb3NpbmcgdGhpcyBjYXNlIGR1ZSB0byBpbmFjdGl2aXR5IGlmIHdlIGRvbiYjMzk7dCByZWNlaXZlIGFueSByZXNwb25zZSB3aXRoaW4gdGhlIGRheS48L3NwYW4-PGJyIGNsZWFyPSJub25lIiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgcG9pbnRlci1ldmVudHM6IGFsbDsgZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-PGJyIGNsZWFyPSJub25lIiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgcG9pbnRlci1ldmVudHM6IGFsbDsgZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-PHNwYW4gc3R5bGU9ImZvbnQtdmFyaWFudC1saWdhdHVyZXM6IG5vbmU7IHdoaXRlLXNwYWNlLWNvbGxhcHNlOiBwcmVzZXJ2ZTsiPlRoYW5rIHlvdSw8L3NwYW4-PGJyIGNsZWFyPSJub25lIiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgcG9pbnRlci1ldmVudHM6IGFsbDsgZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-PGJyIGNsZWFyPSJub25lIiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgcG9pbnRlci1ldmVudHM6IGFsbDsgZm9udC12YXJpYW50LWxpZ2F0dXJlczogbm9uZTsgd2hpdGUtc3BhY2UtY29sbGFwc2U6IHByZXNlcnZlOyI-PHNwYW4gc3R5bGU9ImZvbnQtdmFyaWFudC1saWdhdHVyZXM6IG5vbmU7IHdoaXRlLXNwYWNlLWNvbGxhcHNlOiBwcmVzZXJ2ZTsiPlJpbmdDZW50cmFsIERldmVsb3BlciBTdXBwb3J0PC9zcGFuPjwvYm9keT48L2h0bWw-PGJyPjxicj48aW1nIHNyYz0iaHR0cHM6Ly9yYy5teS5zYWxlc2ZvcmNlLmNvbS9zZXJ2bGV0L3NlcnZsZXQuSW1hZ2VTZXJ2ZXI_b2lkPTAwRDgwMDAwMDAwYVJVWCZlc2lkPTAxOEhyMDAwMDFBeG5FSSZmcm9tPWV4dCI-PC9ib2R5PjwvaHRtbD48YnI-PGJyPnJlZjpfMDBEODBhUlVYLl81MDBIcjFYZGZqcTpyZWY="
  //   )
  //     .replace(/-/g, "+")
  //     .replace(/_/g, "/");
  //   console.log("decodedHTML", decodedData);

  //   var decodedHTML = window.atob(decodedData);

  return (
    <div>
      <Container fluid className="inbox-container">
        <Row>
          <Col sm={2} className="sidebar">
            <pre className="labels" style={{ whiteSpace: "pre-wrap" }}>
              {errorMessage || labels.map((label) => label.name).join("\n")}
            </pre>
          </Col>
          <Col sm={10} className="inbox">
            {/* <ListGroup>Subject </ListGroup> */}
            <div>
              {List !== undefined &&
                List !== null &&
                List.length &&
                List.map((itm, index) => {
                  debugger;
                  return (
                    <div key={index}>
                      <header>
                        Subject: <h4>{itm[index]?.subject} </h4>
                      </header>
                      <div className="ms-1 pt-2 mb-5">
                        From :<div>{itm[index]?.from}</div>
                      </div>
                      <div className="pt-2 ms-2">Mail Body</div>
                      <div className="pt-2 ms-2">
                        {itm[index]?.body && (
                          <div
                            className="pt-2 ms-2"
                            dangerouslySetInnerHTML={{
                              __html: getDatafn(itm[index]?.body),
                            }}
                          />
                        )}
                        {/* {itm[index] &&
                          itm[index]?.body?.body[1] !== undefined &&
                          atob(
                            itm[index]?.body?.body[1].data.replaceAll("-", "+")
                          )} */}
                        {/* {Base64.decode(base64[0])} */}
                        {/* {window.atob(base64[0])} */}
                      </div>
                      {/* <div
                        className="pt-2 ms-2"
                        dangerouslySetInnerHTML={{
                          __html: decod,
                        }}
                      /> */}
                    </div>
                  );
                })}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Gmail_Body;
