import {createFileRoute} from '@tanstack/react-router';
import {Gallery} from '../App';

export const Route = createFileRoute('/')({component: () => <Gallery page="overview"/>});
