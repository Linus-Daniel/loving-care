import { Link, Text } from "@react-email/components";

import { EmailShell } from "./EmailShell";

type Props = {
  parentName: string;
  amount: string;
  description: string;
  transactionId: string;
  date: string;
  receiptUrl?: string;
};

export default function PaymentReceipt({ parentName, amount, description, transactionId, date, receiptUrl }: Props) {
  return (
    <EmailShell preview="Payment receipt" heading="Payment receipt">
      <Text>Dear {parentName},</Text>
      <Text>
        We received your payment of {amount} for {description} on {date}.
      </Text>
      <Text>Transaction ID: {transactionId}</Text>
      {receiptUrl ? <Link href={receiptUrl}>View receipt</Link> : null}
    </EmailShell>
  );
}
