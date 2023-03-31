import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog } from "primereact/dialog";

function toTitleCase(str) {
  const titleCase = str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return titleCase;
}
const localizer = momentLocalizer(moment);

const Bigcalendar = () => {
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [event] = useState([]);
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

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.id);
    setEventData(event);
    showDialog();
  };

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
          header={eventData && <span>{toTitleCase(eventData.title)}</span>}
          visible={visible}
          onHide={hideDialog}
        >
          {eventData && (
            <div className="pt0">
              <h3>Meeting Details</h3>
              <p>{eventData.description}</p>
              <h3>Meeting Location</h3>
              <p>{eventData.location.toLocaleString()}</p>
              <h3>Meeting Start Time</h3>
              <p>{eventData.start.toLocaleString()}</p>
              <h3>Meeting End Time</h3>
              <p>{eventData.end.toLocaleString()}</p>
              <h3>Meeting Participants</h3>
              <p>{eventData.participant.toLocaleString()}</p>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default Bigcalendar;
