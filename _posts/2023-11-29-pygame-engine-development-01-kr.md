---
layout: post
title:  Pygame 엔진 개발 일지 01
date:   2023-11-29 00:00:00 +0000
categories: engine korean
---

# 데이터 기반 설계 정리

출처: Game Programmging Gems. 1.0 The Magic of Data-Driven Design. Steve Rabin.

게임은 결국 *로직logic*과 *데이터data* 두 가지로 나눠서 볼 수 있다. 롤이라는 게임에서 q를 누르면 스킬이 나가는 것은 로직이고, 어떤 챔피언이 어떤 q 스킬이 존재하는 지에 대한 정보는 데이터이다. qwer이라는 로직에 챔피언이라는 데이터만 달리 넣으면 200 가지가 넘는 챔피언 탄생인 것이다!! 이런 것처럼 기본적인 로직을 코드로 짜놓고, 데이터가 기록된 파일을 읽어와 게임을 실행하는 설계를 데이터 기반 설계라고 할 수 있다.

## 아이디어 1. 기초

기본적으로 데이터를 필요할 때 읽어올 수 있는 기능이 필요하다. 물론 binary 형태의 데이터를 읽는 기능도 중요하겠지만 개발 편의성 측면에서는 가장 단순한 텍스트 파일을 읽는 기능이라도 들어 가야 한다. 나중에 간단하게 테스트를 할 때 코드를 고치는 것이 아니라 텍스트 파일만 고치더라도 다르게 동작하면 그보다 편한 것은 없을 것이다.

## 아이디어 2. 최소 조건

상수 같은 것도 텍스트 파일 같은 곳에 저장하면 코드 다시 컴파일할 필요 없이 상수를 바꿀 수 있을 것이다. 물론 파이썬의 경우 interpreter 언어라서 이러한 장점은 딱히 없는 듯 하다. 그거보다는 차라리 게임 디자이너나 아티스트 같은 비프로그래머들이 손쉽게 상수를 수정해서 게임 개발 편의성을 제공한다는 측면이 있다고 볼 수 있다.

## 아이디어 3. 하드 코딩 멈춰!

모든 것은 변할 수 있다는 가정을 두어야 한다. 시점이 달라질 수도 있고, 카메라 로직도 달라질 수도 있고 등등... 이렇듯 핵심적인 설계부터가 유연하게 설계되어 있으면 게임 디자이너 입장에서는 여러 가지를 할 수 있으니 매우 편하다.

모든 게임들은 개발 단계에서 변하기 마련이다. 그렇기에 유연성이 없으면 매번 로직 수정을 할 때마다 시간이 많이 들어간다.

## 아이디어 4. 제어 흐름을 스크립트화 하라!

*스크립트script*는 단순히 코드 밖에서 어떤 행동을 정의하는 한 수단일 뿐이다. 스크립트는 게임에서 뭔가 이벤트 등에 의해 순서대로 발생해야 할 일들을 정의할 때 유용하다. 컷씬 같은 것 말이다. 간단한 콜백 같은 것도 스크립트화할 수 있다.

물론 파이썬 게임 엔진 개발하는 입장에서 이미 파이썬 자체가 단순한 스크립트의 형태를 지니고 있다고 생각하고, 오히려 코딩을 모르는 게임 디자이너들 입장에서는 Blueprint와 같은 visual scripting이 더 의미가 있지 않나 싶긴 하다.

## 아이디어 5. 좋은 스크립트가 상하는 순간

## 아이디어 6. 중복 데이터 증상 막는 법

기본적으로 프로그래밍에서 중복 코드는 안 좋은 코드다. 이런 코드를 막기 위해서 상속과 같은 개념이 등장한 것이다. 예를 들어 고블린이라는 데이터가 있고, 던전에 이 고블린이 배치되어있는 것을 던전 데이터에 기록을 해보자. 각 고블린마다 던전에 고블린 데이터를 기록하는 것이 아니라 하나의 전역 공간에 고블린의 공통 속성, 기본값(고블린이라는 몬스터 이름, 공격력 등) 등을 정의해두고, 던전에는 단순히 이 전역적으로 정의한 고블린에 대한 참조와 각 고블린마다 필요한 값(던전에서의 고블린의 위치 등)을 기록해두는 것이다.

## 아이디어 7. 데이터 생성 툴을 만들어라!

당연히 게임이 커질 수록 단순한 텍스트 파일은 여러모로 관리하기가 힘들어질 것이다. 파일 작성 규칙 등을 안 지켰을 때 발생할 문제, 파일 크기 등의 문제 말이다!! 게임 에디터에서 이러한 값을 수정할 수 있도록 해야 한다.

