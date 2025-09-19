# fetchj

Universal content fetcher for any URI type (http/https/file/data) that works in both Node.js and browsers.

## Installation

```bash
npm install fetchj

# Or install globally for CLI usage
npm install -g fetchj
```

## CLI Usage

```bash
# Fetch any URI from the command line
fetchj https://api.github.com/users/github

# Set Accept header for content negotiation
fetchj https://api.example.com/data --accept application/json

# Add custom headers
fetchj https://api.example.com --header "Authorization: Bearer token123"
fetchj https://api.example.com -H "User-Agent: fetchj/0.0.1" -H "Accept: text/html"

# Pretty-print JSON
fetchj https://api.example.com/data.json --json

# Save to file
fetchj https://example.com --output index.html

# Fetch local file
fetchj file:///etc/hosts

# Decode data URI
fetchj "data:text/plain,Hello%20World"

# Show help
fetchj --help
```

## Library Usage

```javascript
import fetchj from 'fetchj'

// Fetch from HTTP/HTTPS
const html = await fetchj('https://example.com')
const json = await fetchj('https://api.example.com/data.json')

// With Accept header for content negotiation
const jsonData = await fetchj('https://api.example.com/data', {
  headers: { 'Accept': 'application/json' }
})

// With custom headers
const response = await fetchj('https://api.example.com/data', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer token123',
    'User-Agent': 'MyApp/1.0'
  }
})

// Fetch from local file
const config = await fetchj('file:///home/user/config.json')

// Fetch from data URI
const inline = await fetchj('data:text/plain,Hello%20World')
const base64 = await fetchj('data:application/json;base64,eyJ0ZXN0Ijp0cnVlfQ==')

// No protocol defaults to HTTPS
const page = await fetchj('example.com')  // → https://example.com
```

## API

### `fetchj(uri: string, options?: object): Promise<string>`

Fetches content from any URI and returns it as a string.

**Parameters:**
- `uri` - The URI to fetch (required)
- `options` - Optional configuration object
  - `headers` - Custom headers for HTTP/HTTPS requests

Supported protocols:
- `http://` - HTTP URLs (Node.js & Browser)
- `https://` - HTTPS URLs (Node.js & Browser)
- `file://` - Local file paths (Node.js only)
- `data:` - Data URIs (RFC 2397) (Node.js & Browser)

## Error Handling

```javascript
try {
  const content = await fetchj('invalid://uri')
} catch (error) {
  console.error('Fetch failed:', error.message)
}
```

## Browser vs Node.js

This module works in both environments with these differences:
- **Browser**: Supports `http://`, `https://`, and `data:` protocols
- **Node.js**: Supports all protocols including `file://`
- Uses native `fetch()` in browsers, `node-fetch` in Node.js
- Automatically detects the environment

## Use Cases

- Fetching JSON from APIs (universal)
- Loading local configuration files (Node.js)
- Reading HTML pages (universal)
- Processing data URIs from HTML (universal)
- Universal content loader for CLI tools and web apps

## License

MIT