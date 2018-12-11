import * as crypto from "crypto";

import User from "../models/user.model";

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
    let UserModel = User.getModel();
    let users = await UserModel.find();

    if(!users) {
      throw new Error('Users not found');
    }

    for(let index in users) {
      users[index].password = undefined;
    }

    return users;
  }

  public async findById(id: string) {
    let UserModel = User.getModel();
    let user = await UserModel.findById(id);

    if(!user) {
      throw new Error('User not found');
    }

    user.password = undefined;

    return user;
  }

  public async create(username: string, password: string, role: number, isAdult: boolean) {
    let UserModel = User.getModel();

    let user = new UserModel({
      username: username,
      password: password,
      role: role,
      is_adult: isAdult,
      email: "thisnotemail"
    });

    user = await user.save();
    user.password = undefined;

    return user;
  }

  public async login(username: string, password: string) {
    let UserModel = User.getModel();
    let user = await UserModel.findOne({username: username});

    if(!user) {
      throw new Error('User not found');
    }

    const hashedPassword = crypto.createHash(this.algo).update(password).digest('hex');

    console.log(hashedPassword, user.password);

    if(user.password !== hashedPassword) {
      throw new Error('Password mismatch');
    }

    user.password = undefined;

    return user;
  }
}