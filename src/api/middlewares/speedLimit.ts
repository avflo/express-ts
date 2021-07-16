import slowDown from "express-slow-down";

export default slowDown ({
        windowMs: 15 * 1000, // seconds
        delayAfter: 10, // allow 15 requests per x time, then...
        delayMs: 500 // begin adding 500ms of delay per request above 100:
        // request # 16 is delayed by  500ms
        // request # 17 is delayed by 1000ms
        // request # 18 is delayed by 1500ms
        // etc.
    })