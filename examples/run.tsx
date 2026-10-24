import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, writeFileSync } from 'node:fs'
import { EventCard } from '../src/components/EventCard.js'
import { localDateTimeToInstant, classifyEvent } from '../src/domain/event-date-time.js'
import { findOverlaps } from '../src/domain/conflicts.js'
import { changeLanguage } from '../src/i18n/index.js'
import { syntheticEvent } from './synthetic-events.js'

const start = localDateTimeToInstant(syntheticEvent.startDate, syntheticEvent.startTime, syntheticEvent.timezone)!
console.log('Local start converted to UTC:', new Date(start).toISOString())
console.log('Status at the start instant:', classifyEvent(syntheticEvent, start))
console.log('Overlapping fictional events:', findOverlaps(syntheticEvent, [{ ...syntheticEvent, id: 'another-fictional-performance' }]).length)

const css = readFileSync(new URL('../../src/components/event-card.css', import.meta.url), 'utf8')
for (const language of ['en', 'es'] as const) {
  await changeLanguage(language)
  const examples = [
    { label: 'Normal event: venue + city', event: { ...syntheticEvent, isDjSet: false }, show: true },
    { label: 'DJ Set in Upcoming: stage only', event: syntheticEvent, show: true },
    { label: 'DJ Set without stage: venue + city', event: { ...syntheticEvent, stage: '   ' }, show: true },
    { label: 'Other contexts: venue + city', event: syntheticEvent, show: false },
  ]
  const cards = examples.map(({ label, event, show }) =>
    '<h2>' + label + '</h2>' + renderToStaticMarkup(createElement(EventCard, { event, showDjSetStage: show, onClick: () => {} })),
  ).join('')
  const html = '<!doctype html><html lang="' + language + '"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'"><title>RAVELOT Technical Showcase</title><style>' + css + '</style><main class="showcase"><h1>EventCard examples (' + language + ')</h1><p>Static rendering of fictional events. Buttons have no navigation in this snapshot.</p>' + cards + '</main></html>'
  writeFileSync(new URL('./event-card-' + language + '.html', import.meta.url), html)
}
console.log('Open build/examples/event-card-en.html or event-card-es.html locally. No server is needed.')
