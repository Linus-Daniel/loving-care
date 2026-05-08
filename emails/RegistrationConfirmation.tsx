import { Link, Text } from "@react-email/components";

import { EmailShell } from "./EmailShell";

type Props = {
  parentName: string;
  childName: string;
  confirmationNumber: string;
  program: string;
  portalSetupUrl: string;
  portalSetupLabel: string;
  nextSteps: string[];
};

export default function RegistrationConfirmation({
  parentName,
  childName,
  confirmationNumber,
  program,
  portalSetupUrl,
  portalSetupLabel,
  nextSteps,
}: Props) {
  return (
    <EmailShell preview="Registration received" heading="Registration received">
      <Text>Dear {parentName},</Text>
      <Text>
        We received {childName}&apos;s registration for {program}. Your confirmation number is{" "}
        <strong>{confirmationNumber}</strong>.
      </Text>
      <Text>
        Next, <Link href={portalSetupUrl}>{portalSetupLabel}</Link>. This keeps future payments, messages, and
        enrollment updates connected to your family profile.
      </Text>
      {nextSteps.map((step) => (
        <Text key={step}>- {step}</Text>
      ))}
    </EmailShell>
  );
}
