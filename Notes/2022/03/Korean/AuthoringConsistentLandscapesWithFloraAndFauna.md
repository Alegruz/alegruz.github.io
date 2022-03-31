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

이 논문은 지형 생성에 집중하지 않음. 지형 생성이 궁금하다면 다음 논문을 참고: [[Galin et al. 2019](#galin2019); [Smelik et al. 2014](#smelik2014)].

식물 생태계는 대부분 자원의 경쟁을 시뮬레이션하는 방식으로 처리해왔음. [Deussen et al. [1998]](#deussen1998)에서 처음으로 식물 경쟁 시뮬레이션을 통해 식물 분포를 처리했음. 최근에는 이 방식을 계층적 생태계로 확장한 논문이 있음[[Makowski et al. 2019](#makowski2019)]. 최근에는 생태계와 다른 현상을 섞는 연구도 있음. [Benes et al. [2011]](#benes2011)에선 도시 환경과 식물이 자원을 위해 경쟁하는 현상의 상호작용을 인간의 도시 관리까지 고려하여 모델링해줌. [Gain et al. [2017]](#gain2017)에선 식물 분포를 시뮬레이션하고 학습해서 지형 위에서 상호작용할 수 있는 부쉬로 사용해줌. [Cordonnier et al. [2017]](#cordonnier2017)에선 지형 침식과 식물의 상호작용을 모델링함. [[Kapp et al. 2020](#kapp2020)]에선 입력 지형과 일관된 식생을 학습하고 생성하기 위해 심층 신경망을 학습시킴. 이 논문과는 다르게, 오로지 지형과 식물상의 상호작용만 고려했으며, 동물들이 식생과 침식에 주는 영향은 고려하지 않았음. 게다가 이 논문에서는 생존이라는 시뮬레이션 요소에 기반[[Alsweis and Deussen 2005](#alweis_deussen2005); [Gain et al. 2017](#gain2017)]하기에 지배적인 종에게 지역적인 우선 순위를 부여하지만 종의 비율을 제어할 수 있게 해주어 안정적인 상태의 생태계에 집중할 수 있게 해줌.

동물상에 대해서는 Reynolds의 연구[[1987](#reynolds1987); [1999](#reynolds1999)]에서 boids라는 개념을 소개함. Boids란 새 무리가 마치 한 몸으로 움직이는 것을 시뮬레이션해주는 것임. 애니메이팅한 에이전트의 속도[[Paris et al. 2007](#paris2007); [van den Berg et al. 2008](#berg2008)]나 통합된 시야[[López et al. 2019](#lopez2019); [Ondřej et al. 2010](#ondrej2010)]를 기반으로 좀 더 세련된 결정을 할 수 있는 모델을 개발하여 관찰한 행동을 모방할 수 있게 해줌. 여기에 동물에 대해서 특히 환경과 동물이 상호작용을 하는 부분에 있어 예술적인 자유와 제어를 해줄 수 있도록 해주는 연구도 존재함. [[Wang et al. 2014](#wang2014); [Xu et al. 2008](#xu2008)]와 같은 연구에서는 사용자가 동물의 그룹이 형성하는 모양을 제어할 수 있게 해줌. 동시에 [Ecormier-Nocca et al. [2019]](#ecormier_nocca2019)에서는 동물 무리를 모양 뿐만 아니라 분포까지도 제어할 수 있게 해줌. 이런 방법이 시각적으로 그럴 듯한 애니메이션을 제공하기는 하지만, 식생이나 지형의 접근성, 자원이 부족할 때와 같은 중요한 요소와의 관계를 고려하지 않음. 이걸 고려하는 것이 이 논문의 목표임.

식물상과 동물상에서 종 간의 경쟁은 생물학자들이 모델링을 해주었음. 이건 미분 방정식 등으로 표현이 되어있기에 예측이 가능한, 모집단의 생태학적인 틈새의 동적인 모델을 얻을 수 있으며, 전역 자원 관리에 대한 결정을 내릴 수 있게 해줌. 예를 들어 생태학을 위한 보존 생물학과 환경 분석 등에 영감을 받아 [[Loreau 2010](#loreau2010)]에서는 생물다양성이 생태계에 갖는 영향을 보여주었고, [[Shifley et al. 2017](#shifley2017)]에서는 숲 환경을 위한 동적 모델에 대한 종합적인 조사를 함. 우리에서는 동적 생태계를 시뮬레이션하는 방법을 제시하는 것은 아님. 대신 생태계의 일관성을 유지하면서도 실제의 자료를 기반으로 하든 가상의 자료를 기반으로하든 사용자의 입력을 받아들이는 경관을 생성하는 저작 도구에 집중하려고 함. 이렇게 유연하게 입력을 받을 수 있다보니 우리의 시스템이 완전한 통계적인 점유 모델이나 동물 모집단 다이내믹의 베이지언 시뮬레이션을 제공하려는 것이 아님. 광범위한 패턴과 점유 다이내믹에 대한 수학적 모델링에 대한 종합적인 인사이트를 얻고 싶은 독자들은 [[MacKenzie et al. 2017](#mackenzie2017)]를 참고하면 될 듯.

# 참고문헌

<div id="alweis_deussen2005">M. Alsweis and O. Deussen. 2005. <a href="https://kops.uni-konstanz.de/bitstream/handle/123456789/6312/Alsweis_et_al._Modeling_and_Visualization_of_Symmetric_and_Asymmetric_Plant_Competition.pdf;jsessionid=CCA0FCDFAE07087C9354DC90128541B3?sequence=2">Modeling and Visualization of symmetric and asymmetric plant competition</a>. In Eurographics Workshop on Natural Phenomena</div><br>
<div id="animal_diversity_web">Animal-Diversity-Web. DB. <a href="https://animaldiversity.org/">https://animaldiversity.org/</a>. Accessed: 2020-01-22.</div><br>
<div id="bedrich2011">Bedrich Benes, Michel Abdul Massih, Peter Jarvis, Dadniel G. Aliaga, and Carlos A. Vanegas. 2011. <a href="https://www.cs.purdue.edu/cgvlab/papers/aliaga/i3d11.pdf">Urban Ecosystem Design</a>. In I3D. 167ś174.
</div><br>
<div id="cordonnier2017">Guillaume Cordonnier, Eric Galin, James Gain, Bedrich Benes, Eric Guérin, Adrien Peytavie, and Marie-Paule Cani. 2017. <a href="https://hal.archives-ouvertes.fr/hal-01518967">Authoring landscapes by combining ecosystem and terrain erosion simulation</a>. ACM Trans. Graph. 36, 4 (2017), 134</div><br>
<div id="courchamp2008">Franck Courchamp, Ludek Berec, and Joanna Gascoigne. 2008. <a href="https://oxford.universitypressscholarship.com/view/10.1093/acprof:oso/9780198570301.001.0001/acprof-9780198570301#:~:text=of%20many%20...-,Allee%20effects%20are%20broadly%20defined%20as%20a%20decline%20in%20individual,which%20populations%20crash%20to%20extinction.">Allee effects in ecology and conservation</a>. Oxford University Press.</div><br>
<div id="deussen1998">Oliver Deussen, Pat Hanrahan, Bernd Lintermann, Radomir Měch, Matt Pharr, and Przemyslaw Prusinkiewicz. 1998. <a href="https://graphics.stanford.edu/papers/ecosys/">Realistic Modeling and Rendering of Plant Ecosystems</a>. In Proc. of Sigg. (SIGGRAPH ’98). ACM, 275ś286.</div><br>
<div id="ecormier_nocca2019">Pierre Ecormier-Nocca, Julien Pettré, Pooran Memari, and Marie-Paule Cani. 2019. <a href="Image-based Authoring of Herd Animations">Image-based authoring of herd animations</a>. Computer Animation and Virtual Worlds 30, 3-4 (2019).</div><br>
<div id="gain2017">James Gain, Harry Long, Guillaume Cordonnier, and Marie-Paule Cani. 2017. <a href="https://hal.archives-ouvertes.fr/hal-01519852">EcoBrush: Interactive Control of Visually Consistent Large-Scale Ecosystems</a>. Eurographics 36 (2017).</div><br>
<div id="galin2019">Eric Galin, Eric Guérin, Adrien Peytavie, Guillaume Cordonnier, Marie-Paule Cani, Bedrich Benes, and James Gain. 2019. <a href="https://hal.archives-ouvertes.fr/hal-02097510">A Review of Digital Terrain Modeling</a>. Computer Graphics Forum 38, 2 (2019).</div><br>
<div id="kapp2020">Konrad Kapp, James Gain, Eric Guérin, Eric Galin, and Adrien Peytavie. 2020. <A href="https://hal.archives-ouvertes.fr/hal-03007259">Data-driven authoring of large-scale ecosystems</a>. ACM TOG 39, 6 (2020), 1-14.</div><br>
<div id="loreau2010">Michel Loreau. 2010. <a href="https://press.princeton.edu/books/paperback/9780691122700/from-populations-to-ecosystems">From populations to ecosystems: Theoretical foundations for a new ecological synthesis (MPB-46)</a>. Vol. 50. Princeton University Press.</div><br>
<div id="lopez2019">Axel López, François Chaumette, Eric Marchand, and Julien Pettré. 2019. <a href="https://hal.inria.fr/hal-02052554">Character navigation in dynamic environments based on optical flow</a>. Computer Graphics Forum 38, 2 (2019).</div><br>
<div id="mackenzie2017">Darryl I MacKenzie, James D Nichols, J Andrew Royle, Kenneth H Pollock, Larissa Bailey, and James E Hines. 2017. <a href="https://www.elsevier.com/books/occupancy-estimation-and-modeling/mackenzie/978-0-12-407197-1">Occupancy estimation and modeling: inferring patterns and dynamics of species occurrence</a>. Elsevier.</div><br>
<div id="makowski2019">Milosz Makowski, Torsten Hädrich, Jan Scheffczyk, Dominic L. Michels, Sören Pirk, and Wojtek Palubicki. 2019. <a href="https://storage.googleapis.com/pirk.io/projects/synthetic_silviculture/index.html">Synthetic Silviculture: Multi-scale Modeling of Plant Ecosystems</a>. ACM Trans. Graph. 38, 4 (2019).</div><br>
<div id="ondrej2010">Jan Ondřej, Julien Pettré, Anne-Hélène Olivier, and Stéphane Donikian. 2010. <a href="https://hal.inria.fr/inria-00539572">A synthetic-vision based steering approach for crowd simulation</a>. ACM Transactions on Graphics 29, 4 (July 2010), 1.</div><br>
<div id="paris2007">Sébastien Paris, Julien Pettré, and Stéphane Donikian. 2007. <a href="http://people.rennes.inria.fr/Julien.Pettre/pdf/EURO2007.pdf">Pedestrian Reactive Navigation for Crowd Simulation: a Predictive Approach</a>. Computer Graphics Forum 26, 3 (Sept. 2007), 665-674. https://doi.org/10.1111/j.1467-8659.2007.01090.x</div><br>
<div id="reynolds1987">Craig W. Reynolds. 1987. <a href="https://team.inria.fr/imagine/files/2014/10/flocks-hers-and-schools.pdf">Flocks, herds and schools: A distributed behavioral model</a>. ACM SIGGRAPH Computer Graphics 21, 4 (Aug. 1987), 25-34.</div><br>
<div id="reynolds1999">Craig W Reynolds. 1999. <a href="https://www.red3d.com/cwr/steer/">Steering Behaviors For Autonomous Characters</a>. 21.</div><br>
<div id="shifley2017">Stephen R Shifley, Hong S He, Heike Lischke, Wen J Wang, Wenchi Jin, Eric J Gustafson, Jonathan R Thompson, Frank R Thompson, William D Dijak, and Jian Yang. 2017. <a href="https://link.springer.com/article/10.1007/s10980-017-0540-9">The past and future of modeling forest dynamics: from growth and yield curves to forest landscape models</a>. Landscape ecology 32, 7 (2017), 1307-1325.</div><br>
<div id="smelik2014">Ruben Smelik, Tim Tutenel, Rafael Bidarra, and Bedrich Benes. 2014. <a href="http://graphics.tudelft.nl/Publications-new/2014/STBB14/bidarra.CGF.2014.pdf">A Survey on Procedural Modelling for Virtual Worlds</a>. Computer Graphics Forum 33, 6 (2014).</div><br>
<div id="tela_botanica">Tela-Botanica. DB. <a href="https://www.tela-botanica.org/">https://www.tela-botanica.org/</a>. Accessed: 2020-01-22.</div><br>
<div id="berg2008">Jur van den Berg, Ming Lin, and Dinesh Manocha. 2008. <a href="https://ieeexplore.ieee.org/document/4543489">Reciprocal Velocity Obstacles for real-time multi-agent navigation</a>. IEEE, 1928-1935.</div><br>
<div id="wang2014">Xinjie Wang, Linling Zhou, Zhigang Deng, and Xiaogang Jin. 2014. <a href="https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.736.3242&rep=rep1&type=pdf">Flock morphing animation</a>. Computer Animation and Virtual Worlds 25, 3-4 (May 2014), 351-360.</div><br>
<div id="xu2008">Jiayi Xu, Xiaogang Jin, Yizhou Yu, Tian Shen, and Mingdong Zhou. 2008. <a href="https://i.cs.hku.hk/~yzyu/publication/flock-casa08.pdf">Shape-constrained flock animation</a>. Computer Animation and Virtual Worlds 19, 3-4 (2008).</div>