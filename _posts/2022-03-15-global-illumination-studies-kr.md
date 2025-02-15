---
layout: post
title:  전역 조명 공부 노트
date:   2022-03-15 00:00:00 +0000
categories: graphics
lang: "ko"
---

이 노트는 Real-Time Rendering 책 등을 읽고 한국어로 정리한 책입니다.

# Real-Time Rendering

## 물리 기반 셰이딩

### 빛의 물리

결국 물리 기반 셰이딩이라는 것은 빛과 물질의 상호작용을 의미함.

물리광학에 의하면 빛이라는 것은 전자기적 횡파, 즉 전파하는 방향에 수직으로 전자기장이 진동하는 파임. 이때 전기장과 자기장은 서로 또 수직이며, 둘 간의 길이의 비는 고정되어있음. 이 비율이 곧 위상 속도임.

<p><a href="https://commons.wikimedia.org/wiki/File:Electromagneticwave3D.gif#/media/File:Electromagneticwave3D.gif"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Electromagneticwave3D.gif" alt="Electromagneticwave3D.gif"></a><br>By <a href="//commons.wikimedia.org/w/index.php?title=User:Lookang&amp;amp;action=edit&amp;amp;redlink=1" class="new" title="User:Lookang (page does not exist)">Lookang</a> many thanks to <a rel="nofollow" class="external text" href="https://www.phy.ntnu.edu.tw/ntnujava/index.php">Fu-Kwun Hwang</a> and <a rel="nofollow" class="external text" href="https://www.compadre.org/osp/items/detail.cfm?ID=7305">author of Easy Java Simulation = Francisco Esquembre</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=16874302">Link</a></p>

위의 그림에서 볼 수 있듯 가장 단순한 빛은 완벽한 사인 함수임. 이러한 파동은 하나의 *파장wavelength*을 가지며, 그리스 문자로 <i>&lambda;</i>로 표현함. 우리가 인지하는 빛의 색은 이 파장과 매우 밀접한 관련이 있음. 그렇기에 파장이 하나인 빛을 *단색광monochromatic light*이라 부름. 그러나 실무에서 다루는 대부분의 광파는 *다색성polychromatic*을 띠기에 여러 파장을 가짐.

