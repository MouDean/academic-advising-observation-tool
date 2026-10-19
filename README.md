# Academic Advising Observation Tool

A thesis research prototype for recording, reviewing, and exploring structured observations of academic advising sessions.

Created by [Mousa Alhatti / codebea](https://github.com/codebea) at **Abu Dhabi University (ADU)** during thesis work. This public edition preserves the application source while replacing private records and embedded access details with fictional demo data. It is an independent portfolio/research project, without university endorsement.

## Features

- Structured session details, observation ratings, notes, completion checks and session timing.
- Local session history, autosave, backup/restore and media-evidence controls.
- Interactive charts, correlation views and heuristic insight/risk dashboards.
- JSON, Excel and PDF export utilities, plus offline-oriented browser features.

## Run locally

Use Node.js 22 and pnpm 10.4.1 (the package manager recorded by the project).

```sh
git clone https://github.com/codebea/academic-advising-observation-tool.git
cd academic-advising-observation-tool
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

Open the local address printed by Vite. No backend or environment secrets are required for this demo.

```sh
pnpm test
pnpm build
pnpm preview
```

Serve the built `dist/` folder from a local/static server. Service-worker and asset paths assume hosting at the site root; deployment under a subdirectory needs path configuration. Source publication does not deploy a live site.

## Explore the demo

Enter `demo-observe` at the demo access screen. Start a new observation with fictional identifiers, or use the built-in sample generator to explore the dashboards.

The access screen is a client-side demo gate. It does not protect sensitive research data. The insight and predictive dashboards use local calculations and heuristics; they are not a validated predictive model or a connection to an external AI service.

## Architecture

React, Vite, Tailwind CSS, Radix UI, Lucide, SheetJS/XLSX and jsPDF form the core stack. Browser storage holds local application state; there is no shared database or institutional identity integration.

- `src/hooks/useSession.js`: session state and persistence.
- `src/utils/validation.js`: required metadata and completion checks.
- `src/utils/sampleData.js`: fictional analytics sessions.
- `src/components/`: observation, analytics, backup and media interfaces.
- `src/utils/`: exports, browser storage and offline helpers.

## Data and research limits

Use fictional records when evaluating this public edition. Browser storage and local exports can be read by someone with access to that browser profile or device. Backups and exported files need their own handling controls. No thesis participant records, attendance, transcripts, media evidence, password documents, feedback files or earlier repository history are included.

Moving to institutional use requires a separately designed backend, server-side authentication and authorization, secure storage, retention controls, accessibility review, and verification of academic rules. Analytics are exploratory and do not establish research validity or decision-making accuracy.

## Validation

The repository includes targeted Node tests for core utilities and fictional seed records. GitHub Actions runs those checks and a production build. These are smoke/regression checks, not a complete end-to-end or security certification. See [VALIDATION.md](VALIDATION.md) for the checks actually completed.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Use synthetic fixtures only and describe how a proposed change was checked. Report sensitive issues without posting real records; see [SECURITY.md](SECURITY.md).

## License

This public edition is released under the [MIT License](LICENSE). Third-party packages and assets retain their respective licenses.
