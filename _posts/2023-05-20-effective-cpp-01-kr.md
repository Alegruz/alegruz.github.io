---
layout: post
title:  "이펙티브 C++: 01 C++에 익숙해지기"
date:   2023-05-20 00:00:00 +0000
categories: programming cpp effective_cpp korean
---

[목차](/_posts/2023-05-20-effective-cpp-kr.md)

## 01 언어의 집합체로서의 C++

* C++
  * C
  * 개체 지향 C++
  * 템플릿 C++
  * STL

이렇듯 어떤 부분에 집중하느냐에 따라 C++을 사용하는 양상이 매우 달라짐.

## 02 `const`, `enum`, `inline` > `#define`

즉, 전처리기보다는 컴파일러를 좀 더 선호하라는 뜻이다. 매크로로 정의된 상수는 컴파일러가 인식을 못하므로 디버깅할 때 어렵다.

```cpp
// #define ASPECT_RATIO 1.653
const double kAspectRatio = 1.653;
```

게다가 포인터도 상수로 선언할 수 있게 되고, 클래스 전용 상수도 선언할 수 있게 된다.

```cpp
constexpr const char* const kAuthorName = "Alegruz";

class String
{
...
private:
    static constexpr const uint32 MAX_SIZE = 256;
    char m_Data[MAX_SIZE];
};
```

매크로 함수의 경우도 여러 문제가 있다.

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b));
...
int a = 5;
int b = 0;
MAX(++a, b);    // ++가 두 번 호출 됨
```

그렇기에 `inline`을 사용하는 것이 낫다.

```cpp
template <typename T>
inline const T& Max(const T& lhs, const T& rhs)
{
    return lhs > rhs ? lhs : rhs;
}
```

필자: 그뿐만 아니라 콜스택에 잡혀야 디버깅도 편하니 `inline`이 낫다.

## 03 `const`로 덕지 덕지

1. 컴파일러에게도 바꾸지 말라는 의도 전달
2. 동료 프로그래머에게 바꾸지 말라는 의도 전달

```cpp
// char greeting[] = "Hello!";
const char* const greeting = "Hello!";
```

불필요한 실수도 방지할 수 있다:

```cpp
Vector4f operator*(const Vector4f& lhs, const Vector4f& rhs);
...
Vector4f a;
Vector4f b;
Vector4f c;

(a * b) = c;    // 가능!
```

```cpp
const Vector4f operator*(const Vector4f& lhs, const Vector4f& rhs);
...
Vector4f a;
Vector4f b;
Vector4f c;

(a * b) = c;    // 불가능!
```

멤버 함수에도 `const`를 넣어야 한다.

```cpp
template <typename T>
class StaticArray
{
public:
...
    constexpr const T& operator[](size_t position) const { return m_Data[position]; }
    constexpr T& operator[](size_t position) { return m_Data[position]; }
};
```

근데 위의 코드에 보면 코드 중복이 있다. 같은 함수인데 `const` 유무에 따라 분리만 된 것이다. 이 경우엔 `const` 없는 코드에서 `const`로 `static_cast`하여 `const` 있는 코드를 호출하고, `const_cast`로 `const`를 분리하는 방법을 쓸 수도 있다.

물론 `const`를 썻다고 끝은 아니다. 멤버 변수가 포인터라면 포인터가 바뀌지 않는 거지, 포인터가 가리키는 값이 `const`인 것은 아니다. 그러므로 언제나 문법적 `const`만 따르는 것이 아니라, 개념적인 `const`를 따르는 것이 좋다.

## 04 초기화 먼저하고 사용하기

```cpp
int x;      // No
int x = 0;  // Yes

class Vector2d
{
public:
    // Vector2d(int x, int y) { mX = x; mY = y; }   // No
    Vector2d(int x, int y) : mX(x), mY(y) {}        // Yes
private:
    int mX;
    int mY;
}
```

근데 `extern`처럼 지역적이지 않은 정적 개체의 초기화의 순서를 정하는 것은 매우 어려운 문제임. 예를 들어 `A.h`에서 어떤 `extern`으로 선언된 변수 `gVarA`가 있다고 하자. 이때 이 변수를 사용하는 다른 지역적이지 않은 정적 개체 `gVarB`가 다른 파일 `B.h`에 있다고 하자. 그럼 둘 중 당연히 `gVarA`가 먼저 초기화가 되어야 `gVarB`도 유효할 것이다. 하지만 이를 보장하는 것은 매우 어려운 일이다. 이걸 해결하는 방법은 이러한 지역적이지 않은 정적 개체들을 함수 안에 집어 넣는 것이다. 이러면 초기화의 순서를 강제해줄 수 있다:

```cpp
// A.h
class Renderer
{
...
};

extern Renderer gRenderer;

// B.h
class Engine
{
public:
    Engine() { gRenderer.SetOwner(this); }
...
};

extern Engine gTempEngine;
// Main.cpp

int main()
{
    Engine engine;  // gRenderer가 먼저 초기화 되어야 engine도 초기화 가능
}
```

```cpp
// A.h
...
Renderer& GetGlobalRenderer()
{
    static Renderer sGlobalRenderer;
    return sGlobalRenderer;
}
// B.h
...
class Engine
{
public:
    Engine() { GetGlobalRenderer().SetOwner(this); }    // 함수 호출 시 초기화 순서가 강제됨
...
};
Engine& GetTempEngine()
{
    static Engine sTempEngine;
    return sTempEngine;
}
```

하지만 근본적으로 이러한 종속성은 최대한 피하는 것이 좋다.

이런 걸 방지하기 위해서

1. 직접 명시적으로 초기화를 해주고
2. 생성자에선 initializer list를 쓰고
3. 초기화 순서 문제를 지양하자