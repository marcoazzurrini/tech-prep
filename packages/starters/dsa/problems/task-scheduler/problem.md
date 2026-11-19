# Task Scheduler (medium)

A CPU must run every task in `tasks`. Each task is a letter, and equal letters are the same kind of task. One task takes one unit of time. In each unit the CPU runs one task or stays idle.

After a task runs, the CPU must wait at least `n` units before it runs the same kind of task again. Tasks may run in any order. Return the smallest number of time units needed to finish all tasks.

Example 1: tasks = ["A", "A", "A", "B", "B", "B"], n = 2  ->  8
  One best order: A, B, idle, A, B, idle, A, B.
Example 2: tasks = ["A", "C", "A", "B", "D", "B"], n = 1  ->  6
  One best order: A, B, A, B, C, D. No idle time is needed.
Example 3: tasks = ["A", "A", "A", "B", "B", "B"], n = 3  ->  10

Constraints: 1 <= len(tasks) <= 10^4, tasks[i] is an uppercase English letter, 0 <= n <= 100.
