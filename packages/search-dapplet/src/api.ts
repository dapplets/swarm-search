function strip(html: string): string {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export interface Content {
  url: string;
  height: number;
  width: number;
}

export interface Author {
  name: string;
  icon: string;
}

export interface SearchResult {
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  thumbnail: Content[];
  content: Content | null;
  author: Author | null;
}

export interface Response {
  results: SearchResult[],
  isNextAvailable: boolean
}

export class Api {
  constructor(private _url: string) { }

  async search(query: string, offset: number, limit: number): Promise<Response> {
    try {
      const url = this._url
        .replace(/{searchTerms\??}/gm, query.replace(/ /gm, '+'))
        .replace(/{startIndex\??}/gm, offset.toString())
        .replace(/{count\??}/gm, limit.toString());

      const xml = await fetch(url).then(x => x.text());
      const parser = new DOMParser();
      const dom = parser.parseFromString(xml, 'application/xml');
      const results: SearchResult[] = Array.from(dom.querySelectorAll('rss > channel > item')).map(x => ({
        title: x.querySelector('title').textContent,
        link: x.querySelector('link').textContent,
        pubDate: new Date(x.querySelector('pubDate').textContent),
        description: strip(x.querySelector('description').textContent),
        thumbnail: Array.from(x.getElementsByTagName('media:thumbnail')).map(y => ({
          url: y.getAttribute('url'),
          height: parseInt(y.getAttribute('height')),
          width: parseInt(y.getAttribute('width'))
        })),
        content: (x.getElementsByTagName('media:content').length > 0) ? {
          url: x.getElementsByTagName('media:content')[0].getAttribute('url'),
          height: parseInt(x.getElementsByTagName('media:content')[0].getAttribute('height')),
          width: parseInt(x.getElementsByTagName('media:content')[0].getAttribute('width'))
        } : null,
        author: (x.querySelectorAll('[role=author]')) ? {
          name: Array.from(x.querySelectorAll('[role=author]')).map(x => x.innerHTML).find(x => x.indexOf('http://') !== 0 && x.indexOf('https://') !== 0),
          icon: Array.from(x.querySelectorAll('[role=author]')).map(x => x.innerHTML).find(x => x.indexOf('http://') === 0 || x.indexOf('https://') === 0)
        } : null
      }));

      const isNextAvailable = !!Array.from(dom.querySelector('rss > channel').getElementsByTagName('atom:link')).find(x => x.getAttribute("rel") === "next");

      return { results, isNextAvailable };
    } catch (err) {
      console.error('The search engine returned the error', err);
      return { results: [], isNextAvailable: false };
    }
  }
}