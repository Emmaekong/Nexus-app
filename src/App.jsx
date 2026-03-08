import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PILLARS = [
  { id: "mind",    emoji: "🧠", label: "Mind",    color: "#6EE7F7", dark: "#0a2a30" },
  { id: "body",    emoji: "💪", label: "Body",    color: "#86EFAC", dark: "#0a2a18" },
  { id: "heart",   emoji: "❤️", label: "Heart",   color: "#FCA5A5", dark: "#2a0a0a" },
  { id: "purpose", emoji: "💼", label: "Purpose", color: "#FCD34D", dark: "#2a2000" },
  { id: "growth",  emoji: "🌱", label: "Growth",  color: "#C4B5FD", dark: "#160a2a" },
];

const BADGES = [
  { id: "first_step",   icon: "🌟", name: "First Step",     desc: "Started your NEXUS journey",        xp: 50  },
  { id: "streak_3",     icon: "🔥", name: "On Fire",        desc: "3-day streak",                      xp: 100 },
  { id: "streak_7",     icon: "⚡", name: "Unstoppable",    desc: "7-day streak",                      xp: 250 },
  { id: "all_pillars",  icon: "🌈", name: "Whole Human",    desc: "Explored all 5 pillars",            xp: 200 },
  { id: "goal_set",     icon: "🎯", name: "Goal Setter",    desc: "Set your first goal",               xp: 75  },
  { id: "goal_done",    icon: "🏆", name: "Achiever",       desc: "Completed your first goal",         xp: 300 },
  { id: "community",    icon: "🤝", name: "Connected",      desc: "Shared in the community",           xp: 100 },
  { id: "messages_10",  icon: "💬", name: "Deep Diver",     desc: "Sent 10 messages to NEXUS",        xp: 150 },
];

const COMMUNITY_POSTS = [
  { user: "Amara K.", location: "Accra 🇬🇭", pillar: "growth",  avatar: "🌸", time: "2h ago",  text: "Just got accepted into my dream university! 6 months ago I didn't believe I was good enough. NEXUS helped me see what I was capable of.", likes: 142, comments: 23 },
  { user: "Raj M.",   location: "Mumbai 🇮🇳", pillar: "mind",   avatar: "🦁", time: "5h ago",  text: "Learned to code at 41. Just shipped my first app. If you're thinking it's too late — it's not. It's never too late.", likes: 89,  comments: 17 },
  { user: "Sofia L.", location: "São Paulo 🇧🇷", pillar: "body", avatar: "⚡", time: "1d ago",  text: "Ran 5km today. After my knee surgery last year I was told I'd never run again. Here I am. Don't let anyone define your limits.", likes: 203, comments: 41 },
  { user: "James O.", location: "Lagos 🇳🇬",  pillar: "heart",  avatar: "🌊", time: "1d ago",  text: "Had the most honest conversation with my father in 20 years. We cried. It's not perfect yet but it's real. Thank you NEXUS.", likes: 176, comments: 38 },
  { user: "Yuki T.",  location: "Tokyo 🇯🇵",  pillar: "purpose",avatar: "🎋", time: "2d ago",  text: "Left my 20-year corporate career to open a small pottery studio. Everyone thought I was crazy. I've never been happier.", likes: 311, comments: 67 },
];

const SAMPLE_GOALS = [
  { id: 1, title: "Run a 5K", pillar: "body",    progress: 65, deadline: "Jun 2026", milestones: ["Start walking daily", "Run 1km", "Run 3km", "Run 5km"], done: [true, true, false, false] },
  { id: 2, title: "Learn Spanish", pillar: "mind", progress: 30, deadline: "Dec 2026", milestones: ["Learn 100 words", "Hold basic conversation", "Watch a movie", "Think in Spanish"], done: [true, false, false, false] },
];

const CHECKIN_PROMPTS = [
  "What's one thing you're proud of today?",
  "What's one thing holding you back right now?",
  "On a scale of 1–10, how aligned is your life with your purpose?",
  "What would tomorrow's best version of you do differently?",
  "What's one small win you can achieve today?",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getPillar(id) { return PILLARS.find(p => p.id === id) || PILLARS[0]; }

function XPBar({ xp, level }) {
  const toNext = level * 500;
  const pct = Math.min((xp % toNext) / toNext * 100, 100);
  return (
