import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const INITIAL_ITEMS = [
  { id: "s0", text: "프롤로그", kind: "section" },
  { id: "1", text: "인공위성 송호준, 인공지능 송호준", type: "에세이", kind: "chapter" },
  { id: "s1", text: "왜 지금, 왜 우리인가", kind: "section" },
  { id: "2", text: "인공지능이 머야?", type: "기술", kind: "chapter" },
  { id: "3", text: "왜 갑자기 AI가 터졌나 — GPU, 데이터, 그리고 돈 이야기", type: "기술", kind: "chapter" },
  { id: "4", text: "인공지능은 경험에 대한 이야기", type: "에세이", kind: "chapter" },
  { id: "5", text: "회의 시간에 나만 ChatGPT를 안 쓰고 있다", type: "에세이", kind: "chapter" },
  { id: "6", text: "20년치 업무 노하우를 AI한테 먹여서 후배 교육자료 만들기", type: "사례", kind: "chapter" },
  { id: "s2", text: "기술을 알아야 안 속는다", kind: "section" },
  { id: "7", text: "인공지능은 미국사람? — 영어 중심 AI, 한국어의 가능성", type: "기술", kind: "chapter" },
  { id: "8", text: "AI가 거짓말을 한다 — 할루시네이션", type: "기술", kind: "chapter" },
  { id: "9", text: "내 데이터는 누가 갖고 있나 — AI 시대의 프라이버시", type: "기술", kind: "chapter" },
  { id: "10", text: "AI로 사람을 대체한다고?", type: "에세이", kind: "chapter" },
  { id: "11", text: "AI한테 사업 계획서 쓰게 했는데 그럴듯한 헛소리가 나왔던 경험", type: "사례", kind: "chapter" },
  { id: "12", text: "GPU가 뭐길래 주식을 좌우하나", type: "기술", kind: "chapter" },
  { id: "13", text: "AI 기반 영화, 얼마나 현실이 됐을까?", type: "기술", kind: "chapter" },
  { id: "s3", text: "다시 살아보자", kind: "section" },
  { id: "14", text: "중년의 위기 2회차, 3회차 — 다시 살아보자", type: "에세이", kind: "chapter" },
  { id: "15", text: "나이 들어도 흥분할 수 있는 삶", type: "에세이", kind: "chapter" },
  { id: "16", text: '"늦었다"는 말의 함정 — 인공위성도 늦었다고 했다', type: "에세이", kind: "chapter" },
  { id: "17", text: "30년 경력 회계사 vs 3년차 개발자 — 누가 AI를 더 잘 쓸까?", type: "에세이", kind: "chapter" },
  { id: "18", text: "퇴직 후 첫 사이드 프로젝트 — AI로 프로토타입 하루 만에 만들기", type: "사례", kind: "chapter" },
  { id: "19", text: "40년 요리 레시피 음성으로 불러줘서 가족 레시피북 완성", type: "사례", kind: "chapter" },
  { id: "s4", text: "경험이 무기다", kind: "section" },
  { id: "20", text: "프롬프트는 질문이야", type: "에세이", kind: "chapter" },
  { id: "21", text: "도메인 지식이 있어야 AI를 쓸 수 있다 ①②", type: "에세이", kind: "chapter" },
  { id: "22", text: "AI는 답을 주지만, 질문은 인생이 만든다", type: "에세이", kind: "chapter" },
  { id: "23", text: "경험→아이디어→구현→완성(집착)→공유", type: "에세이", kind: "chapter" },
  { id: "24", text: "완성했으면 세상에 내놔라 — 공유가 제일 어렵고 제일 중요하다", type: "에세이", kind: "chapter" },
  { id: "25", text: "내 평생 사진 AI로 정리해서 가족 타임라인 만들기", type: "사례", kind: "chapter" },
  { id: "26", text: "흩어진 글 모아서 에세이집 만들고 블로그에 올리기", type: "사례", kind: "chapter" },
  { id: "s5", text: "기술이 사람을 만날 때", kind: "section" },
  { id: "27", text: "키오스크는 왜 이따위로 만들었을까 — 시니어용 UI/UX", type: "기술", kind: "chapter" },
  { id: "28", text: "음성인식이 전부를 바꾼다 — 키보드가 사라지는 세상", type: "기술", kind: "chapter" },
  { id: "29", text: "컴퓨터 민주화의 마지막 장", type: "에세이", kind: "chapter" },
  { id: "30", text: "저출산과 로봇 — 시니어가 다시 필요해지는 사회", type: "에세이", kind: "chapter" },
  { id: "31", text: "시골 가서 살래? 기여하며 살래?", type: "에세이", kind: "chapter" },
  { id: "32", text: "AI로 동네 커뮤니티 문제 해결하기", type: "사례", kind: "chapter" },
  { id: "33", text: "건강 데이터 말로 기록하고 추세 분석 받기", type: "사례", kind: "chapter" },
  { id: "s6", text: "더 큰 질문들", kind: "section" },
  { id: "34", text: "인간의 뇌는 위대한 것일까?", type: "에세이", kind: "chapter" },
  { id: "35", text: "AI를 사용하는 건 인간을 이해하는 데 도움을 준다", type: "에세이", kind: "chapter" },
  { id: "36", text: "인공지능 시대에 '나'는 누구인가", type: "에세이", kind: "chapter" },
  { id: "37", text: "AI로 내 인생 연표 만들기 — 자녀에게 물려줄 가족사", type: "사례", kind: "chapter" },
  { id: "s7", text: "에필로그", kind: "section" },
  { id: "38", text: "인공위성을 쏘던 그 마음으로", type: "에세이", kind: "chapter" },
];

const DEFAULT_TYPES = ["에세이", "기술", "사례"];
const MAX_UNDO = 10;
const APPLE_COLORS = [
  { name: "red", value: "#FF3B30" },
  { name: "orange", value: "#FF9500" },
  { name: "yellow", value: "#FFCC00" },
  { name: "green", value: "#34C759" },
  { name: "mint", value: "#00C7BE" },
  { name: "teal", value: "#30B0C7" },
  { name: "blue", value: "#007AFF" },
  { name: "indigo", value: "#5856D6" },
  { name: "purple", value: "#AF52DE" },
  { name: "pink", value: "#FF2D55" },
  { name: "brown", value: "#A2845E" },
  { name: "gray", value: "#8E8E93" },
];

const SYSTEM_PROMPT = `당신은 "노인을 위한 AI는 없다?"라는 책의 목차 편집을 도와주는 편집자입니다.
이 책의 저자는 인공위성을 개인으로서 세계 최초로 쏘아올린 미디어 아티스트 송호준(호호)입니다.
타겟 독자는 40-50대, 시니어를 대비하는 현역 세대입니다.
책의 핵심 메시지: 경험이 많은 사람이 AI를 더 잘 쓸 수 있고, 음성인식 시대가 오면 시니어가 진짜 주인공이 된다.
책 구조: 파트 구분은 느슨하게, 챕터마다 에세이+사례+기술이야기가 섞이는 비선형 에세이 구조.
관통하는 프레임워크: 경험 → 아이디어 → 구현 → 완성(집착) → 공유

목차가 변경될 때마다 200자 이내로 간결하게 피드백을 줍니다:
- 전체 흐름의 느낌 (감정 곡선이 자연스러운지)
- 에세이/기술/사례의 배분이 적절한지 (특히 파트 내에서)
- 파트 간 전환이 자연스러운지
- 빠진 것 같은 주제나 연결이 끊기는 부분
- 캐주얼한 한국어 반말로 대답합니다`;

