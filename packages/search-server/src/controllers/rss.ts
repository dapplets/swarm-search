import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import xml from 'xml';

export function get(req: Request, res: Response) {
    const data = fs.readFileSync(path.join(__dirname, '../../src/search-results.json'), { encoding: 'utf-8' });
    const xmlString = xml(JSON.parse(data), { declaration: true });
    res.setHeader('Content-Type', 'text/xml');
    res.send(xmlString);
}