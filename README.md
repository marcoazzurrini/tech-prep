# tech-prep

A desktop study app that follows learning science. Each subject is a course of chapters and lessons. A lesson teaches one concept, then you solve a problem alone, and spaced reviews bring each concept back later. An AI tutor sits in a pane beside the lesson and helps when you ask. The app comes with two courses: the NeetCode 150 and the `jq` command-line tool.

- [PRODUCT.md](PRODUCT.md): what the app is for and how it should behave.
- [docs/learning-model.md](docs/learning-model.md): the learning model.
- [DESIGN.md](DESIGN.md): the visual design.

## Install

The app runs on Apple Silicon Macs. It ships its own Bun, Claude Code, engine and subjects, so it needs nothing from this repo once installed. The tutor runs on your Claude Code login through the Claude Agent SDK. Python 3 is needed only to practise in Python, and `jq` only for the jq course.

```sh
bun install
bun run install-app          # build the app and install it in /Applications
bun run install-app --open   # the same, then open it
```

To update, run `git pull`, then `bun run install-app` again. It quits the running app, backs up your progress and replaces the app. Your progress lives outside the app, so it survives every install.

When only course content changed, run `bun run sync-courses` and restart the app. No reinstall is needed. `packages/starters/README.md` explains how the app finds courses.

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
