// PreToolUse 훅 (Bash, PowerShell): 위험하거나 되돌리기 어려운 명령을 실행 직전에 사용자에게 확인시킨다.
// 차단(deny)은 settings.json의 permissions.deny가 맡고, 이 훅은 별칭·변형까지 잡아 "묻기(ask)"로 돌린다.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function ask(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    }),
  )
  process.exit(0)
}

let command = ''
try {
  command = String(JSON.parse(readFileSync(0, 'utf8') || '{}').tool_input?.command ?? '')
} catch {
  process.exit(0)
}

// 푸시 전에는 추적 중인 파일에 개인 경로나 토큰이 있는지 검사한다
function scanTrackedFiles() {
  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  const patterns = [
    [/[A-Za-z]:\\Users\\[^\\\s"']+/, '내 컴퓨터 경로'],
    [/\/[a-z]\/Users\/[^/\s"']+/i, '내 컴퓨터 경로'],
    [/ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}/, '토큰 모양'],
  ]
  const findings = []
  let files = []
  try {
    files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean)
  } catch {
    return ['git ls-files 실행 실패: 검사를 하지 못했습니다']
  }
  for (const file of files) {
    if (/(^|\/)(private\.md|\.claude\.json|\.env[^/]*)$/.test(file)) findings.push(`${file}: 올라가면 안 되는 파일 이름`)
    if (/\.(png|jpe?g|gif|ico|woff2?|lock)$/i.test(file) || file.endsWith('package-lock.json')) continue
    let text
    try {
      text = readFileSync(join(root, file), 'utf8')
    } catch {
      continue
    }
    for (const [re, label] of patterns) {
      const m = text.match(re)
      if (m) findings.push(`${file}: ${label} (${m[0].slice(0, 40)})`)
    }
  }
  return findings
}

const isDelete =
  /(^|[\s;&|(])(rm|rmdir|rd|del|erase|ri|unlink|Remove-Item)(\s|$)/i.test(command) ||
  /\bgit\s+rm\b/i.test(command) ||
  /\s-delete\b/.test(command)

// 전역 설정 폴더(~/.claude)를 가리키는 경로. 읽기는 통과시키고 수정으로 보이는 명령에만 묻는다
const touchesGlobalDir =
  /(~|\$HOME|\$env:USERPROFILE|%USERPROFILE%|[A-Za-z]:[\\/]Users[\\/][^\\/\s"']+|\/[a-z]\/Users\/[^/\s"']+)[\\/]\.claude(?![\w.])/i.test(command)

const withoutHarmlessRedirects = command.replace(/\d?>&\d/g, '').replace(/\d?>\s*(\/dev\/null|\$null|nul)\b/gi, '')
const looksLikeWrite =
  /(^|[\s\d])>>?/.test(withoutHarmlessRedirects) ||
  /\b(tee|sed\s+-i|mv|cp|ln|chmod|touch|mkdir|truncate)\b/.test(withoutHarmlessRedirects) ||
  /\b(Set-Content|Add-Content|Out-File|New-Item|Rename-Item|Copy-Item|Move-Item|Clear-Content)\b/i.test(withoutHarmlessRedirects)

// ~/.claude.json에는 토큰이 평문으로 들어 있어서 읽기에도 묻는다
const touchesTokenFile = /\.claude\.json/.test(command)

if (isDelete) ask('삭제 명령입니다. 실행해도 되는지 확인해 주세요.')
if (touchesTokenFile) ask('~/.claude.json에는 토큰이 들어 있습니다. 접근해도 되는지 확인해 주세요.')
if (touchesGlobalDir && looksLikeWrite) ask('전역 설정(~/.claude)을 수정하는 명령으로 보입니다. 요청하신 작업인지 확인해 주세요.')

if (/(^|[\s;&|(])git\s+push\b/.test(command)) {
  const findings = scanTrackedFiles()
  ask(
    findings.length === 0
      ? '푸시 전 검사: 추적 중인 파일에서 개인 경로나 토큰 모양이 발견되지 않았습니다. 푸시할까요?'
      : `푸시 전 검사에서 ${findings.length}건이 발견됐습니다. 확인 후 푸시해 주세요.\n` + findings.slice(0, 10).join('\n'),
  )
}
