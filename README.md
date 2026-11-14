# ohm-ui

The ohm interface, built from scratch.

```sh
npm install
npm run dev        # http://localhost:5180
npm run build
```

## Layout

| Path | What it is |
| --- | --- |
| `src/design/` | Design tokens, motion, the Coconat font and the ohm dot, copied from `ohm-1/packages/ui`. Values come from there; change them there first |
| `src/App.tsx` | The app |
| `src/app.css` | Layout. Every value is an `--ohm-*` token |

Stack: Vite, React 19, TypeScript, Lucide icons.
