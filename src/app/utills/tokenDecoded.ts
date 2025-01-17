import jwt, { JwtPayload } from 'jsonwebtoken';

// token decoded
export const tokenDecoded = (verifyItem: string, verifySecret: string) => {
  const decoded = jwt.verify(
    verifyItem,
    verifySecret,
  ) as JwtPayload;
  return decoded;
};
