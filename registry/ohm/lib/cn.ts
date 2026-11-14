import {clsx, type ClassValue} from 'clsx';
import {extendTailwindMerge} from 'tailwind-merge';

// The type roles and radii are custom theme keys; without this, twMerge reads
// `text-h2` as a colour and drops it beside `text-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['h1', 'h2', 'h3', 'body', 'small'],
      radius: ['field', 'row', 'card', 'sheet'],
      spacing: ['control-xs', 'control-sm', 'control-md', 'control-lg'],
    },
  },
});

/** Joins class names and lets later Tailwind utilities override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
