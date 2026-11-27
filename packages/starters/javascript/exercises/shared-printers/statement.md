# Shared Printers (medium)

An office has `count` printers, numbered from 0. Write `printAll(jobs, count)`. Each job is a function that takes a printer number and returns a promise.

A printer prints one job at a time. Give the jobs out in order: each job goes to a printer as soon as one is free. When several printers are free at the start, give the jobs to them in order, 0 first.

Return a promise of the job results, in the order of `jobs`. If a job rejects, reject with its error.

Example 1: three jobs that take 30, 5 and 5 ms and fulfil with their printer number, with count = 2  ->  [0, 1, 1]
Example 2: printAll([], 3)  ->  []
