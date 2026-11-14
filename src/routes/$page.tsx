import {createFileRoute, notFound} from '@tanstack/react-router';
import {pageHead} from '../seo';
import {Gallery} from '../App';
import {PAGES, type PageId} from '../pages';

export const Route = createFileRoute('/$page')({
  beforeLoad: ({params}) => { if (!(params.page in PAGES)) throw notFound(); },
  head: ({params}) => {
    const page = PAGES[params.page as PageId];
    if (!page) return {meta: [{name: 'robots', content: 'noindex'}]};
    return pageHead(params.page === 'overview' ? '/' : `/${params.page}`, `${page.title} · ohm design system`, page.description || `${page.title}: examples and usage in the ohm design system.`);
  },
  component: function Page() {
    const {page} = Route.useParams();
    return <Gallery page={page as PageId}/>;
  },
});
