# ReSTIR GI: 실시간 경로 추적을 위한 경로 재표집 (2022.04.09)
[Home](../README.md)

* **저자**
    * [Yaobin Ouyang](https://developer.nvidia.com/blog/author/yaobinouyang/). NVIDIA
    * [Shiqiu Liu](http://behindthepixels.io/about/). NVIDIA
    * [Markus Kettunen](https://www.linkedin.com/in/markus-kettunen-61528617/?originalSubdomain=ch). NVIDIA
    * [Matt Pharr](https://pharr.org/matt/).
    * [Jacopo Pantaleoni](https://www.linkedin.com/in/jacopo-pantaleoni-8a374a3/?originalSubdomain=de). NVIDIA
* **출판일자**: 2021.06.24. 목요일.
* **출판**: Computer Graphics Forum (Proceedings of High Performance Graphics)
* **연구 분야**: 컴퓨터 그래픽스
* **논문 파일**: [링크](https://d1qx31qr3h6wln.cloudfront.net/publications/ReSTIR%20GI.pdf)

# 초록

최근에 GPU 많이 발전해서 광선추적법 하드웨어로 가속할 수 있긴 한데, 실시간 어플리케이션에서는 실질적으로 픽셀 당 추적 가능한 광선의 수가 얼마 안 됨. 그렇기에 경로 추적법을 사용할 경우, 현존하는 가장 성능이 좋은 디노이징 알고리듬을 사용하더라도 해결해야할 문제들이 있음. 최근에 개발한 ReSTIR 알고리듬[[BWP*20](#bwp*20)]의 경우 픽셀당 그림자 광선을 얼마 쓰지 않으면서도 수백만개의 광원이 있는 장면을 고품질로 렌더링할 수 있었음. 하지만 간접 조명을 표집할 좋은 알고리듬이 추가적으로 필요함.

그렇기에 간접광에 대한 병렬 중심 GPU 구조에 적합하면서 성능도 좋은 경로 표집화 알고리듬을 이 논문에서 소개하고자 함. 이 논문의 방법 또한 ReSTIR의 스크린 스페이스 시공간 재표집 원칙에 기반해서 다중 바운스 경로 추적법을 통해 얻은 간접광의 경로를 재표집함. 이를 통해 시간과 이미지의 픽셀에 대해 어떤 경로가 제일 빛에 영향을 많이 주는 중요한 경로인지에 대한 정보를 공유할 수 있음. 결과적으로 이 알고리듬을 통해 경로 추적법에 비해 오류가 상당히 감소함: 이 알고리듬을 사용할 경우, 이 논문에서 사용한 실험 장면 기준 각 프레임마다 모든 픽셀의 한 표본마다 9.3에서 166 배 정도의 범위만큼이나 MSE가 개선되었음. 디노이저까지 사용할 경우 최신 GPU 기준 실시간 프레임율을 보이면서 고품질의 경로 추적 기반 전역 조명을 렌더링할 수 있었음.

# 1. 도입

# 2. 이전 연구

# 3. 배경

# 4. ReSTIR GI

## 4.1. 표본 생성

## 4.2. 재표집과 셰이딩

## 4.3. 편향

# 5. 구현

# 6. 결과

## 6.1. 한계

# 7. 결론 및 향후 연구

# 감사의 글

# 참고문헌

<div id="ast16">ASTUFF: Burger restaurant, 03 2016. URL: <a href="https://www.turbosquid.com/3d-models/burger-restaurant-3d-model/1021436">https://www.turbosquid.com/3d-models/burger-restaurant-3d-model/1021436</a>.</div><br>
<div id="bmds19">BAKO S., MEYER M., DEROSE T., SEN P.: <a href="http://civc.ucsb.edu/graphics/Papers/PG19_ODIS/">Offline deep importance sampling for Monte Carlo path tracing</a>. In Computer Graphics Forum (2019), vol. 38, Wiley Online Library, pp. 527–542.</div><br>
<div id="bpe17">BAUSZAT P., PETITJEAN V., EISEMANN E.: Gradient-domain path reusing. ACM Trans. Graph. 36, 6 (Nov. 2017) URL: <a href="https://doi.org/10.1145/3130800.3130886">https://doi.org/10.1145/3130800.3130886</a>, doi:10.1145/3130800.3130886.</div><br>
<div id="bsh02">BEKAERT P., SBERT M., HALTON J.: <a href="https://diglib.eg.org/handle/10.2312/EGWR.EGWR02.125-134">Accelerating path tracing by re-using paths</a>. In Proceedings of the 13th Eurographics Workshop on Rendering (Goslar, DEU, 2002), EGRW ’02, Eurographics Association, p. 125–134.</div><br>
<div id="bwp*20">BITTERLI B., WYMAN C., PHARR M., SHIRLEY P., LEFOHN A., JAROSZ W.: Spatiotemporal reservoir resampling for real-time ray tracing with dynamic direct lighting. ACM Trans. Graph. 39, 4 (July 2020). URL: <a href="https://doi.org/10.1145/3386569">https://doi.org/10.1145/3386569. 3392481</a>, doi:10.1145/3386569.3392481.</div><br>
<div id="byc*20">BENTY N., YAO K.-H., CLARBERG P., CHEN L., KALL-WEIT S., FOLEY T., OAKES M., LAVELLE C., WYMAN C.: The Falcor rendering framework, 08 2020. URL: <a href="https://github.com/NVIDIAGameWorks/Falcor">https://github.com/NVIDIAGameWorks/Falcor</a>.</div><br>
<div id="cbh*18">CHAITANYA C. R. A., BELCOUR L., HACHISUKA T., PREMOZE S., PANTALEONI J., NOWROUZEZAHRAI D.: <a href="https://dl.acm.org/doi/10.2312/sre.20181169">Matrix bidirectional path tracing</a>. In Eurographics Symposium on Rendering - Experimental Ideas & Implementations (2018), Jakob W., Hachisuka T., (Eds.), The Eurographics Association. doi:10.2312/sre.20181169.</div><br>
<div id="cha82">CHAO M.-T.: <a href="https://academic.oup.com/biomet/article/69/3/653/221439?login=true#:~:text=A%20general%20purpose%20unequal%20probability%20sampling%20plan&text=In%20contrast%20to%20existing%20such,probabilities%20can%20be%20easily%20computed.">A general purpose unequal probability sampling plan</a>. Biometrika 69, 3 (1982), 653–656.</div><br>
<div id="dgj*20">DIOLATZIS S., GRUSON A., JAKOB W., NOWROUZEZAHRAI D., DRETTAKIS G.: <a href="https://rgl.epfl.ch/publications/Diolatzis2020Practical">Practical product path guiding using linearly transformed cosines</a>. In Computer Graphics Forum (2020), vol. 39, Wiley Online Library, pp. 23–33.</div><br>
<div id="dhd20">DITTEBRANDT A., HANIKA J., DACHSBACHER C.: <a href="https://diglib.eg.org/handle/10.2312/sr20201135">Temporal sample reuse for next event estimation and path guiding for real-time path tracing</a>. In Eurographics Symposium on Rendering (2020), Dachsbacher C., Pharr M., (Eds.), The Eurographics Association. doi:10.2312/sr.20201135.</div><br>
<div id="dk16">DAHM K., KELLER A.: <a href="https://arxiv.org/abs/1701.07403">Learning light transport the reinforced way</a>. In International Conference on Monte Carlo and Quasi-Monte Carlo Methods in Scientific Computing (2016), Springer, pp. 181–195.</div><br>
<div id="dkh*14">DACHSBACHER C., KRIVÁNEK ˇ J., HAŠAN M., ARBREE A., WALTER B., NOVÁK J.: Scalable realistic rendering with many-light methods. Computer Graphics Forum 33, 1 (2014), 88–104. URL: <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.12256">https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.12256</a>, doi:<a href="https://doi.org/10.1111/cgf.12256">https://doi.org/10.1111/cgf.12256</a>.</div><br>
<div id="dwwh20">DENG H., WANG B., WANG R., HOLZSCHUCH N.: A practical path guiding method for participating media. Computational Visual Media 6, 1 (2020), 37–51. URL: <a href="https://doi.org/10.1007/s41095-020-0160-1">https://doi.org/10.1007/s41095-020-0160-1</a>, doi:10.1007/s41095-020-0160-1.</div><br>
<div id="hev*16">HERHOLZ S., ELEK O., VORBA J., LENSCH H., KRIVÁNEK J.: <a href="https://cgg.mff.cuni.cz/~jaroslav/papers/2016-productis/index.htm">Product importance sampling for light transport path guiding</a>. In Computer Graphics Forum (2016), vol. 35, Wiley Online Library, pp. 67–77.</div><br>
<div id="hkl16">HEDMAN P., KARRAS T., LEHTINEN J.: <a href="http://visual.cs.ucl.ac.uk/pubs/smcir/">Sequential Monte Carlo Instant Radiosity</a>. In Proceedings of the ACM SIGGRAPH Symposium on Interactive 3D Graphics and Games (2016), ACM.</div><br>
<div id="hp02">HEY H., PURGATHOFER W.: <a href="https://dl.acm.org/doi/10.1145/584458.584476">Importance sampling with hemispherical particle footprints</a>. In Proceedings of the 18th spring conference on Computer Graphics (2002), pp. 107–114.</div><br>
<div id="hpb07">HAŠAN M., PELLACINI F., BALA K.: Matrix row-column sampling for the many-light problem. In ACM SIGGRAPH 2007 Papers (New York, NY, USA, 2007), SIGGRAPH ’07, Association for Computing Machinery, p. 26–es. URL: <a href="https://doi.org/10.1145/1275808.1276410">https://doi.org/10.1145/1275808.1276410</a>, doi:10.1145/1275808.1276410.</div><br>
<div id="jen95">JENSEN H. W.: <a href="http://graphics.stanford.edu/~henrik/papers/ewr6.html">Importance driven path tracing using the photon map</a>. In Eurographics Workshop on Rendering Techniques (1995), Springer, pp. 326–335. </div><br>
<div id="jen96">JENSEN H. W.: <a href="http://graphics.ucsd.edu/~henrik/papers/photon_map/">Global illumination using photon maps</a>. In Proceedings of the Eurographics Workshop on Rendering Techniques ’96 (Berlin, Heidelberg, 1996), Springer-Verlag, p. 21–30.</div><br>
<div id="kaj86">KAJIYA J. T.: The rendering equation. SIGGRAPH Comput. Graph. 20, 4 (Aug. 1986), 143–150. URL: <a href="https://doi.org/10.1145/15886.15902">https://doi.org/10.1145/15886.15902</a>, doi:10.1145/15886.15902.</div><br>
<div id="kdb14">KELLER A., DAHM K., BINDER N.: Path space filtering. In ACM SIGGRAPH 2014 Talks (New York, NY, USA, 2014), SIGGRAPH’14, Association for Computing Machinery. URL: <a href="https://doi.org/10.1145/2614106.2614149">https://doi.org/10.1145/2614106.2614149</a>, doi:10.1145/2614106.2614149.</div><br>
<div id="kel97">KELLER A.: Instant radiosity. In Proceedings of the 24th Annual Conference on Computer Graphics and Interactive Techniques (USA,1997), SIGGRAPH ’97, ACM Press/Addison-Wesley Publishing Co.,p. 49–56. URL: <a href="https://doi.org/10.1145/258734.258769">https://doi.org/10.1145/258734.258769</a>, doi:10.1145/258734.258769. </div><br>
<div id="kma*15">KETTUNEN M., MANZI M., AITTALA M., LEHTINEN J., DURAND F., ZWICKER M.: Gradient-domain path tracing. ACM Trans. Graph. 34, 4 (July 2015). URL: <a href="https://doi.org/10.1145/2766997">https://doi.org/10.1145/2766997</a>, doi:10.1145/2766997.</div><br>
<div id="lw95">LAFORTUNE E. P., WILLEMS Y. D.: <a href="https://graphics.cs.kuleuven.be/publications/A5TTRTVOMCRT/index.html">A 5d tree to reduce the variance of Monte Carlo ray tracing</a>. In Eurographics Workshop on Rendering Techniques (1995), Springer, pp. 11–20.</div><br>
<div id="mcc13">MCCOMBE J.: <a href="https://dl.acm.org/doi/abs/10.1145/2504435.2504444">Low power consumption ray tracing</a>. SIGGRAPH 2013 Course: Ray Tracing Is the Future and Ever Will Be, 2013</div><br>
<div id="mgn17">MÜLLER T., GROSS M., NOVÁK J.: Practical path guiding for efficient light-transport simulation. Comput. Graph. Forum 36, 4 (July 2017), 91–100. URL: <a href="https://doi.org/10.1111/cgf.13227">https://doi.org/10.1111/cgf.13227</a>, doi:10.1111/cgf.13227. 2</div><br>
<div id="mh20">MUNKBERG J., HASSELGREN J.: Neural denoising with layer embeddings. Computer Graphics Forum 39, 4 (2020), 1–12. URL: <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.14049">https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.14049</a>, doi:https://doi.org/10.1111/cgf.14049.</div><br>
<div id="mmr*19">MÜLLER T., MCWILLIAMS B., ROUSSELLE F., GROSS M., NOVÁK J.: Neural importance sampling. ACM Trans. Graph. 38, 5 (Oct. 2019). URL: <a href="https://doi.org/10.1145/3341156">https://doi.org/10.1145/3341156</a>, doi:10.1145/3341156.</div><br>
<div id="mmsm21">MAJERCIK Z., MARRS A., SPJUT J., MCGUIRE M.: Scaling probe-based real-time dynamic global illumination for production. Journal of Computer Graphics Techniques (JCGT) 10, 2 (May 2021), 1–29. URL: <a href="http://jcgt.org/published/0010/02/01/">http://jcgt.org/published/0010/02/01/</a>.</div><br>
<div id="nvi18">NVIDIA I.: <a href="https://www.nvidia.com/en-us/geforce/turing/">NVIDIA Turing GPU architecture</a>. NVIDIA Whitepaper, 2018. </div><br>
<div id="pan20">PANTALEONI J.: Online path sampling control with progressive spatio-temporal filtering. SN Computer Science 1 (08 2020). <a href="https://doi.org/10.1007/s42979-020-00291-z">doi:10.1007/s42979-020-00291-z</a>.</div><br>
<div id="pjh16">PHARR M., JAKOB W., HUMPHREYS G.: <a href="https://www.pbrt.org/">Physically Based Rendering: From Theory To Implementation</a>. Morgan Kaufmann, Burlington, Massachusetts, 2016.</div><br>
<div id="prdd15">POPOV S., RAMAMOORTHI R., DURAND F., DRETTAKIS G.: Probabilistic connections for bidirectional path tracing. Computer Graphics Forum (Proceedings of the Eurographics Symposium on Rendering) 34, 4 (2015). URL: <a href="http://www-sop.inria.fr/reves/Basilic/2015/PRDD15b">http://www-sop.inria.fr/reves/Basilic/2015/PRDD15b</a>.</div><br>
<div id="rhl20">RUPPERT L., HERHOLZ S., LENSCH H. P.: <a href="https://uni-tuebingen.de/fakultaeten/mathematisch-naturwissenschaftliche-fakultaet/fachbereiche/informatik/lehrstuehle/computergrafik/lehrstuhl/veroeffentlichungen/publications-since-2012/robust-fitting-of-parallax-aware-mixtures-for-path-guiding/">Robust fitting of parallax-aware mixtures for path guiding</a>. ACM Transactions on Graphics (TOG) 39, 4 (2020), 147–1.</div><br>
<div id="skw*17">SCHIED C., KAPLANYAN A., WYMAN C., PATNEY A., CHAITANYA C. R. A., BURGESS J., LIU S., DACHSBACHER C., LEFOHN A., SALVI M.: Spatiotemporal variance-guided filtering: Real-time reconstruction for path-traced global illumination. In Proceedings of High Performance Graphics (New York, NY, USA, 2017), HPG’17, Association for Computing Machinery. URL: <a href="https://doi.org/10.1145/3105762.3105770">https://doi.org/10.1145/3105762.3105770</a>, doi:10.1145/3105762.3105770.</div><br>
<div id="spd18">SCHIED C., PETERS C., DACHSBACHER C.: Gradient estimation for real-time adaptive temporal filtering. Proc. ACM Comput. Graph. Interact. Tech. 1, 2 (Aug. 2018). URL: <a href="https://doi.org/10.1145/3233301">https://doi.org/10.1145/3233301</a>, doi:10.1145/3233301.</div><br>
<div id="tce05">TALBOT J. F., CLINE D., EGBERT P.: <a href="https://diglib.eg.org/handle/10.2312/EGWR.EGSR05.139-146">Importance resampling for global illumination</a>. In Proceedings of the Sixteenth Eurographics Conference on Rendering Techniques (Goslar, DEU, 2005), EGSR ’05, Eurographics Association, p. 139–146.</div><br>
<div id="th19">TOKUYOSHI Y., HARADA T.: Hierarchical Russian roulette for vertex connections. ACM Trans. Graph. 38, 4 (July 2019). URL: <a href="https://doi.org/10.1145/3306346.3323018">https://doi.org/10.1145/3306346.3323018</a>, doi:10.1145/3306346.3323018.</div><br>
<div id="vhh*19">VORBA J., HANIKA J., HERHOLZ S., MÜLLER T., KRIVÁNEK ˇ J., KELLER A.: Path guiding in production. In ACM SIGGRAPH 2019 Courses (New York, NY, USA, 2019), SIGGRAPH’19, Association for Computing Machinery. URL: <a href="https://doi.org/10.1145/3305366.3328091">https://doi.org/10.1145/3305366.3328091</a>, doi:10.1145/3305366.3328091.</div><br>
<div id="vit85">VITTER J. S.: <a href="https://www.cs.umd.edu/~samir/498/vitter.pdf">Random sampling with a reservoir</a>. ACM Transactions on Mathematical Software (TOMS) 11, 1 (1985), 37–57. 2</div><br>
<div id="vks*14">VORBA J., KARLÍK O., ŠIK M., RITSCHEL T., KRIVÁNEK J.: On-line learning of parametric mixture models for light transport simulation. ACM Transactions on Graphics (TOG) 33, 4 (2014), 1–11.</div><br>
<div id="wggh20">WEST R., GEORGIEV I., GRUSON A., HACHISUKA T.: Continuous multiple importance sampling. ACM Transactions on Graphics (TOG) 39, 4 (July 2020). <a href="https://doi.org/10.1145/3386569.3392436">doi:10.1145/3386569.3392436</a>.</div><br>
<div id="wp21">WYMAN C., PANTELEEV A.: <a href="https://research.nvidia.com/publication/2021-07_Rearchitecting-Spatiotemporal-Resampling">Rearchitecting spatiotemporal resampling for production</a>. In Proceedings of ACM/EG Symposium on High Performance Graphics (2021), HPG ’21.</div><br>
<div id="zz19">ZHENG Q., ZWICKER M.: <a href="https://arxiv.org/abs/1808.07840">Learning to importance sample in primary sample space</a>. In Computer Graphics Forum (2019), vol. 38, Wiley Online Library, pp. 169–179. </div>