import { useTranslation } from 'react-i18next'
import { t, displayLocale } from '../i18n/index.js'
import type { EventCardEvent } from '../domain/event-types.js'

function displayDate(date: string) {
  return new Intl.DateTimeFormat(displayLocale(), { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function displayShortDate(date: string) {
  return new Intl.DateTimeFormat(displayLocale(), { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

export function EventCard({ event, onClick, activeOnDate, showDjSetStage = false }: {
  event: EventCardEvent
  onClick: () => void
  activeOnDate?: string
  showDjSetStage?: boolean
}) {
  useTranslation()
  const endsLater = event.endDate !== event.startDate
  const beganEarlier = activeOnDate && activeOnDate !== event.startDate
  const showingStage = showDjSetStage && event.isDjSet && event.stage.trim().length > 0
  const location = showingStage ? event.stage : event.venue

  return (
    <button className="event-card" type="button" onClick={onClick}>
      <span className="event-card-date">{displayDate(event.startDate)}</span>
      <span className="event-card-main">
        <strong>{event.artist || event.name}</strong>
        {event.artist && <span>{event.name}</span>}
      </span>
      <span className="event-card-meta">
        {beganEarlier ? t("Started {{date}} - active until {{time}}", { date: displayShortDate(event.startDate), time: event.endTime }) : `${event.startTime}-${event.endTime}${endsLater ? t(" (ends {{date}})", { date: displayShortDate(event.endDate) }) : ''}`}
        {location && ` - ${location}`}
        {!showingStage && event.city && `, ${event.city}`}
      </span>
    </button>
  )
}
