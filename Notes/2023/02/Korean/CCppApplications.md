# C/C++ 어플리케이션 (2023.02.08)
[Home](/README.md)

어플리케이션이라는 뭔가 실행할 수 있는 프로그램이라고 생각하면 된다.

유튜브 보려고 켜는 브라우저나 모바일 유튜브 어플리케이션.
게임할 때 실행하는 롤 클라이언트, 스팀.

전부 다 어플리케이션이라고 생각하면 된다.

그렇다면 직접 어플리케이션을 개발한다고 하면, 어떻게 개발할 수 있을까?

뭔가 C/C++로 콘솔창 띄워가면서 뭔가 뭔가 텍스트 띄우기는 해봤는데 진짜 본격적인 어플리케이션은 도대체 어떻게 만들 수 있는 걸까?

# Windows

Windows에서 C/C++ 기반으로 데스크탑 어플리케이션을 만드는 방법은 다음과 같은 방법이 있다:

1. WinUI 3 어플리케이션
2. Win32 어플리케이션
3. UWP

기본적으로 1번은 C# 쪽이 좀 더 강하기 때문에 C/C++ 기반에는 적합하지 않다고 볼 수 있다. C/C++으로 할 수는 있지만, 아직 리소스가 많아 보이지는 않는다.

물론 한다면 할 수 있다. xaml의 형태로 UI를 정의하고, 여기에 코드를 연동하는 식인데, Android/웹 개발에서 자주 보이던 패턴이다.

3번의 경우 수많은 개발자들이 욕을 했던 방법이다. UWP의 경우 WinRT 기반으로 개발한 Windows 어플리케이션인데, Windows 10, 11을 기반으로 하여 다른 플랫폼(Xbox 등)을 개발하고자 할 때 적합하다고 본인들은 주장한다. 그러나 많은 개발자들한테 욕 얻어 먹고 지금은 Win32 쪽으로 돌아가려는 듯하다.

2번이 유명한 고전이자 지금까지도 수많은 개발자들이 사용하는 방법인 Win32이다. 따로 .NET이나 WinRT처럼 실시간에 관리해주는 환경 없이 돌 수 있는 방법으로, 매우 성능에 강점이 있다고 볼 수 있다. 게다가 하드웨어에 직접 접근할 수 있게 도와주기까지 하니 말이다.

즉, 현실적으로 게임을 개발한다고 가정을 한다면, Win32로 개발을 하는게 매우 자연스러운 선택이 될 것이다.

Win32로 게임 개발을 하게 된다면 자연스럽게 DirectX라는 API와 친숙해질 것인데, DirectX는 Win32 개발을 할 때 도움을 줄 수 있는 친구들이라고 생각하면 된다.

가장 대표적인 친구로는 그래픽스를 담당해주는 Direct3D가 있는데, 이 친구가 사실상 Windows 운영 체제에서 게임 엔진 개발을 한다고 할 때 가장 많이 다루게 될 그래픽스 API가 될 것이다.

당연하겠지만 그래픽스 뿐만 아니라 다른 부분에 도움을 주는 DirectX API도 존재한다. 수학에 도움을 주는 DirectXMath, 2D 그래픽스의 Direct2D, 텍스트 렌더링의 DirectWrite, 저장소 가속화의 DirectStorage, 오디오의 XAudio2, 입력의 XInput 등등...

DirectX 말고도 여러 다른 API가 있으나 게임 개발에 관련된 글이므로 DirectX에 중점을 더 두었다.

# MacOS

MacOS의 경우 따로 Win32 같은 API는 제공하지 않는 듯 하다. 만약 창을 띄우고 싶다면 `glfw`와 같은 외부 리소스를 사용해야할지도...

# Linux

MacOS와 마찬가지이다. 직접 창을 띄우려면 XSystem에 접근해야하는 등... 그냥 glfw 쓴다.

# Android

NDK를 활용하여 C++로 직접 개발을 할 수 있다. UNIX 계열이니깐...

# iOS

Swift에서 C/C++ 직접 호출할 수 있는 듯? 직접 해봐야 알 것 같다.

# 개발 환경

당연하겠지만 웬만하면 자신이 개발할 환경에서 개발을 하는 것이 좋다. Windows에서 MacOS 개발을 하거나 그러면 생각보다 불편할지도.

물론 Visual Studio의 강력한 기능을 사용하기 위해 일부러 Windows에서 MacOS 개발을 하려는 사람들도 있다. WSL 등의 발전으로 Linux 개발도 편해지고 있고... GDK를 활용한 Android 개발도 Visual Studio에서 가능하고...

C/C++ 개발자의 Visual Studio 사랑은 어쩔 수가 없어서 이런 상황이 나오는...