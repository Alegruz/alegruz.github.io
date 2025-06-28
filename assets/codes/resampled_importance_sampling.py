import matplotlib.pyplot as plt
import numpy as np

# def f(x: np.ndarray) -> np.ndarray:
#     return 1.3 * np.sin(x * np.pi * 3.5) + 0.5

low: float = 0.0
high: float = 1.5
x: np.ndarray = np.arange(low, high, 0.01)

def g(x: np.ndarray) -> np.ndarray:
    return np.cos(x) + np.sin(6 * x) ** 4

num_samples_list: list[int] = [1, 2, 8]
uniform_x_list: list[np.ndarray] = [np.random.uniform(low=low, high=high, size=num_samples) for num_samples in num_samples_list]
uniform_p: float = 1.0 / (high - low)
weights_list: list[np.ndarray] = [g(x=uniform_x) / uniform_p for uniform_x in uniform_x_list]
normalized_weights_list: list[np.ndarray] = []
for i in range(0, len(weights_list)):
    normalized_weights_list.append(weights_list[i] / weights_list[i].sum())
    weights_sum: float = 0.0
results_list: list[np.ndarray] = []

num_samples: int = 100
for i in range(0, len(uniform_x_list)):
    results_list.append(np.random.choice(uniform_x_list[i], num_samples, p=normalized_weights_list[i]))
    print(f"result: {results_list[i]}")

# uniform_integral: float = 0
# for i in range(0, num_samples):
    # uniform_integral += f(uniform_x[i]) / uniform_p
# uniform_integral /= num_samples

# print("Integral: 10.6366")
# print(f"Uniform Distribution: {uniform_integral}")

# plt.plot(uniform_x, f(uniform_x), 'ro', label="Uniform X")
plt.plot(x, g(x), label="Target PDF")
plt.plot(results_list[0], "ro", label="M = 1")
plt.plot(results_list[1], "bs", label="M = 2")
plt.plot(results_list[2], "g^", label="M = 8")

plt.xlabel(xlabel="x")
plt.ylabel(ylabel="y")
plt.title(label="Monte Carlo Integration")
plt.show()