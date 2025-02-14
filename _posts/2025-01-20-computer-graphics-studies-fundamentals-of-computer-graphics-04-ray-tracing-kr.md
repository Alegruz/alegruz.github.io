---
layout: post
title:  그래픽스 공부: Fundamentals of Computer Graphics. 04. 레이 트레이싱
date:   2025-01-20 00:00:00 +0000
categories: graphics korean
---

컴퓨터 그래픽스의 가장 기초적인 작업은 삼차원 물체를 *렌더링rendering*하는 것이다. 한 장면에 3D 공간에 존재하는 여러 기하학적 객체들을 특정 시점에서 바라봤을 때 보이는 이미지라는 2D로 계산해내는 것이다. 좀 더 구체적으로 말하자면 여러 객체들을 입력으로 받아 픽셀 배열을 출력으로 주는 것이다. 어쨋든 각 물체가 픽셀에 어떤 영향을 준다는 뜻이다. 이걸 실제로 하는 방법에는 두 가지가 있다:

* *객체순 렌더링object-order rendering*. 각 객체마다 어떤 픽셀에 영향을 주는지 찾아서 픽셀값을 구하는 것이다.
* *이미지순 렌더링image-order rendering*. 각 픽셀마다 어떤 객체에 영향을 받는지 찾아서 픽셀값을 구하는 것이다.

레이 트레이싱은 후자의 케이스다.

## 4.1. 기초적인 레이 트레이싱 알고리듬

레이 트레이서는 각 픽셀마다 해당 픽셀에서 보이는 객체를 찾는 것이 가장 기본적인 작업이다. 즉, 픽셀에서 바라보는 어떤 방향을 따라 *시점 광선viewing ray*을 쏘아 이 광선과 처음으로 교차하는 객체를 찾는 것이다. 이 객체는 카메라로부터 가장 가까운 객체일 것이다. 이후에는 표면 법선 등 교점에서의 정보를 사용하여 픽셀의 색을 구하는 *쉐이딩shading* 연산을 수행한다.

즉, 기본적인 레이 트레이서는 다음과 같은 단계로 동작한다:

1. *광선 생성ray generation*. 카메라의 기하학적 정보를 바탕으로 각 픽셀마다 원점과 시점 방향을 구하는 연산을 의미한다.
2. *광선 교점ray intersection*. 시점 광선과 교차하는 가장 가까운 객체를 찾는다.
3. *쉐이딩shading*. 광선 교점에 따라 픽셀의 색을 연산한다.

의사코드로 보자면:

```
for each pixel do
  시점 광선을 구한다
  광선과 충돌한 첫 객체를 구하고 그 표면 법선 n을 구한다
  충돌점, 빛, n을 통해 연산한 결과로 픽셀의 색을 구한다
```

## 4.2. 원근법