function loadState() { try { const s = localStorage.getItem("book-toc-state"); if (s) return JSON.parse(s); } catch {} return null; }
function saveState(items, removed) { try { localStorage.setItem("book-toc-state", JSON.stringify({ items, removed })); } catch {} }

export default function App() {
  const saved = useRef(loadState());
  const [items, setItems] = useState(saved.current?.items || INITIAL_ITEMS);
  const [removedItems, setRemovedItems] = useState(saved.current?.removed || []);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [addMode, setAddMode] = useState(null);
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState(() => { try { const t = JSON.parse(localStorage.getItem("book-toc-types")); return t?.[0] || "에세이"; } catch { return "에세이"; } });
  const [newTagInput, setNewTagInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showRemoved, setShowRemoved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => { try { return localStorage.getItem("book-toc-api-key") || ""; } catch { return ""; } });
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(() => { try { return localStorage.getItem("book-toc-custom-prompt") || SYSTEM_PROMPT; } catch { return SYSTEM_PROMPT; } });
  const [bookTitle, setBookTitle] = useState(() => { try { return localStorage.getItem("book-toc-title") || "노인을 위한 AI는 없다?"; } catch { return "노인을 위한 AI는 없다?"; } });
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [customTypes, setCustomTypes] = useState(() => { try { const s = localStorage.getItem("book-toc-types"); return s ? JSON.parse(s) : DEFAULT_TYPES; } catch { return DEFAULT_TYPES; } });
  const [tagColors, setTagColors] = useState(() => { try { const s = localStorage.getItem("book-toc-tag-colors"); return s ? JSON.parse(s) : {}; } catch { return {}; } });
  const [cardView, setCardView] = useState(false);
  const [cardZoom, setCardZoom] = useState(0); // -2,-1,0,1,2... 0=최적화
  const [showDrawer, setShowDrawer] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [dragType, setDragType] = useState(null);
  const [dragGroupIdx, setDragGroupIdx] = useState(null);
  const [dragChapterId, setDragChapterId] = useState(null);
  const [overGroupIdx, setOverGroupIdx] = useState(null);
  const [dropLinePos, setDropLinePos] = useState(null); // flat index where chapter will be inserted
  const idCounter = useRef(200);
  const cardViewRef = useRef(null);
  const [cardDragId, setCardDragId] = useState(null);
  const [cardOverId, setCardOverId] = useState(null);
  const [cardInsertSide, setCardInsertSide] = useState(null); // "before" | "after"
  const [cardOverGroupIdx, setCardOverGroupIdx] = useState(null);
  const [cardDragGroupIdx, setCardDragGroupIdx] = useState(null);
  const [cardOverGroupTarget, setCardOverGroupTarget] = useState(null);
  const [colorPickerTag, setColorPickerTag] = useState(null);
  const [insertAfterItemId, setInsertAfterItemId] = useState(null); // 위치 지정 삽입
  const dragHandleActive = useRef(false); // 드래그 핸들 활성 여부
  const touchDragRef = useRef({ active: false, type: null, id: null, groupIdx: null, dropPos: null, overGroupIdx: null });
  const touchStateRef = useRef({});
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [editLocked, setEditLocked] = useState(() => window.innerWidth < 768);

  useEffect(() => { saveState(items, removedItems); }, [items, removedItems]);
  useEffect(() => { try { localStorage.setItem("book-toc-custom-prompt", customPrompt); } catch {} }, [customPrompt]);
  useEffect(() => { try { localStorage.setItem("book-toc-title", bookTitle); } catch {} }, [bookTitle]);
  useEffect(() => { try { localStorage.setItem("book-toc-types", JSON.stringify(customTypes)); } catch {} }, [customTypes]);
  useEffect(() => { try { localStorage.setItem("book-toc-tag-colors", JSON.stringify(tagColors)); } catch {} }, [tagColors]);
  useEffect(() => { const h = () => { dragHandleActive.current = false; }; document.addEventListener("mouseup", h); return () => document.removeEventListener("mouseup", h); }, []);
  useEffect(() => { const h = () => { const m = window.innerWidth < 768; setIsMobile(m); if (m) { setCardView(false); setEditLocked(true); } }; window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);

  // Touch drag (iPad/모바일)
  useEffect(() => {
    const onMove = (e) => {
      const td = touchDragRef.current;
      if (!td.active) return;
      e.preventDefault();
      const touch = e.touches[0];
      const y = touch.clientY;
      const threshold = 80, h = window.innerHeight;
      if (y < threshold) window.scrollBy(0, -Math.round(12 * (1 - y / threshold)));
      else if (y > h - threshold) window.scrollBy(0, Math.round(12 * (1 - (h - y) / threshold)));
      const els = document.querySelectorAll("[data-item-id]");
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (y < rect.top || y > rect.bottom) continue;
        const itemId = el.dataset.itemId, itemKind = el.dataset.itemKind;
        if (td.type === "chapter" && itemId !== td.id) {
          const fi = touchStateRef.current.flatIdx;
          const pos = itemKind === "section" ? fi[itemId] + 1 : (y < rect.top + rect.height / 2 ? fi[itemId] : fi[itemId] + 1);
          td.dropPos = pos;
          setDropLinePos(pos);
        } else if (td.type === "group") {
          const gs = touchStateRef.current.groups;
          for (let gi = 0; gi < gs.length; gi++) {
            if (gs[gi].section?.id === itemId || gs[gi].chapters.some(c => c.id === itemId)) {
              td.overGroupIdx = gi; setOverGroupIdx(gi); break;
            }
          }
        }
        break;
      }
    };
    const onEnd = () => {
      const td = touchDragRef.current;
      if (!td.active) return;
      td.active = false;
      const { items: cur, groups: gs, flattenGroups: flat, pushUndo: pu } = touchStateRef.current;
      if (td.type === "chapter" && td.id && td.dropPos !== null) {
        pu();
        const srcIdx = cur.findIndex(i => i.id === td.id);
        const updated = [...cur];
        const [moved] = updated.splice(srcIdx, 1);
        const adj = td.dropPos > srcIdx ? td.dropPos - 1 : td.dropPos;
        updated.splice(adj, 0, moved);
        setItems(updated);
      } else if (td.type === "group" && td.groupIdx !== null && td.overGroupIdx !== null && td.groupIdx !== td.overGroupIdx) {
        pu();
        const reordered = [...gs];
        const [moved] = reordered.splice(td.groupIdx, 1);
        reordered.splice(td.overGroupIdx, 0, moved);
        setItems(flat(reordered));
      }
      setDragType(null); setDragGroupIdx(null); setDragChapterId(null); setOverGroupIdx(null); setDropLinePos(null);
      td.dropPos = null; td.overGroupIdx = null;
    };
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    return () => { document.removeEventListener("touchmove", onMove); document.removeEventListener("touchend", onEnd); };
  }, []);

  // Groups + flat index map
  const groups = useMemo(() => {
    const result = [];
    let current = { section: null, chapters: [] };
    for (const item of items) {
      if (item.kind === "section") {
        if (current.section || current.chapters.length > 0) result.push(current);
        current = { section: item, chapters: [] };
      } else {
        current.chapters.push(item);
      }
    }
    if (current.section || current.chapters.length > 0) result.push(current);
    return result;
  }, [items]);

  const maxChapters = useMemo(() => Math.max(...groups.map((g) => g.chapters.length), 1), [groups]);

  const flatIdx = useMemo(() => {
    const map = {};
    items.forEach((item, idx) => { map[item.id] = idx; });
    return map;
  }, [items]);

  const flattenGroups = (gs) => {
    const r = [];
    for (const g of gs) { if (g.section) r.push(g.section); r.push(...g.chapters); }
    return r;
  };

  // Undo/Redo (items + tagColors)
  const pushUndo = useCallback(() => { setUndoStack((p) => [...p.slice(-(MAX_UNDO - 1)), { items, tagColors }]); setRedoStack([]); }, [items, tagColors]);
  const undo = useCallback(() => { if (!undoStack.length) return; const prev = undoStack[undoStack.length - 1]; setRedoStack((r) => [...r, { items, tagColors }]); setItems(prev.items); setTagColors(prev.tagColors); setUndoStack((u) => u.slice(0, -1)); }, [undoStack, items, tagColors]);
  const redo = useCallback(() => { if (!redoStack.length) return; const next = redoStack[redoStack.length - 1]; setUndoStack((u) => [...u, { items, tagColors }]); setItems(next.items); setTagColors(next.tagColors); setRedoStack((r) => r.slice(0, -1)); }, [redoStack, items, tagColors]);
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [undo, redo]);

  // Drag
  const resetDrag = () => { setDragType(null); setDragGroupIdx(null); setDragChapterId(null); setOverGroupIdx(null); setDropLinePos(null); };

  // Group drag
  const handleGroupDragStart = (e, gi) => { setDragType("group"); setDragGroupIdx(gi); e.dataTransfer.effectAllowed = "move"; };
  const handleGroupDragOver = (e, gi) => {
    e.preventDefault();
    if (dragType === "group") {
      setOverGroupIdx(gi);
      const threshold = 80, y = e.clientY, h = window.innerHeight;
      if (y < threshold) window.scrollBy(0, -Math.round(12 * (1 - y / threshold)));
      else if (y > h - threshold) window.scrollBy(0, Math.round(12 * (1 - (h - y) / threshold)));
    }
  };
  const handleGroupDrop = (gi) => {
    if (dragType === "group" && dragGroupIdx !== null && dragGroupIdx !== gi) {
      pushUndo();
      const reordered = [...groups];
      const [moved] = reordered.splice(dragGroupIdx, 1);
      reordered.splice(gi, 0, moved);
      setItems(flattenGroups(reordered));
    }
    resetDrag();
  };

  // Chapter drag — position-based insertion
  const handleChapterDragStart = (e, id) => { e.stopPropagation(); setDragType("chapter"); setDragChapterId(id); e.dataTransfer.effectAllowed = "move"; };

  const handleChapterDragOverItem = (e, itemId) => {
    e.preventDefault();
    if (dragType !== "chapter") return;
    e.stopPropagation();
    // 자동 스크롤: 화면 상하단 80px 이내이면 스크롤
    const threshold = 80, y = e.clientY, h = window.innerHeight;
    if (y < threshold) window.scrollBy(0, -Math.round(12 * (1 - y / threshold)));
    else if (y > h - threshold) window.scrollBy(0, Math.round(12 * (1 - (h - y) / threshold)));
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = flatIdx[itemId];
    setDropLinePos(e.clientY < rect.top + rect.height / 2 ? idx : idx + 1);
  };

  const handleSectionDragOverForChapter = (e, sectionId) => {
    e.preventDefault();
    if (dragType !== "chapter") return;
    e.stopPropagation();
    const threshold = 80, y = e.clientY, h = window.innerHeight;
    if (y < threshold) window.scrollBy(0, -Math.round(12 * (1 - y / threshold)));
    else if (y > h - threshold) window.scrollBy(0, Math.round(12 * (1 - (h - y) / threshold)));
    setDropLinePos(flatIdx[sectionId] + 1);
  };

  const handleChapterDropAtPos = (e) => {
    if (dragType !== "chapter" || !dragChapterId || dropLinePos === null) { resetDrag(); return; }
    if (e) e.stopPropagation();
    pushUndo();
    const srcIdx = items.findIndex((i) => i.id === dragChapterId);
    const updated = [...items];
    const [moved] = updated.splice(srcIdx, 1);
    const adj = dropLinePos > srcIdx ? dropLinePos - 1 : dropLinePos;
    updated.splice(adj, 0, moved);
    setItems(updated);
    resetDrag();
  };

  // API
  const getFeedback = useCallback(async (newItems) => {
    if (!apiKey) { setFeedback("API 키를 먼저 설정해줘. ≡ → 설정."); setShowFeedbackModal(true); return; }
    setShowFeedbackModal(false); setLoading(true);
    let chNum = 0;
    const tocText = newItems.map((item) => { if (item.kind === "section") return `\n── 파트: ${item.text} ──`; chNum++; return `  ${chNum}. [${item.type}] ${item.text}`; }).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: customPrompt, messages: [{ role: "user", content: `현재 목차:\n${tocText}` }] }),
      });
      const data = await res.json();
      if (data.error) setFeedback(`API 에러: ${data.error.message}`);
      else { const text = data.content?.map((c) => (c.type === "text" ? c.text : "")).filter(Boolean).join("\n"); setFeedback(text || "피드백을 가져오지 못했어."); }
    } catch { setFeedback("API 연결 실패 — 키를 확인하거나 다시 시도해봐."); }
    setLoading(false); setShowFeedbackModal(true);
  }, [apiKey, customPrompt]);

  // Item ops
  const addItem = () => {
    if (!newText.trim()) return; pushUndo(); idCounter.current += 1;
    const type = newTagInput.trim() || newType;
    if (addMode === "chapter" && type && !customTypes.includes(type)) setCustomTypes((p) => [...p, type]);
    const newItem = addMode === "section" ? { id: String(idCounter.current), text: newText.trim(), kind: "section" } : { id: String(idCounter.current), text: newText.trim(), type, kind: "chapter" };
    if (insertAfterItemId) {
      const idx = items.findIndex(i => i.id === insertAfterItemId);
      const updated = [...items];
      updated.splice(idx + 1, 0, newItem);
      setItems(updated);
    } else {
      setItems([...items, newItem]);
    }
    setNewText(""); setNewTagInput(""); setAddMode(null); setInsertAfterItemId(null);
  };
  const removeItem = (id) => { pushUndo(); const item = items.find((i) => i.id === id); if (item) { setRemovedItems((p) => [...p, item]); setItems(items.filter((i) => i.id !== id)); } };
  const restoreItem = (ri) => { pushUndo(); setRemovedItems((p) => p.filter((_, i) => i !== ri)); setItems([...items, removedItems[ri]]); };
  const [editType, setEditType] = useState("");
  const [editNote, setEditNote] = useState("");
  const startEdit = (id, text, type, note) => { if (editLocked) return; setEditingId(id); setEditText(text); setEditType(type || ""); setEditNote(note || ""); };
  const saveEdit = (id) => {
    pushUndo();
    const typeVal = editType.trim();
    if (typeVal && !customTypes.includes(typeVal)) setCustomTypes((p) => [...p, typeVal]);
    setItems((p) => p.map((c) => (c.id === id ? { ...c, text: editText, note: editNote.trim() || undefined, ...(typeVal ? { type: typeVal } : {}) } : c)));
    setEditingId(null); setEditText(""); setEditType(""); setEditNote("");
  };
  const cancelEdit = () => { setEditingId(null); setEditText(""); setEditType(""); setEditNote(""); };
  const saveApiKey = () => { localStorage.setItem("book-toc-api-key", apiKeyInput); setApiKey(apiKeyInput); setShowSettings(false); };
  const resetAll = () => { if (confirm("목차를 초기 상태로 되돌릴까?")) { pushUndo(); setItems(INITIAL_ITEMS); setRemovedItems([]); setFeedback(""); setShowSettings(false); } };
  const exportToc = () => {
    let secN = 0;
    const lines = [`# ${bookTitle}`, ""];
    for (const item of items) {
      if (item.kind === "section") {
        secN++;
        if (secN > 1) lines.push("");
        lines.push(`## 파트${secN}. ${item.text}`);
        if (item.note) lines.push(`> ${item.note}`);
        lines.push("");
      } else {
        lines.push(`- [${item.type}] ${item.text}${item.favorite ? " (★)" : ""}`);
        if (item.note) lines.push(`    > ${item.note}`);
      }
    }
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bookTitle}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importToc = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.txt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const lines = text.split("\n");
        const newItems = [];
        let id = 500;
        let title = bookTitle;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const titleMatch = line.match(/^# (.+)/);
          if (titleMatch && !line.startsWith("## ")) { title = titleMatch[1].trim(); continue; }
          const secMatch = line.match(/^## 파트\d+\.\s*(.+)/);
          if (secMatch) {
            const sec = { id: String(id++), text: secMatch[1].trim(), kind: "section" };
            const nextLine = lines[i + 1];
            if (nextLine && nextLine.match(/^>\s*/)) { sec.note = nextLine.replace(/^>\s*/, "").trim(); i++; }
            newItems.push(sec);
            continue;
          }
          const chMatch = line.match(/^- \[(.+?)\]\s*(.+)/);
          if (chMatch) {
            const ch = { id: String(id++), text: chMatch[2].trim(), type: chMatch[1].trim(), kind: "chapter" };
            const nextLine = lines[i + 1];
            if (nextLine && nextLine.match(/^\s{2,}>\s*/)) { ch.note = nextLine.replace(/^\s+>\s*/, "").trim(); i++; }
            newItems.push(ch);
            continue;
          }
        }
        if (newItems.length > 0) {
          pushUndo();
          setBookTitle(title);
          setItems(newItems);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const toggleFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); };
  const startTitleEdit = () => { if (editLocked) return; setEditingTitle(true); setTitleInput(bookTitle); };
  const saveTitleEdit = () => { if (titleInput.trim()) setBookTitle(titleInput.trim()); setEditingTitle(false); };
  const toggleFavorite = (id) => { pushUndo(); setItems(p => p.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i)); };
  const exportTocTxt = () => {
    let secN = 0;
    const lines = [bookTitle, ""];
    for (const item of items) {
      if (item.kind === "section") {
        secN++; if (secN > 1) lines.push("");
        lines.push(`${secN}. ${item.text}`);
        if (item.note) lines.push(`  ${item.note}`);
        lines.push("");
      } else {
        lines.push(`- [${item.type}] ${item.text}${item.favorite ? " (★)" : ""}`);
        if (item.note) lines.push(`    ${item.note}`);
      }
    }
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${bookTitle}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const chapters = items.filter((i) => i.kind === "chapter");
  const sectionsList = items.filter((i) => i.kind === "section");
  const stats = chapters.reduce((a, c) => { a[c.type] = (a[c.type] || 0) + 1; return a; }, {});
  const allTags = useMemo(() => [...new Set(chapters.map((c) => c.type).filter(Boolean))], [chapters]);
  const allTypes = useMemo(() => [...new Set([...customTypes, ...allTags])], [customTypes, allTags]);
  let chapterCount = 0;
  let sectionCount = 0;

  const backdrop = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
  const modalBox = { background: "#F5F0EB", borderRadius: 16, padding: "36px 40px", width: "92%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" };
  const drawerBtn = { display: "block", width: "100%", textAlign: "left", fontSize: 18, padding: "14px 0", background: "none", border: "none", color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" };
  const headerBtn = { width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #ddd", borderRadius: 6, color: "#888", cursor: "pointer", fontSize: 16, flexShrink: 0 };
  const fs = 22;
  const zoomScale = Math.pow(1.25, cardZoom); // each step = 25% bigger/smaller

  touchStateRef.current = { items, groups, flatIdx, flattenGroups, pushUndo };

  const InsertLine = () => <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, margin: isMobile ? "2px 0 2px 36px" : "2px 0 2px 48px" }} />;

  const renderChapter = (ch) => {
    const isChDragging = dragType === "chapter" && dragChapterId === ch.id;
    chapterCount++;
    const num = chapterCount;
    const chIdx = flatIdx[ch.id];
    return (
      <div key={ch.id}>
        {dropLinePos === chIdx && dragChapterId !== ch.id && <InsertLine />}
        <div draggable={!editLocked} data-item-id={ch.id} data-item-kind="chapter"
          onDragStart={(e) => {
            if (!dragHandleActive.current) { e.preventDefault(); return; }
            dragHandleActive.current = false;
            handleChapterDragStart(e, ch.id);
          }}
          onDragOver={(e) => handleChapterDragOverItem(e, ch.id)}
          onDrop={(e) => { if (dragType === "chapter") { e.stopPropagation(); handleChapterDropAtPos(e); } }}
          onDragEnd={resetDrag}
          style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: isMobile ? "8px 52px 8px 12px" : "8px 16px",
            background: isChDragging ? "#e8e3dd" : "transparent",
            opacity: isChDragging ? 0.4 : 1,
            borderRadius: 6,
            transition: "background 0.15s, opacity 0.15s",
            borderLeft: ch.favorite ? "3px solid #daa520" : "3px solid transparent",
            ...(isMobile ? { flexWrap: "wrap" } : {}),
          }}>
          <span
            onMouseDown={() => { if (!editLocked) dragHandleActive.current = true; }}
            onTouchStart={() => { if (editLocked) return; touchDragRef.current = { active: true, type: "chapter", id: ch.id, groupIdx: null, dropPos: null, overGroupIdx: null }; setDragType("chapter"); setDragChapterId(ch.id); }}
            style={{ fontSize: 18, color: "#bbb", minWidth: isMobile ? 28 : 40, padding: "8px 8px 8px 4px", textAlign: "right", userSelect: "none", flexShrink: 0, cursor: editLocked ? "default" : "grab", touchAction: editLocked ? "auto" : "none", margin: "-8px 0" }}>{num}</span>
          <div style={{ flex: 1, minWidth: 0, ...(isMobile ? { flexBasis: "calc(100% - 50px)" } : {}) }}>
            {editingId === ch.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(ch.id); if (e.key === "Escape") cancelEdit(); }} autoFocus
                    style={{ flex: 1, fontSize: fs, padding: "6px 12px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit" }} />
                  <input value={editType} onChange={(e) => setEditType(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(ch.id); if (e.key === "Escape") cancelEdit(); }}
                    placeholder="태그"
                    style={{ width: 80, fontSize: 14, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit", textAlign: "center" }} />
                  <button onClick={() => saveEdit(ch.id)} style={{ fontSize: 16, padding: "6px 18px", border: "1px solid #1a1a1a", borderRadius: 6, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>저장</button>
                </div>
                <input value={editNote} onChange={(e) => setEditNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(ch.id); if (e.key === "Escape") cancelEdit(); }}
                  placeholder="한줄 노트..."
                  style={{ fontSize: 14, padding: "6px 12px", border: "1px solid #e8e3dd", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit", color: "#888" }} />
              </div>
            ) : (
              <div onClick={() => startEdit(ch.id, ch.text, ch.type, ch.note)} style={{ cursor: editLocked ? "default" : "text" }}>
                <span style={{ fontSize: fs, lineHeight: 1.4, wordBreak: "keep-all" }}>{ch.text}</span>
                {ch.note && <div style={{ fontSize: 15, color: "#aaa", marginTop: 2, lineHeight: 1.4 }}>{ch.note}</div>}
              </div>
            )}
          </div>
          {editingId !== ch.id && (
            <div style={{ display: "flex", alignItems: "center", ...(isMobile ? { width: "100%", paddingLeft: 40, marginTop: 2 } : {}) }}>
              {ch.favorite && <span title="마음에 드는" style={{ fontSize: 14, color: "#daa520", flexShrink: 0, marginTop: 3, userSelect: "none" }}>★</span>}
              <span onClick={() => startEdit(ch.id, ch.text, ch.type, ch.note)}
                style={{ fontSize: 14, padding: "3px 10px", border: "1px solid #ccc", borderRadius: 4, background: "transparent", color: "#888", cursor: editLocked ? "default" : "pointer", flexShrink: 0, marginTop: 2 }}>
                {ch.type}
              </span>
              {!editLocked && <>
                <button onClick={() => toggleFavorite(ch.id)} title="마음에 드는" style={{ fontSize: 16, background: "none", border: "none", color: ch.favorite ? "#daa520" : "#ddd", cursor: "pointer", padding: "0 3px", flexShrink: 0, lineHeight: 1 }}>★</button>
                <button onClick={() => { setInsertAfterItemId(ch.id); setAddMode("chapter"); setNewText(""); setNewTagInput(""); }} title="여기에 추가" style={{ fontSize: 18, background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "0 3px", flexShrink: 0, lineHeight: 1 }}>+</button>
                <button onClick={() => removeItem(ch.id)} style={{ fontSize: 22, background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "0 6px", flexShrink: 0, lineHeight: 1 }}>×</button>
              </>}
            </div>
          )}
        </div>
        {insertAfterItemId === ch.id && addMode && (
          <div style={{ padding: isMobile ? "6px 12px 6px 40px" : "6px 16px 6px 60px" }}>
            <div style={{ padding: 12, background: "#fff", borderRadius: 8, border: "1px solid #e8e3dd" }}>
              <input value={newText} onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && newText.trim()) addItem(); if (e.key === "Escape") { setAddMode(null); setNewText(""); setNewTagInput(""); setInsertAfterItemId(null); } }}
                placeholder="새 챕터 제목..." autoFocus
                style={{ width: "100%", fontSize: 18, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                {allTypes.map(t => {
                  const sel = newType === t && !newTagInput;
                  return (
                    <button key={t} onClick={() => { setNewType(t); setNewTagInput(""); }}
                      style={{ fontSize: 13, padding: "3px 10px", border: sel ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 4, background: sel ? "#1a1a1a" : "transparent", color: sel ? "#F5F0EB" : "#888", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                  );
                })}
                <input value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} placeholder="+ 새 태그"
                  onKeyDown={(e) => { if (e.key === "Enter" && newText.trim()) addItem(); }}
                  style={{ fontSize: 13, padding: "3px 10px", width: 80, border: newTagInput ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 4, outline: "none", fontFamily: "inherit", background: newTagInput ? "#1a1a1a" : "transparent", color: newTagInput ? "#F5F0EB" : "#888" }} />
                <div style={{ flex: 1 }} />
                <button onClick={() => { setAddMode(null); setNewText(""); setNewTagInput(""); setInsertAfterItemId(null); }} style={{ fontSize: 13, color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>취소</button>
                <button onClick={addItem} style={{ fontSize: 13, padding: "4px 14px", border: "1px solid #1a1a1a", borderRadius: 4, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer", fontFamily: "inherit" }}>추가</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, 'Apple SD Gothic Neo', sans-serif", background: "#F5F0EB", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* MODALS */}
      {showSettings && (
        <div style={backdrop} onClick={() => setShowSettings(false)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>설정</h2>
              <button onClick={() => setShowSettings(false)} style={{ fontSize: 28, background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>×</button>
            </div>
            <label style={{ fontSize: 18, color: "#666", display: "block", marginBottom: 10 }}>Anthropic API 키</label>
            <input type="password" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} placeholder="sk-ant-..."
              style={{ width: "100%", fontSize: 20, padding: "14px 18px", border: "1px solid #ddd", borderRadius: 8, outline: "none", fontFamily: "monospace", background: "#fff", boxSizing: "border-box" }} />
            <p style={{ fontSize: 15, color: "#aaa", marginTop: 8 }}>키는 브라우저 localStorage에만 저장됩니다.</p>
            <button onClick={saveApiKey} style={{ fontSize: 18, padding: "12px 32px", border: "1px solid #1a1a1a", borderRadius: 8, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer", marginTop: 12 }}>저장</button>
            <div style={{ borderTop: "1px solid #e8e3dd", marginTop: 32, paddingTop: 28 }}>
              <button onClick={resetAll} style={{ fontSize: 18, padding: "12px 24px", border: "1px solid #ddd", borderRadius: 8, background: "transparent", color: "#c44", cursor: "pointer" }}>목차 초기화</button>
            </div>
          </div>
        </div>
      )}
      {showPromptEditor && (
        <div style={backdrop} onClick={() => setShowPromptEditor(false)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>프롬프트 편집</h2>
              <button onClick={() => setShowPromptEditor(false)} style={{ fontSize: 28, background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>×</button>
            </div>
            <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
              style={{ width: "100%", height: 300, fontSize: 18, lineHeight: 1.7, padding: "18px 20px", border: "1px solid #ddd", borderRadius: 10, background: "#fff", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", color: "#1a1a1a" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <button onClick={() => setCustomPrompt(SYSTEM_PROMPT)} style={{ fontSize: 16, background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 0, textDecoration: "underline" }}>기본값으로 되돌리기</button>
              <button onClick={() => setShowPromptEditor(false)} style={{ fontSize: 18, padding: "12px 32px", border: "1px solid #1a1a1a", borderRadius: 8, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>완료</button>
            </div>
          </div>
        </div>
      )}
      {showFeedbackModal && feedback && (
        <div style={backdrop} onClick={() => setShowFeedbackModal(false)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 24, fontWeight: 700 }}>AI 편집자 피드백</span>
              <button onClick={() => setShowFeedbackModal(false)} style={{ fontSize: 28, background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.7, color: "#1a1a1a", wordBreak: "keep-all", whiteSpace: "pre-wrap" }}>{feedback}</div>
          </div>
        </div>
      )}

      {/* DRAWER */}
      {showDrawer && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.12)", zIndex: 200 }} onClick={() => setShowDrawer(false)} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 300, background: "#F5F0EB", borderLeft: "1px solid #e8e3dd", padding: 28, zIndex: 201, boxShadow: "-4px 0 24px rgba(0,0,0,0.06)", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <button onClick={() => setShowDrawer(false)} style={{ fontSize: 24, background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ marginBottom: 32, fontSize: 16, color: "#888", lineHeight: 2 }}>
              <div>파트 {sectionsList.length}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", lineHeight: 1 }}>
                {Object.entries(stats).map(([t, c]) => (
                  <button key={t} onClick={() => setColorPickerTag(colorPickerTag === t ? null : t)}
                    style={{ fontSize: 16, padding: "4px 10px", background: "transparent", border: "1px solid #ddd", borderRadius: 6, color: "#888", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                    {tagColors[t] && <span style={{ width: 8, height: 8, borderRadius: "50%", background: tagColors[t], flexShrink: 0 }} />}
                    {t} {c}
                  </button>
                ))}
              </div>
              {colorPickerTag && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                  <button onClick={() => { pushUndo(); setTagColors((p) => { const n = { ...p }; delete n[colorPickerTag]; return n; }); setColorPickerTag(null); }}
                    style={{ width: 22, height: 22, borderRadius: "50%", background: "#F5F0EB", border: !tagColors[colorPickerTag] ? "2px solid #1a1a1a" : "1px solid #ccc", cursor: "pointer", padding: 0, outline: "none", fontSize: 10, lineHeight: "18px", color: "#aaa" }}>×</button>
                  {APPLE_COLORS.map((cl) => (
                    <button key={cl.name} onClick={() => { pushUndo(); setTagColors((p) => ({ ...p, [colorPickerTag]: cl.value })); setColorPickerTag(null); }}
                      style={{ width: 22, height: 22, borderRadius: "50%", background: cl.value, border: tagColors[colorPickerTag] === cl.value ? "2px solid #1a1a1a" : "2px solid transparent", cursor: "pointer", padding: 0, outline: "none" }} />
                  ))}
                </div>
              )}
              <div style={{ color: "#bbb", marginTop: 8 }}>총 {chapters.length}개 챕터</div>
            </div>
            <div style={{ borderTop: "1px solid #e8e3dd", paddingTop: 8 }}>
              <button style={drawerBtn} onClick={() => { setShowDrawer(false); setShowPromptEditor(true); }}>프롬프트</button>
              <button style={{ ...drawerBtn, color: loading ? "#bbb" : "#1a1a1a" }} disabled={loading} onClick={() => { setShowDrawer(false); getFeedback(items); }}>{loading ? "생각 중..." : "피드백 받기"}</button>
              <button style={drawerBtn} onClick={() => { exportToc(); setShowDrawer(false); }}>내보내기 (.md)</button>
              <button style={drawerBtn} onClick={() => { exportTocTxt(); setShowDrawer(false); }}>내보내기 (.txt)</button>
              <button style={drawerBtn} onClick={() => { importToc(); setShowDrawer(false); }}>불러오기 (.md)</button>
            </div>
            <div style={{ borderTop: "1px solid #e8e3dd", marginTop: 8, paddingTop: 8 }}>
              <button style={{ ...drawerBtn, color: "#888" }} onClick={() => { setShowDrawer(false); setShowSettings(true); }}>설정</button>
            </div>
          </div>
        </>
      )}

      {/* HEADER — edit mode only */}
      {!cardView && (
        <div style={{ position: "sticky", top: 0, background: "#F5F0EB", zIndex: 50, borderBottom: "1px solid #e8e3dd" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "12px 12px" : "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
              {editingTitle ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
                  <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveTitleEdit(); if (e.key === "Escape") setEditingTitle(false); }} autoFocus
                    style={{ flex: 1, fontSize: isMobile ? 20 : 28, fontWeight: 700, padding: "6px 14px", border: "1px solid #ccc", borderRadius: 8, background: "#fff", outline: "none", fontFamily: "inherit" }} />
                  <button onClick={saveTitleEdit} style={{ fontSize: 16, padding: "8px 20px", border: "1px solid #1a1a1a", borderRadius: 8, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>저장</button>
                </div>
              ) : (
                <h1 onClick={startTitleEdit} style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, marginLeft: isMobile ? 8 : 32, lineHeight: 1.3, cursor: editLocked ? "default" : "text", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bookTitle}</h1>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <button onClick={undo} disabled={!undoStack.length} title="되돌리기" style={{ ...headerBtn, color: undoStack.length ? "#666" : "#ddd", borderColor: undoStack.length ? "#ccc" : "#eee" }}>↩︎</button>
              <button onClick={redo} disabled={!redoStack.length} title="다시 실행" style={{ ...headerBtn, color: redoStack.length ? "#666" : "#ddd", borderColor: redoStack.length ? "#ccc" : "#eee" }}>↪︎</button>
              {!isMobile && <button onClick={() => setCardView(true)} style={{ fontSize: 13, padding: "6px 14px", height: 32, background: "none", border: "1px solid #ddd", borderRadius: 6, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>카드뷰</button>}
              {isMobile ? (
                <button onClick={() => {
                  if (!editLocked) { setEditingId(null); setEditingTitle(false); setAddMode(null); setInsertAfterItemId(null); }
                  setEditLocked(l => !l);
                }} title={editLocked ? "편집 잠금 해제" : "편집 잠금"} style={headerBtn}>{editLocked ? "🔒" : "🔓"}</button>
              ) : (
                <button onClick={toggleFullscreen} title="풀스크린" style={headerBtn}>⛶</button>
              )}
              <button onClick={() => setShowDrawer(true)} title="메뉴" style={{ ...headerBtn, fontSize: 18 }}>≡</button>
            </div>
          </div>
        </div>
      )}

      {/* CARD VIEW */}
      {cardView && (
        <div style={{ width: "90vw", margin: "2vh auto", display: "flex", flexDirection: "column", height: "96vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{bookTitle}</h1>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => setCardZoom((z) => z - 1)} title="축소" style={headerBtn}>−</button>
              <button onClick={() => setCardZoom(0)} title="최적화" style={{ ...headerBtn, fontSize: 11, width: "auto", padding: "0 8px" }}>맞춤</button>
              <button onClick={() => setCardZoom((z) => z + 1)} title="확대" style={headerBtn}>+</button>
              <button onClick={undo} disabled={!undoStack.length} title="되돌리기" style={{ ...headerBtn, width: 28, height: 28, fontSize: 14, color: undoStack.length ? "#666" : "#ddd", borderColor: undoStack.length ? "#ccc" : "#eee" }}>↩︎</button>
              <button onClick={redo} disabled={!redoStack.length} title="다시 실행" style={{ ...headerBtn, width: 28, height: 28, fontSize: 14, color: redoStack.length ? "#666" : "#ddd", borderColor: redoStack.length ? "#ccc" : "#eee" }}>↪︎</button>
              <button onClick={() => setCardView(false)} style={{ fontSize: 12, padding: "5px 12px", height: 28, background: "none", border: "1px solid #ddd", borderRadius: 6, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>편집</button>
              <button onClick={toggleFullscreen} title="풀스크린" style={{ ...headerBtn, width: 28, height: 28, fontSize: 14 }}>⛶</button>
              <button onClick={() => setShowDrawer(true)} title="메뉴" style={{ ...headerBtn, width: 28, height: 28, fontSize: 16 }}>≡</button>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <div style={{ width: `${zoomScale * 100}%`, height: `${zoomScale * 100}%` }}>
          <div ref={cardViewRef} style={{ width: `${100 / zoomScale}%`, height: `${100 / zoomScale}%`, transform: `scale(${zoomScale})`, transformOrigin: "top left", display: "flex", gap: 6 }}>
            {groups.map((group, gi) => {
              if (!group.section && group.chapters.length === 0) return null;
              const isColDragging = cardDragGroupIdx === gi;
              const isColOver = cardDragGroupIdx !== null && cardOverGroupTarget === gi && cardDragGroupIdx !== gi;
              const showColLineBefore = cardDragGroupIdx !== null && cardOverGroupTarget === gi && cardDragGroupIdx !== gi;
              return (
                <div key={group.section?.id || `orphan-${gi}`} style={{ display: "flex", flex: 1, minWidth: 0 }}>
                  {showColLineBefore && cardDragGroupIdx > gi && <div style={{ width: 3, background: "#1a1a1a", borderRadius: 2, marginRight: 4, flexShrink: 0 }} />}
                  <div draggable={!!group.section}
                    onDragStart={(e) => {
                      if (cardDragId) { e.preventDefault(); return; }
                      setCardDragGroupIdx(gi); setCardDragId(null); e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (cardDragId) setCardOverGroupIdx(gi);
                      if (cardDragGroupIdx !== null) setCardOverGroupTarget(gi);
                    }}
                    onDrop={() => {
                      if (cardDragGroupIdx !== null && cardOverGroupTarget !== null && cardDragGroupIdx !== cardOverGroupTarget) {
                        pushUndo();
                        const reordered = [...groups];
                        const [moved] = reordered.splice(cardDragGroupIdx, 1);
                        reordered.splice(cardOverGroupTarget, 0, moved);
                        setItems(flattenGroups(reordered));
                        setCardDragGroupIdx(null); setCardOverGroupTarget(null);
                        return;
                      }
                      if (!cardDragId || cardOverGroupIdx === null) return;
                      const srcIdx = items.findIndex((i) => i.id === cardDragId);
                      if (srcIdx === -1) return;
                      pushUndo();
                      const updated = [...items];
                      const [moved] = updated.splice(srcIdx, 1);
                      const targetGroup = groups[cardOverGroupIdx];
                      let insertIdx;
                      if (targetGroup.chapters.length > 0) {
                        insertIdx = flatIdx[targetGroup.chapters[targetGroup.chapters.length - 1].id];
                        if (srcIdx < insertIdx) insertIdx--;
                      } else if (targetGroup.section) {
                        insertIdx = flatIdx[targetGroup.section.id];
                        if (srcIdx < insertIdx) insertIdx--;
                      } else {
                        insertIdx = updated.length - 1;
                      }
                      updated.splice(insertIdx + 1, 0, moved);
                      setItems(updated);
                      setCardDragId(null); setCardOverId(null); setCardInsertSide(null); setCardOverGroupIdx(null);
                    }}
                    onDragEnd={() => { setCardDragGroupIdx(null); setCardOverGroupTarget(null); setCardDragId(null); setCardOverId(null); setCardInsertSide(null); setCardOverGroupIdx(null); }}
                    style={{
                      flex: 1, minWidth: 0,
                      display: "flex", flexDirection: "column",
                      opacity: isColDragging ? 0.35 : 1,
                      background: isColOver ? "#ede8e2" : "transparent",
                      borderRadius: 8, padding: 6,
                      transition: "opacity 0.15s, background 0.15s",
                      cursor: group.section ? "grab" : "default",
                    }}>
                    {group.section && (
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid #e8e3dd", lineHeight: 1.4, flexShrink: 0 }}>
                        <span style={{ color: "#aaa", fontWeight: 400, marginRight: 6, fontSize: 11 }}>파트{gi + 1}</span>
                        {group.section.text}
                        {group.section.note && <div style={{ fontWeight: 400, color: "#aaa", fontSize: 11, marginTop: 2 }}>{group.section.note}</div>}
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateRows: `repeat(${maxChapters}, 1fr)`, gap: 6, flex: 1, minHeight: 0 }}>
                      {group.chapters.map((ch) => {
                        const isDragging = cardDragId === ch.id;
                        const showLineBefore = cardOverId === ch.id && cardInsertSide === "before" && cardDragId !== ch.id;
                        const showLineAfter = cardOverId === ch.id && cardInsertSide === "after" && cardDragId !== ch.id;
                        return (
                          <div key={ch.id}>
                            {showLineBefore && <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, marginBottom: 2 }} />}
                            <div draggable
                              onDragStart={(e) => { e.stopPropagation(); setCardDragId(ch.id); setCardDragGroupIdx(null); e.dataTransfer.effectAllowed = "move"; }}
                              onDragOver={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setCardOverId(ch.id);
                                setCardInsertSide(e.clientY < rect.top + rect.height / 2 ? "before" : "after");
                                setCardOverGroupIdx(gi);
                              }}
                              onDrop={(e) => {
                                e.stopPropagation();
                                if (!cardDragId || cardDragId === ch.id) return;
                                pushUndo();
                                const updated = [...items];
                                const srcIdx = updated.findIndex((i) => i.id === cardDragId);
                                const [moved] = updated.splice(srcIdx, 1);
                                let destIdx = updated.findIndex((i) => i.id === ch.id);
                                if (cardInsertSide === "after") destIdx++;
                                updated.splice(destIdx, 0, moved);
                                setItems(updated);
                                setCardDragId(null); setCardOverId(null); setCardInsertSide(null); setCardOverGroupIdx(null);
                              }}
                              onDragEnd={() => { setCardDragId(null); setCardOverId(null); setCardInsertSide(null); setCardOverGroupIdx(null); setCardDragGroupIdx(null); setCardOverGroupTarget(null); }}
                              style={{
                                padding: "10px 12px", height: "100%", boxSizing: "border-box",
                                background: tagColors[ch.type] ? tagColors[ch.type] + "15" : "#fff",
                                borderRadius: 8,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                                opacity: isDragging ? 0.4 : 1,
                                cursor: "grab",
                                display: "flex", flexDirection: "column", justifyContent: "space-between",
                                transition: "opacity 0.15s",
                              }}>
                              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, wordBreak: "keep-all", marginBottom: ch.note ? 4 : 0 }}>{ch.text}</div>
                              {ch.note && <div style={{ fontSize: 11, color: "#999", lineHeight: 1.3 }}>{ch.note}</div>}
                              <div style={{ marginTop: 6 }}>
                                <span style={{
                                  fontSize: 10, padding: "1px 6px", borderRadius: 3,
                                  background: tagColors[ch.type] ? tagColors[ch.type] + "20" : "#f0ebe5",
                                  color: tagColors[ch.type] || "#999",
                                  border: "1px solid " + (tagColors[ch.type] ? tagColors[ch.type] + "40" : "#e8e3dd"),
                                }}>{ch.type}</span>
                              </div>
                            </div>
                            {showLineAfter && <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, marginTop: 2 }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {showColLineBefore && cardDragGroupIdx < gi && <div style={{ width: 3, background: "#1a1a1a", borderRadius: 2, marginLeft: 4, flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
          </div>
          </div>
        </div>
      )}

      {/* EDIT VIEW */}
      {!cardView && <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "4px 16px 80px" : "24px 32px 80px" }}>
        {groups.map((group, gi) => {
          const isGroupDragging = dragType === "group" && dragGroupIdx === gi;
          const isGroupOver = dragType === "group" && overGroupIdx === gi && dragGroupIdx !== gi;
          if (!group.section) return group.chapters.map((ch) => renderChapter(ch));

          sectionCount++;
          const secNum = sectionCount;
          const sec = group.section;
          const secIdx = flatIdx[sec.id];
          const lastChIdx = group.chapters.length > 0 ? flatIdx[group.chapters[group.chapters.length - 1].id] : secIdx;

          return (
            <div key={sec.id} draggable={!editLocked}
              onDragStart={(e) => {
                if (!dragHandleActive.current) { e.preventDefault(); return; }
                dragHandleActive.current = false;
                handleGroupDragStart(e, gi);
              }}
              onDragOver={(e) => handleGroupDragOver(e, gi)}
              onDrop={() => { if (dragType === "group") handleGroupDrop(gi); else if (dragType === "chapter") handleChapterDropAtPos(); }}
              onDragEnd={resetDrag}
              style={{
                opacity: isGroupDragging ? 0.35 : 1,
                borderTop: gi > 0 ? "1px solid #ddd6ce" : "none",
                marginTop: 12,
                borderRadius: 8,
                background: isGroupOver ? "#ede8e2" : "transparent",
                transition: "opacity 0.15s, background 0.15s",
              }}>
              {/* Section header */}
              <div data-item-id={sec.id} data-item-kind="section"
                onDragOver={(e) => handleSectionDragOverForChapter(e, sec.id)}
                onDrop={(e) => { if (dragType === "chapter") { e.stopPropagation(); handleChapterDropAtPos(e); } }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: isMobile ? "16px 12px 8px" : "20px 16px 8px",
                  marginBottom: 4,
                }}>
                <span
                  onMouseDown={() => { if (!editLocked) dragHandleActive.current = true; }}
                  onTouchStart={() => { if (editLocked) return; touchDragRef.current = { active: true, type: "group", id: sec.id, groupIdx: gi, dropPos: null, overGroupIdx: null }; setDragType("group"); setDragGroupIdx(gi); }}
                  style={{ fontSize: 18, color: "#aaa", minWidth: isMobile ? 50 : 66, paddingTop: 2, textAlign: "right", userSelect: "none", flexShrink: 0, cursor: editLocked ? "default" : "grab", touchAction: editLocked ? "auto" : "none" }}>파트{secNum}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === sec.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(sec.id); if (e.key === "Escape") cancelEdit(); }} autoFocus
                          style={{ flex: 1, fontSize: fs, fontWeight: 700, padding: "6px 12px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit" }} />
                        <button onClick={() => saveEdit(sec.id)} style={{ fontSize: 16, padding: "6px 18px", border: "1px solid #1a1a1a", borderRadius: 6, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>저장</button>
                      </div>
                      <input value={editNote} onChange={(e) => setEditNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(sec.id); if (e.key === "Escape") cancelEdit(); }}
                        placeholder="한줄 노트..."
                        style={{ fontSize: 14, padding: "6px 12px", border: "1px solid #e8e3dd", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit", color: "#888" }} />
                    </div>
                  ) : (
                    <div onClick={() => startEdit(sec.id, sec.text, undefined, sec.note)} style={{ cursor: editLocked ? "default" : "text" }}>
                      <span style={{ fontSize: fs, fontWeight: 700, lineHeight: 1.4 }}>{sec.text}</span>
                      {sec.note && <div style={{ fontSize: 15, color: "#aaa", marginTop: 2, lineHeight: 1.4, fontWeight: 400 }}>{sec.note}</div>}
                    </div>
                  )}
                </div>
                {editingId !== sec.id && !editLocked && (
                  <button onClick={() => { setInsertAfterItemId(sec.id); setAddMode("chapter"); setNewText(""); setNewTagInput(""); }} title="여기에 추가" style={{ fontSize: 18, background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "0 3px", flexShrink: 0, lineHeight: 1 }}>+</button>
                )}
                {!editLocked && group.chapters.length === 0 && <button onClick={() => removeItem(sec.id)} style={{ fontSize: 22, background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "0 6px", flexShrink: 0 }}>×</button>}
              </div>
              {/* 파트 헤더 뒤 인라인 추가 */}
              {insertAfterItemId === sec.id && addMode && (
                <div style={{ padding: isMobile ? "6px 12px 6px 58px" : "6px 16px 6px 82px" }}>
                  <div style={{ padding: 12, background: "#fff", borderRadius: 8, border: "1px solid #e8e3dd" }}>
                    <input value={newText} onChange={(e) => setNewText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && newText.trim()) addItem(); if (e.key === "Escape") { setAddMode(null); setNewText(""); setNewTagInput(""); setInsertAfterItemId(null); } }}
                      placeholder="새 챕터 제목..." autoFocus
                      style={{ width: "100%", fontSize: 18, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                      {allTypes.map(t => {
                        const sel = newType === t && !newTagInput;
                        return (
                          <button key={t} onClick={() => { setNewType(t); setNewTagInput(""); }}
                            style={{ fontSize: 13, padding: "3px 10px", border: sel ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 4, background: sel ? "#1a1a1a" : "transparent", color: sel ? "#F5F0EB" : "#888", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                        );
                      })}
                      <input value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} placeholder="+ 새 태그"
                        onKeyDown={(e) => { if (e.key === "Enter" && newText.trim()) addItem(); }}
                        style={{ fontSize: 13, padding: "3px 10px", width: 80, border: newTagInput ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 4, outline: "none", fontFamily: "inherit", background: newTagInput ? "#1a1a1a" : "transparent", color: newTagInput ? "#F5F0EB" : "#888" }} />
                      <div style={{ flex: 1 }} />
                      <button onClick={() => { setAddMode(null); setNewText(""); setNewTagInput(""); setInsertAfterItemId(null); }} style={{ fontSize: 13, color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>취소</button>
                      <button onClick={addItem} style={{ fontSize: 13, padding: "4px 14px", border: "1px solid #1a1a1a", borderRadius: 4, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer", fontFamily: "inherit" }}>추가</button>
                    </div>
                  </div>
                </div>
              )}
              {dropLinePos === secIdx + 1 && group.chapters.length === 0 && <InsertLine />}
              {group.chapters.map((ch) => renderChapter(ch))}
              {dropLinePos === lastChIdx + 1 && group.chapters.length > 0 && dropLinePos !== secIdx + 1 && <InsertLine />}
            </div>
          );
        })}

        {/* Add area */}
        {addMode && !insertAfterItemId ? (
          <div style={{ padding: 24, background: "#fff", borderRadius: 10, marginTop: 20, marginBottom: 20 }}>
            <input value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addItem(); if (e.key === "Escape") { setAddMode(null); setNewText(""); setNewTagInput(""); } }}
              placeholder={addMode === "section" ? "파트 이름..." : "새 챕터 제목..."} autoFocus
              style={{ width: "100%", fontSize: 22, padding: "14px 18px", border: "1px solid #ddd", borderRadius: 8, outline: "none", fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box", fontWeight: 400 }} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {addMode === "chapter" && (
                <>
                  {allTypes.map((t) => {
                    const sel = newType === t && !newTagInput;
                    return (
                      <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, border: sel ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 6, background: sel ? "#1a1a1a" : "transparent", paddingRight: 4 }}>
                        <button onClick={() => { setNewType(t); setNewTagInput(""); }}
                          style={{ fontSize: 18, padding: "8px 12px 8px 20px", background: "none", border: "none", color: sel ? "#F5F0EB" : "#888", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                        <button onClick={(e) => { e.stopPropagation(); if (customTypes.length > 1) { setCustomTypes((p) => p.filter((x) => x !== t)); if (newType === t) setNewType(customTypes.find((x) => x !== t) || ""); } }}
                          style={{ fontSize: 14, background: "none", border: "none", color: sel ? "#F5F0EB55" : "#ccc", cursor: "pointer", padding: "2px 4px", lineHeight: 1 }}>×</button>
                      </span>
                    );
                  })}
                  <input value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} placeholder="+ 새 태그"
                    style={{ fontSize: 18, padding: "8px 16px", width: 140, border: newTagInput ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 6, outline: "none", fontFamily: "inherit", background: newTagInput ? "#1a1a1a" : "transparent", color: newTagInput ? "#F5F0EB" : "#888" }} />
                </>
              )}
              <div style={{ flex: 1 }} />
              <button onClick={() => { setAddMode(null); setNewText(""); setNewTagInput(""); setInsertAfterItemId(null); }} style={{ fontSize: 18, padding: "8px 20px", border: "none", background: "none", color: "#aaa", cursor: "pointer" }}>취소</button>
              <button onClick={addItem} style={{ fontSize: 18, padding: "10px 28px", border: "1px solid #1a1a1a", borderRadius: 6, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>추가</button>
            </div>
          </div>
        ) : !editLocked ? (
          <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 20 }}>
            <button onClick={() => setAddMode("chapter")} style={{ flex: 1, fontSize: 20, padding: "16px 24px", border: "1px dashed #ccc", borderRadius: 8, background: "transparent", color: "#999", cursor: "pointer" }}>+ 챕터</button>
            <button onClick={() => setAddMode("section")} style={{ flex: 1, fontSize: 20, padding: "16px 24px", border: "1px dashed #ccc", borderRadius: 8, background: "transparent", color: "#999", cursor: "pointer" }}>+ 파트</button>
          </div>
        ) : null}
      </div>}
    </div>
  );
}
