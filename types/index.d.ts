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
}
