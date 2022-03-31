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

# 도입
