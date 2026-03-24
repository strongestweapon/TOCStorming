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

## App.jsx 코드 맵 (행 번호 기준)

단일 컴포넌트 `App`에 모든 로직. 총 ~900행. 행 번호는 변경될 수 있으니 grep으로 확인.

### 상수 (1~84행)
```
3~50    INITIAL_ITEMS[]        초기 목차 데이터. section/chapter 객체 혼합
52      DEFAULT_TYPES          ["에세이", "기술", "사례"]
53      MAX_UNDO               10
54~67   APPLE_COLORS[]         태그 색상 선택용 12색 팔레트
69~81   SYSTEM_PROMPT          AI 편집자 기본 시스템 프롬프트
83~84   loadState/saveState    localStorage 직렬화/역직렬화
```

### State & Ref (86~131행)
```
88    items                    현재 목차 배열 (core data)
89    removedItems             삭제된 항목 (복원용)
90    feedback / 91 loading    API 피드백 결과 & 로딩
92    addMode                  null | "chapter" | "section" — 추가 모드
93    newText / 94 newType     새 항목 입력 값
96    editingId                현재 편집 중인 item id
97    editText                 편집 중인 텍스트
100   apiKey / 101 apiKeyInput API 키
104   customPrompt             커스텀 시스템 프롬프트
105   bookTitle                책 제목 (편집 가능)
108   customTypes              사용자 정의 태그 타입 배열
109   tagColors                태그→색상 매핑 객체
110   cardView                 카드뷰 모드 토글
111   cardZoom                 줌 레벨 (0=맞춤)
112   showDrawer               드로어 토글
113~114 undoStack/redoStack    undo/redo 스택 (items + tagColors 스냅샷)
115~119 dragType/dragGroupIdx/ 편집뷰 드래그 상태
        dragChapterId/overGroupIdx/dropLinePos
122~127 cardDragId/cardOverId/ 카드뷰 드래그 상태
        cardInsertSide/cardOverGroupIdx/
        cardDragGroupIdx/cardOverGroupTarget
128   colorPickerTag           드로어 색상 피커 대상 태그
129   insertAfterItemId        위치 지정 삽입 — 이 item 뒤에 삽입
130   dragHandleActive (ref)   드래그 핸들 mousedown 플래그
120   idCounter (ref)          새 item id 카운터
121   cardViewRef (ref)        카드뷰 DOM ref
```

### Effects (132~137행)
```
132   items/removedItems → localStorage 저장
133   customPrompt → localStorage 저장
134   bookTitle → localStorage 저장
135   customTypes → localStorage 저장
136   tagColors → localStorage 저장
137   mouseup → dragHandleActive 리셋 (드래그 핸들 해제)
```

### 데이터 가공 (139~165행)
```
140~150  groups (useMemo)      items → [{section, chapters[]}] 그룹화
155      maxChapters           가장 많은 챕터를 가진 그룹의 챕터 수
157~161  flatIdx (useMemo)     item.id → flat array index 매핑
163~165  flattenGroups()       groups → flat items 배열 복원
```

### Undo/Redo (169~176행)
```
170   pushUndo()              현재 상태를 undo 스택에 푸시
171   undo() / 172 redo()     되돌리기/다시실행
173~176 Cmd+Z / Cmd+Shift+Z   키보드 단축키 리스너
```

