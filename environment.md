# 이 컴퓨터의 환경

측정일: 2026-10-31. 값이 낡았을 수 있으니, 갱신하라고 하면 컴퓨터를 다시 조회해서 이 파일의 값과 측정일을 고친다.

## 하드웨어와 OS
- Windows 11 Home 10.0.26200 (64비트)
- CPU Intel Core i5-8250U 1.60GHz, 램 7.9GB (약 8GB), C: 드라이브 여유 약 120GB
- 램이 작으므로 무거운 도구와 동시에 여러 개 띄우는 작업은 피하고, 설치 전에 용량을 확인한다.

## 도구
- Node v24.22.1, npm 11.19.1
- git 2.56.0, Claude Code 2.1.302 (VS Code 확장으로 사용)
- Python 3.13.15 (`%LOCALAPPDATA%\Programs\Python\Python313\python.exe`). `python`만 치면 Microsoft Store 바로가기가 잡힐 수 있어서 전체 경로로 실행한다.
- GitHub CLI(`gh`)는 설치되어 있지 않다. GitHub 작업은 GitHub MCP나 REST로 한다.

## 셸
- Bash 도구는 Git Bash, 별도 PowerShell 도구는 Windows PowerShell 5.1이다. `&&`는 PowerShell 5.1에서 쓸 수 없다.
- 훅 명령은 `"shell": "bash"`로 실행하고, 환경변수는 `$HOME`, `$CLAUDE_PROJECT_DIR` 형태를 쓴다.

## VS Code 확장에서 안 되는 것
- `/agents`는 없어졌다. 서브에이전트는 파일(`~/.claude/agents/`, `.claude/agents/`)을 직접 만들거나 Claude에게 만들어 달라고 한다.
- `/branch`는 쓸 수 없다. 대안은 `claude --continue --fork-session`이다.
- 새로운 명령을 권하기 전에 VS Code에서 되는지 확인되지 않았으면 그렇다고 먼저 말한다.
