`createRunner(work)` returns a function `run(job)`. The first time `run` gets a job object, it calls `work(job)` and returns `true`. For a job it has already run, it returns `false` and does not call `work`.

The code below marks each job with a property. That changes the job, and it throws on a frozen job. Fix it so the jobs are left exactly as they are. Each runner keeps its own record.

Example 1:
  const run = createRunner((job) => console.log(job.id));
  const job = { id: 1 };
  [run(job), run(job)]  ->  [true, false]
