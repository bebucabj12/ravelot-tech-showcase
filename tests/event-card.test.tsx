import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { EventCard } from '../src/components/EventCard.js'
import { changeLanguage } from '../src/i18n/index.js'
import { syntheticEvent } from '../examples/synthetic-events.js'

for (const language of ['en', 'es'] as const) {
  for (const variant of [
    { name: 'normal event', isDjSet: false, stage: 'Example Stage', enabled: true, stageOnly: false },
    { name: 'DJ Set in Upcoming', isDjSet: true, stage: 'Example Stage', enabled: true, stageOnly: true },
    { name: 'empty stage', isDjSet: true, stage: '', enabled: true, stageOnly: false },
    { name: 'whitespace stage', isDjSet: true, stage: '   ', enabled: true, stageOnly: false },
    { name: 'other context', isDjSet: true, stage: 'Example Stage', enabled: false, stageOnly: false },
  ]) {
    test(language + ': location presentation for ' + variant.name, async () => {
      await changeLanguage(language)
      const event = { ...syntheticEvent, isDjSet: variant.isDjSet, stage: variant.stage }
      const before = JSON.stringify(event)
      const html = renderToStaticMarkup(<EventCard event={event} onClick={() => {}} showDjSetStage={variant.enabled} />)
      assert.ok(html.includes('23:00-02:00'))
      if (variant.stageOnly) {
        assert.ok(html.includes('Example Stage'))
        assert.ok(!html.includes('Example Hall'))
        assert.ok(!html.includes('Example City'))
      } else {
        assert.ok(html.includes('Example Hall'))
        assert.ok(html.includes('Example City'))
        assert.ok(!html.includes('Example Stage'))
      }
      assert.equal(JSON.stringify(event), before)
    })
  }

  test(language + ': overnight and active-day labels are translated', async () => {
    await changeLanguage(language)
    const html = renderToStaticMarkup(<EventCard event={syntheticEvent} onClick={() => {}} activeOnDate="2024-01-02" />)
    assert.ok(html.includes(language === 'es' ? 'Comenzó el' : 'Started'))
    assert.ok(html.includes('02:00'))
    const overnight = renderToStaticMarkup(<EventCard event={syntheticEvent} onClick={() => {}} />)
    assert.ok(overnight.includes(language === 'es' ? 'finaliza' : 'ends'))
  })
}

test('default context preserves venue and city for a DJ Set', () => {
  const html = renderToStaticMarkup(<EventCard event={syntheticEvent} onClick={() => {}} />)
  assert.ok(html.includes('Example Hall'))
  assert.ok(html.includes('Example City'))
  assert.ok(!html.includes('Example Stage'))
})

test('name fallback and escaping use React rather than raw HTML', () => {
  const html = renderToStaticMarkup(<EventCard event={{ ...syntheticEvent, artist: '', name: '<script>fictional</script>' }} onClick={() => {}} />)
  assert.ok(html.includes('&lt;script&gt;fictional&lt;/script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.startsWith('<button'))
  assert.ok(html.includes('type="button"'))
})

test('tests cannot reach external services', async () => {
  await assert.rejects(async () => fetch('https://example.invalid'), /Network access is disabled/)
})
