import React, { useEffect, useState } from "react";
import { Button, Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const Gmail_Body = () => {
  const [first, setfirst] = useState([]);
  const [getData, setgetData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [List, setList] = useState([]);

  const [labelId, setLabelId] = useState("");
  let result = [];
  let Display = [];
  let Decode = "";
  let param = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await window.gapi.client.gmail.users.threads.get({
        userId: "me",
        id: param.id,
      });

      setgetData(response.result.messages);
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
  console.log("get Data Main", getData);

  useEffect(() => {
    for (let index = 0; index < getData.length; index++) {
      const el1 = getData;
      for (let i = 0; i < el1.length; i++) {
        const fromvalue = el1[i].payload.headers.find(
          (item) => item.name === "From"
        );
        const fetchId = el1[i].id;
        const subjectvalue = el1[i].payload.headers.find(
          (item) => item.name === "Subject"
        );
        const datevalue = el1[i].payload.headers.find(
          (item) => item.name === "Date"
        );

        const To = el1[i].payload.headers.find((item) => item.name === "To");
        const getBody = el1[i]?.payload;

        result.push({
          id: fetchId,
          from: fromvalue.value,
          to: To.value,
          subject: subjectvalue.value,
          date: datevalue.value,
          getBody: getBody,
        });
      }
    }

    setList([result]);
  }, [getData.length > 0]);

  useEffect(() => {
    fetchData();
    listLabels();
    // GetHeader();
  }, []);

  const DecodeCode = (item) => {
    console.log("Get Item Call", item);
    const base64 = item?.replaceAll("-", "+").replaceAll("_", "/");
    console.log("onerted Base64", base64);
    Decode = atob(base64);
    console.log("Decode Data", Decode);
    return Decode;
  };

  const GmailImage = (base64Image) => {
    const base64 = base64Image?.replaceAll("-", "+").replaceAll("_", "/");
    // Decode = atob(base64);
    // console.log("Decode Image", Decode);
    return (
      <div>
        <img src={`data:image/jpeg;base64,${base64}`} alt="Base64 Image" />
      </div>
    );
  };

  // const renderPart = (part) => {
  //   // console.log("Part Loop", part);
  //   if (part?.mimeType === "text/plain") {
  //     return (
  //       <div className="pt-2 ms-2" key={part.partId}>
  //         {Display.push(getDatafn(part.body.data))}
  //       </div>
  //     );
  //   } else if (part?.mimeType === "text/html") {
  //     Display.push(getDatafn(part.body.data));
  //   } else if (
  //     part?.mimeType === "multipart/alternative" ||
  //     part?.mimeType === "multipart/mixed" ||
  //     part?.mimeType === "multipart/related"
  //   ) {
  //     return CheckParts(part.parts);
  //     // part?.parts &&
  //     //   part?.parts.map((partitem, index) => {
  //     //     return (
  //     //       <div
  //     //         key={index}
  //     //         dangerouslySetInnerHTML={{
  //     //           __html: getDatafn(partitem.body.data),
  //     //         }}
  //     //       ></div>
  //     //     );
  //     //   });
  //   } else {
  //     return (
  //       <div key={part?.partId}>
  //         <p>MIME Type: {part?.mimeType}</p>
  //         <p>Attachment Name: {part?.filename}</p>
  //       </div>
  //     );
  //   }
  // };
  let myData = [];
  // const CheckParts = (part) => {
  //   part?.map((itm, index) => {
  //     if (
  //       itm?.mimeType === "multipart/alternative" ||
  //       itm?.mimeType === "multipart/mixed" ||
  //       itm?.mimeType === "multipart/related"
  //     ) {
  //       itm?.parts &&
  //         itm?.parts.map((partitem, index) => {
  //           {
  //             Display.push(getDatafn(partitem.body.data));
  //           }
  //         });
  //     } else if (itm?.mimeType === "text/plain") {
  //       return (
  //         <div className="pt-2 ms-2" key={itm.partId}>
  //           {Display.push(
  //             getDatafn(
  //               itm.body.attachmentId ? itm.body.attachmentId : itm.body.data
  //             )
  //           )}
  //         </div>
  //       );
  //     } else if (itm?.mimeType === "text/html") {
  //       {
  //         Display.push(
  //           getDatafn(
  //             itm.body.attachmentId ? itm.body.attachmentId : itm.body.data
  //           )
  //         );
  //       }
  //     } else if (itm?.mimeType === "application/pdf") {
  //       {
  //         Display.push(getDatafn(itm.body.attachmentId && itm?.filename));
  //       }
  //     } else if (itm?.mimeType === "image/jpeg") {
  //       {
  //         Display.push(getDatafn(itm.body.attachmentId && itm?.filename));
  //       }
  //     } else {
  //       return (
  //         <div key={itm?.partId}>
  //           <p>No Data MAtch</p>
  //         </div>
  //       );
  //     }
  //   });
  // };

  return (
    <div>
      <Container fluid className="inbox-container">
        <Row>
          <Col sm={2} className="sidebar">
            <pre className="labels" style={{ whiteSpace: "pre-wrap" }}>
              {/* {errorMessage || labels.map((label) => label.name).join("\n")}
               */}
              {errorMessage ||
                labels?.map((item) => (
                  <button
                    onClick={() => {
                      setLabelId(item?.id);
                    }}
                  >
                    {item?.name}
                  </button>
                ))}
            </pre>
          </Col>
          <Col sm={10} className="inbox">
            {/* <ListGroup>Subject </ListGroup> */}
            <div>
              {List !== undefined &&
                List !== null &&
                List.length &&
                List[0].map((itm, index) => {
                  debugger;
                  return (
                    <div key={index}>
                      <p onClick={() => navigate("/Display")}>
                        <BiArrowBack />
                      </p>
                      <header>
                        Subject: <h4>{itm?.subject} </h4>
                      </header>
                      <div className="ms-1 pt-2 mb-5">
                        From :<div>{itm?.from}</div>
                      </div>
                      <div className="pt-2 ms-2">
                        <div>
                          {itm?.getBody?.parts !== 0 &&
                          itm?.getBody?.parts !== undefined ? (
                            itm?.getBody?.parts?.map((bodyData, index) => {
                              return (
                                <>
                                  {bodyData?.mimeType === "text/html" ? (
                                    <div
                                      key={index}
                                      // dangerouslySetInnerHTML={{
                                      //   __html: atob(
                                      //     bodyData?.body?.data
                                      //       ?.replaceAll("-", "+")
                                      //       ?.replaceAll("_", "/")
                                      //   ),
                                      // }}
                                      dangerouslySetInnerHTML={{
                                        __html: DecodeCode(
                                          bodyData.body.attachmentId
                                            ? bodyData.body.attachmentId
                                            : bodyData.body.data
                                        ),
                                      }}
                                    >
                                      {/* {itm.body.data} */}
                                    </div>
                                  ) : bodyData?.mimeType === "text/plain" ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: DecodeCode(
                                          bodyData.body.attachmentId
                                            ? bodyData.body.attachmentId
                                            : bodyData.body.data
                                        ),
                                      }}
                                    >
                                      {/* {itm.body.data} */}
                                    </div>
                                  ) : // <div
                                  //   key={index}
                                  //   // dangerouslySetInnerHTML={{
                                  //   //   __html: atob(
                                  //   //     bodyData?.body?.data
                                  //   //       ?.replaceAll("-", "+")
                                  //   //       ?.replaceAll("_", "/")
                                  //   //   ),
                                  //   // }}
                                  //   dangerouslySetInnerHTML={{
                                  //     __html: DecodeCode(
                                  //       bodyData?.body?.data
                                  //     ),
                                  //   }}
                                  // >
                                  //   {/* {itm.body.data} */}
                                  // </div>
                                  bodyData?.mimeType ===
                                      "multipart/alternative" ||
                                    bodyData?.mimeType === "multipart/mixed" ||
                                    bodyData?.mimeType ===
                                      "multipart/related" ? (
                                    bodyData.parts.map((prtItem, index) => {
                                      return (
                                        <>
                                          {prtItem.mimeType === "text/html" ? (
                                            <div
                                              key={index}
                                              // dangerouslySetInnerHTML={{
                                              //   __html: atob(
                                              //     prtItem.body.data
                                              //       .replaceAll("-", "+")
                                              //       .replaceAll("_", "/")
                                              //   ),
                                              // }}
                                              dangerouslySetInnerHTML={{
                                                __html: DecodeCode(
                                                  prtItem.body.attachmentId
                                                    ? prtItem.body.attachmentId
                                                    : prtItem.body.data
                                                ),
                                              }}
                                            >
                                              {/* {itm.body.data} */}
                                            </div>
                                          ) : prtItem.mimeType ===
                                            "text/plain" ? (
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: DecodeCode(
                                                  prtItem.body.attachmentId
                                                    ? prtItem.body.attachmentId
                                                    : prtItem.body.data
                                                ),
                                              }}
                                            >
                                              {/* {itm.body.data} */}
                                            </div>
                                          ) : // <div
                                          //   key={index}
                                          //   // dangerouslySetInnerHTML={{
                                          //   //   __html: atob(
                                          //   //     prtItem.body.data
                                          //   //       .replaceAll("-", "+")
                                          //   //       .replaceAll("_", "/")
                                          //   //   ),
                                          //   // }}
                                          //   dangerouslySetInnerHTML={{
                                          //     __html: DecodeCode(
                                          //       prtItem?.body?.data
                                          //     ),
                                          //   }}
                                          // >
                                          //   {/* {itm.body.data} */}
                                          // </div>
                                          prtItem?.mimeType ===
                                              "multipart/alternative" ||
                                            prtItem?.mimeType ===
                                              "multipart/mixed" ||
                                            prtItem?.mimeType ===
                                              "multipart/related" ? (
                                            prtItem.parts.map(
                                              (lstParts, index) => {
                                                return (
                                                  <>
                                                    {lstParts.mimeType ===
                                                    "text/html" ? (
                                                      <div
                                                        key={index}
                                                        // dangerouslySetInnerHTML={{
                                                        //   __html: atob(
                                                        //     lstParts.body.data
                                                        //       .replaceAll(
                                                        //         "-",
                                                        //         "+"
                                                        //       )
                                                        //       .replaceAll(
                                                        //         "_",
                                                        //         "/"
                                                        //       )
                                                        //   ),
                                                        // }}
                                                        dangerouslySetInnerHTML={{
                                                          __html: DecodeCode(
                                                            lstParts.body
                                                              .attachmentId
                                                              ? lstParts.body
                                                                  .attachmentId
                                                              : lstParts.body
                                                                  .data
                                                          ),
                                                        }}
                                                      >
                                                        {/* {itm.body.data} */}
                                                      </div>
                                                    ) : lstParts.mimeType ===
                                                      "text/plain" ? (
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html: DecodeCode(
                                                            lstParts.body
                                                              .attachmentId
                                                              ? lstParts.body
                                                                  .attachmentId
                                                              : lstParts.body
                                                                  .data
                                                          ),
                                                        }}
                                                      >
                                                        {/* {itm.body.data} */}
                                                      </div>
                                                    ) : // <div
                                                    //   key={index}
                                                    //   // dangerouslySetInnerHTML={{
                                                    //   //   __html: atob(
                                                    //   //     lstParts.body.data
                                                    //   //       .replaceAll(
                                                    //   //         "-",
                                                    //   //         "+"
                                                    //   //       )
                                                    //   //       .replaceAll(
                                                    //   //         "_",
                                                    //   //         "/"
                                                    //   //       )
                                                    //   //   ),
                                                    //   // }}
                                                    //   dangerouslySetInnerHTML={{
                                                    //     __html: DecodeCode(
                                                    //       lstParts?.body?.data
                                                    //     ),
                                                    //   }}
                                                    // >
                                                    //   {/* {itm.body.data} */}
                                                    // </div>
                                                    lstParts?.mimeType ===
                                                        "image/jpeg" ||
                                                      "image/png" ? (
                                                      <div>
                                                        {GmailImage(
                                                          lstParts?.body
                                                            ?.attachmentId
                                                        )}
                                                      </div>
                                                    ) : (
                                                      // <div
                                                      //   key={index}
                                                      // dangerouslySetInnerHTML={{
                                                      //   __html: atob(
                                                      //     lstParts.body.attachmentId
                                                      //       .replaceAll(
                                                      //         "-",
                                                      //         "+"
                                                      //       )
                                                      //       .replaceAll(
                                                      //         "_",
                                                      //         "/"
                                                      //       )
                                                      //       .replaceAll(
                                                      //         " ",
                                                      //         "+"
                                                      //       )
                                                      //     // .replaceAll(/-/g, `+`)
                                                      //     // .replaceAll(/_/g, `/`)
                                                      //   ),
                                                      // }}
                                                      //   dangerouslySetInnerHTML={{
                                                      //     __html: DecodeCode(
                                                      //       lstParts?.body
                                                      //         ?.attachmentId
                                                      //     ),
                                                      //   }}
                                                      // >
                                                      //   {/* <img
                                                      //     src={d}
                                                      //     alt="Base64 Image"
                                                      //   /> */}
                                                      // </div>
                                                      "No Data"
                                                    )}
                                                  </>
                                                );
                                              }
                                            )
                                          ) : prtItem?.mimeType ===
                                              "image/jpeg" || "image/png" ? (
                                            GmailImage(
                                              lstParts?.body?.attachmentId
                                            )
                                          ) : (
                                            // <div
                                            //   key={index}
                                            //   // dangerouslySetInnerHTML={{
                                            //   //   __html: atob(
                                            //   //     prtItem.body.attachmentId
                                            //   //       .replaceAll("-", "+")
                                            //   //       .replaceAll("_", "/")
                                            //   //       .replaceAll(" ", "+")
                                            //   //     // .replaceAll(/-/g, `+`)
                                            //   //     // .replaceAll(/_/g, `/`)
                                            //   //   ),
                                            //   // }}
                                            //   dangerouslySetInnerHTML={{
                                            //     __html: DecodeCode(
                                            //       prtItem?.body?.attachmentId
                                            //     ),
                                            //   }}
                                            // />
                                            ""
                                          )}
                                        </>
                                      );
                                    })
                                  ) : bodyData?.mimeType === "image/jpeg" ||
                                    "image/png" ? (
                                    GmailImage(bodyData?.body?.attachmentId)
                                  ) : // <div
                                  //   key={index}
                                  //   // dangerouslySetInnerHTML={{
                                  //   //   __html: atob(
                                  //   //     bodyData?.body?.attachmentId
                                  //   //       ?.replaceAll("-", "+")
                                  //   //       ?.replaceAll("_", "/")
                                  //   //       ?.replaceAll(" ", "+")
                                  //   //     // .replaceAll(/-/g, `+`)
                                  //   //     // .replaceAll(/_/g, `/`)
                                  //   //   ),
                                  //   // }}
                                  //   dangerouslySetInnerHTML={{
                                  //     __html: DecodeCode(
                                  //       bodyData?.body?.attachmentId
                                  //     ),
                                  //   }}
                                  // />
                                  bodyData?.mimeType === "application/pdf" ? (
                                    <div>{bodyData?.filename}</div>
                                  ) : (
                                    <div
                                      key={index}
                                      // dangerouslySetInnerHTML={{
                                      //   __html: atob(
                                      //     bodyData.body.data
                                      //       .replaceAll("-", "+")
                                      //       .replaceAll("_", "+")
                                      //   ),
                                      // }}
                                      dangerouslySetInnerHTML={{
                                        __html: DecodeCode(
                                          bodyData?.body?.data
                                        ),
                                      }}
                                    >
                                      {/* {itm.body.data} */}
                                    </div>
                                  )}
                                </>
                              );
                            })
                          ) : (
                            <div
                              key={index}
                              // dangerouslySetInnerHTML={{
                              //   __html: atob(
                              //     itm.getBody.body.data
                              //       .replaceAll("-", "+")
                              //       .replaceAll("_", "+")
                              //   ),
                              // }}
                              dangerouslySetInnerHTML={{
                                __html: DecodeCode(itm?.getBody?.body.data),
                              }}
                            >
                              {/* {itm.body.data} */}
                            </div>
                          )}
                        </div>
                      </div>
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
