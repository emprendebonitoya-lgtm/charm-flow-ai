export function getStructuredData() {
  const baseUrl = import.meta.env.APP_URL || 'https://tu-dominio.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MAGNETO - Carisma y Seducción con IA',
    description: 'Software de carisma masculino con inteligencia artificial. Escáner de perfiles, salvavidas de chat, simulador de citas y academia de carisma.',
    url: baseUrl,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'Escáner de perfiles con IA',
      'Salvavidas de chat',
      'Simulador de citas',
      'Date Planner',
      'Academia de carisma',
      'Biblioteca de conocimiento',
    ],
  };
}

export function getOrganizationData() {
  const baseUrl = import.meta.env.APP_URL || 'https://tu-dominio.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MAGNETO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Plataforma de carisma masculino con inteligencia artificial',
    sameAs: [],
  };
}

export function getWebsiteData() {
  const baseUrl = import.meta.env.APP_URL || 'https://tu-dominio.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MAGNETO',
    url: baseUrl,
    description: 'Software de carisma masculino con IA para hombres',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
