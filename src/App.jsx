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









