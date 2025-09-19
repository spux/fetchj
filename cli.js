#!/usr/bin/env node

import fetchj from './index.js'

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    console.log('Usage: fetchj <uri> [options]')
    console.log('')
    console.log('Fetch content from any URI (http/https/file/data)')
    console.log('')
    console.log('Options:')
    console.log('  -h, --help           Show this help message')
    console.log('  -j, --json           Parse and pretty-print JSON')
    console.log('  -o, --output <file>  Write to file instead of stdout')
    console.log('  -a, --accept <type>  Set Accept header for HTTP requests')
    console.log('  -H, --header <h>     Add custom header (format: "Name: Value")')
    console.log('')
    console.log('Common Accept types:')
    console.log('  application/json     Request JSON response')
    console.log('  text/html           Request HTML response')
    console.log('  text/plain          Request plain text')
    console.log('  application/xml     Request XML response')
    console.log('  */*                 Accept any content type (default)')
    console.log('')
    console.log('Examples:')
    console.log('  fetchj https://api.github.com/users/github')
    console.log('  fetchj https://api.example.com/data --accept application/json')
    console.log('  fetchj https://example.com --header "User-Agent: fetchj/0.0.1"')
    console.log('  fetchj file:///etc/hosts')
    console.log('  fetchj data:text/plain,Hello%20World')
    console.log('  fetchj https://api.example.com/data.json --json')
    console.log('  fetchj https://example.com -o index.html')
    process.exit(0)
  }

  const uri = args[0]
  const isJson = args.includes('-j') || args.includes('--json')
  const outputIndex = args.findIndex(arg => arg === '-o' || arg === '--output')
  const outputFile = outputIndex > -1 ? args[outputIndex + 1] : null
  const acceptIndex = args.findIndex(arg => arg === '-a' || arg === '--accept')
  const acceptType = acceptIndex > -1 ? args[acceptIndex + 1] : null

  // Collect custom headers
  const headers = {}
  args.forEach((arg, i) => {
    if ((arg === '-H' || arg === '--header') && args[i + 1]) {
      const headerStr = args[i + 1]
      const colonIndex = headerStr.indexOf(':')
      if (colonIndex > -1) {
        const name = headerStr.substring(0, colonIndex).trim()
        const value = headerStr.substring(colonIndex + 1).trim()
        headers[name] = value
      }
    }
  })

  // Set Accept header if specified
  if (acceptType) {
    headers['Accept'] = acceptType
  }

  try {
    const content = await fetchj(uri, { headers })

    let output = content
    if (isJson) {
      try {
        const parsed = JSON.parse(content)
        output = JSON.stringify(parsed, null, 2)
      } catch (e) {
        console.error('Error: Content is not valid JSON')
        process.exit(1)
      }
    }

    if (outputFile) {
      const fs = await import('fs/promises')
      await fs.writeFile(outputFile, output, 'utf-8')
      console.log(`Written to ${outputFile}`)
    } else {
      console.log(output)
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()