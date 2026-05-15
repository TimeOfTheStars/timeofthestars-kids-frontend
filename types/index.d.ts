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
}

export interface Tournament {
  id: number | string
  title: string
  ageCategory: string
  birthYear?: number
  startDate: string
  startTime?: string
  endDate: string
  location: string
  city?: string
  season: string
  teams?: TournamentTeam[]
  description?: string
  url?: string
  recordingsUrl?: string
}