## 결론

토탈 어나이얼레이션에서도 이 설계를 적용했었고, 이 덕분에 주 간격으로 게임 컨텐츠 업데이트가 가능했다고 한다.

# 실제 개발

현재 개발 중인 엔진에서는 우선 채택한 방법은

1. 디자이너 및 개발자가 수정 / 디버깅이 쉽도록 기본적으로는 json의 형식을 따르도록 한다
2. 추후 배포나 성능을 위해서는 해당 형식을 binary로 저장/로딩하는 기능을 추가한다

이때 json 형식을 따르도록 할 때 현재로서는 에디터에서는 text 파일을 직접 에디팅하듯이 할 수 있도록 구현을 해둔 상태이다. 나중에 reflection 시스템 등이 제대로 정착되면 UI에 제대로 바인딩을 하도록 수정해야할 것이다.

## 설계 예시

```python
# resource.py
"""Resource module"""
from __future__ import annotations
import abc

from core.parser import save_dict_to_json

class IResource(abc.ABC):
    """Resource interface
    """
    def __init__(self: IResource, filename: str) -> None:
        self.__filename: str = filename

    @property
    def filename(self: IResource) -> str:
        """Returns the file name of the resource

        Returns:
            str: file name
        """
        return self.__filename

    @abc.abstractmethod
    def load(self: IResource, data: dict):
        """Load the resource from the file name
        """

    def save(self: IResource) -> dict:
        """Save the resource data into xml data

        Returns:
            dict: xml data
        """
        resource_dict: dict = {}
        resource_dict = self._save_inner(data=resource_dict)
        save_dict_to_json(json_filename=self.__filename, data=resource_dict)
        return resource_dict

    @abc.abstractmethod
    def _save_inner(self: IResource, data: dict) -> dict:
        pass
```

위에처럼 기본적으로 Data-Driven을 적용할 클래스는 `IResource`를 상속 받도록 한다.

상속 예시:

```python
from __future__ import annotations

import pygame
from core.assertions import assert_condition
from core.global_constants import GlobalConstants

from core.parser import parse_json_to_dict
from resources.resource import IResource

class Character(IResource):
    NAME_KEY: str = "name"
    CHARACTERISTIC_KEY: str = "characteristic"
    PLANET_NAME_KEY: str = "planet_name"
    SPRITE_FILENAME_KEY: str = "sprite_filename"

    def __init__(self: Character, character_filename: str) -> None:
        super().__init__(filename=character_filename)
        self.__name: str
        self.__characteristic: str
        self.__planet_name: str
        self.__sprite_filename: str
        self.__sprite: pygame.Surface
        self.load(data=parse_json_to_dict(json_filename=self.filename))

    @property
    def characteristic(self: Character) -> str:
        return self.__characteristic

    @property
    def name(self: Character) -> str:
        return self.__name

    @property
    def planet_name(self: Character) -> str:
        return self.__planet_name

    @property
    def sprite(self: Character) -> pygame.Surface:
        return self.__sprite

    def load(self: Character, data: dict) -> None:
        self.__name = data.get(Character.NAME_KEY)
        assert_condition(condition=self.__name is not None,
                         message="Character data must have a name!!")
        self.__characteristic: str = data.get(Character.CHARACTERISTIC_KEY)
        assert_condition(condition=self.__characteristic is not None,
                         message="Character data must have a characteristic!!")
        self.__planet_name: str = data.get(Character.PLANET_NAME_KEY)
        assert_condition(condition=self.__planet_name is not None,
                         message="Character data must have a name!!")
        self.__sprite_filename: str = data.get(Character.SPRITE_FILENAME_KEY)
        assert_condition(condition=self.__sprite_filename is not None,
                         message="Character data must have a sprite filename!!")
        game_path: str = GlobalConstants.get_constant_or_none(key="game_path")
        self.__sprite: pygame.Surface = \
            pygame.image.load(f"{game_path}/{self.__sprite_filename}").convert_alpha()

    def _save_inner(self: Character, data: dict) -> dict:
        data[Character.NAME_KEY] = self.__name
        data[Character.CHARACTERISTIC_KEY] = self.__characteristic
        data[Character.PLANET_NAME_KEY] = self.__planet_name
        data[Character.SPRITE_FILENAME_KEY] = self.__sprite_filename

        return data
```

위의 코드로 생성/로딩하는 json은 다음과 같다:

```json
{
    "name": "Aberdeen Johnson",
    "characteristic": "friendly",
    "planet_name": "eusebio",
    "sprite_filename": "sprites/alien_blue/blue__0000_idle_1.png"
}
```
