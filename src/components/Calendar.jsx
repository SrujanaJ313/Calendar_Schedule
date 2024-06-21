// FullCalendarComponent.jsx
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
const FullCalendarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  // 'create' or 'view'
  const [meetingData, setMeetingData] = useState({
    title: "",
    requiredEmails: "",
    optionalEmails: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
  });
  const [events, setEvents] = useState([]);
  const handleDateClick = (arg) => {
    const initialDate = arg.dateStr;
    setMeetingData({
      title: "",
      requiredEmails: "",
      optionalEmails: "",
      startDate: initialDate,
      startTime: "08:00",
      endDate: initialDate,
      endTime: "09:00",
      location: "",
    });
    setModalMode("create");
    setShowModal(true);
  };
  const handleEventClick = (info) => {
    const event = info.event;
    const startDateTime = event.start.toISOString().slice(0, 16);
    const endDateTime = event.end.toISOString().slice(0, 16);
    setMeetingData({
      title: event.title,
      requiredEmails: event.extendedProps.requiredEmails || "",
      optionalEmails: event.extendedProps.optionalEmails || "",
      startDate: startDateTime.split("T")[0],
      startTime: startDateTime.split("T")[1],
      endDate: endDateTime.split("T")[0],
      endTime: endDateTime.split("T")[1],
      location: event.extendedProps.location,
    });
    setModalMode("view");
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Meeting title is required."),
    requiredEmails: Yup.string()
      .required("Required emails are required.")
      .matches(
        /^(\s*[\w.-]+@affiliate\.nhes\.nh\.gov\s*;\s*)*$/,
        "Emails must be valid and separated by semicolons."
      ),
    optionalEmails: Yup.string().matches(
      /^(\s*[\w.-]+@affiliate\.nhes\.nh\.gov\s*;\s*)*$/,
      "Emails must be valid and separated by semicolons."
    ),
    startDate: Yup.date().required("Start date is required."),
    startTime: Yup.string().required("Start time is required."),
    endDate: Yup.date().required("End date is required."),
    endTime: Yup.string().required("End time is required."),
  });
  const handleSave = (values) => {
    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      requiredEmails,
      optionalEmails,
    } = values;
    const formattedStartDateTime = `${startDate}T${startTime}:00`;
    const formattedEndDateTime = `${endDate}T${endTime}:00`;
    const newEvent = {
      title,
      start: formattedStartDateTime,
      end: formattedEndDateTime,
      extendedProps: { location, requiredEmails, optionalEmails },
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
  };
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
      />
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "create" ? "Schedule Meeting" : "View Meeting"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={meetingData}
            validationSchema={validationSchema}
            onSubmit={handleSave}
            enableReinitialize
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="meetingTitle">
                  <Form.Label>Meeting Title</Form.Label>
                  <Field
                    name="title"
                    as={Form.Control}
                    type="text"
                    placeholder="Enter meeting title"
                    readOnly={modalMode === "view"}
                    isInvalid={!!ErrorMessage}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="requiredEmails">
                  <Form.Label>Required</Form.Label>
                  <Field
                    name="requiredEmails"
                    as={Form.Control}
                    type="text"
                    placeholder="Enter required emails"
                    readOnly={modalMode === "view"}
                  />
                  <ErrorMessage
                    name="requiredEmails"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group controlId="optionalEmails">
                  <Form.Label>Optional</Form.Label>
                  <Field
                    name="optionalEmails"
                    as={Form.Control}
                    type="text"
                    placeholder="Enter optional emails"
                    readOnly={modalMode === "view"}
                  />
                  <ErrorMessage
                    name="optionalEmails"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId="meetingStartDate">
                      <Form.Label>Start Date</Form.Label>
                      <Field
                        name="startDate"
                        as={Form.Control}
                        type="date"
                        readOnly={modalMode === "view"}
                      />
                      <ErrorMessage
                        name="startDate"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="meetingStartTime">
                      <Form.Label>Start Time</Form.Label>
                      <Field
                        name="startTime"
                        as={Form.Control}
                        type="time"
                        readOnly={modalMode === "view"}
                      />
                      <ErrorMessage
                        name="startTime"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="meetingEndDate">
                      <Form.Label>End Date</Form.Label>
                      <Field
                        name="endDate"
                        as={Form.Control}
                        type="date"
                        readOnly={modalMode === "view"}
                      />
                      <ErrorMessage
                        name="endDate"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="meetingEndTime">
                      <Form.Label>End Time</Form.Label>
                      <Field
                        name="endTime"
                        as={Form.Control}
                        type="time"
                        readOnly={modalMode === "view"}
                      />
                      <ErrorMessage
                        name="endTime"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="meetingLocation">
                  <Form.Label>Location</Form.Label>
                  <Field
                    name="location"
                    as={Form.Control}
                    type="text"
                    placeholder="Enter location"
                    readOnly={modalMode === "view"}
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  {modalMode === "create" && (
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save Meeting
                    </Button>
                  )}
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default FullCalendarComponent;
