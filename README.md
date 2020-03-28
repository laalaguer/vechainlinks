# Vechain Links - Show me interesting subjects on VeChain!

`vechainlinks.com` is a place where you find interesting people, project updates and news from big names in VeChain eco-system.

## Milestone #1: Build a Static Website

Target: Collect Links inside VeChain eco-system.
- Medium
- Twitter
- Reddit
- Weibo
- Official Sites
- Standalone Media Sites
- Useful Tools.
- Telegram Channels
- Codes: VeChain
- Documentation for developers.
- Dapps URLs, Dapps Githubs

Result:
- [x] A simple working static site.
- [x] 5-10 users to comment about the website.
- [x] Open for public members to contribute.

## Milestone #2: Make the Website Dynamic

Apart from above "static" goals, build a "scraper" or "reporter" system, that automatically gathers information from Twitter/Medium/Reddit/Github to show "progress" of the VeChain.

Target #1:
- { Reddit, Medium, WP } Feeds -- RSS can be obtained directly.
- { Twitter, Weibo } Feeds. -- RSS can be obtained from 3rd party.
- { Website } - simple hash-then-cache scrapper bot.
- { Telegram, Github } - Need to develop ourselves.
- Standardize the "social media" backend and output a single RSS API: {bot_type:, user_identifier:, newest:, previous_cache:}
- Cache the RSS result, server fetch from source every X minutes.


Reddit: [Atom-1.0]
https://www.reddit.com/r/VeChain/.rss

Medium: [RSS-2]
https://medium.com/feed/@Medium

WP: RSS, [RSS-2], [Atom-1.0] 
http://example.com/?feed=rss2
http://example.com/?feed=atom

Twitter: [RSS-2.0]
https://queryfeed.net/tw?q=%40abyteahead

Weibo: [RSS-2.0]
https://rssfeed.today/weibo/rss/6353774918

Github: [Atom-1.0]
https://github.com/vechain/thor/releases.atom
https://github.com/vechain/thor/tags.atom
https://github.com/vechain/thor/commits/master.atom
https://github.com/vechain/thor/commits.atom

We will output feeds with Atom-1.0 style, hash something so we get `<id>` of the feed.

```
request

[
    {
        channel_type: "reddit", "medium", "wordpress", "twitter", "weibo", "github_repo", "github_project",
        args: {}
    }
]

response

[
    {
        simplified_rss
    }
]

```
Target #2:
- A Dynamic frontend to display Feeds (excerpt)
- Still don't use any package tool possible, easy to understand by collaborators.

Result:
- A backend, to collect feeds on different platforms, and turning into RSS.
- A simple, dynamic website frontend, to poll RSS feed and display.
- 10-15 users to comment about the website.
- Open for public members to contribute.

## Milestone #3: Subscribe and Analyze

- Google Analytics
- Email Subscribers
- Get first 20-50 users on board.

- Email = https://subscribe.vechainlinks.com/?redirect=url
- 