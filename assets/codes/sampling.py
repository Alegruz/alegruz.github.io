from cProfile import label
import matplotlib.pyplot as plt
import numpy as np

# def integrate_mc(a: float, b: float, num_samples: int, f, p, gen) -> float:
#     x: np.ndarray = gen(a, b, num_samples)
#     estimates = f(x) / p(x, a, b)
#     result: float = estimates.sum() / num_samples
#     return result

def f(x: np.ndarray):
    # print(f"f(x={x})")
    # return (x ** 2) * 0.005 * np.sin(x)
    # return 0.25 - (x - 0.5) ** 2
    return np.cos(x) + np.sin(6 * x) ** 4

def p_uniform(x: np.ndarray, a: float, b: float) -> np.ndarray:
    return 1 / (b - a)

# def gen_uniform(a: float, b: float, num_samples: int) -> np.ndarray:
#     x: np.ndarray = np.random.uniform(low=a, high=b, size=num_samples)
#     return x

# def p_x2(x: np.ndarray, a: float, b: float) -> np.ndarray:
#     b3: float = ((b ** 3) / 3)
#     a3: float = ((a ** 3) / 3)
#     return (x ** 2) / (b3 - a3)

# def gen_x2(a: float, b: float, num_samples: int) -> np.ndarray:
#     x: np.ndarray = np.random.rand(num_samples)
#     b3: float = (b ** 3)
#     a3: float = (a ** 3)
#     return (a3 + x * (b3 - a3)) ** (1.0 / 3.0)

# # gen_uniform(a=0.0, b=100.0, num_samples=10)

# # num_samples_list: list[int] = [10, 50, 100, 150, 200]
# uniform_results_list: list[float] = []
# x2_results_list: list[float] = []
# for num_samples in range(0, 200):
#     uniform_result: float = integrate_mc(a=0.0, b=100.0, num_samples=num_samples, f=f, p=p_uniform, gen=gen_uniform)
#     uniform_results_list.append(uniform_result)
    
#     x2_result: float = integrate_mc(a=0.0, b=100.0, num_samples=num_samples, f=f, p=p_x2, gen=gen_x2)
#     x2_results_list.append(x2_result)

num_samples: int = 10

uniform: np.ndarray = np.random.uniform(low=0.0, high=1.0, size=num_samples)
uniform_weights: np.ndarray = 
# uniform_y = np.vectorize(f)(uniform)

# normal_scale: float = 0.01
# normal_mean: float = 0.5
# normal = np.random.normal(loc=normal_mean, scale=normal_scale, size=num_samples)
# normal_y = np.vectorize(f)(normal)

# uniform_estimation: float = 0.0
# for i in range(0, num_samples):
#     uniform_estimation += f(uniform[i]) / uniform_p(uniform[i])
# uniform_estimation /= num_samples

# normal_estimation: float = 0.0
# for i in range(0, num_samples):
#     normal_estimation += f(normal[i]) / normal_p(normal[i], normal_mean, normal_scale)
# normal_estimation /= num_samples

# print("Answer: 1.0")
# print(f"Uniform Estimation: {uniform_estimation}")
# print(f"Exponential Estimation: {normal_estimation}")

# plt.hist(x=uniform)
# plt.plot(uniform, uniform_y, 'o', label="uniform")
# plt.plot(normal, normal_y, 'o', label="normal")
# plt.plot(uniform_results_list, label="uniform")
# plt.plot(x2_results_list, label="x2")
plt.xlabel(xlabel="x")
plt.ylabel(ylabel="y")
plt.title(label="Uniform Sampling")
plt.show()