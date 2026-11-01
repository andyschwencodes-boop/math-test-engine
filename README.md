# math-test-engine

The rendering engine for Math Test Generator payloads. It provides the test UI,
pagination, print layout (including its own print CSS), the answer key view, and
the shared helpers (`window.MathText`, `window.E`, `window.rInt`, ...).

## Use

Load it in a payload's `<head>` after React, ReactDOM, KaTeX, Tailwind, and
Babel standalone, **pinned to a release tag**:

```html
<script type="text/babel" src="https://cdn.jsdelivr.net/gh/andyschwencodes-boop/math-test-engine@v1.7.0/engine.jsx"></script>
```

Always pin a tag (`@v1.7.0`), never `@main`, so an engine change can't alter a
test that's already been handed out.

## Releasing

The working copy and its checks live in the private generator repo. To release:
copy the updated `engine.jsx` here, make sure its first line names the new
version (`// math-test-engine v1.1.0`), commit, and push a matching tag
(`v1.1.0`). jsDelivr serves new tags within a few minutes.
