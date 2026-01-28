import sgMail from "../config/mail.config";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  meetingType: string;
}

const companyEmails = process.env.COMPANY_EMAILS!.split(",");

export const sendMailToCompany = async (data: ContactPayload) => {
  return sgMail.send({
    from: {
      email: process.env.EMAIL_FROM!,
      name: "Website Contact",
    },
    to: companyEmails,
    replyTo: data.email, // IMPORTANT
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
  });
};

export const sendMailToUser = async (data: ContactPayload) => {
  return sgMail.send({
    from: {
      email: process.env.EMAIL_FROM!,
      name: "Architectural Studio",
    },
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
