export function grant(access, flag) {
  return access | flag;
}

export function revoke(access, flag) {
  return access & ~flag;
}

export function has(access, flag) {
  return (access & flag) !== 0;
}