### 편집뷰 드래그 (178~239행)
```
179   resetDrag()             모든 드래그 상태 초기화
--- 그룹(파트) 드래그 ---
182   handleGroupDragStart    dragHandleActive 체크 후 그룹 드래그 시작
183~190 handleGroupDragOver   그룹 hover 감지 + 자동 스크롤
192~201 handleGroupDrop       그룹 순서 변경 (groups 배열 재배치)
--- 챕터 드래그 ---
204   handleChapterDragStart  챕터 드래그 시작 (stopPropagation)
206~217 handleChapterDragOverItem  hover 위치 기반 dropLinePos 계산 + 자동 스크롤
219~227 handleSectionDragOverForChapter  섹션 위 hover → 섹션 바로 뒤에 삽입위치
229~239 handleChapterDropAtPos  dropLinePos 기반 챕터 이동 실행
```
**드래그 핸들 패턴**: `dragHandleActive` ref 사용. 번호/파트 라벨에 `onMouseDown`으로 활성화, `onDragStart`에서 체크. 입력창 텍스트 선택과 드래그가 겹치지 않음.
**자동 스크롤**: dragOver에서 `e.clientY`가 화면 상/하단 80px 이내이면 `window.scrollBy` 호출.

### API 호출 (242~258행)
```
243~258 getFeedback()         Anthropic Messages API 호출. customPrompt를 system으로 전송
```

### 아이템 조작 (261~382행)
```
262~275 addItem()             새 챕터/파트 추가. insertAfterItemId 있으면 해당 위치에 삽입
277     removeItem(id)        삭제 → removedItems로 이동
278     restoreItem(ri)       removedItems에서 복원
279~280 editType/editNote     편집 상태 (타입, 노트)
281     startEdit()           편집 모드 진입
282~288 saveEdit()            편집 저장 (text, type, note 업데이트)
289     cancelEdit()          편집 취소
290     saveApiKey()          API 키 localStorage 저장
291     resetAll()            초기 데이터로 리셋
292~315 exportToc()           .md 파일 다운로드 (thinking/favorite 플래그 포함)
316~360 importToc()           .md/.txt 파일 파싱 → items 복원
361     toggleFullscreen()    풀스크린 토글
362~363 startTitleEdit/saveTitleEdit  책 제목 편집
364     toggleThinking(id)    고민중 플래그 토글
365     toggleFavorite(id)    마음에 드는 플래그 토글
366~382 exportTocTxt()        .txt 파일 다운로드 (thinking/favorite 포함)
```

### 렌더링 준비 (385~399행)
```
385~390 chapters/sectionsList/stats/allTags/chapterCount/sectionCount  파생 데이터
392~397 backdrop/modalBox/drawerBtn/headerBtn/fs/zoomScale  스타일 상수
399     InsertLine 컴포넌트   드래그 인서트 라인 (높이 3px)
```

### renderChapter (401~490행) — 편집뷰 챕터 렌더링
```
401~408 드래그 설정           draggable + dragHandleActive 체크
409~413 스타일               thinking이면 연한 배경, favorite이면 왼쪽 금색 보더
415~416 번호 span            드래그 핸들 (onMouseDown → dragHandleActive=true, cursor:grab)
418~440 편집 모드            input×3 (텍스트+태그+노트). Enter→저장, Escape→취소
441~447 읽기 모드            텍스트+노트 표시. thinking이면 opacity 0.55
449~462 우측 버튼들          고민/★ 라벨 + 태그 배지 + ★토글 + ?토글 + +추가 + ×삭제
465~489 인라인 추가 폼       insertAfterItemId===ch.id일 때 표시. 입력+태그선택+추가/취소
```

