// src/types/service.ts
export interface Service {
  id: string
  icon?: string
  titleKey: string
}

export const servicesList: Service[] = [
  {
    id: 'web',
    titleKey: 'services.web'
  },
  {
    id: 'frontend',
    titleKey: 'services.frontend'
  },
  {
    id: 'responsive',
    titleKey: 'services.responsive'
  },
  {
    id: 'performance',
    titleKey: 'services.performance'
  }
]