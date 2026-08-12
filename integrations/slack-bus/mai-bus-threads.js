'use strict';
// mai-bus-threads.js — MAI-BUS v2 회의록(스레드) 레이어
// 안건(이벤트)당 1개의 append-only JSONL(threads/<eventId>.jsonl)에 발언을 쌓는다.
// 엔트리 스키마: { ts, from, type: verdict|comment|question|approval|result, text, refs? }
// CLI 진입은 mai-bus.js 하나로 유지되고, 이 모듈은 mai-bus.js가 require해 재-export한다.
// core(mai-bus.js)는 호출 시점에 lazy require — 상호 참조여도 로드 순서 안전.
const fs = require('fs');
const path = require('path');

const ENTRY_TYPES = ['verdict', 'comment', 'question', 'approval', 'result'];
const FEED_DEFAULT_LIMIT = 30;
const FEED_TEXT_WIDTH = 120;

// v3 역할 발언 명의: from이 "REPO/역할" 형식('/' 포함)이면 PM이 아닌 역할 팀원 발언이다.
// Slack 미러 시 icon_emoji를 역할별로 부여한다. 하이픈 풀네임(backend-eng 등)도 같은 아이콘.
const ROLE_EMOJI = {
  backend: ':gear:', 'backend-eng': ':gear:',
  frontend: ':art:', 'frontend-eng': ':art:',
  mobile: ':iphone:', 'mobile-eng': ':iphone:',
  designer: ':lower_left_paintbrush:', 'ui-designer': ':lower_left_paintbrush:',
  spec: ':memo:', 'spec-writer': ':memo:',
  qa: ':mag:', tester: ':mag:', 'qa-tester': ':mag:',
  docs: ':memo:', 'technical-writer': ':memo:',
  sales: ':briefcase:', 'sales-engineer': ':briefcase:',
};
function isRoleFrom(from) { return typeof from === 'string' && from.includes('/'); }
function roleEmoji(from) {
  const role = String(from).split('/')[1] || '';
  return ROLE_EMOJI[role.toLowerCase()] || ':bust_in_silhouette:';
}

let coreCache = null;
function core() { if (!coreCache) coreCache = require('./mai-bus.js'); return coreCache; }
function warn(msg) { process.stderr.write('[MaiBus] ' + msg + '\n'); }
function threadsDir() { const d = path.join(core().busRoot(), 'threads'); fs.mkdirSync(d, { recursive: true }); return d; }
function threadPath(eventId) { return path.join(threadsDir(), eventId + '.jsonl'); }

// events/<id>.json 직접 조회. 없거나 손상이면 null.
function getEvent(eventId) {
  try {
    const e = JSON.parse(fs.readFileSync(path.join(core().busRoot(), 'events', eventId + '.json'), 'utf8'));
    return e && typeof e === 'object' && e.id ? e : null;
  } catch { return null; }
}

function entryTime(en) { const t = Date.parse(en && en.ts); return Number.isFinite(t) ? t : 0; }

function isEntryShape(en) {
  return !!en && typeof en === 'object' && !Array.isArray(en) &&
    typeof en.ts === 'string' && typeof en.from === 'string' && en.from !== '' &&
    typeof en.type === 'string' && typeof en.text === 'string';
}

// threads/<eventId>.jsonl -> entry[] (ts 오름차순, 같은 ts는 파일 순서 유지).
// 손상 라인은 [MaiBus] 경고 후 건너뛴다 — 한 줄이 깨져도 회의록 전체는 살아야 한다.
function threadEntries(eventId) {
  const file = threadPath(eventId);
  if (!fs.existsSync(file)) return [];
  const entries = [];
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    try {
      const en = JSON.parse(lines[i]);
      if (!isEntryShape(en)) throw new Error('missing ts/from/type/text');
      entries.push(en);
    } catch (err) {
      warn('skipping corrupt thread line ' + (i + 1) + ' in ' + eventId + '.jsonl: ' + err.message);
    }
  }
  return entries.sort((a, b) => entryTime(a) - entryTime(b));
}