![Philomena Cunk on Art](https://youtu.be/W_05mmMhgf4?si=msprr_YsxmEXXE3A&t=256)

위 영상에서처럼 원근법이라는 개념은 과거에서부터 이미 등장한 개념이다. 결국 삼차원 세상에 있는 객체를 이차원의 세상으로 어떻게 옮기느냐에 대한 문제이다. 대표적인 방법으로는 *선형원근법linear perspective*으로, 삼차원 공간에 있는 물체 표면의 점으로부터 카메라까지의 선을 그리고, 그 선들이 *이미지 평면image plane*이랑 교차하는 방법을 의미한다. 즉 삼차원 공간에 있는 객체를 이차원 이미지로 투영하는 것이다.

<p><a href="https://en.wikipedia.org/wiki/File:Perspectiva-2.svg#/media/File:Perspectiva-2.svg"><img src="https://upload.wikimedia.org/wikipedia/en/d/d2/Perspectiva-2.svg" alt="File:Perspectiva-2.svg" height="446" width="578"></a><br><a href="https://creativecommons.org/licenses/by/3.0/" title="Creative Commons Attribution 3.0">CC BY 3.0</a>, <a href="https://en.wikipedia.org/w/index.php?curid=13906563">Link</a></p>

가장 기본적인 투영 방법은 *평행 투영parallel projection*으로, 한 카메라로 선을 그리는 게 아니라, 어떤 *투영 방향projection direction*으로 이미지 평면에 충돌할 때까지 선을 그리는 방법이다. 이때 이미지 평면과 투영 방향이 서로 직교한다면 이걸 *정투상orthographic projection*이라 부른다. 그 이외의 평행 투영을 *사투영oblique projection*이라 부른다.

<p><a href="https://commons.wikimedia.org/wiki/File:Axonometric_projection.svg#/media/File:Axonometric_projection.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Axonometric_projection.svg" alt="File:Axonometric projection.svg" height="397" width="467"></a><br>By Yuri Raysper - This W3C-unspecified <a href="https://en.wikipedia.org/wiki/Vector_images" class="extiw" title="w:Vector images">vector image</a> was created with <a href="https://en.wikipedia.org/wiki/Inkscape" class="extiw" title="w:Inkscape">Inkscape</a> ., Public Domain, <a href="https://commons.wikimedia.org/w/index.php?curid=1484146">Link</a></p>

반대로 하나의 점으로 모든 선이 만나는 방법을 *원근투영perspective projection*이라 부른다.

## 4.3. 시점 광선 구하기

광선 생성의 가장 기본적인 도구는 시점과 이미지 평면이다. 결국 광선은 한 원점과 진행 방향을 갖는 것이기 때문에 3D 매개직선으로 표현하는 것이 가장 적합하다.

**p**(t) = **e** + t(**s** - **e**)

해석하자면: "**e**로부터 벡터 **s** - **e**의 방향으로 t만큼 가서 점 **p**를 찾는다"이다. 즉 **e**가 곧 광선의 원점이 되고, **s** - **e**가 광선의 *방향direction*이 된다.

```
class Ray
  Vec3 o | 광선 원점
  Vec3 d | 광선 방향

  Vec3 evaluate(real t)
```

여기서 다룰 모든 광선 생선 방법은 *카메라 프레임camera frame*이라 부를 정규직교좌표계에서 시작한다. 우리 눈의 위치라는 의미로 **e**를 원점으로 두고, 카메라 시점을 기준으로 오른쪽을 바라보는 **u**, 위를 바라보는 **v**, 그리고 뒤를 바라보는 **w** 벡터가 오른손좌표계 기준의 정규직교기저가 된다. 이 정규직교기저를 구할 때엔 *시점 방향view direction*은 곧 -**w**를 구하고, **v**를 구하기 위해서는 카메라 시점 기준 위가 아니라, 세상을 기준으로 위쪽을 의미하는 *위 벡터up vector*가 필요하다. 위 벡터와 시점 방향이 구성하는 평면 위에서 **w**와 직교하는 **v**를 구할 수 있다. 이제 이 두 벡터의 외적이 **u**가 된다.

### 4.3.1. 정투상 시점

정투상에서는 광선을 쏘는 원점이 곧 이미지 평면과 동일하다. 이미지 평면의 각 픽셀에서 바라보는 시점 방향 -**w**으로 광산을 쏘는 것이다. 그렇기에 광선을 구하려면 각 원점만 구하면 된다.

*n<sub>x</sub>* &times; *n<sub>y</sub>* 개의 픽셀을 갖는 이미지 평면을 데카르트 좌표계에 놓았을 때 (*i*, *j*) 번째 픽셀의 좌표를 (*u*, *v*)라고 하고, 이미지 평면의 가장 최하단 좌측 모서리의 좌표가 (*l*, *b*)이고 최상단 우측 모서리의 좌표가 (*r*, *t*)이라 한다면, 픽셀 좌표 (*u*, *v*)는 다음과 같다:

*u* = *l* + (*r* - *l*)(*i* + 0.5)/*n<sub>x</sub>*
*v* = *b* + (*t* - *b*)(*j* + 0.5)/*n<sub>y</sub>*

정투상 시점에서는 이미지 평면 위의 픽셀의 위치가 곧 광선의 시작점이 되고, 광선 방향은 곧 시점 방향이 된다. 이 정보를 토대로 광선을 구해보면:

ray.o &larr; **e** + *u***u** + *v***v**
ray.d &larr; -**w**

### 4.3.2. 원근투영 시점

원근투영 시점에서 모든 광선의 원점은 곧 시점이 된다. 시점 방향은 정투상과는 다르게 모든 픽셀마다 달라진다. 그렇기에 이미지 평면이 시점과 동일할 수 없다. 이미지 평면은 적당한 너비와 높이를 가져야 하므로 원점 **e**보다 어떤 임의의 크기 *d*만큼 앞에(객체 방향으로 앞에) 놓이게 된다. 이 거리를 *이미지 평면 거리image plane distance*라 부르고, 실제 카메라에서의 *초점거리focal length*와 같은 역할을 하기에 적당히 초점 거리라고도 부른다.

ray.o &larr; **e**
ray.d &larr; -*d***w** + *u***u** + *v***v**

## 4.4. 광선과 객체간의 교차

이걸 좀 더 일반적인 문제로 풀어서 말하자면 광선과 어떤 표면 간에 처음으로 교차하게 하는 어떤 값 *t* &in; [*t*<sub>0</sub>, *t*<sub>1</sub>]을 구하는 문제이다. 기본적인 광선의 교차라면 *t*<sub>0</sub> = 0, *t*<sub>1</sub> = +∞인 셈이다.

### 4.4.1. 광선 구간의 교차

광선 방정식을 그냥 원의 방정식에 집어넣어서 근을 구하면 된다. 풀어서 보면 결국 이차방정식이 나오게 된다:

(**d** &sdot; **d**)*t*<sup>2</sup> + 2**d** &sdot; (**e** - **c**)*t* + (**e** - **c**) &sdot; (**e** - **c**) - *R*<sup>2</sup> = 0

이때 *R*은 원의 반지름이다.

이차방정식이므로 *판별식determinant*을 구해서 근의 유무 등을 먼저 판별해주면 좋다.

근의 방정식을 통해 최종적으로 *t*의 값은 다음과 같다:

*t* = (-**d** &sdot; (**e** - **c**) &pm; &radic;((**d** &sdot; (**e** - **c**))<sup>2</sup> - (**d** &sdot; **d**)((**e** - **c**) &sdot; (**e** - **c**)  - *R*<sup>2</sup>))) / (**d** &sdot; **d**)

두 근 중에 가장 작은 것이 범위 [*t*<sub>0</sub>, *t*<sub>1</sub>]에 있다면, 그게 처음으로 교차한 교점이다. 반대로 더 큰 근이 범위 [*t*<sub>0</sub>, *t*<sub>1</sub>]에 있다면, 그게 첫 교점이다. 그게 아니라면 교점이 없는 것이다.

### 4.4.2. 광선과 삼각형간 교차

