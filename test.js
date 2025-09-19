import fetchj from './index.js'
import assert from 'assert'

async function runTests() {
  console.log('Testing fetchj...')

  // Test 1: HTTP/HTTPS
  try {
    const content = await fetchj('https://api.github.com/users/github')
    const json = JSON.parse(content)
    assert(json.login === 'github', 'Should fetch GitHub API')
    console.log('✓ HTTP/HTTPS test passed')
  } catch (e) {
    console.log('✗ HTTP/HTTPS test failed:', e.message)
  }

  // Test 2: Data URI (plain text)
  try {
    const content = await fetchj('data:text/plain,Hello%20World')
    assert(content === 'Hello World', 'Should decode data URI')
    console.log('✓ Data URI test passed')
  } catch (e) {
    console.log('✗ Data URI test failed:', e.message)
  }

  // Test 3: Data URI (base64)
  try {
    const content = await fetchj('data:text/plain;base64,SGVsbG8gV29ybGQ=')
    assert(content === 'Hello World', 'Should decode base64 data URI')
    console.log('✓ Base64 data URI test passed')
  } catch (e) {
    console.log('✗ Base64 data URI test failed:', e.message)
  }

  // Test 4: Data URI (JSON)
  try {
    const content = await fetchj('data:application/json,{"name":"test"}')
    const json = JSON.parse(content)
    assert(json.name === 'test', 'Should fetch JSON data URI')
    console.log('✓ JSON data URI test passed')
  } catch (e) {
    console.log('✗ JSON data URI test failed:', e.message)
  }

  // Test 5: File URI (create a test file first)
  try {
    const fs = await import('fs')
    fs.writeFileSync('/tmp/test-fetchj.json', '{"test": true}')
    const content = await fetchj('file:///tmp/test-fetchj.json')
    const json = JSON.parse(content)
    assert(json.test === true, 'Should fetch file URI')
    console.log('✓ File URI test passed')
  } catch (e) {
    console.log('✗ File URI test failed:', e.message)
  }

  console.log('All tests completed!')
}

runTests()