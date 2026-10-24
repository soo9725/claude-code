---
name: no-global-config-additions
description: 사용자가 말하기 전까지 전역 설정(~/.claude의 settings.json, CLAUDE.md, skills 등)에 아무것도 추가하거나 바꾸지 않는다
metadata:
  type: feedback
---

사용자가 명시적으로 요청하기 전까지 전역 설정(`C:\Users\soo97\.claude`의 `settings.json`, `CLAUDE.md`, `skills/`, `agents/` 등)에 아무것도 추가하거나 바꾸지 않는다.

**Why:** 전역 설정은 모든 프로젝트에 적용되고 공개 저장소(`soo9725/claude-code`)로도 올라가므로, 사용자가 직접 통제하길 원한다. 과거에 `settings.json`에 `"language": "Korean"`을 먼저 추가했다가 "아직 아무것도 넣지 마"라는 지적을 받았다(이미 넣은 4줄은 되돌리지 말고 그대로 두라고 함).

**How to apply:** 전역 설정 파일은 사용자가 "넣어줘/저장해줘/반영해줘"처럼 명시한 항목만 수정한다. 필요해 보여도 먼저 제안만 하고 기다린다. 프로젝트 폴더 안의 파일 작업과는 구분한다.