### return JSX (491~898행)
```
--- 모달 (494~539행) ---
494~512  설정 모달           API 키 입력, 초기화 버튼
513~528  프롬프트 편집 모달   textarea, 기본값 복원 버튼
529~539  피드백 모달         AI 피드백 텍스트 표시

--- 드로어 (541~583행) ---
541      오버레이 (클릭→닫기)
546~583  사이드 메뉴          통계/태그색상피커/프롬프트/피드백받기/
                             내보내기(.md)/내보내기(.txt)/불러오기/설정

--- 편집뷰 헤더 (586~610행) ---
586      sticky 헤더          제목(편집가능) + undo/redo + 카드뷰/풀스크린/메뉴 버튼

--- 카드뷰 (612~763행) ---
612~626  카드뷰 헤더          제목 + 줌(−/맞춤/+) + undo/redo + 편집/풀스크린/메뉴
627~630  줌 구조              스크롤컨테이너 → spacer → transform:scale 컨텐츠
631~757  그룹 렌더링          파트=칼럼, 챕터=카드. 드래그/드롭 지원
                             카드 드래그: 상/하 반 감지 → before/after 라인
                             파트 드래그: 칼럼 단위 이동

--- 편집뷰 리스트 (765~858행) ---
765      그룹 순회            groups.map → 각 그룹(파트+챕터) 렌더링
772      그룹 draggable       dragHandleActive 체크 (파트라벨이 핸들)
796~831  섹션 헤더            파트N 라벨(드래그핸들) + 편집 + +추가 + ×삭제
832~857  파트 뒤 인라인 추가   insertAfterItemId===sec.id일 때 폼 표시

--- 하단 추가 영역 (860~895행) ---
860      addMode && !insertAfterItemId 일 때 하단에 풀 추가 폼 표시
879~895  "+" 챕터 / "+" 파트   addMode 토글 버튼
```

### 아이템 데이터 구조
```js
// chapter
{ id: "1", text: "제목", type: "에세이", kind: "chapter",
  note: "한줄 메모",      // optional
  thinking: true,         // optional — 고민중 플래그
  favorite: true          // optional — 마음에 드는 플래그
}
// section (파트)
{ id: "s1", text: "파트 이름", kind: "section", note: "메모" }
```

### localStorage 키
| 키 | 값 |
|----|-----|
| `book-toc-state` | `{ items, removed }` — 목차 + 삭제된 항목 |
| `book-toc-api-key` | API 키 문자열 |
| `book-toc-custom-prompt` | 커스텀 시스템 프롬프트 |
| `book-toc-tag-colors` | `{ 에세이: "#FF3B30", ... }` 태그→색상 |
| `book-toc-title` | 책 제목 |
| `book-toc-types` | `["에세이", "기술", "사례", ...]` 태그 목록 |

### 중복 패턴 — 하나 바꾸면 전부 바꿔야 하는 것들

| 패턴 | 위치 (행) | 설명 |
|------|----------|------|
| **인라인 추가 폼** | ~463, ~834, ~860 | 챕터 뒤 / 파트 뒤 / 하단. 입력+태그선택+새태그+추가/취소. 3곳 동일 구조 |
| **태그 목록 렌더링** | ~471, ~842, ~875 | `allTypes.map(...)` — 인라인 폼 3곳에서 동일하게 태그 버튼 생성 |
| **새 태그 입력** | ~478, ~849, ~886 | `newTagInput` — 3곳 모두 동일한 "+" 새 태그 input |
| **드래그 핸들** | ~428(챕터번호), ~806(파트라벨) | `dragHandleActive.current = true` onMouseDown |
| **Enter 저장** | ~434,436,441(챕터편집), ~813,817(파트편집) | `if (e.key === "Enter") saveEdit(id)` |
| **내보내기 플래그** | ~303(md), ~374(txt) | `item.favorite` 표시 — 새 플래그 추가 시 양쪽 수정 |
| **드래그 상태 리셋** | ~179(편집뷰), ~645,598(카드뷰) | `resetDrag()` vs 카드뷰 개별 set — 패턴이 다름 주의 |

## 개선 시 유의사항

- App.jsx가 단일 파일로 되어 있음. 컴포넌트 분리 시 `src/components/` 디렉토리 생성 권장.
- `INITIAL_ITEMS`는 초기 데이터. localStorage에 저장된 데이터가 있으면 그걸 우선 로드함.
- 삭제된 항목은 `removedItems` 배열에 보관되어 복원 가능.
- 드래그 앤 드롭은 HTML5 Drag API 사용 중. 모바일 대응이 약함 — 터치 드래그 라이브러리 도입 고려.
- API 호출은 "피드백 받기" 버튼 클릭 시에만 실행됨.