// 발언 1건 append. 이벤트 존재·엔트리 필드를 검증하고 정규화된 엔트리를 돌려준다.
function appendEntry(eventId, entry) {
  if (!eventId || typeof eventId !== 'string') throw new Error('--id is required');
  if (!getEvent(eventId)) throw new Error('unknown event "' + eventId + '" (events/' + eventId + '.json 없음)');
  const { from, type, text } = entry || {};
  if (!from || typeof from !== 'string') throw new Error('--from is required (세션명, 예: mojo-44)');
  if (!ENTRY_TYPES.includes(type)) throw new Error('invalid --type "' + type + '" (valid: ' + ENTRY_TYPES.join(', ') + ')');
  if (!text || typeof text !== 'string') throw new Error('--text is required');
  const normalized = { ts: typeof entry.ts === 'string' && entry.ts ? entry.ts : new Date().toISOString(), from, type, text };
  if (Array.isArray(entry.refs) && entry.refs.length) normalized.refs = entry.refs;
  fs.appendFileSync(threadPath(eventId), JSON.stringify(normalized) + '\n');
  return normalized;
}

// comment 서브커맨드 본체: 존재 검증 + append + Slack 미러(publish와 같은 fire-and-forget 패턴)
function comment(opts) {
  const o = opts || {};
  if (!o.id || typeof o.id !== 'string') throw new Error('--id is required');
  const event = getEvent(o.id);
  if (!event) throw new Error('unknown event "' + o.id + '"');
  const entry = appendEntry(o.id, { ts: o.ts, from: o.from, type: o.type, text: o.text, refs: o.refs });
  // 스레드 발언도 안건과 같은 채널로 라우팅: 자기 프로젝트 채널 + (크로스 프로젝트면) 회의실 채널.
  // v3: 역할 발언(from에 '/')은 roleSpeech 라우팅 = 프로젝트 채널만 (council 소음 방지)
  //     + Slack 명의 표시(username/icon_emoji). PM 발언(/'없음')은 기존 그대로.
  const c = core();
  const fallback = '💬 [' + event.repo + '/' + entry.type + '] ' + entry.from + ': ' + entry.text.slice(0, 3000);
  const roleSpeech = isRoleFrom(entry.from);
  if (typeof c.mirrorPayload === 'function' && typeof c.repoStyle === 'function') {
    const s = c.repoStyle(event.repo);
    const badge = { verdict: '⚖️ 판단', approval: '✅ 승인', result: '🏁 결과', question: '❓ 질문', comment: '💬 의견' }[entry.type] || entry.type;
    // §2.10 기계 강제: 미러 표시 텍스트를 문장 단위 개행으로 정규화 (버스 원문은 불변)
    const shown = typeof c.formatReadable === 'function' ? c.formatReadable(entry.text) : entry.text;
    const quoted = '>' + shown.slice(0, 2700).replace(/\n/g, '\n>');
    const payload = {
      text: fallback,
      attachments: [{
        color: s.c,
        blocks: [
          { type: 'section', text: { type: 'mrkdwn', text: s.e + ' *' + event.repo + '* · *' + badge + '* — _' + entry.from + '_\n' + quoted } },
          { type: 'context', elements: [{ type: 'mrkdwn', text: '`' + o.id + '`' + (entry.refs ? ' · ' + entry.refs.join(', ') : '') }] },
        ],
      }],
    };
    let botToken = null;
    if (roleSpeech) {
      // v4: 역할 전용 봇 계정이 있으면 그 봇 명의로 게시(진짜 별개 발신자).
      // 없으면 메인 봇 + username 명의 표시로 폴백.
      botToken = typeof c.roleBotToken === 'function' ? c.roleBotToken(entry.from) : null;
      if (botToken) {
        payload.username = entry.from; // 봇 자체 프로필 위에 소속(REPO/역할) 표기
      } else {
        payload.username = c.repoStyle(entry.from.split('/')[0]).e + ' ' + entry.from;
        payload.icon_emoji = roleEmoji(entry.from);
      }
    }
    c.mirrorPayload(event, payload, roleSpeech ? { roleSpeech: true, token: botToken || undefined } : undefined);
  } else if (typeof c.mirrorEvent === 'function') {
    c.mirrorEvent(event, fallback);
  } else {
    c.postSlackText(fallback);
  }
  return entry;
}

