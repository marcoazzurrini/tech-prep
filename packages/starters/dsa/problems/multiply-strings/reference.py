def multiply(num1: str, num2: str) -> str:
    if num1 == "0" or num2 == "0":
        return "0"
    # The product of digit i and digit j lands on position i + j + 1. Its carry goes to i + j.
    digits = [0] * (len(num1) + len(num2))
    for i in range(len(num1) - 1, -1, -1):
        for j in range(len(num2) - 1, -1, -1):
            total = int(num1[i]) * int(num2[j]) + digits[i + j + 1]
            digits[i + j + 1] = total % 10
            digits[i + j] += total // 10
    # The first position stays 0 when the product has one digit less.
    start = 1 if digits[0] == 0 else 0
    return "".join(str(d) for d in digits[start:])
