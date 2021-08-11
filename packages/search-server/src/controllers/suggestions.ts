import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    const suggestions = ["cats", ["cats", "cats and dogs", "cats-x. com", "catsthegame.com", "catsan 10 л купить дешево в спб"], ["", "", "", "", ""], [], { "google:clientdata": { "bpc": false, "phi": 0, "tlw": false }, "google:suggestdetail": [{}, {}, {}, {}, {}], "google:suggestrelevance": [9, 2, 2, 2, 1], "google:suggesttype": ["QUERY", "QUERY", "QUERY", "QUERY", "QUERY"], "google:verbatimrelevance": 1 }];
    const json = JSON.stringify(suggestions);
    res.setHeader('Content-Type', 'application/x-suggestions+json');
    res.send(json);
}