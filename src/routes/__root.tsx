import type {ReactNode} from 'react';
import {HeadContent, Scripts, createRootRoute} from '@tanstack/react-router';
import appCss from '../styles.css?url';

// Light unless the visitor chose otherwise; set before paint so there is no flash.
const THEME = `document.documentElement.dataset.theme = localStorage.getItem('ohm-ui-theme') || 'light'`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {charSet: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover'},
    ],
    links: [
      {rel: 'stylesheet', href: appCss},
      {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
    ],
  }),
  notFoundComponent: () => <main className="mx-auto max-w-xl p-16"><h1>Not here</h1><p className="text-muted-foreground">There is no page at this address.</p></main>,
  shellComponent: RootDocument,
});

function RootDocument({children}: {children: ReactNode}) {
  return <html lang="en" data-theme="light" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{__html: THEME}}/>
      <HeadContent/>
    </head>
    <body>
      {children}
      <Scripts/>
    </body>
  </html>;
}