function listThreadIds() {
  return fs.readdirSync(threadsDir()).filter((f) => f.endsWith('.jsonl')).map((f) => f.slice(0, -6)).sort();
}

// 명의 → 레포 매칭 규칙 (§1·§10): ① PM 세션명 `<repo소문자>-` 프리픽스 (mojo-44 ↔ MOJO)
// ② v3 역할 명의 `<repo소문자>/` 프리픽스 (MOJO/backend ↔ MOJO, QA/tester ↔ QA)
function fromMatchesRepo(from, repo) {
  if (typeof from !== 'string') return false;
  const f = from.toLowerCase();
  const r = String(repo).toLowerCase();
  return f.startsWith(r + '-') || f.startsWith(r + '/');
}

// 스레드가 repo 관련: ① 이벤트 발행자 ② affects에 명시 ③ 그 레포 세션이 발언.
// (pending과 달리 affects:[] 브로드캐스트를 "관련"으로 치지 않는다 — 회의 소음 방지)
function isRelatedThread(event, entries, repo) {
  if (event && event.repo === repo) return true;
  if (event && Array.isArray(event.affects) && event.affects.includes(repo)) return true;
  return (entries || []).some((en) => fromMatchesRepo(en.from, repo));
}

// repo 관련 스레드에서 최근 sinceMs 이내 발언들 -> [{eventId, entry}] (ts 오름차순).
// notify-hook의 "활성 회의" 섹션이 사용한다. sinceMs가 유한수가 아니면 전체 기간.
function recentThreadActivity(repo, sinceMs) {
  if (!repo || typeof repo !== 'string') throw new Error('repo is required');
  const cutoff = Number.isFinite(sinceMs) ? Date.now() - sinceMs : -Infinity;
  const out = [];
  for (const eventId of listThreadIds()) {
    const entries = threadEntries(eventId);
    if (!entries.length || !isRelatedThread(getEvent(eventId), entries, repo)) continue;
    for (const entry of entries) if (entryTime(entry) >= cutoff) out.push({ eventId, entry });
  }
  return out.sort((a, b) => entryTime(a.entry) - entryTime(b.entry));
}

// ---------------- 출력 포맷 (사람이 채팅 로그 읽듯) ----------------
// 저장 ts가 ISO(UTC)이므로 문자열 슬라이스로 결정적으로 렌더링하고 (UTC)를 명시한다.
function hhmm(ts) { return typeof ts === 'string' && ts.length >= 16 ? ts.slice(11, 16) : '--:--'; }
function dayOf(ts) { return typeof ts === 'string' && ts.length >= 10 ? ts.slice(0, 10) : '????-??-??'; }
function daySep(day) { return '──── ' + day + ' (UTC) ────'; }
function oneLine(text, width) {
  const s = String(text).replace(/\s*\r?\n\s*/g, ' / ');
  return s.length > width ? s.slice(0, width - 1) + '…' : s;
}
function affectsLabel(event) {
  return Array.isArray(event.affects) && event.affects.length ? event.affects.join(', ') : '전체';
}

