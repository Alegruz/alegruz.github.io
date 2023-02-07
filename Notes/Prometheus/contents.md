1. What is Game Programming Really Like?
   1. The Good
      1. The Job
      2. The Gamers
      3. Your Coworkers
      4. The Tools - Software Development Kits (SDKs)
      5. The Hardware
      6. The Platforms
      7. The Show
   2. The Hard Work
      1. Game Programming Is Freaking Hard
      2. Bits and Pieces
      3. That's Not a Bug - That's a Feature
      4. The Tools
   3. The Dark Side
      1. Hitting a Moving Target
      2. Crunch Mode (and Crunch Meals)
      3. Bah Humbug
      4. Operating System Hell
      5. Fluid Nature of Employment
   4. It's All Worth It, Right?
2. What's in a Game?
   1. Game Architecture
   2. Applying the Game Architecture
   3. Application Layer
      1. Reading Input
      2. File Systems and Resource Caching
      3. Managing Memory
      4. Initialization, the Main Loop, and Shutdown
      5. Other Application Layer Code
   4. Game Logic
      1. Game State and Data Structures
      2. Physics and Collision
      3. Events
      4. Process Manager
      5. Command Interpreter
   5. Game View for the Human Player
      1. Graphics Display
      2. Audio
      3. User Interface Presentation
      4. Process Manager
      5. Options
      6. Multiplayer Games
   6. Game Views for AI Agents
   7. Networked Game Architecture
      1. Remote Game View
      2. Remote Game Logic
   8. Do I Have to Use DirectX?
      1. Design Philosophy of DirectX
      2. Direct3D or Vulkan (orig: Direct3D or OpenGL)
      3. XSound2 or What? (orig: DirectSount or What?)
      4. GameInput or Roll Your Own (orig: DirectInput or Roll Your Own)
   9.  Other Bits and Pieces
3. Coding Tidbits and Style that Saved Me
   1. General Coding Styles
      1. Bracing
      2. Consistency
   2. Smart Code Design Practices
      1. Avoiding Hidden Code and Nontrivial Operations
      2. Class Hierarchies: Keep Them Flat
      3. Inheritance Versus Composition
      4. Virtual Functions Gone Bad
      5. User Interface Classes
      6. Consider Using Factories
      7. Encapsulate Components that Change
      8. Use Streams to Initialize Objects
   3. Smart Pointers and Naked Pointers
      1. Reference Counting
      2. C++'s `shared_ptr`
   4. Using Memory Correctly
      1. Understanding the Different Kinds of Memory
      2. Optimizing Memory Access
      3. Memory Alignment
      4. Virtual Memory
      5. Writing Your Own Memory Manager
   5. Grab Bag of Useful Stuff
      1. An Excellent Random Number Generator
      2. Pseudo-Random Traversal of a Set
      3. Memory Pools
   6. Developing the Style that's Right for You
4. Building Your Game
   1. A Little Motivation
   2. Creating a Project
      1. Build Configurations
      2. Create a Bullet-Proof Directory Structure
      3. Where to Put Your Game Engine and Tools
      4. Setting Visual Studio Build Options
      5. Multiplatform Projects
   3. Source Code Repositories and Version Control
      1. A Little History-Visual SourceSafe from Microsoft
      2. Subversion and TortoiseSVN
      3. Perforce by Perforce Software
      4. AlienBrain from Avid
      5. Using Source Control Branches
   4. Building the Game: A Black Art?
      1. Automate Your Builds
      2. The Build Machine
      3. Automated Build Scripts
   5. Creating Build Scripts
      1. Normal Build
      2. Milestone Build
   6. Multiple Projects and Shared Code
   7. Some Parting Advice
5. Game Initialization and Shutdown
   1. Initialization 101
   2. Some C++ Initialization Pitfalls
   3. The Game's Application Layer
      1. `WinMain`: The Windows Entry Point
      2. The Application Layer: `GameCodeApp`
      3. `InitInstance()`: Checking System Resources
      4. Checking for Multiple Instances of Your Game
      5. Checking Hard Drive Space
      6. Checking Memory
      7. Calculating CPU Speed
      8. Do You Have a Dirtbag on Your Hands?
      9. Initialize Your Resource Cache
      10. Loading Text Strings
      11. Your Script Manager and the Events System
      12. Initialize DirectX and Create Your Window
      13. Create Your Game Logic and Game View
      14. Set Your Save Game Directory
      15. Preload Selected Resources from the Cache
   4.  Sticking the Landing: A Nice Clean Exit
      1.  How Do I Get Out of Here?
      2.  Forcing Modal Dialog Boxes to Close
      3.  Shutting Down the Game
      4.  What About Consoles?
   5.  Getting In and Getting Out
