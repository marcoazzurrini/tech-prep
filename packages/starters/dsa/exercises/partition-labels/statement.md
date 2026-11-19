# Partition Labels (medium)

Cut the string `s` into as many parts as possible, so that no letter appears in more than one part. The parts, joined in order, must give `s` again. Return the length of each part, in order.

Example 1: s = "ababcbacadefegdehijhklij"  ->  [9, 7, 8]  (parts "ababcbaca", "defegde", "hijhklij")
Example 2: s = "eccbbbbdec"  ->  [10]  (`e` is at both ends, so the string stays whole)

Constraints: 1 <= len(s) <= 500, lowercase English letters.
