const origin = 'https://design.ohmmmm.com';
const image = `${origin}/og-design-v1.png`;
export function pageHead(path: string, title: string, description: string) {
  return {
    meta: [
      {title},
      {name: 'description', content: description},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'ohm design system'},
      {property: 'og:title', content: title},
      {property: 'og:description', content: description},
      {property: 'og:url', content: origin + path},
      {property: 'og:image', content: image},
      {property: 'og:image:type', content: 'image/png'},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:alt', content: 'ohm design system — Foundations, components and agent interface'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: title},
      {name: 'twitter:description', content: description},
      {name: 'twitter:image', content: image},
      {name: 'twitter:image:alt', content: 'ohm design system — Foundations, components and agent interface'},
    ],
    links: [{rel: 'canonical', href: origin + path}],
  };
}
