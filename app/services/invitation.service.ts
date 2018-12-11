import Invitation from "../models/invitation.model";
import {randomString} from "../utils";
import JwtService from "./jwt.service";

export default class InvitationService {

  private static instance : InvitationService;

  private constructor() { }

  public static getInstance() : InvitationService {
    if(!this.instance) {
      this.instance = new InvitationService();
    }

    return this.instance;
  }

  public async createInvitation() {
    let jwtService = JwtService.getInstance();
    let InvitationModel = Invitation.getModel();

    let invitation = await (new InvitationModel({token: jwtService.generateKey({
      role: 2,
      is_adult: false,
      type: 10
    })})).save();

    if(!invitation) {
      throw new Error("Invitation generation error");
    }

    return invitation;
  }

  public async invitationIsClosed(token) {
    let InvitationModel = Invitation.getModel();
    let invitation = await InvitationModel.findOne({token: token, used: true});

    return invitation != null;
  }

  public async closeInvitation(token) {
    let InvitationModel = Invitation.getModel();
    let invitation = await InvitationModel.findOne({token: token});
  
    invitation.used = true;

    return await invitation.save();
  }
}