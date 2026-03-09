import { useState, useEffect, useRef } from "react";

const PILLARS = [
  { id: "mind", emoji: "🧠", label: "Mind", color: "#6EE7F7", dark: "#0a2a30" },
  { id: "body", emoji: "💪", label: "Body", color: "#86EFAC", dark: "#0a2a18" },
  { id: "heart", emoji: "❤️", label: "Heart", color: "#FCA5A5", dark: "#2a0a0a" },
  { id: "purpose", emoji: "💼", label: "Purpose", color: "#FCD34D", dark: "#2a2000" },
  { id: "growth", emoji: "🌱", label: "Growth", color: "#C4B5FD", dark: "#160a2a" },
];

const BADGES = [
  { id: "first_step", icon: "🌟", name: "First Step", desc: "Started your NEXUS journey", xp: 50 },
  { id: "streak_3", icon: "🔥", name: "On Fire", desc: "3-day streak", xp: 100 },
  { id: "streak_7", icon: "⚡", name: "Unstoppable", desc: "7-day streak", xp: 250 },
  { id: "all_pillars", icon: "🌈", name: "Whole Human", desc: "Explored all 5 pillars", xp: 200 },
  { id: "goal_set", icon: "🎯", name: "Goal Setter", desc: "Set your first goal", xp: 75 },
  { id: "goal_done", icon: "🏆", name: "Achiever", desc: "Completed your first goal", xp: 300 },
  { id: "community", icon: "🤝", name: "Connected", desc: "Shared in the community", xp: 100 },
  { id: "messages_10", icon: "💬", name: "Deep Diver", desc: "Sent 10 messages to NEXUS", xp: 150 },
];

const COMMUNITY_POSTS = [
  { user: "Amara K.", location: "Accra 🇬🇭", pillar: "growth", avatar: "🌸", time: "2h ago", text: "Just got accepted into my dream university! 6 months ago I didn't believe I was good enough. NEXUS helped me see what I was capable of.", likes: 142, comments: 23 },
  { user: "Raj M.", location: "Mumbai 🇮🇳", pillar: "mind", avatar: "🦁", time: "5h ago", text: "Learned to code at 41. Just shipped my first app. If you're thinking it's too late — it's not. It's never too late.", likes: 89, comments: 17 },
  { user: "Sofia L.", location: "São Paulo 🇧🇷", pillar: "body", avatar: "⚡", time: "1d ago", text: "Ran 5km today. After my knee surgery last year I was told I'd never run again. Here I am.", likes: 203, comments: 41 },
  { user: "James O.", location: "Lagos 🇳🇬", pillar: "heart", avatar: "🌊", time: "1d ago", text: "Had the most honest conversation with my father in 20 years. We cried. Thank you NEXUS.", likes: 176, comments: 38 },
  { user: "Yuki T.", location: "Tokyo 🇯🇵", pillar: "purpose", avatar: "🎋", time: "2d ago", text: "Left my 20-year corporate career to open a small pottery studio. I've never been happier.", likes: 311, comments: 67 },
];

const SAMPLE_GOALS = [
  { id: 1, title: "Run a 5K", pillar: "body", progress: 65, deadline: "Jun 2026", milestones: ["Start walking daily", "Run 1km", "Run 3km", "Run 5km"], done: [true, true, false, false] },
  { id: 2, title: "Learn Spanish", pillar: "mind", progress: 30, deadline: "Dec 2026", milestones: ["Learn 100 words", "Hold basic conversation", "Watch a movie", "Think in Spanish"], done: [true, false, false, false] },
];

const CHECKIN_PROMPTS = [
  "What's one thing you're proud of today?",
  "What's one thing holding you back right now?",
  "On a scale of 1–10, how aligned is your life with your purpose?",
  "What would tomorrow's best version of you do differently?",
  "What's one small win you can achieve today?",
];

function getPillar(id) { return PILLARS.find(p => p.id === id) || PILLARS[0]; }

function XPBar({ xp, level }) {
  const toNext = level * 500;
  const pct = Math.min((xp % toNext) / toNext * 100, 100);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Level {level}</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{xp % toNext}/{toNext} XP</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6EE7F7,#C4B5FD)", borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function Orb({ color, size, x, y, blur = 100, opacity = 0.1 }) {
  return <div style={{ position: "fixed", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, filter: `blur(${blur}px)`, opacity, pointerEvents: "none", zIndex: 0 }} />;
}

