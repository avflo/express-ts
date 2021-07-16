import rateLimit from 'express-rate-limit';

export default rateLimit ({
        windowMs: 15 * 1000, // seconds
        max: 35 // max request per x time
    })


