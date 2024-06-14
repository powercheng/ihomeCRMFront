import { User } from "./user";

export interface JwtPayload {
    sub: string;
    user: User;
    iat: number;
    // 添加其他可能的字段
  }