![Polarization of Light](https://cdn1.byjus.com/wp-content/uploads/2020/07/Polarization-of-Light-2.png)
[Reference](https://byjus.com/physics/polarization-of-light/)

위와 같은 빛을 *직선 편광linearly polarized light*이라 부름. 즉, 공간에 고정된 한 점에서 전기장과 자기장이 선을 따라서 앞 뒤로 움직인다는 뜻임. 이 책에서는 *혼합 직선 편광unpolarized light*을 다룸. unpolarized light의 경우 편광과는 다르게 모든 방향으로 고르게 진동한다고 보면 됨.

<p><a href="https://commons.wikimedia.org/wiki/File:Wave_group.gif#/media/File:Wave_group.gif"><img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Wave_group.gif" alt="Wave group.gif"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Kraaiennest" title="User:Kraaiennest">Kraaiennest</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=3651297">Link</a></p>

파동의 한 극대점을 지켜보면 시간에 따라 어떤 속도만큼 앞으로 진행하는 것을 볼 수 있음. 이걸 파동의 *위상 속도phase velocity*라 부름. 특히 진공 상태에서 진행하는 빛의 파동의 경우 위상 속도를 보통 *c*, 즉 빛의 속도라 부름.

빛의 파동은 에너지를 갖고 있음. 에너지 흐름의 밀도는 전자기장의 크기의 곱과 같음. 어차피 전기장과 자기장은 서로 비례하므로 에너지 흐름의 밀도는 전기장의 크기의 제곱에 비례함. 여기서 전기장에 집중하는 이유는 자기장보다 전기장의 영향이 더 크기 때문임. 여기서 우리가 궁금한 건 시간 당 *평균* 에너지 흐름임. 이때 이 값은 파동의 진폭의 제곱에 비례함. 이 평균 에너지 흐름 밀도를 *복사 조도irradiance*라 부름.

<p><a href="https://commons.wikimedia.org/wiki/File:Interference_of_two_waves.svg#/media/File:Interference_of_two_waves.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Interference_of_two_waves.svg/1200px-Interference_of_two_waves.svg.png" alt="When two or more waves travel through a medium and superpose then the resultant intensity do not distributed uniformly in the space. At some places, it is maximum while at some other places it is minimum. This non uniform distribution of intensity or energy of light is known as interference."></a><br>By original version: <a href="//commons.wikimedia.org/wiki/User:Haade" title="User:Haade">Haade</a>;
vectorization: <a href="//commons.wikimedia.org/wiki/User:Wjh31" title="User:Wjh31">Wjh31</a>, <a href="//commons.wikimedia.org/wiki/User:Quibik" title="User:Quibik">Quibik</a> - Vecorized from <a href="//commons.wikimedia.org/wiki/File:Interference_of_two_waves.png" title="File:Interference of two waves.png">File:Interference of two waves.png</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=10073387">Link</a></p>

빛의 파동은 선형적으로 합쳐짐. 즉, 어떤 빛의 파동이 있을 때, 이 파동은 여러 성분 파동의 합으로 구해짐. 위의 사진처럼 더해졌을 때 더욱 증폭되는 *보강 간섭constructive interference*이 있는가 하면, 아예 파동이 소멸되는 *상쇄 간섭destructive interference*도 있음. 이때 이 두 간섭을 *일관 간섭coherent interference*이라 부름.

보강 간섭의 경우 더해진만큼 증폭되는데, 이때 에너지는 진폭의 제곱에 비례하므로, n<sup>2</sup>만큼 에너지가 증폭이 된다. 당연히 상쇄 간섭의 경우 아예 파동이 상쇄되므로 에너지가 0이 된다.

![Incoherent](https://slideplayer.com/slide/14814011/90/images/2/Coherent+vs.+Incoherent+Interference.jpg)
[Reference](https://slideplayer.com/slide/14814011/)

반대로 *비일관 간섭incoherent interference*의 경우, 즉 성분 파동들이 상대적으로 서로 연관이 없는 증폭이 더해질 경우 n<sup>2</sup>이 아니라 n만큼 증폭이 된다. 예를 들어 위의 그림에서 n 개의 성분 파동들이 전부 동일한 진폭 a를 갖고 있다고 가정하자. 이때 이 서로 다른 성분 파동들을 더해주니 결과 파동의 진폭이 만약 √n a으로 나왔다고 가정하자. 이 경우 최종 에너지 E<sub>n</sub>은 어떤 상수 k에 대해서 E<sub>n</sub> = k (√n a)<sup>2</sup>, 즉 E<sub>n</sub> = kn a<sup>2</sup> = nE<sub>1</sub>이 되므로 보강 간섭과는 다르게 n만큼 에너지가 증폭이 된다.

어떤 물체의 전하가 진동하면 빛의 파동이 발생한다. 이 진동을 발생시킨 에너지(열, 전기 에너지, 화학 에너지 등)의 일부가 빛 에너지로 치환되어 물체로부터 복사된다. 렌더링에선 이런 물체를 광원이라 부른다.

빛이 다른 물체에 닿게 되면 다음과 같이 상호작용한다:

1. 진동하는 전기장이 물체의 전하를 밀고 당겨서 마찬가지로 진동시킨다.
2. 이 진동에 의해 새로운 빛의 파동이 발생하며, 들어온 빛의 일부 에너지를 다른 방향으로 보내준다

이 상호작용을 *산란scattering*이라 부르며, 이것이 다양한 광학적 현상의 기초이다.

산란된 빛은 원본 빛과 동일한 주파수를 갖고 있음. 빛 자체는 여러 주파수를 갖고 있음. 즉, 들어오는 빛의 각 주파수들에 대응되는 나가는 들이 있는데, 이때 주파수에 따라 서로 독립적으로 나가게 됨. 즉, a b c 주파수를 갖는 빛이 있을 때, 여러 다른 방향으로 산란될텐데, 이때 a 주파수는 a 주파수가 알아서 산란이 되지, b, c 주파수에 의해 따로 영향 받는 게 없음.

빛이 따로 혼자 있는 입자와 충돌하게 되면 모든 방향으로 산란되며, 특정 방향으로 좀 더 강도가 세짐. 여기서 특정 방향이란 주로 원래 전파하던 축과 가까운 방향 앞뒤를 의미함. 이때 입자가 얼마나 산란을 잘 해주냐는 파장(색)에 따라 달라짐. 파장이 짧은(보라색) 빛일 수록 더 산란이 잘 됨.

어차피 렌더링에서는 빛이 한 입자와 충돌할 때를 다루는 일은 거의 없음. 대부분의 경우 근처에 입자가 많은 경우임. 이때 보통 근처 입자로부터 산란된 파동은 서로 일관되므로 간섭이 발생함. 어차피 들어오는 빛은 같으니까.

#### 파티클

*이상 기체ideal gas*에선 입자가 서로 영향을 딱히 주지 않아 각 입자들의 위치는 사실상 무작위고 서로 무관함. 즉, 여기서 산란된 파동들은 비일관적이므로 에너지가 선형적으로 더해짐. 즉, n 개의 입자로부터 산란된 빛들의 에너지는 한 개의 입자로부터 산란된 빛의 에너지의 n배가 된다.

만약 입자들이 파장보다 더 좁은 간격으로 한 뭉텅이로 모여있게 된다면, 각 뭉텅이로부터 산란된 빛의 파동들은 서로 보강 간섭을 일으키게 된다. 즉, 한 뭉텅이로부터 산란된 빛의 에너지는 한 입자로부터 산란된 빛의 에너지의 n<sup>2</sup>배가 된다.

즉, 특정 밀도만큼 입자가 한 공간에 밀집되어있다고 할 때, 밀도는 유지하면서 입자를 넣으면 넣을 수록 산란된 빛의 강도가 증가하게 됨. 이 뭉텅이를 밀도는 유지하면서 크기는 키우게 되면 강도가 더욱 증가하다가 뭉텅이의 지름이 빛의 파장과 비슷해지는 순간 뭉텅이가 커진다고 해서 산란된 빛의 강도가 증가하지는 않음.

![RayleighScattering](https://dbscthumb-phinf.pstatic.net/1126_000_1/20120508161229058_2LXA12EYJ.jpg/ce5_1364_i1.jpg?type=w340_2&wm=Y)
[Reference](https://terms.naver.com/entry.naver?docId=978668&cid=60248&categoryId=60248)

![TyndallEffect](https://dbscthumb-phinf.pstatic.net/4447_000_1/20190809185656327_FBZV9B95B.jpg/%25ED%258B%25B4%25.jpg?type=w450_fst_n&autoRotate=true)
[Reference](https://terms.naver.com/entry.naver?docId=5810533&cid=60217&categoryId=60217)

보통 빛의 산란을 설명할 때 *파티클particle*은 분리된 한 입자를 의미할 수도, 여러 입자의 뭉텅이를 의미할 수도 있음. 파장보다 둘레가 작은 뭉텅이의 경우 분리된 한 입자에서 발생하는 산란을 증폭한 결과이므로 분리된 한 입자에서 산란될 때처럼 산란의 방향이라 파장 종속성 등이 동일함. 이런 산란을 기체의 경우 *레일리 산란Rayleigh scattering*, 고체의 경우 *틴들 산란Tyndall scattering*이라 부름.

![MieScattering](https://dbscthumb-phinf.pstatic.net/2765_000_9/20170928113420334_HN3M9AZRS.gif/1323560_0.gif?type=m1500&wm=N)
[Reference](https://terms.naver.com/entry.naver?docId=4294933&cid=40942&categoryId=32299)

뭉텅이의 둘레가 파장보다 커지게 되면 산란된 파동이 서로 동위상이 아니게 되므로 산란의 특성이 바뀌게 됨. 산란 자체가 진행 방향 위주로 되며 눈에 보이는 모든 파장이 동일하게 산란되기 전까지는 파장 종속성이 줄어듦. 이런 산란을 *미 산란Mie scattering*이라 부름.

#### 매질

*균질매체homogeneous medium*이란 균일한 간격으로 동일한 입자들로 채워진 매질을 의미함.

균질매체의 경우 산란된 빛은 원래 전파 방향을 제외하면 전부 상쇄 간섭이 발생함. 산란된 빛의 결과를 전부 합해보면 원본 파동에 비해 위상 속도와 (일부의 경우) 진폭 빼고는 다 같음. 최종 빛은 산란이 되지 않은 상태임. 이건 상쇄 간섭 때문임.

여기서 원래 빛의 위상 속도와 새 빛의 위상 속도 간의 비율이 바로 매질의 광학적 속성인 *굴절률index of refraction* n을 결정함. *흡수성absorptive*이 있는 매질의 경우 빛 에너지의 일부를 열 등으로 바꾸어 파동의 진폭을 거리에 지수적으로 비례하여 감소시킴. 이 감소율은 *감쇠 지수attenuation index*에 의해 정의되며 κ(카파)로 표기함. n과 κ 둘 다 파장에 따라 보통 달라짐. 이 두 값을 통해 어떤 파장을 갖는 빛에 매질이 어떤 영향을 주는 지를 정의하며, 이걸 보통 복소수 n + iκ로 표기하며, 이를 *복소 굴절률complex index of refraction*이라 부름.

굴절률은 빛과 입자 간의 상호작용을 추상화해주어 매질을 마치 연속된 물체로 간주할 수 있게 해줌.

위상 속도는 직접 생김새에 영향을 주지 않는다. 속도의 *변화change*가 생김새에 변화를 준다. 반대로 빛의 흡수는 빛의 강도를 줄여주며 (파장이 다를 경우) 색도 바꿔줄 수 있어 생김새에 직접적인 영향을 준다.

산란과 흡수는 둘 다 빛이 상호작용하는 매질의 크기에 따라 그 결과가 달라진다.

일반적으로 매질의 생김새는 산란과 흡수로 결정이 된다. 여기서 산란의 정도가 얼마나 흐린지 정도를 결정한다. 고체나 액체 매질에 있는 파티클은 보통 빛의 파장보다 큰 경우가 많으므로 모든 가시적인 파장을 고르게 산란한다.

하얀색이 보통 산란의 수준이 높고 흡수가 낮을 때 발생한다.

#### 표면

빛이 표면에 닿을 때 두 가지 요소가 그 결과에 영향을 준다. 양측의 실체와 표면의 기하이다. 우선 실체에 대한 논의를 하기 위해 표면이 완벽히 평평한 평면이라고 가정하도록 하자. 이때 "외부"(들어오는 파동, 즉 *입사incident*파가 속한 쪽)에서의 굴절률을 n<sub>1</sub>이라 표기하고 "내부"(표면을 통과하여 파동이 전달될 곳)의 굴절률을 n<sub>2</sub>이라 표현한다.

전에 언급했듯 빛의 파동은 물체의 구성이나 밀도에 불연속적인 부분을 만났을 때 굴절률만큼 산란이 된다.

## 전역 조명

결국 렌더링을 해서 구하려는 것은 광휘radiance임. 지금까지는 *반사 방정식reflectance equation*으로 구했음:

![ReflectanceEquation](/Images/GlobalIllumination/ReflectanceEquation.svg)

![ReflectanceEquationImage](/Images/GlobalIllumination/ReflectanceEquationImage.png)

### 렌더링 방정식

사실 반사 방정식은 렌더링 방정식의 한 특수한 경우임.

![RenderingEquation](/Images/GlobalIllumination/RenderingEquation.png)

여기서 ![EmittedRadiance](/Images/GlobalIllumination/EmittedRadiance.png)은 표면 위의 한 점 **p**에서 **v** 방향으로 발광하는 방사 휘도를 의미함.

![IncomingRadianceIsOutgoingRadiance](/Images/GlobalIllumination/IncomingRadianceIsOutgoingRadiance.png)

이때 위의 식처럼 결국 **p** 위치에서 방향 **l**로 들어오는 방사 휘도는 같은 지점에서 반대 방향 **-l**으로 나가는 방사 휘도와 같음. 여기서 함수 ![RayCastingFunction](/Images/GlobalIllumination/RayCastingFunction.png)를 *광선 투사 함수ray casting function*이라 부름.

렌더링 방정식의 의미 자체는 매우 단순함. **p**라는 표면 위의 지점을 셰이딩해주기 위해서는 **p**를 떠나 시점 방향 **v**로 가는 나가는 방사 휘도를 구해주면 됨. 이 값은 결국 발광 방사 휘도 ![EmittedRadiance](/Images/GlobalIllumination/EmittedRadiance.png)에 반사된 방사 휘도를 더한 값임.

이때 ![IncomingRadianceIsOutgoingRadiance](/Images/GlobalIllumination/IncomingRadianceIsOutgoingRadiance.png)라는 식에 의해 한 지점에서 나가는 방사 휘도는 곧 다른 지점으로부터 나오는 방사 휘도와 같다는 것을 알 수 있음. 즉, 이 방정식은 재귀 방정식임.

렌더링 방정식의 중요한 특징은 발광량에 *선형linear*의 관계를 갖는다는 것임. 어떤 물체가 각 빛에 대응하는 것도 독립적으로 이루어짐.

실시간 렌더링에서는 그냥 지역 조명 모델만을 사용하는게 일반적임. 즉, 보이는 지점만 처리하면 됨. 각 지점마다 다 독립적으로 셰이딩이 됨. 근데 투명, 반사, 그림자와 같은 *전역 조명global illumination* 알고리듬들은 이미 빛의 영향을 받은 다른 물체의 정보를 필요로 함. 그래서 여러 번 연산을 해줘야 함. 그 대신 렌더링한 결과는 상당히 현실적이게 됨.

보통 조명 문제를 처리할 때는 광자가 어떤 경로를 지난다고 생각하고 처리하면 됨. 단순 지역 조명 모델에서는 이 광자가 빛을 떠나 어떤 표면에 부딪히고, 이것이 눈으로 바로 감. 중간에 뭐 가림막이 없음. 그림자 처리하는 기술들은 중간에 걸리는 부분을 고려해서 물체에 의해 직접 가려진 부분을 처리함. 환경 맵은 광원에서 상당히 멀리 떨어진 물체까지 도달한 조명을 처리함. 방사 조도 맵도 마찬가지로 반구 형태의 방향으로부터 멀리 떨어진 물체까지 모든 방향으로 도달한 조명을 처리함.

여러 가지 빛 전달 경로를 좀 더 형식적으로 표현해주면 여러 알고리듬을 손 쉽게 이해할 수 있음. 빛(L)에서 나온 광자가 눈(E)으로 갈 때 발생하는 상호작용들은 각각 난반사(D) 혹은 정반사(S)로 표기할 수 있음. 여기에 몇가지 연산자만 추가해주면 됨:

|연산자|설명|예시|해석|
|-----|-----|----|----|
|*|한 개 이상 있을 수도, 없을 수도 있음|S*|정반사가 한 개 이상 있을 수도, 없을 수도 있음|
|+|한 개 이상 있음|D+|한 개 이상의 난반사가 존재함|
|?|한 개까지 있을 수 있음|S?|정반사가 없거나, 딱 하나 존재할 수 있음|
|\||or|D\|SS|난반사 하나 있거나, 정반사 두 개가 있음|
|()|그룹|(D\|S)*|난반사나 정반사 둘 중 하나가 없을 수도 있고, 한 개 이상 있을 수도 있음|


가장 간단한 경로는 LE임. 즉, 빛이 직접 눈으로 바로 간 것임. 간단한 z-버퍼의 경우 L(D|S)E, 혹은 LDE|LSE임.

렌더링 방정식 자체는 L(D|S)*E로 볼 수 있음. 즉, 광자가 빛을 떠나 사실상 무한 번 난반사 / 정반사 표면에 충돌하여 최종적으로 눈에 오게 됨.

전역 조명은 이런 경로를 따르는 빛 전달을 연산하는 방법을 연구하는 분야임. 근데 이걸 실시간으로 처리하려니 퀄리티를 조금 손해봐야함. 효율적으로 값을 구해야하니깐. 대표적인 방법이 두 가지가 있는데, 하나는 단순화하는 것이고, 다른 하나는 사전에 연산해놓는 것임.

### 일반적인 전역 조명

결국 렌더링 방정식을 구해야함. 지역 조명과 전역 조명의 차이라면 지역 조명에서는 어차피 방사 휘도가 주어지기 때문에 딱히 구할 필요가 없음. 근데 전역 조명을 구하려면 방정식 전체를 구해야함. 어떤 한 지점에 들어오는 방사 휘도는 또다른 어딘가에서 날아온 방사 휘도이기 때문임.

이렇게 방정식 전체를 풀면 현실적인 결과는 얻을 수 있지만 실시간에서 계산하기엔 좀 빡셈. 그럼에도 이걸 연구하는 두 가지 있음:

1. 아예 정적이거나 적당히 정적인 장면에서는 이러한 알고리듬을 전처리해줘서 미리 저장해둔 결과값만 갖다 쓸 수 있음.
2. 전역 조명 알고리듬은 매우 이론적인 바탕에 기반함.

렌더링 방정식을 푸는데에는 유한요소법과 몬테 카를로 방법 두 가지가 있음. 라디오시티가 전자에 해당하고, 광선추적법은 후자임. 물론 후자를 더 많이 쓺.

#### 라디오시티

<iframe width="560" height="315" src="https://www.youtube.com/embed/P3L2umEUCao" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*라디오시티Radiosity*는 확산 표면 간에 반사광을 처음으로 시뮬레이션해주는 최초의 컴퓨터 그래픽스 기술임. 가장 기본적인 라디오시티 알고리듬에서는 모든 간접광은 확산 표면에서 왔다고 가정하는 것으로 시작함. 그래서 LD*E임.

이때 모든 표면은 몇 개의 패치로 이루어져있다고 가정함. 이러한 패치마다 평균 라디오시티 값 하나를 구함. 그래서 빛을 좀 더 디테일하게 잡으려면 패치 크기가 작아야함.

렌더링 방정식을 바탕으로 패치 i의 라디오시티를 다음과 같이 구할 수 있음:

![Radiosity](/Images/GlobalIllumination/Radiosity.png)

여기서 B<sub>i</sub>는 패치 i의 라디오시티를 의미하고, B<sub>i</sub><sup>e</sup>는 복사 *발산도exitance*, 즉 패치 i가 발산하는 라디오시티를 의미하며, &rho;<sub>ss</sub>는 부분면의 알베도임. F<sub>ij</sub>는 패치 i와 j 사이의 *파형률form factor*를 의미함. 여기서 파형률은 다음과 같음:

![FormFactor](/Images/GlobalIllumination/FormFactor.png)

여기서 A<sub>i</sub>는 패치 i의 영역을 의미하고, V(**i**, **j**)는 점 **i**와 **j** 간의 가시성 함수를 의미함. 각도 &theta;<sub>i</sub>와 &theta;<sub>j</sub>는 두 패치의 각 법선과 두 점 **i**와 **j**를 잇는 광선 간의 각도를 의미하며, d<sub>ij</sub>는 광선의 길이를 의미함.

![FormFactorImage](https://i.stack.imgur.com/Yh4v5.png)
[Reference](https://computergraphics.stackexchange.com/questions/4196/what-is-radiosity)

파형률은 순수하게 기하학적인 단어일 뿐임. 결국은 패치 i에서 떠난 균일 난반사 복사 에너지의 일부가 패치 j에 닿는 것임. 한 장면 내에 속한 서로 다른 두 패치 간의 파형률을 정확하게 구하는 것이 라디오시티 알고리듬의 상당한 부분을 차지한다고 볼 수 있음.

파형률을 다 계산했다면 모든 패치에 대한 방정식을 하나의 선형 시스템으로 합쳐줄 수 있음. 이 시스템의 해를 구하면 모든 패치의 라디오시티 값을 구할 수 있게 됨. 당연히 패치 수가 증가할 수록 계산 복잡도가 증가하므로 사용하는 행렬의 개수를 줄이는 방안을 고려해봐야함.

이 알고리듬의 경우 확장성도 별로고, 기타 다른 한계점이 있기 때문에 전통적인 라디오시티 자체는 거의 사용하지 않긴 함. 하지만 파형률을 사전에 계산해두고 실시간에 사용하는 식으로 광전파를 구현한다는 아이디어 자체는 요즘 현대적인 실시간 전역 조명 시스템에서 널리 사용되긴 함.

#### 광선 추적법

*광선 투사법ray casting*은 한 위치에서 특정 방향으로 광선을 쏘아 해당 방향에 어떤 물체가 존재하는지를 확인하는 방법임. *광선 추적법ray tracing*은 광선을 통해 장면 내의 여러 원소들 간의 빛 전달을 결정하는데 사용함. 가장 간단한 형태의 광선 추적법을 보자면, 카메라로부터 장면을 투영한 화면의 픽셀 하나로 광선을 쏘게 됨. 이 광선은 해당 방향으로 가장 가까운 물체와 충돌할 것임. 이 충돌 지점, 즉 교차점이 현재 그림자가 져있는지 여부를 각 광원에 광선을 쏘아 광선이 광원까지 갈 수 있는지, 혹은 중간에 물체가 있어 막혀있는지를 확인함. 불투명한 물체는 빛을 막을 것이고, 투명한 물체는 빛을 감쇠시킬 것임. 이때 교차점에서 다른 광선들을 쏘아줄 수 있음. 대표적으로 반사 방향으로 광선을 쏴주어 매끈한 표면임을 보일 수 있음. 이 반사 광선은 또 다시 어떤 물체와 충돌하는데, 이때 이 충돌한 물체의 색을 그대로 가질 것임. 여기서 또 그림자가 진 곳인지를 확인해줄 수 있음. 반사 광선 말고 또 굴절 광선도 존재할 수 있음. 이것도 마찬가지로 재귀적으로 처리할 것임.

카지야 교수는 광선을 쏘고, 이 광선이 얼마 만큼의 빛을 전달하는지를 판단하는 메커니즘 자체를 바탕으로 렌더링 방정식의 적분 부분을 구할 수 있음을 깨달았음. 이때 이 적분을 해결하기 위해 *몬테 카를로Monte Carlo* 방법을 사용함. 적분을 할 때 주어진 영역에서 임의의 표본에 대해서만 적분을 구하는 것임. 이렇게 되면 이산적으로 값을 구할 수 있게 됨. 광선이 장면 내에서 돌아다니다보면 일종의 *경로path*가 생김. 그러면 이 경로를 통해 전달되는 빛이 바로 적분의 한 부분을 차지하게 되는 것임. 이 과정을 *경로 추적법path tracing*이라 부름.

경로를 추적한다는 개념은 매우 강력한 개념임. 경로를 통해 광택이 있는 표면이나 확산 표면을 렌더링해줄 수 있음.

다만, 계산 복잡도가 좀 있어야 퀄리티 있는 렌더링이 가능해진다는 단점이 있음. 게다가 바로 옆에 있는 픽셀이라 하더라도 서로 결과값이 매우 달라질 수 있음. 즉, 결과가 *높은 분산high variance*을 가질 수도 있음. 시각적으로 보면 노이즈가 있는 이미지라고 생각하면 됨. 이런 걸 해결하기 위해 등장한 방법 중 가장 널리 사용하는 것이 바로 *중요도 샘플링importance sampling*임. 대부분이 빛이 오는 방향 위주로 광선을 더 많이 쏘는 것임.

![MonteCarloPathTracingNoise](https://i.ytimg.com/vi/mYMkAnm-PWw/maxresdefault.jpg)

### 앰비언트 어클루전

![AmbientOcclusion](https://ars.els-cdn.com/content/image/3-s2.0-B9781558606593500172-f15-16-9781558606593.jpg)
[Reference](https://www.sciencedirect.com/topics/computer-science/ambient-occlusion)

일반적인 전역 조명은 보통 계산 비용이 비싸다는 단점이 있음.

실시간이면서도 간단하고, 간단하면서도 충분히 괜찮은 기술 중 대표적인 간단한 전역 조명 알고리듬으로는 *앰비언트 어클루전ambient occlusion* (AO)가 있음. 이 방법은 광원이 방향성인 성격이 덜해서 물체의 디테일을 강조하지 않을 경우 물체의 모양에 따라 자연스러운 결과를 적은 비용으로 나타내줄 수 있음.

#### 앰비언트 어클루전 이론

앰비언트 어클루전의 이론적 배경 자체가 바로 반사 방정식임. 설명의 편의상 램버트 표면에만 집중하도록 함. 이러한 표면 위에서 나가는 방사 휘도 L<sub>o</sub>은 표면 방사 조도 E에 비례함. 방사 조도는 들어오는 방사 휘도에 코사인으로 가중치를 준 합임. 일반적으로 표면 위의 위치 **p**와 그 법선 **n**에 따른다는 뜻임. 설명의 편의상 들어오는 방사 휘도는 상수라고 가정함. 즉, 들어오는 모든 방향 **l**에 대해 L<sub>i</sub>(**l**) = L<sub>A</sub>임. 이 경우 방사 조도 방정식은 다음과 같음:

![AOIrradiance](/Images/GlobalIllumination/AOIrradiance.png)

여기서 &Omega;란 들어올 수 있는 모든 가능한 방향에 대한 반구를 의미함.

여기에 가시성을 적용해줘야함. 어떤 방향의 경우 다른 물체에 의해 막혀있을 수도 있음. 이러면 L<sub>A</sub>가 아닌 다른 방사 휘도를 가질 것임. 대충 이 경우 0이라고 가정함.

#### 가시성과 모호성

#### 상호반사성 처리하기

#### 사전 계산 앰비언트 어클루전

AO 요소들을 계산하는게 시간을 먹기에 주로 렌더링 이전에 오프라인에서 미리 계산을 함. 이런 것처럼 앰비언트 어클루전과 같이 빛에 관한 정보를 사전에 미리 계산해놓는 과정을 *베이킹baking*이라 부름.

앰비언트 어클루전을 사전에 계산할 때 사용하는 가장 일반적인 방법은 몬테 카를로 방법임.

---

Latex:

방사 조도 방정식:

```
E\left( \textbf{p}, \textbf{n} \right ) = \int_{\textbf{l}\in{\Omega}}{L_{A}\left( {\textbf{n}} \cdot {\textbf{l}} \right )^{+}d\textbf{l}}=\pi L_{A}
```


파형률:

```
F_{ij} = \frac{1}{A_{i}}\int_{A_{i}}{\int_{A_{j}}{V \left ( \textbf{i}, \textbf{j} \right )\frac{cos{\theta_{i}}cos{\theta_{j}}}{\pi d_{ij}^{2}}}da_{i}}da_{j}
```

반사 방정식:

```
L_{o}\left ( \textbf{\textrm{p}}, \textbf{\textrm{v}} \right ) = \int_{\textbf{\textrm{I}}\in \Omega}{f\left ( \textbf{\textrm{l}}, \textbf{\textrm{v}} \right )L_{i}\left ( \textbf{\textrm{p}}, \textbf{\textrm{l}} \right )\left ( \textbf{\textrm{n}} \cdot \textbf{\textrm{l}} \right )^+}d\textbf{\textrm{l}}
```

렌더링 방정식:

```
L_{o}\left ( \textbf{p}, \textbf{v} \right ) = L_{e}\left ( \textbf{p}, \textbf{v} \right ) + \int_{\textbf{l}\in \Omega }{f\left ( \textbf{l}, \textbf{v} \right )}L_{o}\left ( r\left ( \textbf{p}, \textbf{l} \right ), -\textbf{l} \right )\left ( \textbf{n}\cdot \textbf{l} \right )^{+}d\textbf{l}
```

라디오시티:

```
B_{i} = B_{i}^{e} + \rho_{ss}\sum_{j}{F_{ij}B_{j}}
```