function Avatar({ icon, size = 36, color = "#6EE7F7" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>
      {icon}
    </div>
  );
}

function TypingText({ text, speed = 22, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => { setDisplayed(""); setIdx(0); }, [text]);
  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => { setDisplayed(d => d + text[idx]); setIdx(i => i + 1); }, speed);
      return () => clearTimeout(t);
    } else if (onDone) onDone();
  }, [idx, text]);
  return <span>{displayed}<span style={{ opacity: 0.6 }}>▋</span></span>;
   }export default function NexusFull() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState(0);
  const [authForm, setAuthForm] = useState({ name: "", age: "", location: "", dream: "" });
  const [tab, setTab] = useState("home");
  const [xp, setXp] = useState(150);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(3);
  const [earnedBadges, setEarnedBadges] = useState(["first_step", "streak_3"]);
  const [visitedPillars, setVisitedPillars] = useState(new Set(["mind"]));
  const [activePillar, setActivePillar] = useState(PILLARS[0]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showAiTyping, setShowAiTyping] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const chatRef = useRef(null);
  const [goals, setGoals] = useState(SAMPLE_GOALS);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalPillar, setNewGoalPillar] = useState("mind");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [communityInput, setCommunityInput] = useState("");
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [checkinDone, setCheckinDone] = useState(false);
  const [checkinAnswer, setCheckinAnswer] = useState("");
  const [checkinPrompt] = useState(CHECKIN_PROMPTS[Math.floor(Math.random() * CHECKIN_PROMPTS.length)]);
  const [memories, setMemories] = useState([
    { date: "Yesterday", pillar: "mind", note: "Wants to learn to code. Has tried before but gave up." },
    { date: "2 days ago", pillar: "heart", note: "Struggling with communication at work." },
    { date: "Last week", pillar: "growth", note: "Core fear: not being good enough." },
  ]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, showAiTyping]);

  function addXP(amount) {
    setXp(prev => { const next = prev + amount; if (next >= level * 500) setLevel(l => l + 1); return next; });
  }

  function earnBadge(id) {
    if (!earnedBadges.includes(id)) {
      setEarnedBadges(b => [...b, id]);
      const badge = BADGES.find(b => b.id === id);
      if (badge) addXP(badge.xp);
    }
  }

  async function sendMessage(text) {
    if (!text.trim() || isTyping) return;
    const userMsg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setShowAiTyping(true);
    setAiResponse("");
    const newTotal = totalMessages + 1;
    setTotalMessages(newTotal);
    if (newTotal >= 10) earnBadge("messages_10");
    addXP(10);
    const visited = new Set([...visitedPillars, activePillar.id]);
    setVisitedPillars(visited);
    if (visited.size === 5) earnBadge("all_pillars");
    const memoryContext = memories.map(m => `[${m.date} - ${m.pillar}]: ${m.note}`).join("\n");
    const goalContext = goals.map(g => `Goal: "${g.title}" (${g.progress}% done)`).join(", ");
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are NEXUS — the world's most advanced AI companion for human potential. You help ${user?.name || "this person"} achieve what they never thought possible.\n\nCurrent pillar: ${activePillar.label}\n\nMemory:\n${memoryContext}\n\nGoals: ${goalContext || "none yet"}\n\nBe warm, bold, personal. 2-4 sentences max. End with one powerful question.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Tell me more — I'm here with you.";
      setAiResponse(reply);
      if (newTotal % 5 === 0) setMemories(m => [{ date: "Just now", pillar: activePillar.id, note: text.slice(0, 80) }, ...m.slice(0, 9)]);
    } catch { setAiResponse("I'm here. Tell me more about what's on your mind."); }
  }

  function handleAiDone() {
    setMessages(m => [...m, { role: "assistant", text: aiResponse }]);
    setShowAiTyping(false);
    setIsTyping(false);
    setAiResponse("");
  }

  function startChat(pillar) {
    setActivePillar(pillar);
    setMessages([{ role: "assistant", text: `${pillar.emoji} ${user?.name || "Hey"} — you've opened ${pillar.label}. Where do you want to go today?` }]);
    setTab("chat");
  }

  if (screen === "landing") {
    return (
      <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", overflow: "hidden", position: "relative" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadein{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}} .nexus-btn:hover{transform:scale(1.03)}`}</style>
        <Orb color="#6EE7F7" size={600} x="-5%" y="-20%" blur={140} opacity={0.07} />
        <Orb color="#C4B5FD" size={500} x="55%" y="40%" blur={130} opacity={0.07} />
        <div style={{ textAlign: "center", zIndex: 10, padding: "0 24px", maxWidth: 700, animation: "fadein 1s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(110,231,247,0.08)", border: "1px solid rgba(110,231,247,0.2)", borderRadius: 100, padding: "6px 20px", marginBottom: 40, color: "#6EE7F7", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>
            Something the world has never seen
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(72px,13vw,120px)", fontWeight: 700, color: "#fff", margin: "0 0 4px", lineHeight: 0.95, letterSpacing: "-3px" }}>NEXUS</h1>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(18px,3vw,26px)", color: "rgba(255,255,255,0.35)", marginBottom: 48, fontStyle: "italic" }}>Your AI for everything human</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
            {PILLARS.map(p => (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, background: `${p.color}0f`, border: `1px solid ${p.color}33`, borderRadius: 100, padding: "8px 18px", color: p.color, fontSize: 13 }}>{p.emoji} {p.label}</div>))}
          </div>
          <button className="nexus-btn" onClick={() => setScreen("auth")} style={{ background: "rgba(110,231,247,0.08)", border: "1.5px solid rgba(110,231,247,0.4)", borderRadius: 100, padding: "18px 56px", color: "#fff", fontSize: 17, cursor: "pointer", transition: "all 0.3s" }}>Begin Your Journey →</button>
          <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, textAlign: "left" }}>
            {COMMUNITY_POSTS.slice(0, 3).map((p, i) => (
              <div key={i} style={{ opacity: 0.7 }}>
                <div style={{ color: getPillar(p.pillar).color, fontSize: 11, marginBottom: 4 }}>{p.user} · {p.location}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>"{p.text.slice(0, 90)}..."</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "auth") {
    const steps = [
      { field: "name", label: "What's your name?", placeholder: "Your first name...", type: "text" },
      { field: "age", label: "How old are you?", placeholder: "Your age...", type: "number" },
      { field: "location", label: "Where are you from?", placeholder: "City, Country...", type: "text" },
      { field: "dream", label: "What's the one thing you've always wanted to achieve?", placeholder: "Be honest...", type: "text" },
    ];
    const current = steps[authStep];
    const advance = () => {
      if (!authForm[current.field].toString().trim()) return;
      if (authStep < steps.length - 1) { setAuthStep(s => s + 1); }
      else { setUser(authForm); setMessages([{ role: "assistant", text: `${authForm.name}, I've been waiting for you. Your dream: "${authForm.dream}". That's where we begin. Which pillar calls to you?` }]); earnBadge("first_step"); setScreen("app"); }
    };
    return (
      <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 24, position: "relative" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <Orb color="#6EE7F7" size={400} x="50%" y="-15%" blur={130} opacity={0.08} />
        <div style={{ maxWidth: 520, width: "100%", zIndex: 10 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 48 }}>
            {steps.map((_, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= authStep ? "#6EE7F7" : "rgba(255,255,255,0.1)", transition: "background 0.4s" }} />))}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 24, lineHeight: 1.2 }}>{current.label}</div>
          <input autoFocus type={current.type} value={authForm[current.field]} onChange={e => setAuthForm(f => ({ ...f, [current.field]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") advance(); }} placeholder={current.placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(110,231,247,0.25)", borderRadius: 14, padding: "16px 20px", color: "#fff", fontSize: 18, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }} />
          <button onClick={advance} style={{ width: "100%", background: "rgba(110,231,247,0.1)", border: "1.5px solid rgba(110,231,247,0.35)", borderRadius: 14, padding: "14px", color: "#6EE7F7", fontSize: 16, cursor: "pointer" }}>
            {authStep < steps.length - 1 ? "Continue →" : "Enter NEXUS →"}
          </button>
        </div>
      </div>
    );
                 }
  const TABS = [
    { id: "home", icon: "⬡", label: "Home" },
    { id: "chat", icon: "◎", label: "NEXUS AI" },
    { id: "goals", icon: "◈", label: "Goals" },
    { id: "community", icon: "◉", label: "Community" },
    { id: "profile", icon: "◐", label: "Profile" },
  ];

  const currentColor = activePillar.color;

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08)} @keyframes fadein{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}} @keyframes blink{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
      <Orb color={currentColor} size={500} x="55%" y="-25%" blur={150} opacity={0.06} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(4,4,10,0.92)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>NEXUS</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,100,0,0.1)", border: "1px solid rgba(255,100,0,0.25)", borderRadius: 100, padding: "4px 12px" }}><span style={{ fontSize: 13 }}>🔥</span><span style={{ color: "#FF8C42", fontSize: 13 }}>{streak}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(110,231,247,0.08)", border: "1px solid rgba(110,231,247,0.2)", borderRadius: 100, padding: "4px 12px" }}><span style={{ color: "#6EE7F7", fontSize: 13 }}>✦ {xp} XP</span></div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {tab === "home" && (
          <div style={{ padding: "24px 20px", animation: "fadein 0.5s ease" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Good day, {user?.name}. ✦</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, marginBottom: 24 }}>Your dream: <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>"{user?.dream}"</span></div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 20 }}><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 12 }}>YOUR PROGRESS</div><XPBar xp={xp} level={level} /></div>
            {!checkinDone && (<div style={{ background: "rgba(110,231,247,0.05)", border: "1px solid rgba(110,231,247,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}><div style={{ color: "#6EE7F7", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Daily Check-in ✦</div><div style={{ color: "#fff", fontSize: 16, marginBottom: 14, fontStyle: "italic" }}>"{checkinPrompt}"</div><textarea value={checkinAnswer} onChange={e => setCheckinAnswer(e.target.value)} placeholder="Be honest..." rows={2} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,247,0.2)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", resize: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", marginBottom: 10 }} /><button onClick={() => { if (checkinAnswer.trim()) { setCheckinDone(true); addXP(25); setStreak(s => s + 1); if (streak + 1 >= 7) earnBadge("streak_7"); } }} style={{ background: "rgba(110,231,247,0.12)", border: "1px solid rgba(110,231,247,0.3)", borderRadius: 10, padding: "10px 20px", color: "#6EE7F7", fontSize: 14, cursor: "pointer" }}>Submit (+25 XP)</button></div>)}
            {checkinDone && <div style={{ background: "rgba(134,239,172,0.05)", border: "1px solid rgba(134,239,172,0.2)", borderRadius: 16, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 24 }}>✅</span><div style={{ color: "#86EFAC" }}>Check-in complete! Keep your streak going.</div></div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {PILLARS.map(p => (<button key={p.id} onClick={() => startChat(p)} style={{ background: `${p.color}0a`, border: `1px solid ${p.color}22`, borderRadius: 14, padding: 16, textAlign: "left", cursor: "pointer", position: "relative" }}>{visitedPillars.has(p.id) && <div style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: "50%", background: p.color }} />}<div style={{ fontSize: 22, marginBottom: 6 }}>{p.emoji}</div><div style={{ color: p.color, fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{p.label}</div></button>))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Recent Achievements</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>{BADGES.filter(b => earnedBadges.includes(b.id)).map(b => (<div key={b.id} style={{ flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", textAlign: "center", minWidth: 90 }}><div style={{ fontSize: 24, marginBottom: 4 }}>{b.icon}</div><div style={{ color: "#fff", fontSize: 11 }}>{b.name}</div><div style={{ color: "#6EE7F7", fontSize: 10 }}>+{b.xp} XP</div></div>))}</div>
          </div>
        )}
        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 136px)" }}>
            <div style={{ display: "flex", gap: 6, padding: "12px 16px", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
              {PILLARS.map(p => (<button key={p.id} onClick={() => { setActivePillar(p); setMessages([{ role: "assistant", text: `${p.emoji} Shifting to ${p.label}, ${user?.name}. What's on your mind?` }]); }} style={{ flexShrink: 0, background: activePillar.id === p.id ? `${p.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${activePillar.id === p.id ? p.color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 100, padding: "7px 14px", cursor: "pointer", color: activePillar.id === p.id ? p.color : "rgba(255,255,255,0.4)", fontSize: 13 }}>{p.emoji} {p.label}</button>))}
            </div>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
              {messages.map((m, i) => (<div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}><div style={{ maxWidth: "75%", background: m.role === "user" ? `${currentColor}18` : "rgba(255,255,255,0.05)", border: `1px solid ${m.role === "user" ? currentColor + "44" : "rgba(255,255,255,0.08)"}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "11px 15px", color: m.role === "user" ? currentColor : "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.6 }}>{m.text}</div></div>))}
              {showAiTyping && aiResponse && (<div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}><div style={{ maxWidth: "75%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px 18px 18px 4px", padding: "11px 15px", color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.6 }}><TypingText text={aiResponse} onDone={handleAiDone} /></div></div>)}
              {isTyping && !aiResponse && <div style={{ display: "flex", gap: 5, padding: "8px 16px" }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: currentColor, opacity: 0.5, animation: `pulse ${0.7 + i * 0.15}s infinite` }} />)}</div>}
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(4,4,10,0.95)", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput); } }} placeholder="Tell NEXUS what's on your mind..." rows={1} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: `1.5px solid ${chatInput ? currentColor + "55" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", resize: "none", fontFamily: "'DM Sans',sans-serif" }} />
                <button onClick={() => sendMessage(chatInput)} style={{ width: 44, height: 44, borderRadius: 12, cursor: "pointer", background: `${currentColor}18`, border: `1.5px solid ${currentColor}44`, color: currentColor, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>↑</button>
              </div>
            </div>
          </div>
        )}
        {tab === "goals" && (
          <div style={{ padding: "24px 20px", animation: "fadein 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#fff" }}>My Goals</div><button onClick={() => setShowAddGoal(!showAddGoal)} style={{ background: "rgba(110,231,247,0.1)", border: "1px solid rgba(110,231,247,0.3)", borderRadius: 100, padding: "8px 16px", color: "#6EE7F7", fontSize: 13, cursor: "pointer" }}>+ New Goal</button></div>
            {showAddGoal && (<div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: 20, marginBottom: 20 }}><input value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} placeholder="What do you want to achieve?" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }} /><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{PILLARS.map(p => (<button key={p.id} onClick={() => setNewGoalPillar(p.id)} style={{ background: newGoalPillar === p.id ? `${p.color}20` : "rgba(255,255,255,0.04)", border: `1px solid ${newGoalPillar === p.id ? p.color + "55" : "rgba(255,255,255,0.08)"}`, borderRadius: 100, padding: "6px 12px", color: newGoalPillar === p.id ? p.color : "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>{p.emoji} {p.label}</button>))}</div><button onClick={() => { if (!newGoalTitle.trim()) return; const g = { id: Date.now(), title: newGoalTitle, pillar: newGoalPillar, progress: 0, deadline: "Dec 2026", milestones: ["Get started", "Build momentum", "Half way", "Achieve it"], done: [false, false, false, false] }; setGoals(gs => [...gs, g]); setNewGoalTitle(""); setShowAddGoal(false); earnBadge("goal_set"); addXP(75); }} style={{ background: "rgba(110,231,247,0.1)", border: "1px solid rgba(110,231,247,0.3)", borderRadius: 10, padding: "10px 20px", color: "#6EE7F7", fontSize: 14, cursor: "pointer" }}>Create Goal (+75 XP)</button></div>)}
            {goals.map(goal => { const p = getPillar(goal.pillar); return (<div key={goal.id} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><span style={{ fontSize: 20 }}>{p.emoji}</span><div style={{ flex: 1 }}><div style={{ color: "#fff", fontSize: 16 }}>{goal.title}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Due {goal.deadline}</div></div><div style={{ color: p.color, fontSize: 18, fontWeight: 700 }}>{goal.progress}%</div></div><div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden", marginBottom: 16 }}><div style={{ height: "100%", width: `${goal.progress}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}88)`, borderRadius: 6 }} /></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{goal.milestones.map((m, i) => (<button key={i} onClick={() => { const updated = goals.map(g => { if (g.id !== goal.id) return g; const nd = [...g.done]; nd[i] = !nd[i]; const prog = Math.round(nd.filter(Boolean).length / nd.length * 100); if (prog === 100) earnBadge("goal_done"); if (nd[i]) addXP(50); return { ...g, done: nd, progress: prog }; }); setGoals(updated); }} style={{ display: "flex", alignItems: "center", gap: 8, background: goal.done[i] ? `${p.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${goal.done[i] ? p.color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", textAlign: "left" }}><div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${goal.done[i] ? p.color : "rgba(255,255,255,0.2)"}`, background: goal.done[i] ? p.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{goal.done[i] && <span style={{ color: "#000", fontSize: 9 }}>✓</span>}</div><span style={{ color: goal.done[i] ? p.color : "rgba(255,255,255,0.5)", fontSize: 12 }}>{m}</span></button>))}</div></div>); })}
          </div>
        )}
        {tab === "community" && (
          <div style={{ padding: "24px 20px", animation: "fadein 0.5s ease" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Community</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>Real people. Real breakthroughs. From every corner of the world.</div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 24 }}><textarea value={communityInput} onChange={e => setCommunityInput(e.target.value)} placeholder="Share a breakthrough..." rows={2} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", resize: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", marginBottom: 10 }} /><button onClick={() => { if (!communityInput.trim()) return; setPosts(p => [{ user: user?.name || "You", location: user?.location || "🌍", pillar: activePillar.id, avatar: "✨", time: "just now", text: communityInput, likes: 0, comments: 0 }, ...p]); setCommunityInput(""); earnBadge("community"); addXP(100); }} style={{ background: "rgba(110,231,247,0.1)", border: "1px solid rgba(110,231,247,0.3)", borderRadius: 10, padding: "9px 18px", color: "#6EE7F7", fontSize: 13, cursor: "pointer" }}>Share (+100 XP)</button></div>
            {posts.map((post, i) => { const p = getPillar(post.pillar); const liked = likedPosts.has(i); return (<div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 18, marginBottom: 12 }}><div style={{ display: "flex", gap: 12, marginBottom: 12 }}><Avatar icon={post.avatar} size={38} color={p.color} /><div><div style={{ color: "#fff", fontSize: 14 }}>{post.user}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{post.location} · {post.time}</div></div><div style={{ marginLeft: "auto", background: `${p.color}15`, border: `1px solid ${p.color}33`, borderRadius: 100, padding: "3px 10px", color: p.color, fontSize: 11, alignSelf: "flex-start" }}>{p.emoji} {p.label}</div></div><div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.65, marginBottom: 14 }}>{post.text}</div><button onClick={() => { const next = new Set(likedPosts); if (liked) { next.delete(i); setPosts(ps => ps.map((p, j) => j === i ? { ...p, likes: p.likes - 1 } : p)); } else { next.add(i); setPosts(ps => ps.map((p, j) => j === i ? { ...p, likes: p.likes + 1 } : p)); } setLikedPosts(next); }} style={{ background: liked ? "rgba(252,163,165,0.15)" : "transparent", border: liked ? "1px solid rgba(252,163,165,0.3)" : "1px solid transparent", borderRadius: 100, padding: "5px 12px", color: liked ? "#FCA5A5" : "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer" }}>♥ {post.likes}</button></div>); })}
          </div>
        )}
        {tab === "profile" && (
          <div style={{ padding: "24px 20px", animation: "fadein 0.5s ease" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 28 }}><div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#6EE7F733,#C4B5FD33)", border: "2px solid rgba(110,231,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👤</div><div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>{user?.name}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{user?.location} · Level {level}</div><div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontStyle: "italic", marginTop: 2 }}>"{user?.dream}"</div></div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>{[{ label: "Total XP", value: xp, color: "#6EE7F7" }, { label: "Streak", value: `${streak}d 🔥`, color: "#FF8C42" }, { label: "Goals", value: goals.length, color: "#86EFAC" }].map(s => (<div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 12px", textAlign: "center" }}><div style={{ color: s.color, fontSize: 20, fontWeight: 700, marginBottom: 3 }}>{s.value}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{s.label}</div></div>))}</div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 18, marginBottom: 24 }}><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 12 }}>LEVEL PROGRESS</div><XPBar xp={xp} level={level} /></div>
            <div style={{ marginBottom: 24 }}><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>🧠 AI Memory</div>{memories.map((m, i) => { const p = getPillar(m.pillar); return (<div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}><span>{p.emoji}</span><div><div style={{ color: p.color, fontSize: 11, marginBottom: 3 }}>{m.date} · {p.label}</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{m.note}</div></div></div>); })}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Achievements ({earnedBadges.length}/{BADGES.length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{BADGES.map(b => { const earned = earnedBadges.includes(b.id); return (<div key={b.id} style={{ background: earned ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)", border: `1px solid ${earned ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", opacity: earned ? 1 : 0.35 }}><span style={{ fontSize: 22 }}>{b









