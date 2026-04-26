import sys

def tsp(mask, pos, n, dist, dp):
    # If all cities are visited, return cost to go back to start
    if mask == (1 << n) - 1:
        return dist[pos][0]

    # If already computed, return stored value
    if dp[mask][pos] != -1:
        return dp[mask][pos]

    ans = sys.maxsize

    # Try visiting all unvisited cities
    for city in range(n):
        if (mask & (1 << city)) == 0:
            newAns = dist[pos][city] + tsp(mask | (1 << city), city, n, dist, dp)
            ans = min(ans, newAns)

    dp[mask][pos] = ans
    return ans


# Main function
if __name__ == "__main__":
    n = 4  # number of cities

    # Distance matrix
    dist = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0]
    ]

    # DP table
    dp = [[-1] * n for _ in range(1 << n)]

    result = tsp(1, 0, n, dist, dp)
    print("Minimum travelling cost:", result)