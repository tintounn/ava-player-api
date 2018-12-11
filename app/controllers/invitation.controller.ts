import { Response, Request } from "express";
import InvitationService from "../services/invitation.service";

export default class InvitationController {

  public static async create(req: Request, res: Response) {
    let invitationService = InvitationService.getInstance();

    try {
      const invitation = await invitationService.createInvitation();

      res.status(201).json({invitation: invitation});
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }
}