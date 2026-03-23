# CLAUDE.md

## 프로젝트 개요

"노인을 위한 AI는 없다?" 책의 목차 편집 도구. 드래그 앤 드롭으로 목차를 재배치하고, Claude API가 실시간으로 전체 흐름을 평가해주는 싱글 페이지 앱.

## 기술 스택

- React 18 + Vite
- 순수 React (외부 UI 라이브러리 없음)
- Anthropic Messages API (`claude-sonnet-4-20250514`)
- localStorage로 상태 및 API 키 저장
- 인라인 스타일 (CSS 파일 없음)

## 프로젝트 구조

```
book-toc-app/
├── index.html          # 진입점
├── package.json
├── vite.config.js
├── README.md           # 사용자용 문서 + 원본 프롬프트
├── CLAUDE.md           # 이 파일
└── src/
    ├── main.jsx        # React 마운트
    └── App.jsx         # 전체 앱 (단일 컴포넌트)
```

## 실행

```bash
npm install
npm run dev
```

## 핵심 데이터 구조

목차 항목(item)은 두 종류:
- **chapter**: `{ id, text, type: "에세이"|"기술"|"사례", kind: "chapter" }`
- **section (파트)**: `{ id, text, kind: "section" }`

이 둘이 하나의 flat array `items`에 섞여서 순서대로 렌더링됨. 파트 헤더 아래의 챕터들이 해당 파트에 속하는 시각적 구조.

## 디자인 원칙

- **색상**: 배경 `#F5F0EB` (베이지), 텍스트 `#1a1a1a` (블랙), 보조 `#888`~`#ccc` (그레이). 다른 컬러 사용하지 않음. 집중을 위한 의도적 제한.
- **폰트**: Pretendard, Apple SD Gothic Neo, sans-serif. 시스템 폰트 우선.
- **인터랙션**: 클릭으로 편집, 드래그로 이동, ×로 삭제. 최소한의 UI.
- **톤**: 도구 자체는 조용하고 방해하지 않아야 함. AI 피드백만 캐주얼한 반말.

## AI 편집자 (API 호출)

- `SYSTEM_PROMPT` 상수 = 기본 시스템 프롬프트 (편집자 역할, 피드백 기준 등)
- 사용자가 하단 "프롬프트 편집"으로 시스템 프롬프트를 직접 수정 가능 → `customPrompt` state, localStorage 저장
- API 호출은 "피드백 받기" 버튼 클릭 시에만 실행 (자동 트리거 없음)
- 피드백 결과는 모달 팝업으로 표시
- 모델: `claude-sonnet-4-20250514`
- 헤더에 `anthropic-dangerous-direct-browser-access: true` 필요 (브라우저에서 직접 호출)

## 책 컨텍스트 (기능 개선 시 참고)

- **저자**: 송호준 (호호) — 세계 최초 개인 인공위성 발사자, 미디어 아티스트
- **타겟 독자**: 40-50대, 시니어를 대비하는 현역 세대
- **핵심 메시지**: 경험 많은 사람이 AI를 더 잘 쓴다. 음성인식 시대에 시니어가 주인공.
- **책 구조**: 파트 구분은 느슨하게, 에세이+사례+기술이야기가 비선형으로 섞임
- **관통 프레임워크**: 경험 → 아이디어 → 구현 → 완성(집착) → 공유
- **챕터 타입 3가지**: 에세이(생각/철학), 기술(기술 해설), 사례(실습+QR코드)

## App.jsx 구조 요약

단일 컴포넌트 `App`에 모든 로직 포함. 주요 영역:

### 상수 (파일 상단)
- `INITIAL_ITEMS` (1~48행): 초기 목차 데이터 배열. chapter/section 객체 혼합.
- `TYPE_LABELS`: 타입 한글 약어 매핑 (`에세이→글`, `기술→기술`, `사례→사례`)
- `SYSTEM_PROMPT` (52~64행): 기본 시스템 프롬프트 텍스트 (편집자 역할, 피드백 기준)

