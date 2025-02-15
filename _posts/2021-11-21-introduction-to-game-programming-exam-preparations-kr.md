---
layout: post
title:  게임 프로그래밍 입문 공부 노트
date:   2021-11-21 00:00:00 +0000
categories: study
lang: "ko"
---

## 파이썬 Python

### 데코레이터 Decorator

앞으로 함수를 호출할 때, 공통적으로 무언가를 추가적으로 실행하고 싶을 때 사용하는 기능.

예를 들어 앞으로 렌더링과 관련된 모든 함수에 디버깅의 용도로 앞 뒤에:

```
render starting
# 함수 실행
render ended
```

이런 식으로 로깅을 한다고 가정. 사실 해결방법은 모든 렌더링 함수에 `print` 함수를 앞 뒤로 써주면 되겠지만, 이건 너무 귀찮음. 그래서 사용하는게 데코레이터:

```python
from functools import wraps
def debug_render(func: Callable):
    @wraps(func) 
    def run_debug_function(*args, **kwargs):
        print("rendering started")
        result = func(*args, **kwargs)
        print("rendering ended")
        return result
    return run_debug_function

@debug_render
def render():
    print("RENDERING")
```

이거 말고도 getter/setter도 property로 해줄 수 있음:

```python
class Vector2f:
    def __init__(self, x: float, y: float) -> None:
        assert isinstance(x, float)
        assert isinstance(y, float)

        self.__x: float = x
        self.__y: float = y

    @property
    def x(self) -> float:
        return self.__x

    @property
    def y(self) -> float:
        return self.__y

    @x.setter
    def x(self, x: float) -> None:
        assert isinstance(x, float)

        self.__x = x

    @y.setter
    def y(self, y: float) -> None
        assert isinstance(y, float)

        self.__y = y
        
    @x.deleter
    def x(self) -> None:
        del self.__X

    @y.deleter
    def y(self) -> None:
        del self.__y
```

### `map`

### `filter`

### `reduce`

### 이터레이터 Iterator

### 제너레이터 Generator

## 충돌

### 기본 충돌

### 모서리 충돌

## 회전

## 코코스 cocos

### 기본 개념

#### 장면 `Scene`

장면(`Scene` 클래스)이란 어플리케이션 워크플로우를 구성하는 독립적인 개체. 여러 장면이 존재할 수는 있어도, 한 순간에 오로지 하나만 활성화 되어있음.

