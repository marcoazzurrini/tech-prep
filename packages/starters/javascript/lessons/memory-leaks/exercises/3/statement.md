`createSessions()` returns an object that tracks open sessions. `open(user)` starts a session and returns its id, and `close(id)` ends it. `activeUsers()` lists the users of the open sessions, in the order they were opened. `stored()` says how many sessions the object holds.

The code below keeps every closed session for ever. Fix it so that a closed session is no longer held. Ids are never reused.

Example 1:
  const s = createSessions();
  const a = s.open("Ada");
  s.open("Bo");
  s.close(a);
  [s.activeUsers(), s.stored()]  ->  [["Bo"], 1]
