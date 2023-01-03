import { Request } from 'express';

export const getClientIp = (req: Request): string => {
  let pass = req.headers['x-forwarded-for'];
  if (typeof pass === 'object') {
    pass = pass.join('|');
  }
  return (
    pass ||
    // req.connection.remoteAddress ||
    req.socket.remoteAddress
    // req.connection.socket.remoteAddress
  );
};
