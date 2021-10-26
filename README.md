# Swarm Search

The set of modules augmenting Google and YouTube search pages with data from OpenSearch-compatible engines.

## Getting Started

### Google Search

The dapplet works at Google search pages. In the tab "all" any content type will be shown, in the tab "video" - only videos.

[![Watch the video](https://github.com/dapplets/swarm-search/raw/main/docs/demo-google-search-preview.png)](https://drive.google.com/file/d/1IFLuD0vqVHKlKuHBm71if-7zLKL1oaXL/view?usp=sharing)

[![Download the video]](https://github.com/dapplets/swarm-search/raw/main/docs/demo-google-search.mp4)

### YouTube Search

At the YouTube only video search results are available.

[![Watch the video](https://github.com/dapplets/swarm-search/raw/main/docs/demo-youtube-search-preview.png)](https://github.com/dapplets/swarm-search/raw/main/docs/demo-youtube-search.mp4)

### Indexing via Swarm Gateway

[**Swarm Gateway**](https://gateway.ethswarm.org/) is the website allowing any user to upload a small file to Swarm free. We've created the dapplet "Swarm Indexer" to augment this webpage for collecting metadata from user.

[![Watch the video](https://github.com/dapplets/swarm-search/raw/main/docs/demo-gateway-preview.png)](https://github.com/dapplets/swarm-search/raw/main/docs/demo-gateway.mp4)

### Indexing via Media Downloader

[**Media Downloader**](https://github.com/dapplets/media-downloader) is a dapplet created at Liberate Data Week Hackathon. We added the feature which allows you to add video to the index and make it available via Swarm Search dapplet.

[![Watch the video](https://github.com/dapplets/swarm-search/raw/main/docs/demo-media-downloader-preview.png)](https://github.com/dapplets/swarm-search/raw/main/docs/demo-media-downloader.mp4)

### Change Search Engine

Two search engines were verified at the development:

DevianArt's backend containing a huge collection of media content.

```
https://backend.deviantart.com/rss.xml?q={searchTerms}&offset={startIndex}&limit={count}
```

Swarm Search server written as a mock of non-developed yet search engine which allows to add files uploaded to Swarm via dapplets working on Swarm Gateway and Media Downloader.

```
https://swarm-search-server.herokuapp.com/rss?q={searchTerms}&count={count}&offset={startIndex}&type={type?}
```

Any [OpenSearch-compatible](https://github.com/dewitt/opensearch/blob/main/opensearch-1-1-draft-6.md) search engine can be specified in the dapplet's settings. 

The instruction about how to change a search engine in the dapplet's settings is in following video.

[![Watch the video](https://github.com/dapplets/swarm-search/raw/main/docs/demo-change-search-engine-preview.png)](https://github.com/dapplets/swarm-search/raw/main/docs/demo-change-search-engine.mp4)

## Project Architecture

![Communication diagram](https://github.com/dapplets/swarm-search/raw/main/docs/communication.png)

### Actors

* **Uploader** - an user uploading files to the Swarm.
* **Searcher** - an user searching something with activated Search Dapplet.

### Components

* [**Indexer Dapplet**](https://github.com/dapplets/swarm-search/tree/main/packages/swarm-indexer-dapplet) - augments Swarm Gateway to collect metadata from Uploader.
* [**Search Dapplet**](https://github.com/dapplets/swarm-search/tree/main/packages/search-dapplet) - injects search results in third party websites.
* [**Search API**](https://github.com/dapplets/swarm-search/tree/main/packages/search-server) - a server which proxies the Elasticsearch engine and transforms data to OpenSearch compatible format.
* **Elasticsearch** - an engine implementing full-text search.
* [**Swarm Gateway**](https://gateway.ethswarm.org/) - a website for free files uploading to the Swarm.
* **Bee Nodes** - Swarm network storing data in a decentralized way.

Bee Nodes

### A: File uploading (indexing)

A1: An Uploader (user) attaches a file to the Swarm Gateway and fills out the manifest form for indexing.

A2: Swarm Gateway sends a file to Bee node.

A3: Bee node returns a swarm reference hash.

A4: The Indexer Dapplet intercepts the uploaded file and swarm reference.

A5: The Indexer Dapplet sends file, reference and metadata to the Search Backend.

A6: Search API retranslates the query to Elasticsearch.

### B: File searching

B1: Searcher opens the website and sends a query.

B2: Search Dapplet intercepts the entered query from the website.

B3: Search Dapplet sends [OpenSearch-compatible query](#custom-opensearch-query) to fetch search results.

B4: Search API receives OpenSearch query and transforms it to ElasticSearch request.

B5: Elasticsearch returns search results in JSON format.

B6: Search API transforms JSON to OpenSearch's XML and returns to the dapplet.

B7: Search Dapplet injects search results to the website.

B8: Searcher can see external search results and open them.

### Custom OpenSearch Query

The Search Dapplet uses additional `type` parameter to filter search results by content type.

This parameter is not specified by OpenSearch specification and must be implemented by a search server if you want to have content type specific search.

Valid value of this parameter is `video`.

```
/rss?q={searchTerms}&count={count}&offset={startIndex}&type={type?}
```

## Development

### Build Project

This project is designed as monorepo, so NPM Workspaces feature is required to install dependencies.

```
npm install
```

To start the development server use command:

```
npm start
```

### Elasticsearch Installation

1. Install Elasticsearch by following [this official guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)

2. Install [Ingest Attachment Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/current/ingest-attachment.html) which allows to search by files content.

3. Create the piplene and add processors that allows searching by file content and removes unused sorces fields.

```
PUT http://localhost:9200/_ingest/pipeline/attachment
{
    "description": "Extract attachment information",
    "processors": [
        {
            "attachment": {
                "field": "data",
                "target_field": "attachment"
            }
        },
        {
            "remove": {
                "field": "data"
            }
        }
    ]
}
```

4. Create the index

```
PUT http://localhost:9200/fs_index
```

5. Create `/packages/search-server/.env` file with URL to the Elasticsearch HTTP API and start development!

The URL must ending at slash `/` symbol.

```
ELASTICSEARCH_URL=http://localhost:9200/
```