## 카드뷰 레이아웃 원칙

카드뷰 CSS 수정 시 반드시 지킬 것:

### DOM 구조
```
div (90vw × 96vh, flex column)              ← 전체 컨테이너
  div (헤더: 제목 + 줌/undo/편집 버튼)        ← flexShrink: 0, 줌 밖
  div (overflow: auto)                       ← 스크롤 컨테이너
    div (width/height: zoomScale*100%)       ← spacer (스크롤 영역 확보)
      div (width/height: 100/zoomScale%)     ← 컨텐츠 (transform: scale)
        div (flex row, gap: 6)               ← 칼럼 행
          div × 8 (flex: 1, flex column)     ← 각 파트 칼럼
            div (파트 헤더)
            div (grid, repeat(maxCh, 1fr))   ← 카드 그리드
              div × N (카드)
```

### 줌 구현 (transform: scale 패턴)
- `cardZoom` state: 0=맞춤, +1=확대, -1=축소
- `zoomScale = Math.pow(1.25, cardZoom)` — 매 단계 25%씩
- **핵심**: 맞춤(0) 상태의 레이아웃을 그대로 유지한 채 균일 확대
- **CSS zoom 쓰면 안 됨**: 레이아웃 리플로우 발생 → 칼럼 좁아지고 텍스트 줄바꿈
- **헤더는 줌 밖**: 스크롤 컨테이너만 줌 적용, 헤더 버튼은 항상 고정 크기
- **스크롤 처리**: spacer div가 scale된 크기를 부모에게 알려줘서 스크롤바 생성
  ```
  spacer: width: ${scale * 100}%, height: ${scale * 100}%
  content: width: ${100 / scale}%, height: ${100 / scale}%, transform: scale(${scale})
  ```

### 카드 높이 통일
- `maxChapters = Math.max(...groups.map(g => g.chapters.length))`
- `grid-template-rows: repeat(maxChapters, 1fr)` — 가장 긴 칼럼 기준
- 짧은 칼럼은 아래가 빔 (카드가 비정상적으로 늘어나지 않음)
- flex: 1로 카드 높이를 분배하면 프롤로그(1개)가 거대해지는 문제 발생 → grid 1fr이 정답

### 드래그
- 카드 드래그: 상/하 반 감지 → before/after 인서트라인 (가로 3px)
- 파트 드래그: 칼럼 전체 드래그 → 좌/우 인서트라인 (세로 3px)
- 카드를 다른 파트로 드롭: 해당 파트 마지막에 삽입

### 기타 원칙
- **flex chain 확인**: 부모가 flex container가 아니면 자식 flex:1 무의미
- **코드 전에 레이아웃 구조를 텍스트로 먼저 설계할 것**

## 개선 시 유의사항 (코딩 원칙)

- **임기응변 금지**: 속성 하나 바꿔보는 추측성 시도 대신, "왜 안 되는지" CSS 스펙 기준으로 진단 먼저
- **기존 패턴 참고 필수**: 새 뷰/모드 만들 때 편집뷰의 UX 패턴(인서트라인, 드래그 피드백 등) 동일 적용
- **수정 시 사이드이펙트 확인**: 한 곳 바꾸면 다른 곳 깨지지 않는지 체크
- **구조적 해결 우선**: 픽셀 단위 임기응변보다 근본적 해결책

## 잠재적 개선 방향

- 컴포넌트 분리 (ChapterItem, SectionHeader, FeedbackPanel, SettingsModal)
- 드래그 라이브러리 도입 (dnd-kit 등) — 모바일 터치 지원, 애니메이션
- 피드백 히스토리 (이전 피드백 비교)
- 목차 버전 관리 (스냅샷 저장/복원)
- 아이디어 메모장 기능 (목차 편집 전 브레인스토밍 공간)
- 다크모드 (단, 베이지+블랙 톤 유지)
