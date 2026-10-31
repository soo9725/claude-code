# Notification 훅: Claude Code가 사용자 입력(권한 확인, 질문)을 기다릴 때 Windows 토스트 알림을 띄운다.
# 표준 입력으로 훅 JSON(message, notification_type, cwd)을 받는다.
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$raw = [Console]::In.ReadToEnd()
$data = $null
if ($raw) { try { $data = $raw | ConvertFrom-Json } catch { } }

# 입력 대기가 아닌 알림(로그인 성공 등)은 띄우지 않는다
if ($data -and $data.notification_type -eq 'auth_success') { exit 0 }

$project = if ($data -and $data.cwd) { Split-Path -Leaf $data.cwd } else { 'Claude Code' }
$message = if ($data -and $data.message) { $data.message } else { '입력을 기다리고 있어요' }

# Claude Code가 영어로 보내는 알려진 문구는 한국어로 바꾼다. 모르는 문구는 그대로 둔다
if ($message -match '^Claude needs your permission to use (.+?)\.?$') { $message = $Matches[1] + ' 실행 권한이 필요해요' }
elseif ($message -match 'waiting for your input') { $message = '입력을 기다리고 있어요' }

function Escape-Xml([string]$s) { [System.Security.SecurityElement]::Escape($s) }

[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
$xml.LoadXml("<toast><visual><binding template='ToastGeneric'><text>Claude Code · $(Escape-Xml $project)</text><text>$(Escape-Xml $message)</text></binding></visual></toast>")
$toast = New-Object Windows.UI.Notifications.ToastNotification $xml
$appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
