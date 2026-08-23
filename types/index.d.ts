export interface Review {
  author: string
  text: string
  pic: string
}

export interface NewsItem {
  image: string
  excerpt: string
  url: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface NavItem {
  title: string
  to: string
}

export interface AbonementCard {
  type: string
  price: number
  period: string
  isGoalie?: boolean
  isDiscount?: boolean
}

export interface TournamentTeam {
  name: string
  logo?: string
  photo?: string
}

export interface TournamentArena {
  name: string
  url?: string
  address?: string
  city?: string
}

export interface Tournament {
  id: number | string
  title: string
  ageCategory: string
  birthYear?: number | string
  startDate: string
  startTime?: string
  endDate: string
  endTime?: string
  location?: string
  arena?: TournamentArena
  city?: string
  season: string
  teams?: TournamentTeam[]
  description?: string
  url?: string
  recordingsUrl?: string
  gameFormat?: string | null
  periodMinutes?: number | null
  periodsCount?: number | null
  hasStats?: boolean
}

/* --- Статистика турниров (публичный контур API, camelCase) --- */

export interface TeamRef {
  id: string
  name: string
  logo?: string | null
}

export interface PlayerRef {
  id: string
  fullName: string
  photo?: string | null
  position?: string | null
  birthDate?: string | null
}

export interface StandingRow {
  place: number
  team: TeamRef
  games: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export interface GameListItem {
  id: string
  matchNo: number
  date: string
  time?: string | null
  teamA: TeamRef
  teamB: TeamRef
  scoreA?: number | null
  scoreB?: number | null
  shotsA?: number | null
  shotsB?: number | null
  videoUrl?: string | null
  scan?: string | null
  isFinished: boolean
}

/** Строка статистики игрока: заявка турнира, состав матча, бомбардиры */
export interface StatLine {
  player: PlayerRef
  team: TeamRef
  number?: number | null
  games: number
  goals: number
  assists: number
  points: number
  isGoalie: boolean
  goalsAgainst?: number | null
  saves?: number | null
  minutesPlayed?: number | null
}

export interface GoalEvent {
  period: number
  time: string
  teamId: string
  scorer: PlayerRef
  scorerNumber?: number | null
  assists: PlayerRef[]
  assistNumbers: (number | null)[]
}

export interface GameDetail {
  game: GameListItem
  rosterA: StatLine[]
  rosterB: StatLine[]
  goals: GoalEvent[]
}

export interface PlayerTotals {
  games: number
  goals: number
  assists: number
  points: number
  goalsAgainst?: number | null
  saves?: number | null
  minutesPlayed?: number | null
}

export interface PlayerStatsGroup {
  id: string
  name: string
  totals: PlayerTotals
}

export interface PlayerStats {
  player: PlayerRef
  career: PlayerTotals
  byTournament: PlayerStatsGroup[]
  byTeam: PlayerStatsGroup[]
}
