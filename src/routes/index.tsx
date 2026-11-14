import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '../seo';
import {Gallery} from '../App';

export const Route = createFileRoute('/')({head: () => pageHead('/', 'ohm design system', 'Foundations, components and agent interface for ohm. Explore the design system and install components with the shadcn CLI.'), component: () => <Gallery page="overview"/>});
