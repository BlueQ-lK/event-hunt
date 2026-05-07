import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetUrl: string;
}

const ResetPasswordEmail = ({ resetUrl }: ResetPasswordEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl p-8 mx-auto max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-gray-900 mb-6 text-center">
                Reset Your Password
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-6 leading-6">
                We received a request to reset your password. If you didn&apos;t
                make this request, you can ignore this email.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-[6px] text-[16px] font-medium box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 leading-5">
                If the button above doesn&apos;t work, you can copy and paste
                the following link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-8 break-all">
                {resetUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 mb-6 leading-5">
                This link will expire in 1 hour for security reasons.
              </Text>

              <Text className="text-[14px] text-gray-600 leading-5">
                If you did not request a password reset, please contact support
                immediately.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6 mt-8">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-2">
                © 2026 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-2">
                123 Business Street, Mangaluru, Karnataka 575001, India
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
