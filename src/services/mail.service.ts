import resendClient from "../config/mail.config";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  meetingType: string;
}

function getCompanyEmails(): string[] {
  const raw = process.env.COMPANY_EMAILS;
  if (!raw) throw new Error("COMPANY_EMAILS environment variable is not set");
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function getEmailFromAddress(): string {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM environment variable is not set");
  return from;
}

function getResendFromAddress(): string {
  return process.env.RESEND_FROM || "Architectural Studio <onboarding@resend.dev>";
}

export const sendMailToCompany = async (data: ContactPayload) => {
  if (!resendClient) throw new Error("Resend client not initialized (missing RESEND_API_KEY)");

  const companyEmails = getCompanyEmails();
  const fromAddress = getResendFromAddress();

  return resendClient.emails.send({
    from: fromAddress,
    to: companyEmails,
    subject: "New Appointment Request",
    html: `
      <h3>New Appointment</h3>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Date:</b> ${data.date}</p>
      <p><b>Time Slot:</b> ${data.timeSlot}</p>
      <p><b>Meeting Type:</b> ${data.meetingType}</p>
    `,
    reply_to: data.email,
  });
};

export const sendMailToUser = async (data: ContactPayload) => {
  if (!resendClient) throw new Error("Resend client not initialized (missing RESEND_API_KEY)");

  const fromAddress = getResendFromAddress();

  return resendClient.emails.send({
    from: fromAddress,
    to: data.email,
    subject: "Appointment Received",
    html: `
      <p>Hi ${data.name},</p>
      <p>Thank you for contacting us.</p>
      <p>We’ve received your appointment request and will reach out shortly.</p>
      <br/>
      <p>— Architectural Studio Team</p>
    `,
  });
};
