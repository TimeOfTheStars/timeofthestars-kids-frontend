export interface Review {
  author: string
  text: string
  pic: string
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
