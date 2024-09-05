import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (payload: any) => {
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '20d'
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
