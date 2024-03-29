import moment from "moment";
import * as Yup from "yup";

export class CreateMeetingRequestModel {
  constructor(
    eventName,
    eventDescription,
    location,
    eventStartDate,
    eventEndDate,
    eventStartDate2,
    eventEndDate2,
    eventStartDate3,
    eventEndDate3,
    participants,
    eventVoteDuration,
    eventOwner
  ) {
    this.eventName = eventName;
    this.eventDescription = eventDescription;
    this.location = location;
    this.eventStartDate = eventStartDate;
    this.eventEndDate = eventEndDate;
    this.eventStartDate2 = eventStartDate2;
    this.eventEndDate2 = eventEndDate2;
    this.eventStartDate3 = eventStartDate3;
    this.eventEndDate3 = eventEndDate3;
    this.participants = participants;
    this.eventVoteDuration = eventVoteDuration;
    this.eventOwner = eventOwner;
  }

  static empty() {
    const now = moment();
    const startOfNextHour = moment(now).startOf("hour").add(1, "hour");
    const endOfNextHour = moment(startOfNextHour).add(1, "hour");

    return new CreateMeetingRequestModel(
      "", // eventname
      "", // eventDescription
      "", // location
      startOfNextHour.toDate(),
      endOfNextHour.toDate(),
      null, // eventStartDate2
      null, // eventEndDate2
      null, // eventStartDate3
      null, // eventEndDate3
      [], // participants
      startOfNextHour.toDate(),
      "" // eventOwner
    );
  }

  static validationSchema = Yup.object({
    eventName: Yup.string()
      .min(3, "Event name must be at least 3 characters")
      .required("Event name is required"),

    eventDescription: Yup.string().optional(),

    eventStartDate: Yup.date()
      .min(new Date(), "Event date-time cannot be in the past")
      .required("Event date-time is required"),

    eventEndDate: Yup.date()
      .min(
        Yup.ref("eventStartDate"),
        "Event end date-time cannot be earlier than start date-time"
      )
      .test(
        "duration",
        "Event duration must be at least 10 minutes",
        function (value) {
          const { eventStartDate } = this.parent;
          const diffInMinutes = moment
            .duration(moment(value).diff(moment(eventStartDate)))
            .asMinutes();
          return diffInMinutes >= 10;
        }
      )
      .required("Event duration is required"),

    eventStartDate2: Yup.date()
      .nullable()
      .test("date", "Event date-time cannot be in the past", function (value) {
        if (!value) return true; // if value is null, do not validate
        return moment(value).isSameOrAfter(moment());
      }),

    eventEndDate2: Yup.date()
      .nullable()
      .min(
        Yup.ref("eventStartDate2"),
        "Event end date-time cannot be earlier than start date-time"
      )
      .test(
        "duration",
        "Event duration must be at least 10 minutes",
        function (value) {
          const { eventStartDate2 } = this.parent;
          if (eventStartDate2 === null) {
            return true;
          }
          const diffInMinutes = moment
            .duration(moment(value).diff(moment(eventStartDate2)))
            .asMinutes();
          return diffInMinutes >= 10;
        }
      ),

    eventStartDate3: Yup.date()
      .nullable()
      .test("date", "Event date-time cannot be in the past", function (value) {
        if (!value) return true; // if value is null, do not validate
        return moment(value).isSameOrAfter(moment());
      }),

    eventEndDate3: Yup.date()
      .nullable()
      .min(
        Yup.ref("eventStartDate3"),
        "Event end date-time cannot be earlier than start date-time"
      )
      .test(
        "duration",
        "Event duration must be at least 10 minutes",
        function (value) {
          const { eventStartDate3 } = this.parent;
          if (eventStartDate3 === null) {
            return true;
          }
          const diffInMinutes = moment
            .duration(moment(value).diff(moment(eventStartDate3)))
            .asMinutes();
          return diffInMinutes >= 10;
        }
      ),

    eventVoteDuration: Yup.date()
      .required("Event vote duration is required")
      .test(
        "vote-duration",
        "Voting cannot end after start date",
        function (value) {
          const { eventStartDate } = this.parent;
          return moment(value).isSameOrBefore(moment(eventStartDate));
        }
      ),

    participants: Yup.array()
      .of(
        Yup.string()
          .email("Enter a valid email")
          .required("Participant email cannot be empty")
      )
      .min(1, "Include at least one participant."),
  });
}
