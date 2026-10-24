import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

// Explicit publication boundary; generated output and dependencies are not source.
const roots = new Set(['src', 'examples', 'tests', 'scripts', 'docs'])
const rootFiles = new Set(['README.md', 'SECURITY.md', 'package.json', 'package-lock.json', 'tsconfig.json', '.gitignore', '.npmrc'])
const ignored = new Set(['node_modules', 'build', '.git'])
const files = []
function visit(dir = '.') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (dir === '.' && ignored.has(entry.name)) continue
    assert.ok(!entry.isSymbolicLink(), 'Symbolic links are not allowed: ' + file)
    if (entry.isDirectory()) {
      if (dir === '.') assert.ok(roots.has(entry.name), 'Unexpected root directory: ' + entry.name)
      visit(file)
    } else {
      if (dir === '.') assert.ok(rootFiles.has(entry.name), 'Unexpected root file: ' + entry.name)
      assert.ok(!entry.name.startsWith('.env'), 'Environment files must not be published')
      assert.ok(!/\.(?:sql|png|jpe?g|webp|zip|map)$/i.test(file), 'Unreviewed artifact: ' + file)
      files.push(file)
    }
  }
}
visit()
const patterns = [
  ['project endpoint', /[a-z0-9]{20}\.supabase\.co/i],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['Supabase key literal', /sb_(?:secret|publishable)_[A-Za-z0-9_-]{16,}/],
  ['JWT literal', /eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/],
  ['GitHub credential', /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ['private Windows path', /[A-Z]:[\\/](?:Users|home)[\\/]/i],
]
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  for (const [category, pattern] of patterns) assert.ok(!pattern.test(text), category + ' found in ' + file)
}
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
assert.deepEqual(Object.keys(pkg.dependencies).sort(), ['i18next', 'react', 'react-dom', 'react-i18next'].sort())
console.log('Publication boundary and pattern audit passed for ' + files.length + ' files.')
console.log('This is a heuristic check, not a guarantee that every sensitive value is detectable.')
