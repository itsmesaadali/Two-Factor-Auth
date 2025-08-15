import {add} from 'date-fns'
import { Response } from 'express';
import { REFRESH_PATH } from './cookie';

export const ONE_DAY_IN_MS = 24* 60 * 60 * 1000;


export const thirtyDaysFromNow = ():Date => 
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const fortyFiveMinutedFromNow = ():Date => {
    const now = new Date()
    now.setMinutes(now.getMinutes() * 45)
    return now 
}


export const calculateExpirationDate = (expiresIn: string = '15m'): Date => {
    // match number * unit (m = minutes, h = hours, d = days)
    const match = expiresIn.match(/^(\d+)([mhd])$/);
    if (!match) throw new Error('Invalid format. Use "15m", "1h", or "2d"');
    
    const value = match[1]; // Get the numeric value
    const unit = match[2];  // Get the time unit
    
    if (!value || !unit) {
        throw new Error('Invalid format. Use "15m", "1h", or "2d"');
    }

    const numericValue = parseInt(value, 10);
    const expirationDate = new Date();

    switch (unit) {
        case "m":
            return add(expirationDate, { minutes: numericValue });
        case "h":
            return add(expirationDate, { hours: numericValue });
        case "d":
            return add(expirationDate, { days: numericValue });    
        default:
            throw new Error('Invalid unit. Use "m", "h", or "d"');
    }
}

export const clearAuthenticationCookies = (res:Response): Response =>
    res.clearCookie('accessToken').clearCookie('refreshToken', {
        path:REFRESH_PATH,
    })