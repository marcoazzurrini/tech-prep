export function permissions(role) {
  const list = [];

  switch (role) {
    case "admin":
      list.push("delete");
    // falls through
    case "editor":
      list.push("write");
    // falls through
    case "viewer":
      list.push("read");
  }

  return list;
}
