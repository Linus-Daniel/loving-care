import { Text } from "@react-email/components";

import { EmailShell } from "./EmailShell";

type Props = {
  parentName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventTime: string;
};

export default function EventReminder({ parentName, eventTitle, eventDate, eventLocation, eventTime }: Props) {
  return (
    <EmailShell preview="Event reminder" heading="Upcoming event reminder">
      <Text>Dear {parentName},</Text>
      <Text>
        Reminder: {eventTitle} is scheduled for {eventDate} at {eventTime}.
      </Text>
      <Text>Location: {eventLocation}</Text>
    </EmailShell>
  );
}
