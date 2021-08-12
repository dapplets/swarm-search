import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    const suggestions = ["cats", ["cats", "cats and dogs"]];
    const json = JSON.stringify(suggestions);
    res.setHeader('Content-Type', 'application/x-suggestions+json');
    res.send(json);
}