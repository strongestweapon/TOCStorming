import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const INITIAL_ITEMS = [
  { id: "s0", text: "프롤로그", kind: "section" },
  { id: "1", text: "프롤로그 — 인공위성 송호준, 인공지능 송호준", type: "에세이", kind: "chapter" },
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
  { id: "38", text: "에필로그 — 인공위성을 쏘던 그 마음으로", type: "에세이", kind: "chapter" },
];

const DEFAULT_TYPES = ["에세이", "기술", "사례"];
const MAX_UNDO = 10;

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
  const [compact, setCompact] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [dragType, setDragType] = useState(null);
  const [dragGroupIdx, setDragGroupIdx] = useState(null);
  const [dragChapterId, setDragChapterId] = useState(null);
  const [overGroupIdx, setOverGroupIdx] = useState(null);
  const [dropLinePos, setDropLinePos] = useState(null); // flat index where chapter will be inserted
  const idCounter = useRef(200);

  useEffect(() => { saveState(items, removedItems); }, [items, removedItems]);
  useEffect(() => { try { localStorage.setItem("book-toc-custom-prompt", customPrompt); } catch {} }, [customPrompt]);
  useEffect(() => { try { localStorage.setItem("book-toc-title", bookTitle); } catch {} }, [bookTitle]);
  useEffect(() => { try { localStorage.setItem("book-toc-types", JSON.stringify(customTypes)); } catch {} }, [customTypes]);

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

  // Undo/Redo
  const pushUndo = useCallback(() => { setUndoStack((p) => [...p.slice(-(MAX_UNDO - 1)), items]); setRedoStack([]); }, [items]);
  const undo = useCallback(() => { if (!undoStack.length) return; setRedoStack((r) => [...r, items]); setItems(undoStack[undoStack.length - 1]); setUndoStack((u) => u.slice(0, -1)); }, [undoStack, items]);
  const redo = useCallback(() => { if (!redoStack.length) return; setUndoStack((u) => [...u, items]); setItems(redoStack[redoStack.length - 1]); setRedoStack((r) => r.slice(0, -1)); }, [redoStack, items]);
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [undo, redo]);

  // Drag
  const resetDrag = () => { setDragType(null); setDragGroupIdx(null); setDragChapterId(null); setOverGroupIdx(null); setDropLinePos(null); };

  // Group drag
  const handleGroupDragStart = (e, gi) => { setDragType("group"); setDragGroupIdx(gi); e.dataTransfer.effectAllowed = "move"; };
  const handleGroupDragOver = (e, gi) => { e.preventDefault(); if (dragType === "group") setOverGroupIdx(gi); };
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
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = flatIdx[itemId];
    setDropLinePos(e.clientY < rect.top + rect.height / 2 ? idx : idx + 1);
  };

  const handleSectionDragOverForChapter = (e, sectionId) => {
    e.preventDefault();
    if (dragType !== "chapter") return;
    e.stopPropagation();
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
    setItems([...items, newItem]); setNewText(""); setNewTagInput(""); setAddMode(null);
  };
  const removeItem = (id) => { pushUndo(); const item = items.find((i) => i.id === id); if (item) { setRemovedItems((p) => [...p, item]); setItems(items.filter((i) => i.id !== id)); } };
  const restoreItem = (ri) => { pushUndo(); setRemovedItems((p) => p.filter((_, i) => i !== ri)); setItems([...items, removedItems[ri]]); };
  const [editType, setEditType] = useState("");
  const startEdit = (id, text, type) => { setEditingId(id); setEditText(text); setEditType(type || ""); };
  const saveEdit = (id) => {
    pushUndo();
    const typeVal = editType.trim();
    if (typeVal && !customTypes.includes(typeVal)) setCustomTypes((p) => [...p, typeVal]);
    setItems((p) => p.map((c) => (c.id === id ? { ...c, text: editText, ...(typeVal ? { type: typeVal } : {}) } : c)));
    setEditingId(null); setEditText(""); setEditType("");
  };
  const cancelEdit = () => { setEditingId(null); setEditText(""); setEditType(""); };
  const saveApiKey = () => { localStorage.setItem("book-toc-api-key", apiKeyInput); setApiKey(apiKeyInput); setShowSettings(false); };
  const resetAll = () => { if (confirm("목차를 초기 상태로 되돌릴까?")) { pushUndo(); setItems(INITIAL_ITEMS); setRemovedItems([]); setFeedback(""); setShowSettings(false); } };
  const exportToc = () => { let n = 0; const text = items.map((i) => { if (i.kind === "section") return `\n━━ ${i.text} ━━`; n++; return `  ${n}. [${i.type}] ${i.text}`; }).join("\n"); const blob = new Blob([`${bookTitle}\n목차\n${"═".repeat(40)}\n${text}\n`], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "목차.txt"; a.click(); URL.revokeObjectURL(url); };
  const toggleFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); };
  const startTitleEdit = () => { setEditingTitle(true); setTitleInput(bookTitle); };
  const saveTitleEdit = () => { if (titleInput.trim()) setBookTitle(titleInput.trim()); setEditingTitle(false); };

  const chapters = items.filter((i) => i.kind === "chapter");
  const sectionsList = items.filter((i) => i.kind === "section");
  const stats = chapters.reduce((a, c) => { a[c.type] = (a[c.type] || 0) + 1; return a; }, {});
  let chapterCount = 0;
  let sectionCount = 0;

  const backdrop = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
  const modalBox = { background: "#F5F0EB", borderRadius: 16, padding: "36px 40px", width: "92%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" };
  const drawerBtn = { display: "block", width: "100%", textAlign: "left", fontSize: 18, padding: "14px 0", background: "none", border: "none", color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" };
  const headerBtn = { width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #ddd", borderRadius: 6, color: "#888", cursor: "pointer", fontSize: 16, flexShrink: 0 };
  const fs = compact ? 14 : 22;

  const InsertLine = () => <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, margin: "2px 0 2px 48px" }} />;

  const renderChapter = (ch) => {
    const isChDragging = dragType === "chapter" && dragChapterId === ch.id;
    chapterCount++;
    const num = chapterCount;
    const chIdx = flatIdx[ch.id];
    return (
      <div key={ch.id}>
        {dropLinePos === chIdx && dragChapterId !== ch.id && <InsertLine />}
        <div draggable
          onDragStart={(e) => handleChapterDragStart(e, ch.id)}
          onDragOver={(e) => handleChapterDragOverItem(e, ch.id)}
          onDrop={(e) => { if (dragType === "chapter") { e.stopPropagation(); handleChapterDropAtPos(e); } }}
          onDragEnd={resetDrag}
          style={{
            display: "flex", alignItems: "flex-start", gap: compact ? 6 : 10,
            padding: compact ? "3px 8px" : "8px 16px",
            background: isChDragging ? "#e8e3dd" : "transparent",
            opacity: isChDragging ? 0.4 : 1,
            borderRadius: 6, cursor: "grab",
            transition: "background 0.15s, opacity 0.15s",
          }}>
          <span style={{ fontSize: compact ? 12 : 18, color: "#bbb", minWidth: compact ? 20 : 32, paddingTop: compact ? 1 : 2, textAlign: "right", userSelect: "none", flexShrink: 0 }}>{num}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingId === ch.id ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(ch.id); if (e.key === "Escape") cancelEdit(); }} autoFocus
                  style={{ flex: 1, fontSize: fs, padding: "6px 12px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit" }} />
                <input value={editType} onChange={(e) => setEditType(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(ch.id); if (e.key === "Escape") cancelEdit(); }}
                  placeholder="태그"
                  style={{ width: 80, fontSize: compact ? 11 : 14, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit", textAlign: "center" }} />
                <button onClick={() => saveEdit(ch.id)} style={{ fontSize: 16, padding: "6px 18px", border: "1px solid #1a1a1a", borderRadius: 6, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>저장</button>
              </div>
            ) : (
              <span onClick={() => startEdit(ch.id, ch.text, ch.type)} style={{ fontSize: fs, lineHeight: compact ? 1.35 : 1.4, cursor: "text", wordBreak: "keep-all" }}>{ch.text}</span>
            )}
          </div>
          {editingId !== ch.id && (
            <span onClick={() => startEdit(ch.id, ch.text, ch.type)}
              style={{ fontSize: compact ? 11 : 14, padding: compact ? "1px 5px" : "3px 10px", border: "1px solid #ccc", borderRadius: compact ? 3 : 4, background: "transparent", color: "#888", cursor: "pointer", flexShrink: 0, marginTop: compact ? 1 : 2 }}>
              {ch.type}
            </span>
          )}
          {!compact && editingId !== ch.id && <button onClick={() => removeItem(ch.id)} style={{ fontSize: 22, background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "0 6px", flexShrink: 0, lineHeight: 1 }}>×</button>}
        </div>
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
              {Object.entries(stats).map(([t, c]) => <span key={t} style={{ marginRight: 16 }}>{t} {c}</span>)}
              <div style={{ color: "#bbb", marginTop: 4 }}>총 {chapters.length}개 챕터</div>
            </div>
            <div style={{ borderTop: "1px solid #e8e3dd", paddingTop: 8 }}>
              <button style={drawerBtn} onClick={() => { setShowDrawer(false); setShowPromptEditor(true); }}>프롬프트</button>
              <button style={{ ...drawerBtn, color: loading ? "#bbb" : "#1a1a1a" }} disabled={loading} onClick={() => { setShowDrawer(false); getFeedback(items); }}>{loading ? "생각 중..." : "피드백 받기"}</button>
              <button style={drawerBtn} onClick={() => { exportToc(); setShowDrawer(false); }}>내보내기</button>
            </div>
            <div style={{ borderTop: "1px solid #e8e3dd", marginTop: 8, paddingTop: 8 }}>
              <button style={{ ...drawerBtn, color: "#888" }} onClick={() => { setShowDrawer(false); setShowSettings(true); }}>설정</button>
            </div>
          </div>
        </>
      )}

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, background: "#F5F0EB", zIndex: 50, padding: compact ? "10px 32px" : "20px 32px", borderBottom: "1px solid #e8e3dd" }}>
        <div style={{ maxWidth: compact ? 1200 : 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            {editingTitle && !compact ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
                <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveTitleEdit(); if (e.key === "Escape") setEditingTitle(false); }} autoFocus
                  style={{ flex: 1, fontSize: 28, fontWeight: 700, padding: "6px 14px", border: "1px solid #ccc", borderRadius: 8, background: "#fff", outline: "none", fontFamily: "inherit" }} />
                <button onClick={saveTitleEdit} style={{ fontSize: 16, padding: "8px 20px", border: "1px solid #1a1a1a", borderRadius: 8, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>저장</button>
              </div>
            ) : (
              <h1 onClick={() => !compact && startTitleEdit()} style={{ fontSize: compact ? 16 : 28, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.3, cursor: compact ? "default" : "text", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bookTitle}</h1>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            <button onClick={undo} disabled={!undoStack.length} title="되돌리기" style={{ ...headerBtn, color: undoStack.length ? "#666" : "#ddd", borderColor: undoStack.length ? "#ccc" : "#eee" }}>↩</button>
            <button onClick={redo} disabled={!redoStack.length} title="다시 실행" style={{ ...headerBtn, color: redoStack.length ? "#666" : "#ddd", borderColor: redoStack.length ? "#ccc" : "#eee" }}>↪</button>
            <button onClick={() => setCompact(!compact)} style={{ fontSize: 13, padding: "6px 14px", height: 32, background: "none", border: "1px solid #ddd", borderRadius: 6, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>{compact ? "편집" : "전체"}</button>
            <button onClick={toggleFullscreen} title="풀스크린" style={headerBtn}>⛶</button>
            <button onClick={() => setShowDrawer(true)} title="메뉴" style={{ ...headerBtn, fontSize: 18 }}>≡</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: compact ? 1200 : 860, margin: "0 auto", padding: compact ? "16px 40px 40px" : "24px 32px 80px", columnCount: compact ? 2 : 1, columnGap: compact ? 48 : 0 }}>
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
            <div key={sec.id} draggable
              onDragStart={(e) => handleGroupDragStart(e, gi)}
              onDragOver={(e) => handleGroupDragOver(e, gi)}
              onDrop={() => { if (dragType === "group") handleGroupDrop(gi); else if (dragType === "chapter") handleChapterDropAtPos(); }}
              onDragEnd={resetDrag}
              style={{
                opacity: isGroupDragging ? 0.35 : 1,
                borderTop: gi > 0 ? "1px solid #ddd6ce" : "none",
                marginTop: compact ? 6 : 12,
                borderRadius: 8,
                background: isGroupOver ? "#ede8e2" : "transparent",
                transition: "opacity 0.15s, background 0.15s",
                cursor: "grab", breakInside: "avoid",
              }}>
              {/* Section header — also a chapter drop target */}
              <div
                onDragOver={(e) => handleSectionDragOverForChapter(e, sec.id)}
                onDrop={(e) => { if (dragType === "chapter") { e.stopPropagation(); handleChapterDropAtPos(e); } }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: compact ? 6 : 10,
                  padding: compact ? "10px 8px 4px" : "20px 16px 8px",
                  marginBottom: compact ? 2 : 4,
                }}>
                <span style={{ fontSize: compact ? 12 : 18, color: "#aaa", minWidth: compact ? 44 : 66, paddingTop: compact ? 1 : 2, textAlign: "right", userSelect: "none", flexShrink: 0 }}>파트{secNum}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === sec.id ? (
                    <div style={{ display: "flex", gap: 10 }}>
                      <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(sec.id); if (e.key === "Escape") cancelEdit(); }} autoFocus
                        style={{ flex: 1, fontSize: fs, fontWeight: 700, padding: "6px 12px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", outline: "none", fontFamily: "inherit" }} />
                      <button onClick={() => saveEdit(sec.id)} style={{ fontSize: 16, padding: "6px 18px", border: "1px solid #1a1a1a", borderRadius: 6, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>저장</button>
                    </div>
                  ) : (
                    <span onClick={() => startEdit(sec.id, sec.text)} style={{ fontSize: fs, fontWeight: 700, lineHeight: compact ? 1.35 : 1.4, cursor: "text" }}>{sec.text}</span>
                  )}
                </div>
                {!compact && <button onClick={() => removeItem(sec.id)} style={{ fontSize: 22, background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "0 6px", flexShrink: 0 }}>×</button>}
              </div>
              {/* Insert line at section start (for empty sections too) */}
              {dropLinePos === secIdx + 1 && group.chapters.length === 0 && <InsertLine />}
              {/* Chapters */}
              {group.chapters.map((ch) => renderChapter(ch))}
              {/* Insert line after last chapter */}
              {dropLinePos === lastChIdx + 1 && group.chapters.length > 0 && dropLinePos !== secIdx + 1 && <InsertLine />}
            </div>
          );
        })}

        {/* Add area */}
        {!compact && (
          <>
            {addMode ? (
              <div style={{ padding: 24, background: "#fff", borderRadius: 10, marginTop: 20, marginBottom: 20 }}>
                <input value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addItem(); if (e.key === "Escape") { setAddMode(null); setNewText(""); setNewTagInput(""); } }}
                  placeholder={addMode === "section" ? "파트 이름..." : "새 챕터 제목..."} autoFocus
                  style={{ width: "100%", fontSize: 22, padding: "14px 18px", border: "1px solid #ddd", borderRadius: 8, outline: "none", fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box", fontWeight: addMode === "section" ? 700 : 400 }} />
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  {addMode === "chapter" && (
                    <>
                      {customTypes.map((t) => (
                        <button key={t} onClick={() => { setNewType(t); setNewTagInput(""); }}
                          style={{ fontSize: 18, padding: "8px 20px", border: (newType === t && !newTagInput) ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 6, background: (newType === t && !newTagInput) ? "#1a1a1a" : "transparent", color: (newType === t && !newTagInput) ? "#F5F0EB" : "#888", cursor: "pointer" }}>{t}</button>
                      ))}
                      <input value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} placeholder="+ 새 태그"
                        style={{ fontSize: 18, padding: "8px 16px", width: 140, border: newTagInput ? "1px solid #1a1a1a" : "1px solid #ddd", borderRadius: 6, outline: "none", fontFamily: "inherit", background: newTagInput ? "#1a1a1a" : "transparent", color: newTagInput ? "#F5F0EB" : "#888" }} />
                    </>
                  )}
                  <div style={{ flex: 1 }} />
                  <button onClick={() => { setAddMode(null); setNewText(""); setNewTagInput(""); }} style={{ fontSize: 18, padding: "8px 20px", border: "none", background: "none", color: "#aaa", cursor: "pointer" }}>취소</button>
                  <button onClick={addItem} style={{ fontSize: 18, padding: "10px 28px", border: "1px solid #1a1a1a", borderRadius: 6, background: "#1a1a1a", color: "#F5F0EB", cursor: "pointer" }}>추가</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 20 }}>
                <button onClick={() => setAddMode("chapter")} style={{ flex: 1, fontSize: 20, padding: "16px 24px", border: "1px dashed #ccc", borderRadius: 8, background: "transparent", color: "#999", cursor: "pointer" }}>+ 챕터</button>
                <button onClick={() => setAddMode("section")} style={{ flex: 1, fontSize: 20, padding: "16px 24px", border: "1px dashed #ccc", borderRadius: 8, background: "transparent", color: "#999", cursor: "pointer", fontWeight: 600 }}>+ 파트</button>
              </div>
            )}
            {removedItems.length > 0 && (
              <div style={{ marginTop: 12, marginBottom: 20 }}>
                <button onClick={() => setShowRemoved(!showRemoved)} style={{ fontSize: 18, background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 0, textDecoration: "underline" }}>빠진 항목 {removedItems.length}개 {showRemoved ? "숨기기" : "보기"}</button>
                {showRemoved && <div style={{ marginTop: 12 }}>{removedItems.map((item, ri) => (
                  <div key={item.id + "-rm"} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 20, color: "#aaa" }}>
                    {item.kind === "section" && <span style={{ fontSize: 14, border: "1px solid #ddd", borderRadius: 5, padding: "2px 8px", color: "#bbb" }}>파트</span>}
                    <span style={{ flex: 1, textDecoration: "line-through" }}>{item.text}</span>
                    <button onClick={() => restoreItem(ri)} style={{ fontSize: 18, padding: "6px 18px", border: "1px solid #ddd", borderRadius: 6, background: "transparent", color: "#888", cursor: "pointer" }}>복원</button>
                  </div>
                ))}</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
