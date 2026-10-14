# tech-prep

Left pane: **Neovim**. You read and write code here.
Right pane: **the tutor**. You talk to it there.

The tutor opens each file here for you. Every file is code.

## The roadmap

You work through the **Blind 75**, topic by topic (Arrays & Hashing, Two Pointers, …).
Each problem uses a few **concepts** (small skills). When a problem needs a concept
you haven't learned yet, the tutor teaches it first.

## A new concept takes 3 steps

1. **Example**: a small solved function, written for you. The tutor explains it.
2. **Exercise**: the same idea with a few lines missing. Fill in the `TODO` lines.
3. **Problem**: a real interview problem. The statement is at the top of the file,
   and you write the function below it, like on LeetCode.

Each file has sections between `═══` lines:
- the code (EXAMPLE, EXERCISE, or YOUR SOLUTION: the part you read or write),
- in examples and exercises, TESTS at the bottom. Do not edit them.
- in problems, the tests are hidden, like on LeetCode.

`<leader>tt` runs the tests in every kind of file.

When you run tests, the tutor sees the result and replies.

After you solve a problem, you explain your solution to the tutor in a few sentences.
Later, the tutor brings each concept back with a new problem, so it sticks.

## Keys

- `<leader>tt`: save and run the tests. Press any key to close the results.
- tmux prefix + arrow keys: switch between Neovim and the tutor.

## Things you can say to the tutor

- "next": go to the next step.
- "hint": get a small hint.
- "skip the lesson": go straight to the problem.
- "I give up": see the solution, then try again later.
- `/tech-prep:roadmap` or `/tech-prep:progress`: see where you are.
