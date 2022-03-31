# 지형에 일관된 식물상과 동물상 저작하기 (논문 번역) (2022.03.31)
[Home](../README.md)

저자:

* [피에르 에꼬르미에-노까. Pierre Ecormier-Nocca](https://www.lix.polytechnique.fr/geovic/members/pierre_ecormier-nocca/), [LIX, Ecole Polytechnique/CNRS, Institut Polytechnique de Paris, France](https://www.lix.polytechnique.fr/geovic/index.html). pierre.ecormier@polytechnique.edu
* [기욤 꼬르도니에. Guillaume Cordonnier](http://www-sop.inria.fr/members/Guillaume.Cordonnier/), [ETH Zürich, Switzerland](https://cgl.ethz.ch/) and [Inria, Université Côte d’Azur, France](https://www.inria.fr/fr/centre-inria-universite-cote-azur). guillaume.cordonnier@inria.fr
* [필립 까레. Philippe Carrez](https://www.linkedin.com/in/philippecarrez/?originalSubdomain=fr), [Immersion Tools, France](https://immersion.tools/fr/). guillaume.cordonnier@inria.fr
* [안-마리 모아뉴. Anne-Marie Moigne](https://mnhn.academia.edu/AnneMarieMoigne), [Muséum national d’Histoire naturelle - UMR 7194, HnHp, MNHN, UPVD, CNRS, France](https://mnhn.academia.edu/). anne-marie.moigne@cerptautavel.com
* [푸랑 메마리. Pooran Memari](http://www.lix.polytechnique.fr/~memari/), [LIX, CNRS/Ecole Polytechnique, Institut Polytechnique de Paris, France](https://www.lix.polytechnique.fr/geovic/index.html). , memari@lix.polytechnique.fr
* [베드리히 베네쉬. Bedřich Beneš](https://www.cs.purdue.edu/homes/bbenes/), [Purdue University, USA](https://www.cs.purdue.edu/). bbenes@purdue.edu
* [마리-폴 까니. Marie-Paule Cani](https://www.lix.polytechnique.fr/geovic/members/marie-paule_cani/), [LIX, Ecole Polytechnique/CNRS, Institut Polytechnique de Paris, France](https://www.lix.polytechnique.fr/geovic/index.html). marie-paule.cani@polytechnique.edu

<iframe width="560" height="315" src="https://www.youtube.com/embed/nx1ULB80wrc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 초록

지형에 식물상과 동물상을 서로의 상호작용까지 고려하여 저작하는 새로운 방법을 소개하는 논문. 이 논문에서 소개하는 알고리듬을 통해 각 종별 밀도 맵, 일상 루틴으로 이루어진 안정된 상태의 생태계를 만들어줄 수 있으며, 지형의 침식, 기후적 조건, 생물학적 정보를 갖는 종들로부터 수정된 지형을 만들어줄 수 있음. 자원 접근 그래프Resource Access Graph라는 새로운 자료 구조로 먹이 사슬과 지형의 자원을 얻기 위해 움직이는 동물들 간의 상호작용을 인코딩 해줌. 이 논문에서 제공하는 새로운 경쟁 알고리듬은 이 자료를 바탕으로 초식동물과 육식동물을 모두 아우르는, 지속적으로 안정된 상태의 먹이사슬 솔루션을 제공함. 이 모든 결과는 즉각적으로 적용할 수 있어 실시간으로 맵을 수정해줄 수도 있음. 이를 통해 야생 생물의 영향(초식동물들이 풀을 먹는 등)과 지형 침식을 적용할 수 있음. 또한 이 방법을 현존하는 생태계와 고생물학 전문가들을 통한 이용자 검증으로 정량적으로 검증하여 우리의 시스템이 충분히 다양한 기후에 따른 다양한 생태계를 동일한 지형에서 보일 수 있었음.

# 1. 도입

지형이 이쁘려면 기후, 침식, 식생, 동물과 같은 여러 요소들 간의 상호작용이 있어야 함. 얘네가 분명 지형에 영향을 주는데, 얘네를 전부 합쳐서 고려해주는 게 쉬운 건 아님. 지금까지 대부분의 경우는 기후, 침식, 식물 생태계나 고려했지 동물상은 맨 마지막에 따로 직접 추가해줬음.

우선 이 논문에서 제시하는 첫번째 관찰은 "동물이 시야에 보이지 않더라도 지형에 시각적인 영향을 준다"는 것임. 동물 간 공간과 자원의 경쟁을 통해 식생을 없애고 길이 생기는 등의 상황이 발생함. 그래서 지금까지 동물을 무시하고 지형에 식물을 깔고 나서 동물을 추가하던 파이프라인을 수정해야 함.

두번째 관찰은 여러 생물체가 공존하는 지형을 만드는게 시뮬레이션 없어도 일관성을 유지하면서 만들어줄 수 있고, 사용자가 손쉽게 제어할 수 있게 만들어줄 수도 있음. 가상 환경을 디자인하시는 분들의 목적은 자신의 의도한대로 관객을 충분히 환경에 몰입하게 해주는 것임. 당연히 이 논문의 결과가 실제 환경과 비슷하면 생물학자들이나 고생물학자들에게도 이득임. 시간 축을 통해 시뮬레이션이 진행되는 시스템의 경우 사용자가 직접 개입을 적극적으로 하기 힘드니까 우리 시스템이 더 나은?듯.

우리 방법이 퀄리티 좋은 CG 지형을 만들어내는 이유는 일관적이면서도 식물상과 동물상 둘 다 포함하는, 제어가 가능한 생태계를 만들기 때문임. 식물도 고려하고, 동물도 고려하고, 심지어 먹이 사슬도 다 고려해줌. 이걸 하위 계층부터 상위로 반복적으로 처리해줌. 사용자 입장에서 직관적으로 수정도 가능하고, 일관적으로 배치된 식물들과 일상 생활에 따라 행동하는 동물들이 존재하는 결과도 바로 볼 수 있음.

이 논문의 시스템을 사용할 경우 보통 입력 지형에 대해서 기후를 정의해주고, 심을 식물들의 종, 초식동물 종, 육식동물 종을 입력해주고, 추가적으로 경쟁 이후 얼만큼의 비율로 있을지에 대한 정보도 주게 됨. 이 입력에 대한 출력은 결국 생태계가 나올 것임. 이 생태계는 주어진 지형에 종이 존재하는 밀도 맵으로 표현이 됨. 당연히 수정 가능. 각 먹이사슬 단계마다, 생성된 개체 하나 하나 마다의 영향이 해당 개체가 소비할 자원으로 역전파됨. 개체와 자원 둘 간의 경로를 연산하여 해당 경로에서의 방목, 먹이 탐색 활동, 침식 등을 처리해줌. 이를 전부 적용한 최종적인 지형은 이제 식물상, 동물상과 일관되어있음. [그림 1](#figure_1) 참조.

<div style="text-align: center" id="figure_1">
<img src="https://raw.githubusercontent.com/Alegruz/alegruz.github.io/master/Images/AuthoringConsistentLandscapesWithFloraAndFauna/Figure1.png" alt="Figure1">
<p>그림 1: 지형, 기후 조건과 경쟁 관계인 종 간 의도한 비율과 먹이 사슬 종속성을 입력으로 줌. 이 입력에 대해 우리의 알고리듬은 자원 접근 그래프에 대해 반복적으로 종의 밀도 맵을 계산하여 동물의 일상 경로를 추출할 수 있음. 그 결과로 식생, 동물, 그리고 동물이 만들어낸 경로를 전부 포함한 당장 사용 가능한 3D 지형이 나옴. 이 맵은 언제든지 페인트 툴로 수정 가능함.</p>
</div>

이런 결과를 얻을 수 있는 이유는 몇 가지 중요한 점 위주로 선택을 했고, 근사를 했기 때문임. 첫번째 결정 사항은 각 먹이 사슬마다 종을 추가할 때 사용자가 이 비율을 직접 수정할 수 있다는 점임. 이때 이 입력으로부터 지형 위의 실제 표본의 개수와 분포를 얻을 수 있음. 이걸 구할 때 새로 만든 절차적 경쟁 알고리듬을 사용하는데, 이 알고리듬은 결과로 나온 생태계가 안전된 상태라는 가정이 있기에 간단하게 사용할 수 있음. 두번째 결정 사항은 자원 접근 그래프(RAG)라는 새로운 자료 구조를 기반으로 했다는 점임. 이 자료 구조는 각 종에 대응하는 자원을 위치와 접근성에 따라 계층적 그래프로 표현하여 효율적이면서 지형에 일관적으로 종의 개체화를 처리해줄 수 있음.

이 논문의 의의:

1. RAG라는 계층적, 생물학 기반의 자원 그래프로, 먹이 시슬 단계별 지역적 상호작용을 인코딩해주고, 자원 사이의 경로를 모델링할 수 있게 해줌.
2. 절차적 경쟁 알고리듬을 통해 각 먹이 사슬 단계 별로 안정된 상태의 생태계를 빠르게 근사할 수 있게 해줌.
3. 지형과 상호작용하면서 동시에 식물과 동물의 개체화를 일관적으로 수정할 수 있게 해줌.

# 2. 관련 연구