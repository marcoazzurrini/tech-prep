class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def search(self, word: str) -> bool:
        def match(node: dict, i: int) -> bool:
            if i == len(word):
                return "$" in node
            ch = word[i]
            if ch == ".":
                # Try every child; "$" is the end marker, not a letter.
                return any(match(child, i + 1) for key, child in node.items() if key != "$")
            return ch in node and match(node[ch], i + 1)

        return match(self.root, 0)
