import matplotlib.pyplot as plt
import numpy as np

def f(x: np.ndarray) -> np.ndarray:
    return np.cos(x * np.pi * 0.5) + 2

low: float = 0.0
high: float = 5.0
x: np.ndarray = np.arange(low, high, 0.1)

num_samples: int = 10
uniform_x: np.ndarray = np.random.uniform(low=low, high=high, size=num_samples)
uniform_p: float = 1.0 / (high - low)

uniform_integral: float = 0
# uniform_integral = f(uniform_x).sum() / uniform_p
for i in range(0, num_samples):
    uniform_integral += f(uniform_x[i]) / uniform_p
uniform_integral /= num_samples

print("Integral: 10.6366")
print(f"Uniform Distribution: {uniform_integral}")

plt.plot(uniform_x, f(uniform_x), 'ro', label="Uniform X")
plt.plot(x, f(x), label="Function")

plt.xlabel(xlabel="x")
plt.ylabel(ylabel="y")
plt.title(label="Monte Carlo Integration")
plt.show()