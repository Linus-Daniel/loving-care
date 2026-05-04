import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

type EmailShellProps = {
  preview: string;
  heading: string;
  children: ReactNode;
};

export function EmailShell({ preview, heading, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: "#f6f8fb", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ margin: "32px auto", maxWidth: "620px", backgroundColor: "#ffffff" }}>
          <Section style={{ backgroundColor: "#0f2a44", padding: "28px" }}>
            <Heading style={{ color: "#f7c948", margin: 0 }}>Loving Family Daycare</Heading>
          </Section>
          <Section style={{ padding: "28px" }}>
            <Heading as="h2" style={{ color: "#0f2a44", marginTop: 0 }}>
              {heading}
            </Heading>
            {children}
          </Section>
          <Hr />
          <Section style={{ padding: "20px 28px" }}>
            <Text style={{ color: "#667085", fontSize: "13px" }}>
              Loving Family Daycare, Lagos, Nigeria. You received this email because you interacted with our school
              platform.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