6.  Game Actors and Component Architecture
    1.  A First Attempt at Building Game Actors
    2.  Component Architecture
    3.  Creating Actors and Components
    4.  Defining Actors and Components
    5.  Storing and Accessing Actors
    6.  Putting It All Together
    7.  Data Sharing
        1.  Direct Access
        2.  Events
        3.  The Best of Both Worlds
7.  Controlling the Main Loop
    1.  Organizing the Main Loop
        1.  Hard-Coded Updates
        2.  Multithreaded Main Loops
        3.  A Hybrid Technique
        4.  A Simple Cooperative Multitasker
        5.  Very Simple Process Example: `DelayProcess`
        6.  Mor Uses of `Process` Derivatives
    2.  Playing Nicely with the OS
    3.  Using the DirectX 12 Framework
        1.  Rendering and Presenting the Display
        2.  Your Callback Functions for Updating and Rendering
    4.  Can I Make a Game Yet?
8.  Loading and Caching Game Data
    1.  Game Resources: Formats and Storage Requirements
        1.  3D Object Meshes and Environments
        2.  Animation Data
        3.  Map/Level Data
        4.  Texture Data
        5.  Bitmap Color Depth
        6.  Sound and Music Data
        7.  Video and Prerendered Cinematics
    2.  Resources Files
        1.  Packaging Resources into a Single File
        2.  Other Benefits of Packaging Resources
        3.  Data Compression and Performance
        4.  zlib: Open Source Compression
    3.  The Resource Cache
        1.  `IResourceFile` Interface
        2.  `ResHandle`: Tracking Loaded Resources
        3.  `IResourceLoader`: Interface and the `DefaultResourceLoader`
        4.  `ResCache`: A Simple Resource Cache
        5.  Caching Resources into DirectX et al.
        6.  World Design and Cache Prediction
    4.  I'm Out of Cache
9.  Programming Input Devices
    1.  Getting the Device State
    2.  Using XInput or DirectInput
    3.  A Few Safety Tips
    4.  Working with Two-Axis Controls
        1.  Capturing the Mouse on Desktops
        2.  Making a Mouse Drag Work
    5.  Working with a Game Controller
        1.  Dead Zones
        2.  Normalizing Input
        3.  One Stick, Two Stick, Red Stick, Blue Stick
    6.  Working with the Keyboard
        1.  Mike's Keyboard Snooper
        2.  `GetAsyncKeyState()` and Other Evils
        3.  Handling the Alt Key Under Windows
    7.  What, No Dance Pad?
10. User Interface Programming
    1.  DirectX's Text Helper and Dialog Resource Manager
    2.  The Human's Game View
    3.  A WASD Movement Controller
    4.  Screen Elements
    5.  A Custom `MessageBox` Dialog
    6.  Modal Dialog Boxes
    7.  Controls
    8.  Control Identification
    9.  Hit Testing and Focus Order
    10. Control State
    11. More Control Properties
        1.  Hot Keys
        2.  Tooltips
        3.  Context-Sensitive Help
        4.  Dragging
        5.  Sounds and Animation
    12. Some Final User Interface Tips
11. Game Event Management
    1.  Game Events
        1.  Events and Event Data
        2.  The Event Listener Delegates
        3.  The Event Manager
        4.  Example: Bringing It All Together
    2.  What Game Events Are Important?
    3.  Distinguishing Events from Processes
12. Game Audio
    1.  How Sound Works
        1.  Digital Recording and Reproduction
        2.  Sound Files
        3.  A Quick Word About Threads and Synchronization
    2.  Game Sound System Architecture
        1.  Sound Resources and Handles
        2.  `IAudioBuffer` Interface and `AudioBuffer` Class
        3.  `IAudio` Interface and `Audio` Class
        4.  XAudio2 Implementations (orig: DirectSound Implementations)