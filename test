export default class AbstractSource {
  base = ''

  async single(params) { throw new Error('Not implemented') }
  async batch(params) { return this.single(params) }
  async movie(params) { return this.single(params) }

  parseSize(sizeStr) {
    const match = String(sizeStr).match(/([\d.]+)\s*(KiB|MiB|GiB|KB|MB|GB)/i)
    if (!match) return 0
    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()
    switch (unit) {
      case 'KIB': case 'KB': return value * 1024
      case 'MIB': case 'MB': return value * 1024 * 1024
      case 'GIB': case 'GB': return value * 1024 * 1024 * 1024
      default: return 0
    }
  }
}
