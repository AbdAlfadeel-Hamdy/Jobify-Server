import jwt, { verify, JwtPayload } from "jsonwebtoken";

export const createJWT = async (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = (token: string) => {
  const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  return decoded;
};
