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

export class Api {
  async search(query: string, offset: number = 0): Promise<SearchResult[]> {
    const url = `https://backend.deviantart.com/rss.xml?q=${query.replace(/ /gm, '+')}&offset=${offset}`;
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
    return results;
  }
}

/*
{
  title: "Search result from Ethereum Swarm",
  views: "10M",
  date: "today",
  channel: "Ethereum Swarm",
  description: "We are injecting search results into YouTube and Google.",
  badges: [{
    label: 'SWARM',
    color: '#ffc300'
  }]
}
*/