import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
let resendClient: Resend | null = null;
if (!apiKey) {
	console.warn("RESEND_API_KEY is not set. Email sending will be disabled.");
} else {
	try {
		resendClient = new Resend(apiKey);
	} catch (err) {
		console.error("Failed to create Resend client:", err);
	}
}

export default resendClient;
