#include <iostream>

#include "math.h"

int main()
{
    raytracing::float3 v1(1.0f, 2.0f, 3.0f);
    raytracing::float3 v2(4.0f, 5.0f, 6.0f);

    raytracing::ParametricLine line(v1, v2 - v1);

    std::cout << "Origin: (" << line.Origin.X << ", " << line.Origin.Y << ", " << line.Origin.Z << ")\n";
    std::cout << "Direction: (" << line.Direction.X << ", " << line.Direction.Y << ", " << line.Direction.Z << ")\n";

    raytracing::float3 result = v1 + v2;
    std::cout << "Result of addition: (" << result.X << ", " << result.Y << ", " << result.Z << ")\n";

    result = v1 * 2.0f;
    std::cout << "Result of scalar multiplication: (" << result.X << ", " << result.Y << ", " << result.Z << ")\n";

    result = v1.cross(v2);
    std::cout << "Cross product: (" << result.X << ", " << result.Y << ", " << result.Z << ")\n";

    std::cout << "Length of v1: " << v1.length() << "\n";
    std::cout << "Normalized v1: (" << v1.normalize().X << ", " << v1.normalize().Y << ", " << v1.normalize().Z << ")\n";

    std::cout << "Dot product of v1 and v2: " << v1.dot(v2) << "\n";

    // Example of using ParametricLine
    raytracing::ParametricLine ray(v1, v2 - v1);
    std::cout << "Ray Origin: (" << ray.Origin.X << ", " << ray.Origin.Y << ", " << ray.Origin.Z << ")\n";
    std::cout << "Ray Direction: (" << ray.Direction.X << ", " << ray.Direction.Y << ", " << ray.Direction.Z << ")\n";

    // Example of using Triangle
    raytracing::Triangle triangle(v1, v2, raytracing::float3(7.0f, 8.0f, 9.0f));
    std::cout << "Triangle vertices: \n";
    for (const auto& vertex : triangle.Vertices)
    {
        std::cout << "(" << vertex.X << ", " << vertex.Y << ", " << vertex.Z << ")\n";
    }

    return 0;
}