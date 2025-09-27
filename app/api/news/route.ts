import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"

type Item = {
  title: string
  link: string
  pubDate?: string
  source?: string
}

const FEEDS = [
  "https://news.google.com/rss/search?q=banking&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=investments&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=stocks&hl=en-US&gl=US&ceid=US:en",
]

async function fetchFeed(url: string): Promise<Item[]> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return []
  const xml = await res.text()

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  })
  const parsed = parser.parse(xml)

  // Google News RSS structure: rss.channel.item[]
  const items = parsed?.rss?.channel?.item ?? []
  return items
    .map((it: any) => ({
      title: String(it.title ?? "")
        .replace(/<[^>]+>/g, "")
        .trim(),
      link: String(it.link ?? "").trim(),
      pubDate: it.pubDate ? String(it.pubDate) : undefined,
      source: it?.source?.["#text"] ? String(it.source["#text"]) : "Google News",
    }))
    .filter((i: Item) => i.title && i.link)
}

export async function GET() {
  try {
    const lists = await Promise.all(FEEDS.map((u) => fetchFeed(u)))
    const merged = lists.flat()

    const sorted = merged.sort((a, b) => {
      const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0
      const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0
      return tb - ta
    })

    // Keep it light
    const top = sorted.slice(0, 30)
    return NextResponse.json({ items: top })
  } catch (e) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}
