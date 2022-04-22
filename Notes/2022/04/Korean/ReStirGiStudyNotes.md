# ReSTIR GI 공부 노트 (2022.04.21)
[Home](../README.md)

# ReSTIR GI 관련 블로그 글

## 정반사용 ReSTIR GI

[원글 링크](https://www.zyanidelab.com/restir-gi-for-specular-bounces/)


다중튕김 전역조명에서 제일 중요한 건 "어느 방향"으로 광선을 쏠 건지임. 실시간에선 광선을 여러 개 못 쓰니까 광선 하나 하나가 의미가 있어야 함.

이 글에서는 특히나 정반사 환경에서 의미 있는 광선을 표집하는 법에 대해 논함.

기본 개념: ReSTIR GI<sup>[1](#ref_1)</sup>.
서브 개념: RIS<sup>[2](#ref_2)</sup>, ReSTIR<sup>[3](#ref_3)</sup>.

![shot2022-04-04_21-12-11](https://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-12-11.png)
Ground truth (10k SPP)

* 문 위에 밝은 램프 두 개.
* 바닥에 반사된 빛에서 나오는 간접광 덕분에 건물의 앞부분을 볼 수 있음.

경로 추적법을 사용하면 광선이 어디로 튈지를 결정해야함. 보통은 정반사인지, 난반사인지를 확인하고, 이 BRDF에 따라 중요도 표집하여 광선을 쏨. 그럼 또 이 새로 생성한 광선에 대해서 또 똑같은 일을 해줌. 그렇게 계속 광선을 새로 만들다보면 언젠가는 광원에 충돌하거나, 적당한 시기에 종료하고, 다시 시작할 것임.

일단 여기선 **난반사**만 고려하도록 함:

그 결과:

![shot2022-04-04_21-13-23](https://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-13-23.png)
경로 추적 BRDF 표집 (1 SPP)

별로임. 이거 개선하려면 다음 이벤트 추정(NEE)를 사용하면 개선 가능. 즉, 튕길 때마다 빛이 어디있는지를 찾아 빛의 기여도를 구한 다음, 그 기여도를 다시 경로를 되돌아가면서 반영해주는 것임:

![shot2022-04-04_21-13-45](https://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-13-45.png)
1회 튕김 BRDF 표집 + NEE (1 SPP)

훨씬 나아짐. 근데 문제가 이게 난반사다보니까 사실상 모든 방향으로 광선이 튕기게 됨. 그러다보니 빛이 그리 많이 들어오진 않음. 만약 성공적으로 지금 빛을 받고 있는 땅바닥에 광선이 갔다고 쳐도, 그 다음 프레임에는 또 딴데 가있을 거임. 그러니까 한 번 써준 걸 재사용해주는게 더 나을거고, 더 나아가서 주변 픽셀들이랑 쓰까 묵을 수 있게 해주면 좋을 것임. 그렇기 때문에 ReSTIR<sup>[3](#ref_3)</sup>이 좋은 것임.

근데 원래 ReSTIR처럼 빛을 표집해서 저장해두는게 아니라, **경로를 저장**해둘거임.

1. 람베르트 난반사 BRDF에서 표집을 해서 방향 하나 겟
2. 이 방향으로 광선 쏨
3. 이 광선이 충돌한 표면에서 나오는 방사 휘도를 구함

![image-14](https://www.zyanidelab.com/content/images/2022/04/image-14.png)
ReSTIR GI 표본 생성하는 법

이게 끝임. 여기서 추가적으로 해줘야되는건 경로에 알맞고, 저장하고 읽기 적당한 RIS 가중치를 구하는 것:

<div style="text-align: center" id="SampleRelativeWeight">
<img src="https://raw.githubusercontent.com/Alegruz/alegruz.github.io/master/Images/ReStirGi/SampleRelativeWeight.png" alt="SampleRelativeWeight">
<p>RIS 가중치</p>
</div>

여기서 p(y)는 BRDF에서 표집(균일 표집이든... 코사인 가중치 표집이든...)하는 것에 대한 PDF로 써주면 됨. 

![TargetPdf](/Images/ReStirGi/TargetPdf.png)는:

![TargetFunctionEquation](/Images/ReStirGi/TargetFunctionEquation.png)

즉

![image-5](https://www.zyanidelab.com/content/images/2022/04/image-5.png)

여기서 &rho;를 BRDF라 치면, L<sub>i</sub>는 표본으로부터 들어오는 방사 휘도(우리가 충돌한 표면에서 떠날 때 L<sub>o</sub>라 부름), N은 법선, L은 방향 벡터 표본.

여튼 표본이 있으니, 이걸 저장소에 저장해서 ReSTIR로 시간적으로, 공간적으로 재사용해서 개꿀빨면 됨.

![image-15](https://www.zyanidelab.com/content/images/2022/04/image-15.png)
ReSTIR GI 시공간 재표집.

결과:
![shot2022-04-04_21-14-31](https://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-14-31.png)
1회 튕김 ReSTIR GI + NEE (1 SPP)

픽셀들이 바닥으로 광선을 보내야한다는 걸 알기라도 하는 듯. 근데 공간 재사용할 때 주의해야하는데, 야코비 판별식으로 기하 차이를 사용해야함. 이건 논문의 4.3절에 잘 설명되어있음.

지금까지는 난반사만 다뤘는데, 사실 정반사를 사용해줘도 문제 없음. 뭐 시점만 바뀔 뿐이지 저장소, 가중치, 경로 다 똑같음.

근데 정반사, 특히나 반사율이 그리 날카롭지 않은 거친 금속 표면 등에서는 ReSTIR GI가 더 성능이 좋아짐:

![shot2022-03-30_19-01-32](https://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-03-30_19-01-32.png)
표면의 거친 정도가 서로 다른 금으로 된 기둥. (10k SPP)

위의 그림에서 거친 정도는 서로 다름(20%, 40%, 60%, 80%, 100%). 광원은 지금 카메라 뒤쪽에 있고, 벽의 일부에 의해 가려져있으므로, 나머지 기둥들은 간접광을 받을 것임.

여기에 아까처럼 BRDF 표집 + NEE:

![shot2022-03-30_17-46-09](https://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-03-30_17-46-09.png)
1회 튕김 BRDF 표집 + NEE (1 SPP)

막 그렇게 좋은 결과는 아님. 그렇다고 위에서처럼 바로 ReSTIR GI를 적용해줄 수 있는 것은 아님. 왜냐면 시야 벡터까지 고려해줘야함. 만약 한 방향으로 계속 빛이 들어오고 있을 때 고개를 돌리기만 해도 이게 확 변할 수도 있음. 심지어 0이 될 수도 있음. RIS 가중치를 좀 수정해야함:

<div style="text-align: center">
<img src="https://raw.githubusercontent.com/Alegruz/alegruz.github.io/master/Images/ReStirGi/SampleRelativeWeight.png" alt="SampleRelativeWeight">
</div>

여기서 그냥 아까처럼 p(y)는 표집할 정반사 BRDF에 대한 PDF, ![TargetPdf](/Images/ReStirGi/TargetPdf.png)는 똑같이 ![image-5](https://www.zyanidelab.com/content/images/2022/04/image-5.png)으로 해줘도 둘 다 결국 시야에 의해 달라지는 값들임. 고개 조금 까딱 돌렸는데 시간적 저장소에 대한 가중치 싹 다 다시 계산하고 그래야함? 아니면 걍 전부 0으로 만들고 다시 계산? 그럴거면 ReSTIR 왜 함? 그럼 또 야코비안 등판해야됨?

![image-16](https://www.zyanidelab.com/content/images/2022/04/image-16.png)
정반사와 시야의 관계

벌써부터 시야 벡터 때문에 화가 나지만, 이걸 수학적으로 어캐 하든, 어캐 대~충 해야함.

여기선 대~충하는 방법 사용할 것임.

RIS의 특징 중 하나는 반복적으로 사용할 수 있다는 점임<sup>[4](#ref_4)</sup>. 즉, 적당히 최적인 p(y)로 표집을 해서 적당한 ![TargetPdf](/Images/ReStirGi/TargetPdf.png)을 구하고, 이걸로 더 나은 PDF를 또 구하고... 이렇게 반복해나가는 것임. ![TargetPdf](/Images/ReStirGi/TargetPdf.png)에다가 값싼 함수를 써줄 수도 있음. GGX 대신 퐁이라든가... 결국 시야 벡터 때문에 이러는 것.

여튼 대충 나름? 최?적?인 p(y)를 구하는 것부터 시작하면 됨. 즉, 시야 벡터가 바뀌어도 그 값이 그대로인 PDF를 구해야함. 이거, "균일표집"이네요. 즉, 표본이 정반사 방향에 있기만 하면 시야 벡터가 바뀌어도 됨. 이 아이디어는 여기서<sup>[5](#ref_5)</sup> 온거임.

---

<div id="ref_1">1. Yaobin Ouyang, Shiqiu Liu, Markus Kettunen, Matt Pharr, Jacopo Pantaleoni. <a href="https://research.nvidia.com/publication/2021-06_restir-gi-path-resampling-real-time-path-tracing">ReSTIR GI: Path Resampling for Real-Time Path Tracing</a>.  Computer Graphics Forum (Proceedings of High Performance Graphics). Thursday, June 24, 2021</div>
<div id="ref_2">2. Justin Talbot, David Cline, Parris Egbert. <a href="https://justintalbot.com/publication/importance-resampling/">Resampled Importance Sampling</a>. Eurographics Symposium on Rendering. June, 2005.</div>
<div id="ref_3">3. Benedikt Bitterli, Chris Wyman, Matt Pharr, Peter Shirley, Aaron Lefohn, Wojciech Jarosz. <a href="https://cs.dartmouth.edu/wjarosz/publications/bitterli20spatiotemporal.html">Spatiotemporal reservoir resampling for real-time ray tracing with dynamic direct lighting</a>. ACM Transactions on Graphics (Proceedings of SIGGRAPH), 39(4), July 2020.</div>
<div id="ref_4">4. Alexey Panteleev. Chris Wyman. <a href="https://youtu.be/QWsfohf0Bqk">Part 1: Rendering Games With Millions of Ray Traced Lights</a>. NVIDIA Developer, YouTube.</div>
<div id="ref_5">5. Mr. Zyanide. <a href="https://www.zyanidelab.com/uniform-sampling-phong/">Uniform Sampling Phong BRDF</a>. </div>