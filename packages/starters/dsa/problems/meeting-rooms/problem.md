# Meeting Rooms (easy)

Given a list of meeting times `intervals`, each `[start, end]`, return `true` if one person could attend every meeting, i.e. no two meetings overlap. A meeting that ends at time `t` does not clash with one that starts at `t`.

Example 1: intervals = [[0, 30], [5, 10], [15, 20]]  ->  false
Example 2: intervals = [[7, 10], [2, 4]]  ->  true
Example 3: intervals = [[1, 5], [5, 8]]  ->  true (back-to-back is fine)

Constraints: 0 <= len(intervals) <= 10^4, 0 <= start < end <= 10^6.
