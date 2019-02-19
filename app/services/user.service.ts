import * as crypto from "crypto";

import User from "../models/user.model";
import JwtService from "./jwt.service";

export default class UserService {

  private readonly algo : string = "sha256"; 

  private static instance : UserService;

  private constructor() {}

  public static getInstance() : UserService {
    if(!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  public async findAll() {
    let users: any = await User.find();

    if(!users) {
      throw new Error('Users not found');
    }

    for(let index in users) {
      users[index].password = undefined;
    }

    return users;
  }

  public async findById(id: string) {
    let user: any = await User.findById(id);

    if(!user) {
      throw new Error('User not found');
    }

    user.password = undefined;

    return user;
  }

  public async create(username: string, password: string, role: number, isAdult: boolean) {
    let user: any = new User({
      username: username,
      password: crypto.createHash(this.algo).update(password).digest('hex'),
      role: role,
      is_adult: isAdult,
      email: "thisnotemail"
    });

    user = await user.save();
    user.password = undefined;

    return user;
  }

  public async update(id: string, body: any) {
    let user: any = await User.findById(id);

    if(!user) {
      throw new Error('User not found');
    }

    if(body.password && body.old_password) {
      const oldPassword = crypto.createHash(this.algo).update(body.old_password).digest('hex');
      
      if(user.password != oldPassword) {
        throw new Error('Bad old password');
      }

      user.password = crypto.createHash(this.algo).update(body.password).digest('hex');
    }

    if(body.role) {
      user.role = body.role;
    }
    
    if(body.is_adult) {
      user.is_adult = body.is_adult;
    }

    await user.save();

    return await this.findById(id);
  }

  public async login(username: string, password: string) {
    const jwtService: JwtService = JwtService.getInstance();
    let user: any = await User.findOne({username: username});

    if(!user) {
      throw new Error('User not found');
    }

    const hashedPassword = crypto.createHash(this.algo).update(password).digest('hex');

    if(user.password !== hashedPassword) {
      throw new Error('Password mismatch');
    }

    user.password = undefined;

    return {
      user: user,
      token: jwtService.generateKey({user_id: user._id, role: user.role, type: JwtService.USER_TOKEN})
    };
  }
}