![scenes](https://python.cocos2d.org/doc/_images/scenes.png)

이 장면을 서로 독립적인 어플리케이션처럼 다뤄줄 수 있음. 이 장면 간의 관계에 어떠한 로직을 넣어줄 수 있음(인트로 끝나면 메뉴로 간다거나 등).

cocos2d에서 장면은 `CocosNode`로 구성된 트리임. 이때 루트 노드가 `Scene` 노드가 되는 것. 그 다음 후손을 계층, 즉 `Layer`라 부름. 계층은 개별적인 요소들을 조직화해주는 역할임.

메인 메뉴 화면의 예시:

```
메인 메뉴 장면: 모든 메인 메뉴 요소들을 갖고 있는 장면 노드
    애니메이션 있는 뒷배경: 애니메이션이 있는 뒷배경을 그려주는 계층
        정적 배경: 장면을 덮는 그림을 갖는 스프라이트 Sprite
        멀리 있는 나무들: 멀리 있는 나무들을 갖는 계층
            나무1...나무k: k 개의 나무 스프라이트
        새들: 나는 새들을 포함하는 계층
            새1...새k: k 마리의 새 스프라이트
        가까운 나무들: 가까운 나무들을 갖는 계층
            나무1...나무k: k 개의 나무 스프라이트
    메인 메뉴: 계층의 하위 클래스인 메뉴로, cocos에서 기본 제공하며, 메뉴와 관련된 모든 행동을 처리함(키 입력, 하이라이트, 선택 등)
        아이템1: 메뉴 아이템 MenuItem, "게임 시작"
        아이템2: MenuItem, "옵션"
        아이템3: MenuItem, "종료"
```

장면에도 장면 전환(`TransitionScene`)과 같은 하위 클래스가 존재하여 장면 간 전환(페이드 인/아웃, 슬라이드 등)을 해줌.

#### 계층 `Layer`

계층을 통해 장면을 뒤에서 앞으로 구조화해줄 수 있음. 예시:
* 배경: 풍경 그림
* 먼 곳: 미적 용도의 나무, 새 등
* 중간: 플랫폼
* 가까운 곳: 플레이어, 적, 코인 등
* HUD: 게임 스탯 보여주는 곳

계층을 단순화하자면 투명한 셀로판지에 그릴 걸 그려 놓는 거고, 이런 셀로판지 여러 개를 쌓아두면 장면이 되는 것임.

![layers](https://python.cocos2d.org/doc/_images/layers.png)

특정 용도를 위한 계층도 있음. `Menu` 같은 애들.

계층에서 렌더링이나 로직을 짜게 되므로, 제일 많이 코딩을 하게 될 곳임.

여기서 이벤트 처리도 정의함. 이벤트는 장면 내의 계층에게 앞에서 뒤로 전송이 됨. 그 이벤트를 어떤 계층에서 처리한다면, 그 뒤 계층으로 이벤트가 또 가지는 않음.

계층에도 여러 전용 하위 클래스가 존재함:
* `MultiplexLayer`: 여러 계층이 한 데 묶여있지만, 그 중에서도 하나만 보이는 계층
* `ScrollingManager`, `ScrollableLayer`: 스크롤을 제어해주는 로직
* `RectMapLayer`, `HexMapLayer`, `TmxObjectLayer`: 사각형/육각형 타일들이나 TMX 개체들의 집합 출력
* `Menu`: 간단한 메뉴
* `ColorLayer`: 단색을 갖는 직사각형
* `PythonInterpreterLayer`: 디렉터가 이걸 사용해서 장면 안에 있는 개체를 볼 수 있게 해주는 상호작용 콘솔 (단축키: ctrl + l)

애셋 손쉽게 로딩하려면 `Layer` 상속 받은 클래스에 `__init__` 오버라이드해주면 됨.

계층도 `CocosNode`의 하위클래스이기 때문에 직접 변환을 해주거나 액션을 통해서 변환을 적용시켜줄 수 있음.

#### 스프라이트 `Sprite`

스프라이트 모르는 흑우 읍제?

스프라이트(`Sprite` 클래스)는 다른 스프라이트를 자식으로 가질 수도 있음. 부모에 변환이 적용되면 자식들에게도 변환이 적용이 됨.

### 충돌

#### CollisionManager

CollisionManager은 누가 충돌의 대상이 되느냐에 대한 정보를 기록해두고 있음. 이걸 통해 충돌 가능한 애들끼리 충돌했는지 여부를 확인할 수 있음.

충돌 가능한 애들 관리법:
* `add(obj)`: 앞으로 CollisionManager 개체는 충돌 가능한 `obj`에 대한 정보를 기록함
* `remove_tricky(obj)`: `obj`에 대한 정보 앞으로 기록 안함. 대신 제대로 작동하려면 `obj.cshape`이 처음 `add`했을 때랑 같아야 함.
* `clear()`: 지금까지 기록하던 애들 앞으로 기록 안 함.

현재 CollisionManager은 CollisionManagerBruteForce와 CollisionManagerGrid로 나뉨. 전자는 단순히 그냥 장면에 존재하는 모든 개체에 대해 for문 처리하겠다는거고, 후자는 나름대로 그리드로 화면을 나눠서 좀 더 효율적으로 탐색을 하겠다는 뜻임. 당연히 성능은 후자가 더 좋음.

![comparing_collision_managers](https://python.cocos2d.org/doc/_images/comparing_collision_managers.png)

#### 원과 직사각형 충돌 처리

충돌을 처리하려면 사실 물체의 생김새를 단순화 해야 함. x, y axis에 각 변이 평행한 직사각형으로 퉁치든, 원으로 퉁치든. 결국에 둘 다 공통적으로 갖는 변수는 `.cshape`.

##### `cocos.collision_model.CircleShape`
* 원형
* 중심 좌표와 반지름 정보
* 두 중심 좌표 간의 유클리드 거리 < 두 반지름의 합 => 충돌 발생!!

##### `cocos.collision_model.AARectShape`
* 직사각형
* 축 정렬
* 맨해튼 거리

AABB: Axis-Aligned Bounding Box. 모든 물체의 충돌을 직사각형으로 처리하겠다는 의미.

### 액션

액션이란 `CocosNode` 개체에게 주어지는 명령.

주로 개체의 속성에 영향을 줌. 위치 변환, 회전 변환, 스케일링 등.

세 가지로 구분:
* `InstantAction`: 한 스텝에 변환이 이루어짐
* `IntervalAction`: 주어진 시간만큼 변화가 적용이 됨. `MoveBy` 등.
* `Action`: 지속적으로 변화가 적용이 되지만, 따로 기간이 초기화 당시에 주어지는 건 아님. 평생 갈 수도 있음.

#### `InstantAction`

시간이 따로 걸리지 않는 액션. 예를 들어 `Hide()`로 개체를 안보이게 만들어줄 수 있음.

#### `IntervalAction`

제일 재미있는 부분. 어떤 변환을 한정된 시간만큼 적용. 예를 들어 `MoveBy(얼만큼, 언제동안)`.

### 메뉴

* `MenuItem(label, callback, *args, **kwargs)`
    * 라벨이 있는 메뉴 아이템
* `EntryMenuItem(label, callback, value, max_value=0)`
    * 값을 입력해줄 수 있는 메뉴 아이템
    * 너 이름이 뭐니?
* `ToggleMenuItem(label, callback, value=False)`
    * 불리언 값으로 세팅할 수 있는 옵션
    ```python
    items.append( ToggleMenuItem('Show FPS:', self.on_show_fps, director.show_FPS) )
    ```
* `MultipleMenuItem(label, callback, items, default_item=0)`
    * 여러 값 중 고를 수 있게 해주는 것
    ```python
    self.volumes = ['Mute','10','20','30','40','50','60','70','80','90','100']

    items.append( MultipleMenuItem(
                'SFX volume: ',
                self.on_sfx_volume,
                self.volumes,
                8 ) )
    ```
* `ImageMenuItem(label, callback, *args, **kwargs)`
    * 선택할 수 있는 이미지가 있는 메뉴 아이템
    * 크아에서 맵 고르기 등
* `ColorMenuItem(label, callback, items, default_item=0)`
    * 색 선택할 수 있는 메뉴 아이템
    * 커마

### 사운드

cocos는 사운드 출력 못 함. 그래서 `pygame`에 있는 기능 갖다 써야 함.

```python
import cocos.audio
import cocos.audio.pygame
import cocos.audio.pygame.mixer
```

이런 식으로 `pygame` 기능 갖다 써야 함.

```python
pygame.mixer.music.load("background.wav")

# play the music indefinitely
pygame.mixer.music.play(-1)

pygame.mixer.music.stop()
```

## 미니맥스

### 알파베타 가지치기

## seek

## pursuit

## wander

## 장애물 피하기

## 3차원

### Model, View, Projection``

### `glMatrixMode()`

### `gluLookAt(어디서, 어디를, 어디가 위쪽 방향인지)`

