# Shared content for every decision sketch (real product content; numbers are sample data)

Product: "tech-prep", a desktop coding-interview trainer for one person. Read /Users/marcoazzurrini/dev/tech-prep/PRODUCT.md.
Screen to sketch: the main SESSION screen, mid-review, at 1440 x 900.

Shell regions every sketch must have (arrangement may differ per direction):
1. Navigation: Today (active), Roadmap, Concepts, History, Settings.
2. Today's session strip, showing what remains: "Review · 1 of 3" (current), then "Learn: Window with Counts", then "Review".
3. The editor pane: the learner's REAL Neovim (a terminal surface). It is the biggest area. Show it as Neovim:
   line numbers, syntax colours, a Neovim statusline "NORMAL  longest-substring.ts  typescript  14:28".
   File content (TypeScript), exactly:
     // ═══ PROBLEM ════════════════════════════════════════
     // Longest Substring Without Repeating Characters (medium)
     //
     // Given a string s, return the length of the longest
     // substring (contiguous) with no repeated character.
     //   "abcabcbb" -> 3    "bbbbb" -> 1    "pwwkew" -> 3
     // ═══ YOUR SOLUTION ══════════════════════════════════
     export function lengthOfLongestSubstring(s: string): number {
       const last = new Map<string, number>();
       let left = 0;
       let best = 0;
       for (let right = 0; right < s.length; right++) {
         const ch = s[right];
         if (last.has(ch)) left = last.get(ch)! + 1;
         last.set(ch, right);
         best = Math.max(best, right - left + 1);
       }
       return best;
     }
4. Test result (from pressing <leader>tt): "7 / 8 passed", failing case: s = "abba", expected 2, got 3.
5. Tutor pane (Claude). Messages, in order:
   - Tutor: "Before you code: which approach would you use, and why?"
   - You: "Sliding window. Grow the right edge, and jump left past the last copy of the character."
   - Tutor: "Good call. 7 of 8 tests pass. The failing case is "abba". On line 14, when you reach the second "a", where does left go? Is that to the right of where it was?"
   - Final line, bold, on its own: "Your turn: trace "abba" by hand and watch left."
   - A message input at the bottom: placeholder "Ask the tutor…".
6. Problem header: title "Longest Substring Without Repeating Characters", difficulty "Medium", mode "Review".
   This is an UNLABELLED review: the concepts are hidden until the attempt ends ("2 concepts · revealed when you finish").
7. Small progress readout (sample data, label it "sample data" somewhere small): 9 of 62 concepts passed, 2 mastered, 3 due today, 7 of 75 problems solved.

Hard rules (from the product):
- Easy reading is a hard requirement: tutor prose at least 16px, line-height >= 1.55, measure about 60 characters, short blocks, generous spacing, no walls of text, high contrast.
- Standard, familiar controls: real-looking nav, tabs, buttons, input. No costume of a terminal or of the world's physical artifact.
- Self-contained HTML: inline CSS, no JavaScript, only Google Fonts may be fetched. body exactly 1440 x 900, overflow hidden. Under 200 lines.
- No emoji. No invented features beyond the list above.
