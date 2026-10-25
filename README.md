# claude-code

Claude Code 전역 설정(`~/.claude`) 저장소. 이 저장소에 올라가는 것은 `CLAUDE.md`, `settings.json`, `skills/`, `agents/`, 이 문서뿐이다. 대화 기록, 로그인 정보, 메모리, 플러그인 캐시는 올리지 않는다.

## 스킬

`skills/` 폴더에 있다.

| 이름 | 설명 |
|---|---|
| find-skills | 필요한 기능에 맞는 스킬을 찾아 설치하도록 돕는 스킬 |
| grill-me | 계획이나 설계를 질문으로 파고들어 함께 다듬는 스킬. `/grill-me`로만 호출한다 |
| ponytail | 가장 작은 변경으로 문제를 해결하고 짧게 답하게 하는 스킬 |
| ponytail-review | 변경 사항의 로직, 보안, 부하, 테스트, 불필요한 코드를 검토하는 스킬 |

## 에이전트

`agents/` 폴더에 있다.

| 이름 | 설명 |
|---|---|
| ponytail-reviewer | ponytail-review 스킬을 가지고 코드 변경을 읽기 전용으로 검토하는 에이전트 |

## 훅

| 이름 | 설명 |
|---|---|
| 없음 | 전역 설정에 직접 등록한 훅은 없다. superpowers 플러그인은 세션 시작 훅을 포함하므로 켜면 훅이 동작한다 |

## MCP

이 저장소에는 없고 컴퓨터마다 따로 등록한다.

| 이름 | 설명 |
|---|---|
| github | GitHub 저장소, 이슈, PR을 조회하고 수정하는 MCP. 사용자 범위로 `~/.claude.json`에 등록하며 토큰이 들어 있어 저장소에 올리지 않는다. 등록 명령은 `claude mcp add --transport http github https://api.githubcopilot.com/mcp -H "Authorization: Bearer <토큰>" --scope user`이고 토큰은 직접 입력한다 |
| Context7 | 라이브러리와 프레임워크의 최신 문서를 조회하는 MCP. claude.ai 계정의 커넥터로 연결한다 |

## 플러그인

플러그인은 이 저장소에 올리지 않는다. 다른 컴퓨터에서는 아래 주소와 명령으로 다시 설치한다. 명령은 Claude Code 채팅 입력창에 그대로 입력한다.

| 이름 | 설명 | 주소 |
|---|---|---|
| frontend-design | 화면을 만들거나 고칠 때 색, 글꼴, 배치 방향을 정하도록 돕는 플러그인 | 공식 마켓플레이스 `claude-plugins-official` |
| ui-ux-pro-max | 스타일, 색상표, 글꼴 조합, UX 지침 데이터로 UI를 설계하고 검토하는 플러그인 | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| superpowers | 브레인스토밍, 계획 작성, 테스트 주도 개발 같은 개발 절차 스킬을 묶은 플러그인. 설치만 하고 쓰지 않는다 | https://github.com/obra/superpowers-marketplace |

### 설치 방법

frontend-design

```
/plugin install frontend-design@claude-plugins-official
```

ui-ux-pro-max. 검색 도구를 쓰려면 Python 3가 필요하다. 윈도우에서는 `winget install -e --id Python.Python.3.13 --scope user`로 설치한다.

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

superpowers

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

설치한 뒤 `/reload-plugins`를 입력하면 바로 적용된다. 켜고 끄는 것은 `/plugin`에서 한다.
