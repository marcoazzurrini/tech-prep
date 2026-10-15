# tech-prep

A desktop study app with an AI tutor that follows learning science. Each subject has its own tutor. The tutor teaches in a chat, opens small exercises beside the conversation, and schedules reviews of what you've learned. The first subject is the Blind 75.

- [PRODUCT.md](PRODUCT.md): what the app is for and how it should behave.
- [docs/learning-model.md](docs/learning-model.md): the learning model.
- [DESIGN.md](DESIGN.md): the visual design.

## Setup

Requires Bun, Python 3, gitleaks (`brew install gitleaks`) and a Claude Code login. The tutor runs on your Claude Code login through the Claude Agent SDK.

```sh
bun install     # all packages
bun run dev     # open the desktop app
bun run check   # format, lint, typecheck, test and build, as CI does
```

Your data lives in `~/.tech-prep`. Set `TECHPREP_HOME` to use another folder.
