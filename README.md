# tech-prep

A desktop study app with an AI tutor that follows learning science. Each subject is a course of chapters and lessons, with a tutor in a pane beside the lesson. The tutor teaches, writes the exercises and schedules reviews of what you've learned. The first subject is the Blind 75.

- [PRODUCT.md](PRODUCT.md): what the app is for and how it should behave.
- [docs/learning-model.md](docs/learning-model.md): the learning model.
- [DESIGN.md](DESIGN.md): the visual design.

## Install

The app runs on Apple Silicon Macs. It ships its own Bun, Claude Code, engine and subjects, so it needs nothing from this repo once installed. The tutor runs on your Claude Code login through the Claude Agent SDK. Python 3 is needed only to practise in Python.

```sh
bun install
bun run app:install   # build the app and install it in /Applications
```

To update, run `git pull`, then `bun run app:install` again.

The app is signed ad hoc, without an Apple Developer account. A copy you build yourself opens normally. A copy downloaded from elsewhere needs "Open Anyway" once, in System Settings, Privacy & Security.

Your progress and workspace live in `~/Library/Application Support/tech-prep`. The first run copies any data from the old `~/.tech-prep` folder and leaves that folder untouched. Set `TECHPREP_HOME` to use another folder.

## Develop

Requires Bun, Python 3 and gitleaks (`brew install gitleaks`).

```sh
bun run dev           # open the app from source
bun run storybook     # browse UI components at localhost:6006
bun run check         # format, lint, typecheck, test and build, as CI does
```

The development build keeps its data in `~/Library/Application Support/tech-prep-dev`, apart from the installed app.
