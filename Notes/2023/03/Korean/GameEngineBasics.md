# 게임 엔진 기초 (2023.03.15)
[Home](/)

경희대학교 소프트웨어융합학과의 2학년 과목 게임 엔진 기초의 온라인 사이트입니다.

# 1. 개요

## 1.1. 대상자

* 필수 지식
    * C++ 프로그래밍이 가능한 학생 (객체지향프로그래밍 교과목 수강자)
    * 개체지향 개념을 이해하는 학생 (객체지향프로그래밍 교과목 수강자)
* 도움이 되는 지식
    * 자료구조에 대한 지식이 있는 학생 (자료구조 교과목 수강자)
    * 컴퓨터 하드웨어와 운영체제에 대한 지식이 있는 학생 (컴퓨터구조/운영체제 교과목 수강자)

## 1.2. 목적

게임 개발이라는 것은 그래픽스, 오디오, 하드웨어 입출력 제어, 네트워크, 인공지능 등의 여러 가지 분야를 하나의 어플리케이션으로 합치는 작업이라고 할 수 있습니다. 이때 개인이 모든 분야를 총괄하여 바닥부터 시작하기란 사실상 불가능에 가깝다고 할 수 있습니다. 개인 뿐만 게임 개발 스튜디오에서도 규모와 무관하게 언제나 이러한 모든 사항을 직접 개발하는 것은 경제적, 시간적 비용을 초래하게 됩니다. 그렇기에 게임 개발을 할 때 기반 기술에 집중하기 보다 실제 게임 자체에 집중할 수 있도록 탄생한 것이 바로 게임 엔진이라고 할 수 있습니다.

이 수업을 수강한 학생은 Unreal Engine이나 Godot Engine과 같은 게임 엔진의 구조를 이해하고, 코드를 읽을 수 있게 됩니다.

**주의사항**

* 이 수업에서는 렌더링 이외의 내용을 다룹니다!!
    * 실시간 렌더링과 관련된 개념은 3학년 1학기 게임그래픽프로그래밍 교과목에서 다룹니다. 이 수업에서 다루는 렌더링 관련 내용은 구조와 관련된 부분들입니다.
* 권장하는 환경:
    * OS: Windows 10 이상
    * CPU: Intel 옥타코어 이상
    * GPU: NVIDIA (외장 그래픽 카드)
    * RAM: 16 GB 이상
    * IDE: Visual Studio 2022
* 만약 리눅스나 MacOS와 같은 타 OS나, AMD CPU/GPU와 Intel GPU와 같은 타 하드웨어 등을 사용하는 학생의 경우에는 조교진의 지원을 받기가 어려울 수도 있습니다.

## 1.3. 수업 진행 방식

매주 두 번의 강의가 있으며, 하루는 이론 수업, 나머지 하루는 실습 수업을 진행합니다.

이론 수업에서는 주어진 PDF 자료를 바탕으로 수업을 진행하며, 수업 자료는 **전부 영어로 되어있으니** 참고 바랍니다.

이론 수업의 평가는 **기말고사로만 진행**하며, 문제는 전부 **영어로 출제**가 됩니다.

실습 수업에서는 수업에서 제공하는 기본적인 게임 엔진을 바탕으로 조교가 수업을 진행합니다. 이 수업은 각 하드웨어나 운영체제에 대한 세부적인 내용은 최대한 피하려고 하나, 대부분의 하드웨어/운영체제/컴파일러에서 공통적으로 제공하는 개념들은 실습에서 가르치도록 합니다.

**매주 실습 과제**가 있으나, 수업 시간에 배운 내용 그대로 제출하기에 실습 시간에는 실습을 잘 따라오시면 됩니다.

이 수업에서는 4인 이상이서 프로젝트를 진행하게 됩니다. 프로젝트의 주제나 내용은 게임 엔진이라는 큰 틀에서 자유롭게 정하여 진행합니다. 주제를 정하기 어려운 학생들을 위하여 추천 주제들을 제공하오니, 참고하시면 됩니다. 당연히 인원 수는 평가할 때 고려합니다.

프로젝트의 의의는

1. C++ 프로그래밍에 익숙해짐
2. 협업 개발 환경에 익숙해짐

입니다. 그러므로 프로젝트가 잘 안 되어 실패하더라도, 의의와 평가 기준을 바탕으로 평가를 할 것이오니 큰 걱정 마시고 하고 싶은 주제를 고르시는 것을 추천합니다.

프로젝트의 경우 몇 가지 규칙이 있습니다:

1. 반드시 **실시간**이어야 할 것
2. **상호작용**이 가능해야 할 것 (실습 시간에 다룹니다)
3. 재미 요소보다는 기술적 요소에 집중할 것 (화려한 모델을 사용하는 것보다는 기술에 좀 더 집중)
4. 수업에서 다룬 주제 하나를 선택하여 발전시킬 것 (수업에서는 간단한 개념을 공부하기에, 이보다 발전된 기술은 금방 찾아서 구현할 수 있음)

프로젝트 평가 기준입니다:

1. 성능 
2. 품질
3. 실무성
4. 독창성

