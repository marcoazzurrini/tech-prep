def partition(s: str) -> list[list[str]]:
    result = []
    pieces = []

    def is_palindrome(left: int, right: int) -> bool:
        # Two pointers move inward from both ends.
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    def backtrack(start: int) -> None:
        if start == len(s):
            result.append(pieces[:])
            return
        for end in range(start, len(s)):
            if is_palindrome(start, end):  # only cut after a palindrome
                pieces.append(s[start : end + 1])
                backtrack(end + 1)
                pieces.pop()

    backtrack(0)
    return result
