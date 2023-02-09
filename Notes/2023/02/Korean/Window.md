# 창 띄우는 법 (2023.02.09)
[Home](/README.md)

화가가 그림을 그리기 위해서는 캔버스가 필요하듯이, 게임 개발자들도 멋있는 그래픽을 사용자들에게 보여주려면 우선 창을 띄워야 한다.

# Windows

Windows 운영체제는 한국인들에게 워낙 친숙하다보니 창이라고 하면 무엇을 의미하는지 다 알 것이다. 브라우저를 실행하면 나오는 것도 창, 뭔가 하다가 "정말로 ~하시겠습니까?"하고 조그맣게 뜨는 창도, 창.

Windows에서는 이 창을 다룰 수 있게 개발자들에게 방법을 제공한다. 개체지향적으로 생각해보면 뭔가 `Window` 클래스 같은 걸 주나?라고 생각할 수 있겠지만, 그건 아니고, 비슷하게 "핸들"이라는 것을 제공한다. 그냥 지정 번호 같은 건데, 포인터랑도 비슷하다고 볼 수 있다.

그래서 창은 어떻게 띄우는 걸까?

## Win32

일단 Windows 환경에서 Win32 API로 어플리케이션을 만든다고 해보자. 그렇다면 다음의 과정을 거쳐야한다:

1. 창 클래스 생성
2. 창 클래스 등록
3. 창 생성
4. 창 띄우기

### 1. 창 클래스 생성

생각해보면 프로그램마다 창이 다 다르게 생긴 것을 알 수 있다. 창에 뜨는 이름도 다르고, 아이콘도 다르고, 메뉴바 구성도 다르고, X 버튼이 있을 수도, 없을 수도, 최소화 최대화 버튼이 있을 수도, 없을 수도 있는 형태다.

이렇듯이 우선 우리가 창을 띄우기 전에 해야하는 것은 무슨 창을 띄울지에 대한 결정이다. 이러한 결정 사항들은 `WNDCLASS` 개체에 저장해주면 된다.

```cpp
typedef struct tagWNDCLASSA {
    UINT      style;
    WNDPROC   lpfnWndProc;
    int       cbClsExtra;
    int       cbWndExtra;
    HINSTANCE hInstance;
    HICON     hIcon;
    HCURSOR   hCursor;
    HBRUSH    hbrBackground;
    LPCSTR    lpszMenuName;
    LPCSTR    lpszClassName;
} WNDCLASSA, *PWNDCLASSA, *NPWNDCLASSA, *LPWNDCLASSA;
```

[마소 공홈 참고](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassa)

하나씩 보도록 하자:

#### `UINT style`

말 그대로 스타일이다. 창에 그림자 효과(`CS_DROPSHADOW`)를 줄 수도, 종료 버튼을 비활성화(`CS_NOCLOSE`) 시킬 수도, 더블 클릭을 가능하게(`CS_DBLCLKS`) 해줄 수도 있다.

여기서 오해하면 안되는게, 스타일이라는게 뭐 옷 입는 것처럼 코디하는 그런게 아니라, 어떤 유형의 창을 만들 것이느냐에 대한 것이다.