// thread --id: 안건 헤더(제목·발행자·kind·affects) + 발언 타임라인
function formatThread(eventId) {
  if (!eventId || typeof eventId !== 'string') throw new Error('--id is required');
  const event = getEvent(eventId);
  if (!event) throw new Error('unknown event "' + eventId + '"');
  const entries = threadEntries(eventId);
  const lines = ['안건: ' + event.title,
    '  ' + event.id + ' | 발행 ' + event.repo + ' | ' + event.kind + ' | affects: ' + affectsLabel(event)];
  if (event.detail) lines.push('  상세: ' + event.detail);
  lines.push('');
  if (!entries.length) {
    lines.push('(발언 없음 — comment --id ' + event.id + ' 로 첫 발언을 남기세요)');
    return lines.join('\n') + '\n';
  }
  let day = '';
  for (const en of entries) {
    if (dayOf(en.ts) !== day) { day = dayOf(en.ts); lines.push(daySep(day)); }
    const text = String(en.text).split('\n');
    lines.push(hhmm(en.ts) + ' ' + en.from + ' [' + en.type + '] ' + text[0]);
    for (let i = 1; i < text.length; i++) lines.push('      ' + text[i]);
    if (Array.isArray(en.refs) && en.refs.length) lines.push('      ↳ refs: ' + en.refs.join(', '));
  }
  return lines.join('\n') + '\n';
}

// feed: 이벤트 발행 + 스레드 발언 통합 타임라인 (오름차순 정렬 후 마지막 limit건 = 최신 활동)
function collectFeed(repo) {
  const events = core().listEvents();
  const eventById = {};
  for (const e of events) eventById[e.id] = e;
  const entriesById = {};
  for (const id of listThreadIds()) entriesById[id] = threadEntries(id);
  const relatedCache = {};
  const related = (id) => {
    if (!repo) return true;
    if (!(id in relatedCache)) {
      relatedCache[id] = isRelatedThread(eventById[id] || getEvent(id), entriesById[id] || [], repo);
    }
    return relatedCache[id];
  };
  const items = [];
  for (const e of events) if (related(e.id)) items.push({ t: Date.parse(e.ts) || 0, ts: e.ts, event: e });
  for (const [id, list] of Object.entries(entriesById)) {
    if (!related(id)) continue;
    for (const entry of list) items.push({ t: entryTime(entry), ts: entry.ts, eventId: id, entry });
  }
  return items.sort((a, b) => a.t - b.t); // stable: 같은 시각이면 안건이 발언보다 먼저
}

function formatFeed(opts) {
  const o = opts || {};
  let limit = FEED_DEFAULT_LIMIT;
  if (o.limit !== undefined && o.limit !== null) {
    limit = parseInt(o.limit, 10);
    if (!Number.isFinite(limit) || limit < 1) throw new Error('invalid --limit "' + o.limit + '" (1 이상 정수)');
  }
  let repo = null;
  if (o.repo !== undefined && o.repo !== null) {
    const valid = core().ALL_REPOS || core().REPOS; // 가상 레포(QA) 포함 — 구버전 core면 실물만
    if (!valid.includes(o.repo)) throw new Error('invalid --repo "' + o.repo + '" (valid: ' + valid.join(', ') + ')');
    repo = o.repo;
  }
  const items = collectFeed(repo);
  if (!items.length) return '(활동 없음' + (repo ? ' — ' + repo + ' 관련' : '') + ')\n';
  const shown = items.slice(-limit);
  const lines = [];
  if (items.length > shown.length) {
    lines.push('(이전 활동 ' + (items.length - shown.length) + '건 생략 — --limit ' + items.length + ' 로 전체 확인)');
  }
  let day = '';
  for (const it of shown) {
    if (dayOf(it.ts) !== day) { day = dayOf(it.ts); lines.push(daySep(day)); }
    if (it.event) {
      const e = it.event;
      lines.push(hhmm(it.ts) + ' [안건] ' + e.repo + '/' + e.kind + ' ' + e.title +
        ' (' + e.id + ', affects: ' + affectsLabel(e) + ')');
    } else {
      lines.push(hhmm(it.ts) + '   └ ' + it.entry.from + ' [' + it.entry.type + '] ' +
        oneLine(it.entry.text, FEED_TEXT_WIDTH) + '  @' + it.eventId);
    }
  }
  return lines.join('\n') + '\n';
}

