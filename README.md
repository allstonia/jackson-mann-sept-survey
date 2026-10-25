# Jackson Mann survey graphics — embedding on allstonia.com

Four interactive graphics from the September 2026 survey, plus a loader that
sizes them automatically.

| Chart name | Graphic |
|---|---|
| `1-proposals-a-b` | How Allston-Brighton rated Proposal A and Proposal B (1–5) |
| `2-swing-space` | Moving BCYF to the Taft Building during construction |
| `3-school-vs-housing` | Which proposal each respondent rated higher, and by how much |
| `4-additional-uses` | Interest in nine additional uses for the site |

Each `.html` file is completely self-contained — CSS, JavaScript and data are all
inline. No CDN, no web fonts, no build step.

## Embedding (recommended)

Upload every file in this folder, then in the post add one placeholder per
graphic and the loader **once**:

```html
<div data-jm-chart="1-proposals-a-b"></div>
<div data-jm-chart="2-swing-space"></div>
<div data-jm-chart="3-school-vs-housing"></div>
<div data-jm-chart="4-additional-uses"></div>

<script src="https://ACCOUNT.github.io/REPO/embed.js" async></script>
```

Swap `ACCOUNT`/`REPO` for wherever you uploaded them. In Elementor, put the
placeholders wherever you want each chart in the article and the `<script>` in
one HTML widget at the end. Order doesn't matter and you can use just one chart.

That's all. Each graphic becomes a full-width iframe that measures itself and
tells the page how tall to be, so there are never inner scrollbars or empty gaps —
on first load, when the reader rotates their phone, and when the layout reflows.

**Preview:** open `index.html` to see all four in an article-width column. It's
also the quickest way to confirm the upload worked.

## Sizing: how it adapts

- **Width** — the graphics always fill the column they're placed in, up to 860px.
- **Height** — measured from the content and sent to the host page, so it's exact
  at any width. Before the first measurement lands, a sensible placeholder height
  is used so the page doesn't jump.
- **Layout** — each graphic reads **its own width**, not the browser window's, via
  a CSS container query. Below ~620px the row labels move above the bars; below
  ~430px type tightens and alternate axis ticks drop out so they never collide.
  That means a narrow sidebar gets the compact layout even on a desktop screen,
  which is usually what you want.
- **Touch** — tap any bar for its exact numbers, tap elsewhere to dismiss.

The iframes load eagerly rather than lazily. Each file is ~15 KB with no external
requests, so lazy-loading saves less than a single photo on the page — and a lazy
iframe that never trips its load threshold leaves a blank box where the chart
should be, which I hit while testing at phone width. If you want it anyway, add
`data-jm-lazy` to a placeholder. The loader also reloads any frame that has not
reported a height after four seconds, so a chart never stays blank.

## Plain iframe, without the loader

Works too, you just set the height yourself:

```html
<iframe src="https://ACCOUNT.github.io/REPO/1-proposals-a-b.html"
        title="How Allston-Brighton rated the two Jackson Mann proposals"
        style="width:100%;border:0;display:block" height="430"
        scrolling="no"></iframe>
```

Heights that fit a ~900px column: 430 / 560 / 760 / 900. A phone needs roughly
640 / 630 / 880 / 1170, so without the loader you have to pick one compromise
height. The loader exists to avoid exactly that.

## Pasting inline instead of iframing

Copy what's between `<body>` and `</body>` into an Elementor HTML widget and the
`<style>` block into the page's custom CSS. Then set `--jm-font: inherit` so the
graphics pick up Allstonia's own typeface. If you place several on one page, keep
only one copy of the `<style>` and `<script>` — the class names are shared.

Sizing still adapts: the container query means each graphic responds to its own
column, not the window.

## Customising

Every themeable value is a CSS variable at the top of each file:

- `--jm-font` — typeface. Set to `inherit` when pasting inline.
- `--surface`, `--ink`, `--ink2`, `--muted` — background and text.
- `--r1`…`--b5` — the 1–5 rating scale (red → grey → blue), with `--on-*` giving
  the label colour that stays legible on each.
- `--int-no`, `--int-yes`, `--int-very` — the interest scale.
- `--cat-housing`, `--cat-school`, `--cat-equal` — the head-to-head colours.

Dark mode is **opt-in only**: add `data-theme="dark"` to `<html>`. It's deliberately
not tied to the reader's OS setting, because allstonia.com renders on white and an
automatic flip would leave a dark block in a light page.

## Accessibility

- Every bar segment is keyboard-focusable with an `aria-label` carrying its exact
  count, so the data is reachable without a mouse.
- Each graphic has a "Show the numbers" button revealing a full data table.
- Colours were checked for colour-vision deficiency (protan/deutan separation) and
  for contrast against the page, in both light and dark.
- Segment labels hide automatically when a bar is too narrow to hold them; the
  value stays in the tooltip and the table.

## Source

City of Boston Jackson Mann site survey, September 2026. n = 473; 439–453 per item
on the additional-uses question, 472 on swing space.
