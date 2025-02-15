---
layout: post
title:  "익셉셔널 C++: 01 제너릭 프로그래밍 및 C++ 표준 라이브러리"
date:   2023-05-20 00:00:00 +0000
categories: programming cpp exceptional_cpp
lang: "ko"
---

[목차](/_posts/2023-05-20-exceptional-cpp-kr.md)

## 01 `vector`의 사용법과 남용

```cpp
std::vector<int> v;

v[0];       // 범위 체크 X. 효율성을 위해서 범위 체크를 하지 않음.
v.at[0];    // 범위 체크 O
```

```cpp
std::vector<int> v;
v.reserve(2);               // 최소 두 개는 저장할 수 있는 용량을 보장해달라.
// assert(v.capacity() == 2);  // 그러므로 이 assert는 false가 나올 수도 있음.
assert(v.capacity() >= 2);  // 그리고 어차피 STL 자체적으로 이런 조건들을 검증하기 때문에 assert가 필요 없음.
v[0] = 0;   // reserve 함수는 용량만 할당해주는거지 실제 인덱스에 유효한 개체가 있음을 보장하는 것이 아님.
            // 즉 v[0]에는 생성자가 호출된 유효한 개체가 있는 것이 아닌 단순 메모리만 할당된 상황인 것임.
            // 그러므로 유효하지 않은 메모리에 복사(할당) 연산자를 호출하려고 하는 것임.
v[1] = 1;
// 이 벡터의 용량이 최소 2인거지 실제 크기는 0이므로 이 루프는 돌지 않게 됨
// 또한 내부적으로 무언가를 수정하는 루프가 아니므로 const_iterator를 썻어야 함
// 그리고 iterator 간의 비교는 대소 관계가 아니라 동일성 비교를 해야 한다. 즉, i != v.end()로 해야 함.
// 또한 정말로 현재 i의 값이 필요한게 아니라면 ++i로 쓰는 것이 더 낫다.
// 그리고 이 루프에서 v.end()의 값이 바뀌지 않으므로 매번 호출하는 것보다 따로 변수에 담아 두는 것이 좋을 수 있다.
// 물론 여기선 end의 타입이 int*이기 때문에 컴파일러가 최적화를 해주겠지만 안 그런 경우에는 다르다.
// for (std::vector<int>::iterator i = v.begin(); i < v.end(); i++)
const std::vector<int>::const_iterator& vecEnd = v.end();
for (std::vector<int>::const_iterator i = v.begin(); i != vecEnd; ++i)
{
    // 여기서 스트림을 flush해줄 거 아니면 std::endl보단 단순히 '\n'만 출력해주는 것이 낫다.
    // std::cout << *i << std::endl;
    std::cout << *i << '\n';
}

std::cout << v[0];
v.reserve(100);
assert(v.capacity() == 100);
std::cout << v[0];

v[2] = 3;
v[3] = 4;
// ...
v[99] = 100;    // 설사 reserve한 상태에서 이런 할당 연산이 가능하다고 가정하자
                // 만약 앞에 v[0] = 1; 같은 거 없이 바로 v[99] = 100 하나만 해준다면, 
                // 이 벡터의 크기는 1인 것인지, 100인 것인지 논리적으로 불분명함.
for (std::vector<int>::iterator i = v.begin(); i < v.end(); i++)
{
    std::cout << *i << std::endl;
}
```

## 02 스트링 포맷 1

* `sprintf`
  * 장점
    * 사용법이 명백하고 간단함
    * 가장 효율적임
  * 단점
    * length safety
    * type safety (컴파일 오류가 아닌 런타임 오류임)
      * `sprintf(buf, "%4c", i);` 의도한 건 d인데 c로 적어도 컴파일 오류가 나지 않음. 결과를 봐야 잘 못된 걸 앎
    * 템플릿과 같이 쓰기 애매함

## 03 스트링 포맷 2

* `snprintf`
  * 장점
    * 사용법이 명백하고 간단함
    * 가장 효율적임
    * length safety
  * 단점
    * type safety (컴파일 오류가 아닌 런타임 오류임)
    * 템플릿과 같이 쓰기 애매함

결론: `sprintf` < `snprintf`

* `std::stringstream`
  * 장점
    * length safety
    * type safety
    * 템플릿과 같이 쓰기 애매함
  * 단점
    * 사용법이 명백하지 않고 복잡함
    * 효율성이 떨어짐

* `std::strstream`
  * 장점
    * 효율성
    * length safety
    * type safety
    * 템플릿과 같이 쓰기 애매함
  * 단점
    * 사용법이 명백하지 않고 복잡함

게임 개발자로서 성능이 매우 중요하기 때문에 C++ STL에 포함된 애들보다는 C의 `snprintf`가 제일 나은 선택지 같다.