import {Request,Response} from "express";
import { sendMailToCompany,sendMailToUser } from "../services/mail.service";

export const submitContact = async (req: Request, res: Response) => {
  try {
    await sendMailToCompany(req.body);
    await sendMailToUser(req.body);

    res.status(200).json({ message: "Emails sent Successfully" });
  } catch (error: any) {
    console.error("MAIL ERROR:", error.message);
    res.status(500).json({
      message: "Emails sending failed",
      error: error.message,
    });
  }
};
