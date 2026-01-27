import { Request, Response } from "express";
import { sendMailToCompany, sendMailToUser } from "../services/mail.service";

export const submitContact = async (req: Request, res: Response) => {
  try {
    await Promise.all([
      sendMailToCompany(req.body),
      sendMailToUser(req.body),
    ]);

    return res.status(200).json({ message: "Emails sent successfully" });
  } catch (error: any) {
    console.error("MAIL ERROR:", error);

    return res.status(500).json({
      message: "Email service unavailable",
    });
  }
};
