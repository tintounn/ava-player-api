import * as jsonwebtoken from "jsonwebtoken";

export default class JwtService {

  private static instance : JwtService;

  private readonly secretKey: string;

  private constructor() {
    this.secretKey = process.env.JWT_SECRET || 'secret';
  }

  public static getInstance() : JwtService {
    if(!this.instance) {
      this.instance = new JwtService();
    }

    return this.instance;
  }

  public generateKey(data) {
    return jsonwebtoken.sign({
      exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.JWT_EXPIRATION) || (60 *60)),
      data: data
    }, this.secretKey);
  }

  public verify(token) : any {
    return jsonwebtoken.verify(token, this.secretKey);
  }
}