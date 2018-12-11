import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";

import MongoDB from "./app/mongo";

import File from "./app/models/file.model";
import Movie from "./app/models/file.model";

import CoreController from "./app/controllers/core.controller";
import UserController from "./app/controllers/user.controller";
import MovieController from "./app/controllers/movie.controller";
import InvitationController from "./app/controllers/invitation.controller";
import User from "./app/models/user.model";
import UserService from "./app/services/user.service";

class App {
  
  private app: express.Application;
  private server: http.Server;

  private hostname: string = process.env.HOSTNAME || "0.0.0.0";
  private port: number = parseInt(process.env.PORT) || 8080;

  constructor() {
    this.app = express();

    this.init();
  }

  private async init() {

    try {
      await MongoDB.getInstance().setup();
      await this.config();
      await this.routes();
      await this.setupAdmin();
      await this.run();
    } catch (err) {
      console.error(err);
    }
  }

  private async setupAdmin() {
    let userService = UserService.getInstance();
    let UserModel = User.getModel();

    let admin = await UserModel.findOne({username: 'admin'});
    if(!admin) {
      await userService.create("admin", process.env.ADMIN_PASSWORD || "admin", 1, true);
    }
  }

  private async routes() {
    const router : express.Router = express.Router();

    /* ##### USERS ##### */
    router.post('/valid', UserController.valid);
    router.post('/auth', UserController.login);
    router.get('/users', UserController.findAll);
    router.post('/register', UserController.register);

    /* ##### INVITATIONS ##### */
    router.post('/invitations', InvitationController.create);


    /* ##### MOVIES ##### */
    router.get('/movies/search', MovieController.search);
    router.get('/movies/:id', MovieController.findById);
    router.get('/movies/:id/stream', MovieController.stream);
    router.get('/movies', MovieController.findAll);
    router.post('/movies', MovieController.create);

    this.app.use('/', router);
  }

  private async config() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private run() : void {
    this.server = this.app.listen(this.port, this.hostname, (err) => {
      if(err) {
        throw new Error(err);
      } else {
        console.log(`Server launch on ${this.hostname}:${this.port}`);
      }
    });
  }
}

(new App());