// report --id: 감사 증적 마크다운.
// 감사자가 "누가 언제 무슨 근거로 판단했고 누가 승인했나"를 이 문서 하나로 재구성할 수 있어야 한다:
// ① 안건 메타 표 ② 발언 전체 타임라인(원문 그대로) ③ 의결 요약(verdict/approval/result 추출).
function mdCell(v) { return String(v).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>'); }

function buildReport(eventId) {
  if (!eventId || typeof eventId !== 'string') throw new Error('--id is required');
  const event = getEvent(eventId);
  if (!event) throw new Error('unknown event "' + eventId + '"');
  const entries = threadEntries(eventId);
  const L = ['# 회의록: ' + event.title, ''];
  L.push('## 1. 안건 메타', '');
  L.push('| 항목 | 값 |');
  L.push('| --- | --- |');
  L.push('| 이벤트 ID | `' + event.id + '` |');
  L.push('| 제목 | ' + mdCell(event.title) + ' |');
  L.push('| 발행 레포 | ' + mdCell(event.repo) + ' |');
  L.push('| 종류(kind) | ' + mdCell(event.kind) + ' |');
  L.push('| 발행 시각(UTC) | ' + mdCell(event.ts) + ' |');
  L.push('| 영향(affects) | ' + mdCell(affectsLabel(event)) + ' |');
  L.push('| 상세 | ' + (event.detail ? mdCell(event.detail) : '-') + ' |');
  L.push('| 참조(refs) | ' + (Array.isArray(event.refs) && event.refs.length ? mdCell(event.refs.join(', ')) : '-') + ' |');
  L.push('| 발행 세션(actor) | ' + (event.actor ? mdCell(event.actor) : '-') + ' |');
  L.push('| 발언 수 | ' + entries.length + ' |', '');
  L.push('## 2. 발언 타임라인', '');
  if (!entries.length) L.push('_발언 없음_', '');
  entries.forEach((en, i) => {
    L.push('### 2.' + (i + 1) + ' [' + en.type + '] ' + en.from + ' — ' + en.ts, '');
    for (const line of String(en.text).split('\n')) L.push('> ' + line);
    if (Array.isArray(en.refs) && en.refs.length) L.push('>', '> refs: ' + en.refs.map((r) => '`' + r + '`').join(', '));
    L.push('');
  });
  L.push('## 3. 의결 요약', '');
  const section = (heading, type, emptyNote) => {
    L.push('### ' + heading, '');
    const hits = entries.filter((en) => en.type === type);
    if (!hits.length) L.push('- (기록 없음 — ' + emptyNote + ')');
    for (const en of hits) {
      const refs = Array.isArray(en.refs) && en.refs.length ? ' [refs: ' + en.refs.join(', ') + ']' : '';
      L.push('- **' + en.from + '** (' + en.ts + '): ' + oneLine(en.text, 500) + refs);
    }
    L.push('');
  };
  section('가부 판단 (verdict)', 'verdict', '판단 미기록');
  section('사용자 승인 (approval)', 'approval', '승인 기록 없음, 미승인 상태로 간주');
  section('반영 결과 (result)', 'result', '미반영 또는 결과 미기록');
  L.push('---');
  L.push('_생성: ' + new Date().toISOString() + ' · mai-bus report --id ' + event.id + '_', '');
  return L.join('\n');
}

module.exports = { ENTRY_TYPES, getEvent, threadEntries, appendEntry, comment, recentThreadActivity,
  fromMatchesRepo, isRelatedThread, formatThread, formatFeed, buildReport,
  // v3 역할 발언 명의 (추가 export — 기존 표면 보존)
  ROLE_EMOJI, isRoleFrom, roleEmoji };
