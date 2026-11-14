import {useLocalRuntime, type ChatModelAdapter} from '@assistant-ui/react';

const wait = (ms: number, signal: AbortSignal) => new Promise<void>((done, fail) => {
  const timer = setTimeout(done, ms);
  signal.addEventListener('abort', () => { clearTimeout(timer); fail(signal.reason); }, {once: true});
});

/** A stand-in agent for the gallery: one tool call, then an echo in Markdown. Nothing leaves the page. */
const demo: ChatModelAdapter = {
  async *run({messages, abortSignal}) {
    const last = messages.at(-1);
    const text = last?.content.map(p => p.type === 'text' ? p.text : '').join('') ?? '';
    const call = {type: 'tool-call' as const, toolCallId: 'demo-1', toolName: 'searchVault', args: {query: text}, argsText: JSON.stringify({query: text})};
    yield {content: [call]};
    await wait(900, abortSignal);
    const done = {...call, result: {found: 3}};
    yield {content: [done]};
    await wait(300, abortSignal);
    yield {content: [done, {type: 'text', text: `You wrote **${text || 'nothing'}**.\n\n| Part | From |\n| --- | --- |\n| Thread | assistant-ui |\n| Look | ohm tokens |`}]};
  },
};

export const useDemoRuntime = () => useLocalRuntime(demo);
