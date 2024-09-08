import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (
  payload: any,
  secret: string,
  expiresIn: string
) => {
  return jsonwebtoken.sign(payload, secret as string, {
    expiresIn
  });
};

export const decodeToken = (token: string): any => {
  let decoded = null;
  try {
    decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return null;
  }
  return decoded;
};
