---
layout: post
title:  Pygame 엔진 개발 일지 02: Assert 대탐험
date:   2023-11-29 00:00:00 +0000
categories: engine korean
---

출처: Game Programmging Gems. 1.12 Squeezing More Out of Assert. Steve Rabin.

아직까지 python의 기본 `assert`만 쓰고 있었다면 인생 절반 손해본 것이나 다름 없다. 기본 `assert`는 물론 유용한 기능이지만, 여기에 이 기능 저 기능 추가하면 좀 더 유용하게 디버깅을 할 수 있게 된다. 이번 개발 일지에서는 좀 더 유용한 `assert`문을 구현해보도록 하자.

## Assert문 기초

그냥 프로그래머라면 `assert`가 알파요 오메가여야 한다. 프로그램을 출시하기 전에 여기저기 검증 코드를 덕지 덕지 붙임으로써 방어적으로 프로그래밍을 해줘야 오류가 발생하면 그때 그때 검출하여 고칠 수 있게 된다. 당연히 오남용해서는 안되겠지만, 그래도 웬만하면 최대한 많은 곳에 `asert`문을 넣는 것이 베스트 프랙티스다.

기본적으로 `assert`문은 검증 용도이기 때문에 출시 버전에는 포함되지 않는 것이 기본이다. 즉, `assert`문이 로직에 영향을 줘서는 안되는 것이다.

예시:

```python
import dataclasses

@dataclasses.dataclass
class Vector3f:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

def normalize_vector3f(src: Vector3f) -> Vector3f:
    assert isinstance(src, Vector3f)    # 입력 변수 자료형 검증
    assert src is not None  # 입력 변수값 검증

    length: float = sqrt((src.x * src.x) + (src.y * src.y) + (src.z * src.z))

    assert length != 0.0    # 분모가 0인 경우 검출

    dst: Vector3f = Vector3f(x=src.x / length, y=src.y / length, z=src.z / length)
    return dst
```

## Assert문 업그레이드하기 1: 정보 추가해주기

```python
import dataclasses

@dataclasses.dataclass
class Vector3f:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

def normalize_vector3f(src: Vector3f) -> Vector3f:
    assert isinstance(src, Vector3f), "input argument type is not Vector3f!!"
    assert src is not None, "input argument is None!!"

    length: float = sqrt((src.x * src.x) + (src.y * src.y) + (src.z * src.z))

    assert length != 0.0, "length of the source vector is 0!!"

    dst: Vector3f = Vector3f(x=src.x / length, y=src.y / length, z=src.z / length)
    return dst
```

`assert`문에 쉼표로 뒤에 디버깅용 정보를 추가해줄 수 있다.

## Assert문 업그레이드하기 2: 정보 더 추가해주기

만약 코드에서 이 줄에 절대 와서는 안 되는 경우가 있다면, 그냥 디버깅 메시지 앞에 부정문을 붙여주면 된다:

```python
assert not "Code should never get here!!"
```

## Assert문 업그레이드하기 3: 가독성 향상하기

```python
def my_assert(condition: bool, message: str) -> None:
    assert condition, message

...
my_assert(condition=src is not None,
            message="input argument is None!!")
my_assert(condition=False,
            message="Code should never get here!!")
...
```

## Assert문 업그레이드하기 4: Assert문 무시 가능하도록 하기

```python
IGNORE_ASSERT: bool = False

def my_assert(condition: bool, message: str) -> None:
    if IGNORE_ASSERT is False:
        assert condition, message

...
my_assert(condition=src is not None,
            message="input argument is None!!")
my_assert(condition=False,
            message="Code should never get here!!")
...
```

## Assert문 업그레이드하기 5: Debugger 없이도 작동하게 만들기

`assert`에서 걸릴 때 int 3가 발생하는 것은 debugger가 attach 되어있을 때 가능한 것이다. debugger가 없을 때도 assert에 걸리게 만들고 싶다면 별도의 window 창 같은 걸 띄워서 assert가 걸렸음을 알리고, main thread에서 이 창을 대기하게 만들면 된다.

