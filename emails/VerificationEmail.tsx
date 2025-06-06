import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button
} from '@react-email/components';

// If the error persists after installing @react-email/components, try:
// import { Html, Head, Font, Preview, Heading, Row, Section, Text } from '@react-email/html';

// Note: You need to install the package first:
// npm install @react-email/components
// or
// yarn add @react-email/components

interface VerificationEmailProps {
    username: string;
    verificationCode: string;
}

export default function VerificationEmail({
    username,
    verificationCode
}: VerificationEmailProps) {
    return (
        <Html lang='en' dire='ltr'>
            <Head>
                <title>Verification Code</title>
                <Font // You can delete the font
                fontFamily="Roboto"
                fallbackFontFamily="Verdena"
                webFont={{
                    url: '',
                    format: ''
                }}
                fontWeight={400}
                fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verification code: {verificationCode}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for signing up for our service. Please use the following verification code to complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text>{verificationCode}</Text>
                </Row>
                <Row>
                    <Text>
                        If you did not sign up for our service, please ignore this email.
                    </Text>
                </Row>
                <Row>
                    
                </Row>
            </Section>
        </Html>
    )
}