### State
| state | 용도 |
|-------|------|
| `items` | 현재 목차 배열 |
| `removedItems` | 삭제된 항목 (복원용) |
| `dragIdx`, `overIdx` | 드래그 앤 드롭 인덱스 |
| `feedback`, `loading` | API 피드백 결과 & 로딩 상태 |
| `addMode`, `newText`, `newType` | 새 항목 추가 UI |
| `editingId`, `editText` | 인라인 편집 |
| `showRemoved` | 삭제 목록 토글 |
| `showSettings` | 설정 모달 |
| `apiKey`, `apiKeyInput` | API 키 (localStorage 저장) |
| `customPrompt` | 사용자 커스텀 시스템 프롬프트 (localStorage 저장) |
| `showPromptEditor` | 프롬프트 편집 영역 토글 |
| `showFeedbackModal` | 피드백 팝업 모달 토글 |

### 주요 함수
- `getFeedback(items)`: API 호출 → `customPrompt`를 system으로, 목차를 user message로 전송 → 결과를 모달로 표시
- `handleDragStart/Over/Drop/End`: HTML5 드래그 앤 드롭
- `moveItem(idx, dir)`: 화살표 버튼으로 항목 이동
- `addItem()`: 새 챕터/파트 추가
- `removeItem(idx)` / `restoreItem(ri)`: 항목 삭제/복원
- `startEdit/saveEdit/cancelEdit`: 인라인 텍스트 편집
- `cycleType(idx)`: 챕터 타입 순환 (에세이→기술→사례)
- `saveApiKey()`: API 키 저장
- `resetAll()`: 초기 데이터로 리셋
- `exportToc()`: 목차를 .txt 파일로 다운로드

### UI 레이아웃 (렌더링 순서)
1. **설정 모달** (`showSettings`): API 키 입력, 내보내기, 초기화
2. **헤더** (sticky): 제목, 통계 (파트/글/기술/사례 수), ⚙ 버튼
3. **목차 리스트**: section(파트 헤더) + chapter 항목. 드래그/편집/삭제/이동 지원.
4. **추가 영역**: "+ 챕터" / "+ 파트" 버튼 → 입력 폼
5. **삭제 항목**: 토글로 보기/숨기기, 복원 버튼
6. **피드백 모달** (`showFeedbackModal`): API 응답을 팝업으로 표시
7. **하단 패널** (fixed): 프롬프트 편집 textarea + "피드백 받기" 버튼

### localStorage 키
- `book-toc-state`: `{ items, removed }` — 목차 상태
- `book-toc-api-key`: API 키 문자열
- `book-toc-custom-prompt`: 커스텀 시스템 프롬프트

## 개선 시 유의사항

- App.jsx가 단일 파일로 되어 있음. 컴포넌트 분리 시 `src/components/` 디렉토리 생성 권장.
- `INITIAL_ITEMS`는 초기 데이터. localStorage에 저장된 데이터가 있으면 그걸 우선 로드함.
- 삭제된 항목은 `removedItems` 배열에 보관되어 복원 가능.
- 드래그 앤 드롭은 HTML5 Drag API 사용 중. 모바일 대응이 약함 — 터치 드래그 라이브러리 도입 고려.
- API 호출은 "피드백 받기" 버튼 클릭 시에만 실행됨.

## 잠재적 개선 방향

- 컴포넌트 분리 (ChapterItem, SectionHeader, FeedbackPanel, SettingsModal)
- 드래그 라이브러리 도입 (dnd-kit 등) — 모바일 터치 지원, 애니메이션
- API 호출 디바운스 (변경 후 1~2초 대기 후 호출)
- 피드백 히스토리 (이전 피드백 비교)
- 목차 버전 관리 (스냅샷 저장/복원)
- 마크다운/JSON 내보내기
- 다크모드 (단, 베이지+블랙 톤 유지)
