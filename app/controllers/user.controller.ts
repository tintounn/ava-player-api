import { Response, Request } from "express";

import User from '../models/user.model';
import UserService from "../services/user.service";
import JwtService from "../services/jwt.service";
import InvitationService from "../services/invitation.service";

export default class UserController {

  public static async login(req: Request, res: Response) {
    let userService: UserService = UserService.getInstance();
    
    try {
      let struct = await userService.login(req.body.username, req.body.password);

      res.status(201).json(struct);
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async register(req: Request, res: Response) {
    let userService: UserService = UserService.getInstance();
    let invitationService: InvitationService = InvitationService.getInstance();
    let jwtService: JwtService = JwtService.getInstance();

    try {
      let invitationIsClosed = await invitationService.isClosed(req.body.token);

      if(!invitationIsClosed) {
        let tokenData = jwtService.verify(req.body.token);
        let user = await userService.create(req.body.username, req.body.password, 2, false);
        await invitationService.close(req.body.token);

        res.status(201).json({user: user});
      } else {
        throw new Error("Invitation is already used");
      }
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async valid(req: Request, res: Response) {
    let userService: UserService = UserService.getInstance();
    let jwtService: JwtService = JwtService.getInstance();

    try {
      const decoded = jwtService.verify(req.body.token);
      const user = await userService.findById(decoded.data.user_id);

      res.status(200).json({user: user});
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async findAll(req: Request, res: Response) {
    let userService: UserService = UserService.getInstance();

    try {
      const users = await userService.findAll();

      res.status(200).json({users: users});
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async update(req: Request, res: Response) {
    let userService: UserService = UserService.getInstance();

    try {
      const user = await userService.update(req.params.id, req.body);

      res.status(200).json({user: user});
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }
}