export default new class SukebeiNyaa {
  base = 'https://sukebei.nyaa.si'

  async single({ titles, episode }) {
    if (!titles?.length) return []

    const query = this.buildQuery(titles[0], episode)
    const url = `${this.base}/?f=0&c=0_0&q=${encodeURIComponent(query)}`

    const res = await fetch(url)
    if (!res.ok) return []

    const html = await res.text()
    return this.parseHTML(html)
  }

  batch = this.single
  movie = this.single

  buildQuery(title, episode) {
    let query = title.replace(/[^\w\s-]/g, ' ').trim()
    if (episode) query += ` ${episode.toString().padStart(2, '0')}`
    return query
  }

  parseHTML(html) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const rows = Array.from(doc.querySelectorAll('table.torrent-list > tbody > tr'))

    return rows.map(row => {
      const titleEl = row.querySelector('td.torrent > a:nth-child(2)')
      const linkEl = row.querySelector('td.torrent > a:nth-child(1)')
      const seedersEl = row.querySelector('td:nth-child(5)')
      const leechersEl = row.querySelector('td:nth-child(6)')
      const sizeEl = row.querySelector('td:nth-child(4)')

      const magnet = linkEl?.href || ''
      const hash = magnet.match(/btih:([a-fA-F0-9]+)/)?.[1] || ''

      return {
        title: titleEl?.textContent.trim() || '',
        link: magnet,
        hash,
        seeders: Number(seedersEl?.textContent.trim() ?? 0),
        leechers: Number(leechersEl?.textContent.trim() ?? 0),
        downloads: 0,
        size: this.parseSize(sizeEl?.textContent.trim() ?? ''),
        date: new Date(),
        verified: false,
        type: 'alt',
        accuracy: 'medium'
      }
    })
  }

  parseSize(sizeStr) {
    const match = String(sizeStr).match(/([\d.]+)\s*(KiB|MiB|GiB|KB|MB|GB)/i)
    if (!match) return 0
    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()
    switch (unit) {
      case 'KIB':
      case 'KB': return value * 1024
      case 'MIB':
      case 'MB': return value * 1024 * 1024
      case 'GIB':
      case 'GB': return value * 1024 * 1024 * 1024
      default: return 0
    }
  }

  async test() {
    try {
      const res = await fetch(this.base)
      return res.ok
    } catch {
      return false
    }
  }
}()
