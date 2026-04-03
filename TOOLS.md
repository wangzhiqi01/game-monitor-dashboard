# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Local Tooling Notes

### Bilibili live scraper tool

- Reusable entrypoint: `node scripts/bili_live_tool_v3.js --game torchlight-infinite`
- Purpose: query current B站《火炬之光：无限》直播数量
- Persistent profile path: `.openclaw/playwright-bili-profile`
- Output JSON path: `.openclaw/outputs/bili-torchlight-infinite.json`
- If blocked by captcha, rerun with: `node scripts/bili_live_tool_v3.js --game torchlight-infinite --headful --manual-captcha`
