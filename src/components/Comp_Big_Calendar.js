import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useFormik } from "formik";
import { CreateMeetingRequestModel } from "data/models/create_meeting/create_meeting_request_model";
import { createMeeting } from "data/api/api";

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const localizer = momentLocalizer(moment);

const Bigcalendar = () => {
  const toast = useRef(null);
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [secondDialogVisible, setSecondDialogVisible] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/createMeeting/all")
      .then((response) => response.json())
      .then((data) => {
        const fetchedEvents = data.eventData.map((item) => ({
          id: item._id,
          title: item.eventName,
          description: item.eventDescription,
          location: item.location,
          allDay: false,
          start: new Date(item.eventStartDate),
          end: new Date(item.eventEndDate),
          participant: item.participants,
        }));
        setEvents(fetchedEvents);
      })
      .catch((error) => console.error(error));
  }, []);

  const deleteEvent = (id) => {
    fetch(`http://localhost:3001/createMeeting/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Successfully deleted:", data);
        hideDialog();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error while deleting:", error);
      });
  };

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const showSecondDialog = () => {
    setSecondDialogVisible(true);
  };

  const hideSecondDialog = () => {
    setSecondDialogVisible(false);
  };

  const handleSelectEvent = (event) => {
    setSelectedEventData(event);
    showDialog();
  };

  const showFailure = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: message,
      life: 3000,
    });
  };

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Event successfully created and sent to participants",
      life: 3000,
    });
  };

  const formik = useFormik({
    initialValues: CreateMeetingRequestModel.empty(),
    validationSchema: CreateMeetingRequestModel.validationSchema,
    onSubmit: async (createMeetingRequestModel) => {
      const response = await createMeeting(createMeetingRequestModel);
      if (response.success) {
        showSuccess();
        window.location.reload();
      } else {
        showFailure(response.data);
      }
      console.log(response);
    },
  });

  return (
    <div>
      <div style={{ height: "500pt" }}>
        <Calendar
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
        />
        <Dialog
          style={{ width: "40vw" }}
          header={
            selectedEventData && (
              <span>{toTitleCase(selectedEventData.title)}</span>
            )
          }
          visible={visible}
          onHide={hideDialog}
        >
          {selectedEventData && (
            <div className="pt0">
              <h3>Meeting Details</h3>
              <p>{selectedEventData.id}</p>
              <p>{selectedEventData.description}</p>
              <h3>Meeting Location</h3>
              <p>{selectedEventData.location}</p>
              <h3>Meeting Start Time</h3>
              <p>{selectedEventData.start.toLocaleString()}</p>
              <h3>Meeting End Time</h3>
              <p>{selectedEventData.end.toLocaleString()}</p>
              <h3>Meeting Participants</h3>
              <p>{selectedEventData.participant}</p>
            </div>
          )}
          <div className="grid">
            <div className="col-8"></div>
            <div className="col-2">
              <Button
                className="z-5 w-4rem h-4rem border-circle shadow-6"
                onClick={showSecondDialog}
                size="sm"
                icon="pi pi-pencil"
                style={{
                  position: "flex",
                  bottom: "10%",
                  right: "0%",
                }}
              />
            </div>
            <div className="col-2">
              <Button
                className="z-5 w-4rem h-4rem border-circle shadow-6"
                severity="danger"
                onClick={() => deleteEvent(selectedEventData.id)}
                size="sm"
                icon="pi pi-trash"
                style={{
                  position: "flex",
                  bottom: "10%",
                  right: "0%",
                }}
              />
            </div>
          </div>
        </Dialog>{" "}
        <Dialog
          header={
            selectedEventData && (
              <span>{"Edit " + toTitleCase(selectedEventData.title)}</span>
            )
          }
          visible={secondDialogVisible}
          onHide={hideSecondDialog}
          style={{ width: "40vw" }}
        >
          <p>Content for the second dialog goes here</p>
        </Dialog>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Bigcalendar;