```python
import multiprocessing

import tkinter as tk
from tkinter import ttk
import traceback

IGNORE_ASSERT: bool = False

class AssertWindow:
    INSTANCE: AssertWindow = None

    @staticmethod
    def start(message: str, stacktrace: str, pipeline: multiprocessing.Pipe) -> None:
        AssertWindow(message=message, stacktrace=stacktrace, pipeline=pipeline)
        print("hi")

    def __init__(self: AssertWindow, message: str, stacktrace: str, pipeline: multiprocessing.Pipe) -> None:
        AssertWindow.INSTANCE = self
        self.__message: str = message
        self.__pipeline: multiprocessing.Pipe = pipeline

        self.__assert_window: tk.Tk = tk.Tk()
        # self.__assert_window.geometry(newGeometry="700x400")

        self.__assert_message_frame: ttk.LabelFrame = \
            ttk.LabelFrame(master=self.__assert_window,
                           text="Assert Message")
        self.__assert_message_frame.pack()
        self.__assert_message: ttk.Label = \
            ttk.Label(master=self.__assert_message_frame,
                      text=self.__message)
        self.__assert_message.pack()

        self.__stacktrace_frame: ttk.LabelFrame = \
            ttk.LabelFrame(master=self.__assert_window,
                           text="Stack Trace")
        self.__stacktrace_frame.pack()

        self.__stacktrace_label: ttk.Label = \
            ttk.Label(master=self.__stacktrace_frame,
                      text=stacktrace)
        self.__stacktrace_label.pack()

        self.__assert_continue: ttk.Button = ttk.Button(master=self.__assert_window,
                                                        text="Ignore Once",
                                                        command=AssertWindow.on_continue)

        self.__assert_stop: ttk.Button = ttk.Button(master=self.__assert_window,
                                                    text="Stop",
                                                    command=AssertWindow.on_stop)
        self.__assert_continue.pack()
        self.__assert_stop.pack()
        self.__assert_window.mainloop()

    @staticmethod
    def on_continue() -> None:
        AssertWindow.INSTANCE.__pipeline.send("is_continue")
        AssertWindow.INSTANCE.__assert_window.quit()

    @staticmethod
    def on_stop() -> None:
        AssertWindow.INSTANCE.__pipeline.send("is_stop")
        AssertWindow.INSTANCE.__assert_window.quit()

def my_assert(condition: bool, message: str) -> None:
    if IGNORE_ASSERT is False:
        if condition is False:
            parent_pipeline, child_pipeline = multiprocessing.Pipe()

            stacktrace: str = ""
            for line in traceback.format_stack():
                stacktrace += line.strip() + "\n"
            assert_window_process: multiprocessing.Process = \
                multiprocessing.Process(target=AssertWindow.start,
                                        name="Assert Window",
                                        args=(log_message, stacktrace, child_pipeline)
                )
            assert_window_process.start()
            message: str = parent_pipeline.recv()
            assert_window_process.join()

            if message == "is_stop":
                breakpoint()

...
my_assert(condition=src is not None,
            message="input argument is None!!")
my_assert(condition=False,
            message="Code should never get here!!")
...
```

여기에 stack 정보까지 추가해주면 된다.

## Assert문 업그레이드하기 6: Assert 메시지 복붙 가능하도록 하기

이거는 `pyperclip` 모듈을 사용해주면 편하다. 버튼을 하나 더 추가하면 된다:

```python
...
        self.__buttons_frame: ttk.Frame = \
            ttk.Frame(master=self.__assert_window)
        self.__buttons_frame.pack()

        self.__assert_copy_to_clipboard: ttk.Button = ttk.Button(master=self.__buttons_frame,
                                                        text="Copy Message to Clipboard",
                                                        command=AssertWindow.on_copy_to_clipboard)
        self.__assert_continue: ttk.Button = ttk.Button(master=self.__buttons_frame,
                                                        text="Ignore Once",
                                                        command=AssertWindow.on_continue)

        self.__assert_stop: ttk.Button = ttk.Button(master=self.__buttons_frame,
                                                    text="Stop",
                                                    command=AssertWindow.on_stop)
        self.__assert_copy_to_clipboard.pack(side=tk.LEFT)
        self.__assert_continue.pack(side=tk.LEFT)
        self.__assert_stop.pack(side=tk.LEFT)
...
    @staticmethod
    def on_copy_to_clipboard():
        pyperclip.copy(text=AssertWindow.INSTANCE.__message)
```