import {createFileRoute, notFound} from '@tanstack/react-router';
import {Gallery} from '../App';
import {PAGES, type PageId} from '../pages';

export const Route = createFileRoute('/$page')({
  beforeLoad: ({params}) => { if (!(params.page in PAGES)) throw notFound(); },
  component: function Page() {
    const {page} = Route.useParams();
    return <Gallery page={page as PageId}/>;
  },
});
