import matplotlib.pyplot as plt

deferred_clustered_timestamp = [644100, 34755200, 83797600, 117809100, 167215700, 217373000, 267338300, 317249800, 350699900, 600925900, 634330900, 834417900, 1068211000, 2488359300, 3495770500,
             4490586700, 5515614600, 6507368300, 7506210500, 8532828600, 9525348100, 10533508800, 11524608200, 12532044400, 13546202500]

deferred_clustered = [59.06, 59.08, 59.1, 59.11, 59.13, 59.15, 59.18, 59.2, 59.22, 59.23, 59.24, 59.25, 59.26, 59.27, 59.3, 60.38, 60.41, 60.44, 60.47, 60.51, 60.54, 60.57, 60.59, 
                      60.62, 60.66]

thin_gbuffer_clustered_timestamp = [644100, 34755200, 83797600, 117809100, 167215700, 217373000, 267338300, 317249800, 350699900, 600925900, 634330900, 834417900, 1068211000, 2488359300, 3495770500,
             4490586700, 5515614600, 6507368300, 7506210500, 8532828600, 9525348100, 10533508800, 11524608200, 12532044400, 13546202500]

thin_gbuffer_clustered = [59.06, 59.08, 59.1, 59.11, 59.13, 59.15, 59.18, 59.2, 59.22, 59.23, 59.24, 59.25, 59.26, 59.27, 59.3, 60.38, 60.41, 60.44, 60.47, 60.51, 60.54, 60.57, 60.59, 
                      60.62, 60.66]

peak: int = 0
plt.plot(deferred_clustered_timestamp, deferred_clustered, label="Deferred Clustered")
plt.plot(thin_gbuffer_clustered_timestamp, thin_gbuffer_clustered, label="Thin G-Buffer Clustered")
plt.legend()
plt.xlabel("Timestamp (ns)")
plt.ylabel("Non Local Usage (MB)")
plt.title(label="GPU Memory")
plt.show()