import {MarkdownTextPrimitive} from '@assistant-ui/react-markdown';
import remarkGfm from 'remark-gfm';
import {cn} from '@/registry/ohm/lib/cn';

const PLUGINS = [remarkGfm];

/**
 * Replies never load images on their own: text an agent read from an email or a page could
 * otherwise make it write an image whose URL carries private data to someone else's server.
 * An image becomes a link the person can choose to open.
 */
const COMPONENTS = {
  img: ({src, alt}: {src?: string | Blob; alt?: string}) => typeof src === 'string' && src
    ? <a href={src} target="_blank" rel="noopener noreferrer">{alt || 'Image'}</a>
    : null,
};

/** An assistant message's text as Markdown, with GitHub tables, strikethrough and task lists. */
export function MarkdownText({className}: {className?: string}) {
  return <MarkdownTextPrimitive
    remarkPlugins={PLUGINS}
    components={COMPONENTS}
    className={cn(
      'ohm-markdown text-body text-foreground',
      '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
      '[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
      '[&_code]:font-mono [&_code]:text-small [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-field [&_pre]:bg-muted [&_pre]:p-3',
      '[&_table]:my-2 [&_table]:w-full [&_td]:py-1 [&_td]:pr-4 [&_th]:py-1 [&_th]:pr-4 [&_th]:text-left [&_th]:font-semibold [&_tbody_tr:nth-child(odd)]:bg-muted',
      className,
    )}
  />;
}
