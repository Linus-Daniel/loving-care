import { Link, Text } from "@react-email/components";

import { EmailShell } from "./EmailShell";

type Props = {
  parentName: string;
  childName: string;
  startDate: string;
  portalLoginUrl: string;
};

export default function RegistrationApproved({ parentName, childName, startDate, portalLoginUrl }: Props) {
  return (
    <EmailShell preview="Registration approved" heading="Welcome to Loving Family Daycare">
      <Text>Dear {parentName},</Text>
      <Text>
        {childName}&apos;s registration has been approved. The scheduled start date is {startDate}.
      </Text>
      <Text>
        You can access the parent portal here: <Link href={portalLoginUrl}>Parent Portal</Link>.
      </Text>
    </EmailShell>
  );
}