네 가지를 전부 종합적으로 평가하기 때문에 가령 실패했다 하더라도 다른 평가 기준에서 좋은 점수를 받아 전체적으로 좋은 점수를 받을 수 있습니다. 단, 최종 발표는 반드시 **실행이 가능한 데모**인 상태여야 합니다. 본인의 게임의 테크 데모를 실제로 공개한다는 생각으로 가장 멋있게 보여주세요.

프로젝트로 추천하는 몇 가지 주제입니다:

1. Memory Pool
2. Resource Manager
3. Resource Compression/Decompression

## 강의 목록

|주차|이론|내용|실습|내용|
|----|----|---|---|----|
|1|Introduction to Game Engine|게임 엔진의 개념, 일반적인 구조|Development Tools and C/C++ Recap|IDE, Git, 프로파일링, 메모리 누수 검출 등의 도구 및 C/C++ 복습|
|2|Basics of Computer Hardware and Memory Architecture|컴퓨터 구조와 메모리 구조의 기초|C/C++ Recap|C/C++ 복습|
|3|Engine Subsystem I|엔진 초기화 및 종료, 메모리 관리|Memory Pool|메모리 풀의 구현|
|4|Engine Subsystem II|자료구조와 문자열, 엔진 설정 기능|Containters|자료구조 구현|
|5|Resources and the File System|파일 시스템 및 자원 관리|File I/O|파일 입출력 구현|
|6|The Game Loop|게임 루프|Win32 Game Loop|Win32에서의 게임 루프 구현|
|7|HID|게임의 입출력|Input System|마우스, 키보드 입력 시스템 구현|
|8|Debugging|디버깅|Logger, Profiler, and Tracer|디버깅 툴 구현|
|9|Rendering: Overlays|UI, HUD, 메뉴, 폰트 렌더링 등|Menu System|imGui 사용 방법|
|10|Audio|오디오 이론 기초 및 오디오 엔진 구조|OpenAL|OpenAL 사용 방법|
|11|Introduction to Gameplay Systems|게임 플레이 입문|Game Editor|게임 에디터 구현|
|12|Runtime Gameplay Foundation Systems I|게임 플레이 시스템|Scene, Object System|게임 씬, 오브젝트 시스템 구현|
|13|Runtime Gameplay Foundation Systems II|게임 플레이 시스템|Task System|게임 태스크 시스템 구현|
|14|Final Project Check|최종 프로젝트 점검| | |

1. Introduction
   1. Abstraction of Systems
2. Core Systems
   1. The Low-Level System
      1. Basic Data Structures
      2. Encapsulating Platform-Specific Concepts
      3. Endianness
      4. System Time
      5. File Handling
      6. Memory Allocation and Deallocation
   2. The Mathematics System
      1. Basic Mathematics Functions
      2. Fast Functions
      3. Vectors
      4. Matrices
      5. Quaternions
      6. Lines and Planes
      7. Colors
   3. The Object System
      1. Run-Time Type Information
      2. Names and Unique Identifiers
      3. Sharing and Smart Pointers
      4. Controllers
      5. Streaming
      6. Cloning
      7. String Trees
      8. Initialization and Termination
3. Application
   1. Abstraction of the Application
      1. Processing Command Line Parameters
      2. The Application Class
      3. The ConsoleApplication Class
      4. The WindowApplication Class
      5. The WindowApplication3 Class
   2. Sample Applications
      1. Billboard Node Sample
      2. BspNode Sample
      3. CachedArray Sample
      4. Castle Sample
      5. ClodMesh Sample
      6. Collision Sample
      7. InverseKinematics Sample
      8. Portals Sample
      9. ScreenPolygon Sample
      10. SkinnedBiped Sample
      11. SortFaces Sample
      12. Terrain Sample
   3. Sample Tools

1. Introduction
   1. The Evolution of Graphics Hardware and Games
2. Object-Oriented Infrastructure
   1. Object-Oriented Software Construction
      1. Software Quality
      2. Modularity
      3. Reusability
      4. Functions and Data
      5. Object Orientation
   2. Style, Naming Conventions, and Namespaces
   3. Run-Time Type Information
      1. Single-Inheritance Systems
      2. Multiple-Inheritance Systems
      3. Macro Support
   4. Templates
   5. Shared Object and Reference Counting
   6. Streaming
      1. The Stream API
      2. The Object API
   7. Names and Unique Identifiers
      1. Name String
      2. Unique Identification
   8. Initialization and Termination
      1. Potential Problems
      2. A Generic Solution for Classes
   9. An Application Layer
      1.  Processing Command-Line Parameters
      2.  The Application Class
      3.  The ConsoleApplication Class
      4.  The WindowApplication Class
      5.  The WindowApplication3 Class
      6.  Managing the Engines
3.  Memory Management
    1.  Memory Budget for Game Consoles
    2.  Leak Detection and Collecting Statistics
    3.  General Memory Management Concepts
        1.  Allocation Using Sequential-Fit Methods
        2.  Allocation Using Buddy-System Methods
        3.  Allocation Using Segregated-Storage Methods
        4.  Memory Compaction

1. Algorithms & Data Structures
2. Mathematics
3. Computer Architecture
4. Graphics
5. Compilers & Formal Languages
6. Artificial Intelligence
7. Networks
8. UI & UX