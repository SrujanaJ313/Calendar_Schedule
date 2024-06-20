import React, { useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import * as bootstrap from "bootstrap";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./index.css";

function Calendar() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [meetingData, setMeetingData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
  });
  const handleEventClick = (info) => {
    const event = info.event;
    const startDateTime = event.start.toISOString().slice(0, 16);
    const endDateTime = event.end.toISOString().slice(0, 16);
    setMeetingData({
      title: event.title,
      startDate: startDateTime.split("T")[0],
      startTime: startDateTime.split("T")[1],
      endDate: endDateTime.split("T")[0],
      endTime: endDateTime.split("T")[1],
      location: event.extendedProps.location,
    });
    setModalMode("view");
    setShowModal(true);
  };

  const handleDateClick = (arg) => {
    const initialDate = arg.dateStr;
    setMeetingData({
      title: "",
      startDate: initialDate,
      startTime: "08:00",
      endDate: initialDate,
      endTime: "09:00",
      location: "",
    });
    setModalMode("create");
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSave = () => {
    const { startDate, startTime, endDate, endTime } = meetingData;
    const formattedStartDateTime = `${startDate}T${startTime}:00`;
    const formattedEndDateTime = `${endDate}T${endTime}:00`;
    const savedData = {
      ...meetingData,
      startDateTime: formattedStartDateTime,
      endDateTime: formattedEndDateTime,
    };
    // console.log("Meeting data:", savedData);
    const eventData = {
      title:savedData.title,
      start: savedData.startDateTime,
      end: savedData.endDateTime,
    };
    setEvents((event) => [...event,eventData]);
    setShowModal(false);
  };
  const [events, setEvents] = useState([
    {
      title: "Srujana Meeting",
      start: "2024-06-19T08:00:00",
      end: "2024-06-19T09:00:00",
    },
  ]);
  
  return (
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
        height={"90vh"}
        dateClick={handleDateClick}
        events={events}
        eventClick={handleEventClick}
        // eventDidMount={(info) => {
        //   return new bootstrap.Popover(info.el, {
        //     title: info.event.title,
        //     placement: "auto",
        //     trigger: "hover",
        //     customClass: "popoverStyle",
        //     content:
        //       "<p>Please subscribe<strong>Bootstrap popover</strong>.</p>",
        //     html: true,
        //   });
        // }}
      />
      <Modal show={showModal} onHide={handleClose}>
        
        <Modal.Header closeButton>
          
          <Modal.Title>
            {modalMode === "create" ? "Schedule Meeting" : "View Meeting"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <Form>
            
            <Form.Group controlId="meetingTitle">
              
              <Form.Label>Meeting Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter meeting title"
                name="title"
                value={meetingData.title}
                onChange={handleInputChange}
                readOnly={modalMode === "view"}
              />
            </Form.Group>
            <Row>
              
              <Col>
                
                <Form.Group controlId="meetingStartDate">
                  
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={meetingData.startDate}
                    onChange={handleInputChange}
                    readOnly={modalMode === "view"}
                  />
                </Form.Group>
              </Col>
              <Col>
                
                <Form.Group controlId="meetingStartTime">
                  
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="startTime"
                    value={meetingData.startTime}
                    onChange={handleInputChange}
                    readOnly={modalMode === "view"}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              
              <Col>
                
                <Form.Group controlId="meetingEndDate">
                  
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={meetingData.endDate}
                    onChange={handleInputChange}
                    readOnly={modalMode === "view"}
                  />
                </Form.Group>
              </Col>
              <Col>
                
                <Form.Group controlId="meetingEndTime">
                  
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    value={meetingData.endTime}
                    onChange={handleInputChange}
                    readOnly={modalMode === "view"}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="meetingLocation">
              
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={meetingData.location}
                onChange={handleInputChange}
                readOnly={modalMode === "view"}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="secondary" onClick={handleClose}>
            
            Close
          </Button>
          {modalMode === "create" && (
            <Button variant="primary" onClick={handleSave}>
              Save Meeting
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
