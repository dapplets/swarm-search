import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.send('<html><body>The search results page will be here soon.</body></html>');
}