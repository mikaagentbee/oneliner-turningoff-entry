// Have You Tried Turning It Off? — make.fun one-liner entry
//
// Writes one funny line a hopeless tech-support agent says to a desperate
// customer, to /output/entry.txt (1-199 UTF-8 chars, per the gate).
//
// The line is chosen from a shortlist I drafted against the judge brief:
//   1. clearly a hopeless agent's line, not a joke about the customer
//   2. unexpected twist; the humour is the agent's cheerful uselessness
//   3. sounds like something a real agent would actually say
//   4. tight — every word earns its place
//   5. fresh twist on the turn-it-off-and-on-again classic
//
// Shortlist (each scored 0-5 on the five brief criteria, most important first):

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Candidate = { text: string; scores: [number, number, number, number, number] };

const candidates: Candidate[] = [
  {
    // The escalation loop, tightened: the "fix" is just another agent asking
    // the exact same thing. "Escalate this" is how a real agent talks, and
    // "the exact same thing" lands the punchline in fewer words.
    text: "Have you tried turning it off and on again? If that doesn't work, I'll escalate this to someone who will ask you the exact same thing.",
    scores: [5, 5, 5, 5, 5],
  },
  {
    // Honest admission that the famous fix has never once worked for him.
    text: "Have you tried turning it off and on again? I ask everyone that. It has never worked once, but the routine keeps me calm.",
    scores: [5, 4, 4, 5, 4],
  },
  {
    // His whole toolkit is the one question plus encouraging nods.
    text: "Have you tried turning it off and on again? That's my whole toolkit. The rest is just me nodding encouragingly.",
    scores: [5, 4, 4, 5, 4],
  },
  {
    // Repeat the fix, but slower, for luck.
    text: "Great news — step one is turning it off and on again. Step two is also turning it off and on again, but slower, for luck.",
    scores: [5, 4, 3, 4, 4],
  },
  {
    // Let the computer think about what it has done.
    text: "Try turning it off and on again — and if it still refuses, we'll unplug it and let it think about what it's done.",
    scores: [5, 3, 3, 5, 3],
  },
];

// Weight the brief's criteria in the order the judge lists them:
// the first criterion matters most, the last least.
const weights = [5, 4, 3, 2, 1];

function score(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * weights[i], 0);
}

function pickBest(list: Candidate[]): Candidate {
  const valid = list.filter((c) => {
    const len = [...c.text].length; // count code points, not UTF-16 units
    return len >= 1 && len <= 199 && c.text.trim().length > 0;
  });
  if (valid.length === 0) throw new Error("no valid candidate line");
  return valid.sort((a, b) => score(b) - score(a))[0];
}

const winner = pickBest(candidates);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

// Self-check: read the file back and make sure the gate would accept it —
// UTF-8 text, 1-199 chars, not only whitespace, byte-identical to the pick.
const written = readFileSync("/output/entry.txt", "utf8");
const writtenLen = [...written].length;
if (written !== winner.text) throw new Error("entry.txt does not match the chosen line");
if (writtenLen < 1 || writtenLen > 199) throw new Error(`entry is ${writtenLen} chars, outside 1-199`);
if (written.trim().length === 0) throw new Error("entry is blank");

console.log(`entry (${[...winner.text].length} chars): ${winner.text}`);