[마소 공홈 참고](https://learn.microsoft.com/en-us/windows/win32/winmsg/window-class-styles)

#### `WNDPROC lpfnWndProc`

앞에 `lpfn`는 그냥 이 변수가 어떤 자료형인지 알려주는 거다. `l`이 있으니 long, `p`가 있으니 포인터, `fn`이 있으니 함수라는 뜻이다.

즉, long 포인터형의 함수 포인터라는 뜻이다.

여기에 포인터로 전달할 함수는 바로 창 프로시저procedure 콜백 함수이다. 사용자가 창이랑 뭔가 상호작용을 할텐데, 그 상호작용이 있을 때마다 이러한 상호작용이 있었다고 개발자에게 알려주는 수단이다.

예를 들어 사용자가 창을 종료하거나, 창을 최대/최소화를 하거나, 어떤 지점에서 마우스를 움직이거나 왼쪽 클릭을 하는 등 모든 상호작용에 대하여 이 콜백 함수가 실행되게 된다.

만약 우리가 사용자가 마우스를 좌클릭했을 때 어떤 효과음을 실행시키게 하고 싶다면 콜백 함수에서 들어온 상호작용 정보가 마우스 좌클릭인지 확인하고, 만약 그렇다면 효과음을 실행하게 코드를 짜면 된다.

```cpp
WNDPROC Wndproc;

LRESULT Wndproc(
  HWND unnamedParam1,
  UINT unnamedParam2,
  WPARAM unnamedParam3,
  LPARAM unnamedParam4
)
{...}
```

함수는 위와 같은 형태를 띠며, 각각 요소는 다음과 같다:

##### `HWND unnamedParam1`

우리가 상호작용을 할 창에 대한 핸들handle이다. 위에서 언급했듯이, Win32에서 창을 다룰 수 있게 하기 위해 핸들이라는 것을 제공한다고 했었다. 바로 그걸 얘기하는 것이다.

콜백 함수를 현재로써는 함수 포인터로 넘겨주고 있으니, 전역 함수로 줄 수 밖에 없으니까 지금 이 콜백 함수가 어떤 창에서의 정보를 갖고 오는 지를 모르기 때문에 따로 매개변수로 핸들 정보를 넘겨주는 것이다.

만약 우리의 프로그램이 3D 에디터 프로그램이어서 동시에 여러 창을 띄울 수 있게 했다고 해보자. 사용자가 만약 3D 모델 뷰어 창을 동시에 두 개를 띄웠다고 가정하자. 서로 창이 독립적일 뿐이지 상호작용하는 방법은 같아야 한다. 즉, 핸들이 서로 다르더라도 같은 창 프로시저를 사용할 것이다. 이런 경우에 구분을 줄 수 있게 하기 위해 `HWND` 변수를 넘겨주는 것이다.

그래서 보통 매개변수명을 `hWnd`라고들 많이 쓴다. 앞에 `h`는 핸들이라고 붙여준 것이다.

##### `UINT unnamedParam2`

이게 위에서 얘기한 상호작용 정보로 들어오는 것이다. 보통 이걸 메세지라고 부르는데, 그래서 `uMsg`라고 부르는 편이다. 앞에 `u`는 `unsigned int` 형이라고 해서 붙여준거다.

[시스템 메세지](https://learn.microsoft.com/en-us/windows/win32/winmsg/about-messages-and-message-queues#system-defined-messages)

흔히 우리가 처리할 메세지들은 창에서 온 메세지, 즉 Window Message로 `WM`으로 시작하는 친구들이다.

예를 들어 만약 창이 생성되는 중이라면 `WM_CREATE` 메세지가 올 것이고, 창 크기가 바뀌었다면 `WM_SIZE` 메세지가 올 것이다.

##### `WPARAM unnamedParam3`, `LPARAM unnamedParam4`

위에서처럼 창의 크기가 바뀌었다는 정보가 오게 되면 그래서 어떤 크기로 바뀌었는지를 알려줄 수단이 필요하다.

마우스를 움직였으면 어디로 움직인 건지, 좌클릭을 했다면 어느 좌표를 좌클릭한건지, 스크롤을 했다면 얼마나 스크롤을 한 건지 등등...

이러한 추가적인 정보들은 필요한 만큼 이 두 매개변수로 들어오게 된다. 이러한 정보가 필요 없다면 들어오지 않을 것이다.

즉, 메세지의 종류에 따라 쓸 수도, 안 쓸 수도 있다.

##### `LRESULT` 반환

이건 처리 결과를 얘기하는 건데, 이것도 메세지의 종류에 따라 달라진다. 보통은 개발자가 정상적으로 처리를 해준 뒤 0을 넘겨주거나, 내가 지금 딱히 처리할 메세지가 아닌 경우 기본 설정으로 처리할 수 있도록 `DefWindowProcA` 함수를 호출하고 리턴해줄 수도 있다.

```cpp
LRESULT DefWindowProcA(
    [in] HWND   hWnd,
    [in] UINT   Msg,
    [in] WPARAM wParam,
    [in] LPARAM lParam
);
```

창으로 넘어오는 메세지가 워낙 많기 때문에 처리할 얘들만 따로 `switch (uMsg)` 문으로 처리하고, 나머지는 그냥 `return DefWindowProcA(hWnd, uMsg, wParam, lParam)` 처리하는 게 속 편하긴 하다.

#### `int cbClsExtra`, `int cbWndExtra`

우리가 `WNDCLASSA` 구조체가 있긴 하지만, 여기 뒤에 뭔가 정보를 더 넣어서 주고 싶을 때도 있다. 예를 들어 뒤에 따로 개발자의 이름을 추가 한다던가 말이다. 이렇게 되면 기존 구조체에 크기에 더해서 문자열을 가리키는 포인터의 크기만큼 추가가 될 것이다. 여기서 추가된 바이트 수를 `cbClsExtra`로 넘겨 줘야 한다.

위에서 개발자의 이름을 추가적으로 넣어주었다고 했었다. 그럼 구조체 자체의 크기랑 별개로, 구조체로 생성한 실제 창 개체의 크기도 달라졌을 것이다. 그만큼 또 `cbWndExtra`로 넘겨 줘야 한다.

근데 사실 이거 특수한 경우 아니면 거의 안 쓰니까 둘 다 0으로 주고 무시하고 넘어가면 된다.