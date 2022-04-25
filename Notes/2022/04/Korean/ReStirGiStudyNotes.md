# ReSTIR GI 공부 노트 (2022.04.21)
[Home](../../../../README.md)

# ReSTIR 논문 요약

## 배경

![RenderingEquation](/Images/ReStirGi/RenderingEquation.png)

결국 위의 방정식 구하자고 하는 짓임.

결국 아래 그림처럼 되는 것임:

![RenderingEquationFigure0](/Images/ReStirGi/RenderingEquationFigure0.png)

여기서 f는 BSDF.

> ### BRDF, BTDF, BSDF
> <p><a href="https://commons.wikimedia.org/wiki/File:BSDF05_800.png#/media/File:BSDF05_800.png"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d8/BSDF05_800.png" alt="BSDF05 800.png"></a><br>By <a href="https://en.wikipedia.org/wiki/User:Jurohi" class="extiw" title="w:User:Jurohi">Jurohi</a> (<a href="https://en.wikipedia.org/wiki/User_talk:Jurohi" class="extiw" title="w:User talk:Jurohi">talk</a>) (<a href="https://en.wikipedia.org/wiki/Special:ListFiles/Jurohi" class="extiw" title="w:Special:ListFiles/Jurohi">Uploads</a>) - <span class="int-own-work" lang="en">Own work</span>, <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=109584028">Link</a></p>
>
> * Bidirectional **Reflectance** Distribution Function
> * Bidirectional **Transmittance** Distribution Function
> * Bidirectional **Scattering** Distribution Function
> 
> BRDF는 "이 표면 위의 한 점에 &omega;<sub>i</sub>의 방향으로 빛이 들어왔을 때, &omega;<sub>o</sub>의 방향으로 빛이 **반사**될 확률이 얼마일까요?라는 의미.
> 
> BTDF는 "이 표면 위의 한 점에 &omega;<sub>i</sub>의 방향으로 빛이 들어왔을 때, &omega;<sub>o</sub>의 방향으로 빛이 **투과**할 확률이 얼마일까요?
> 
> BSDF는 "이 표면 위의 한 점에 &omega;<sub>i</sub>의 방향으로 빛이 들어왔을 때, &omega;<sub>o</sub>의 방향으로 빛이 **산란**할 확률이 얼마일까요?

위의 예시 그림에서 L<sub>i</sub> 곧바로 광원에서 오는 빛이지만, 사실 광원이 아닌 곳에서 들어오는 간접광일 수도 있음:

![RenderingEquationFigure0](/Images/ReStirGi/RenderingEquationFigure0.png)

L<sub>i</sub>는 들어오는 빛이고, L<sub>o</sub>는 나가는 빛.

즉, **x**로 들어오는 입사광 ![TheRenderingEquationIncomingLight](/Images/RayTracingEssentials/TheRenderingEquationIncomingLight.gif)은 결국 해당 경로를 추적했을 때 가장 가까운 지점 y, 즉 TRACE(**x**, &omega;<sub>i</sub>)에서 **x** 방향으로 나가는 빛, 즉 L<sub>o</sub>(**y**, **x** - **y**) = L<sub>o</sub>(TRACE(**x**, &omega;<sub>i</sub>), -&omega;<sub>i</sub>)임.

여튼 결론적으로 **x** 지점에서 카메라로 오는 빛을 구하는게 핵심인데, **x** 지점에서의 빛은 결국 &Omega;라는 반구 방향으로 오는 빛들을 전부 합한 것임.

![TheRenderingEquationByElement](/Images/RayTracingEssentials/TheRenderingEquationByElement.jpeg)

근데 이게 컴퓨터에서 사실 적분을 하라는 건 컴퓨터보고 죽으라는 소리임.

![WhatNowDie](/Images/ReStirGi/WhatNowDie.jpg)

그럼 이걸 도대체 어떻게 구하라는걸까?

사실 이건 간단하다. 민주주의 체제를 생각하면 된다. 민주주의 체제에서 뭔가 국가적인 판단을 하려면 사실 모든 국민에게 물어보면 된다. 모든 국민이 투표를 하면 끝이지만, 이게 실질적으로 불가능하다. 그러니 행정부, 입법부, 사법부라는 것이 국민을 대표하여 존재하는 것.

이처럼 빛도 대표자를 뽑으면 된다.


근데 아무나 뽑으면 나라가 지옥으로 향하는 고속도로 하이패스 끊듯이, 빛도 마찬가지다. **x**로 들어오는 빛도 좋은 친구를 뽑아야 한다.

# ReSTIR 구현

## ReSTIR DX12

[원글 링크](https://github.com/lindayukeyi/ReSTIR_DX12)
[원글 링크](https://github.com/tatran5/Reservoir-Spatio-Temporal-Importance-Resampling-ReSTIR)

Falcor 3.1

### Pass

1. Ray Traced GBuffer Pass
    * G 버퍼 및 초기 candidate 생성
    * 레이트레이싱 G버퍼 + RIS
    * 우선 카메라에서 광선을 쏴서 G버퍼 만들고, 여기에 픽셀별로 저장소를 사용해서 RIS 결과를 저장함.
    * 이때 저장소는 다음 패스에서 서로 공유할 수 있도록 따로 텍스처를 만들어서 공유함.
2. Shadow Detection Pass
    * 보이지 않는 표본 삭제
    * 첫번째 패스에서 선택한 candidate에서 픽셀 당 하나의 그림자 광선을 쏨. 만약 occluded 되어있다면 저장소의 가중치를 0으로 두어 혆재 픽셀이 빛 표본으로부터 아무런 기여를 받지 못하게 해줌. 이러면 occluded된 표본들은 근처 픽셀에 전달되지 않게 됨.
3. Temporal Reuse Pass (픽셀 셰이더)
    * 시간적 재사용
    * 픽셀 셰이더 사용 시작. 텍스처만 입력 받아서 계산 몇가지 해주는 것임.ㄴ
    * 현재 픽셀에서의 충돌 지점이 주어질 때, 이걸 직전 프레임의 view-projection 행렬과 곱해줘서 직전 프레임에서의 해당 픽셀 위치를 구함.
    * 직전 프레임에서의 픽셀에서의 저장소와 현재 저장소를 합쳐줌.
    * 표본 수는 clamping 해주고, weight을 scaling해주어 무지성으로 표본의 수가 증가하지 않도록 방지해줌.
4. Spatial Reuse Pass (spatial reuse iteration 번) (픽셀 셰이더)
    * 공간적 재사용
    * 현재 저장소와, 화면 공간 기준 이웃 저장소 몇 개를 합쳐줌. 근처 픽셀이 비슷한 조명 상태나 occlusion을 갖고 있다면 좋은 표본을 재사용해줄 수 있음. 하지만 bias가 발생함. bias 한정해주는 법은 둘 간의 법선의 차이나 depth 차이가 특정 범위를 넘어서면 해당 이웃의 저장소는 무시하는 식으로 해줄 수 있음.
5. Shader Pixel Pass
    * 최종 색 계산
    * 저장소랑 기존 패스의 G버퍼를 바탕으로 최종 이미지 겟.
6. ATrous Denoise Pass (filter limit 번) (픽셀 셰이더. 선택 사항)
    * ATrous 디노이저
7. Copy to Output Pass (디버깅용)
    * 선택한 텍스처를 채널로 출력

#### `RayTracedGBufferPass`

![RayTracedGBufferPass](/Images/ReStirGi/RayTracedGBufferPass.png)

위의 Pass에 그나마 유사한 것으로 생각하는 Falcor 자체 제공 Pass로는 GBufferRt가 있는 듯:

![GBufferBase](/Images/ReStirGi/GBufferBase.png)

![GBufferRT](/Images/ReStirGi/GBufferRT.png)

## Fast Volume Rendering with Spatiotemporal Reservoir Resampling (Volumetric ReSTIR)

[원글 링크](https://github.com/DQLin/VolumetricReSTIRRelease)

* Daqi Lin. University of Utah.
* Chris Wyman. NVIDIA.
* Cem Yuksel. University of Utah.

Falcor 4.2

### Pass

## Dynamic Diffuse Global Illumination Resampling

[원글 링크](https://research.nvidia.com/publication/2021-12_dynamic-diffuse-global-illumination-resampling)

### Pass

## Rendering Many Lights with Grid-Based Reservoirs

[원글 링크](http://cwyman.org/papers/rtg2-manyLightReGIR.pdf)

### Pass

# ReSTIR GI 관련 블로그 글

## 정반사용 ReSTIR GI

[원글 링크](http://www.zyanidelab.com/restir-gi-for-specular-bounces/)


다중튕김 전역조명에서 제일 중요한 건 "어느 방향"으로 광선을 쏠 건지임. 실시간에선 광선을 여러 개 못 쓰니까 광선 하나 하나가 의미가 있어야 함.

이 글에서는 특히나 정반사 환경에서 의미 있는 광선을 표집하는 법에 대해 논함.

기본 개념: ReSTIR GI<sup>[1](#ref_1)</sup>.
서브 개념: RIS<sup>[2](#ref_2)</sup>, ReSTIR<sup>[3](#ref_3)</sup>.

![shot2022-04-04_21-12-11](http://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-12-11.png)
Ground truth (10k SPP)

* 문 위에 밝은 램프 두 개.
* 바닥에 반사된 빛에서 나오는 간접광 덕분에 건물의 앞부분을 볼 수 있음.

경로 추적법을 사용하면 광선이 어디로 튈지를 결정해야함. 보통은 정반사인지, 난반사인지를 확인하고, 이 BRDF에 따라 중요도 표집하여 광선을 쏨. 그럼 또 이 새로 생성한 광선에 대해서 또 똑같은 일을 해줌. 그렇게 계속 광선을 새로 만들다보면 언젠가는 광원에 충돌하거나, 적당한 시기에 종료하고, 다시 시작할 것임.

일단 여기선 **난반사**만 고려하도록 함:

그 결과:

![shot2022-04-04_21-13-23](http://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-13-23.png)
경로 추적 BRDF 표집 (1 SPP)

별로임. 이거 개선하려면 다음 이벤트 추정(NEE)를 사용하면 개선 가능. 즉, 튕길 때마다 빛이 어디있는지를 찾아 빛의 기여도를 구한 다음, 그 기여도를 다시 경로를 되돌아가면서 반영해주는 것임:

![shot2022-04-04_21-13-45](http://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-13-45.png)
1회 튕김 BRDF 표집 + NEE (1 SPP)

훨씬 나아짐. 근데 문제가 이게 난반사다보니까 사실상 모든 방향으로 광선이 튕기게 됨. 그러다보니 빛이 그리 많이 들어오진 않음. 만약 성공적으로 지금 빛을 받고 있는 땅바닥에 광선이 갔다고 쳐도, 그 다음 프레임에는 또 딴데 가있을 거임. 그러니까 한 번 써준 걸 재사용해주는게 더 나을거고, 더 나아가서 주변 픽셀들이랑 쓰까 묵을 수 있게 해주면 좋을 것임. 그렇기 때문에 ReSTIR<sup>[3](#ref_3)</sup>이 좋은 것임.

근데 원래 ReSTIR처럼 빛을 표집해서 저장해두는게 아니라, **경로를 저장**해둘거임.

1. 람베르트 난반사 BRDF에서 표집을 해서 방향 하나 겟
2. 이 방향으로 광선 쏨
3. 이 광선이 충돌한 표면에서 나오는 방사 휘도를 구함

![image-14](http://www.zyanidelab.com/content/images/2022/04/image-14.png)
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

![image-5](http://www.zyanidelab.com/content/images/2022/04/image-5.png)

여기서 &rho;를 BRDF라 치면, L<sub>i</sub>는 표본으로부터 들어오는 방사 휘도(우리가 충돌한 표면에서 떠날 때 L<sub>o</sub>라 부름), N은 법선, L은 방향 벡터 표본.

여튼 표본이 있으니, 이걸 저장소에 저장해서 ReSTIR로 시간적으로, 공간적으로 재사용해서 개꿀빨면 됨.

![image-15](http://www.zyanidelab.com/content/images/2022/04/image-15.png)
ReSTIR GI 시공간 재표집.

결과:
![shot2022-04-04_21-14-31](http://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-04-04_21-14-31.png)
1회 튕김 ReSTIR GI + NEE (1 SPP)

픽셀들이 바닥으로 광선을 보내야한다는 걸 알기라도 하는 듯. 근데 공간 재사용할 때 주의해야하는데, 야코비 판별식으로 기하 차이를 사용해야함. 이건 논문의 4.3절에 잘 설명되어있음.

지금까지는 난반사만 다뤘는데, 사실 정반사를 사용해줘도 문제 없음. 뭐 시점만 바뀔 뿐이지 저장소, 가중치, 경로 다 똑같음.

근데 정반사, 특히나 반사율이 그리 날카롭지 않은 거친 금속 표면 등에서는 ReSTIR GI가 더 성능이 좋아짐:

![shot2022-03-30_19-01-32](http://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-03-30_19-01-32.png)
표면의 거친 정도가 서로 다른 금으로 된 기둥. (10k SPP)

위의 그림에서 거친 정도는 서로 다름(20%, 40%, 60%, 80%, 100%). 광원은 지금 카메라 뒤쪽에 있고, 벽의 일부에 의해 가려져있으므로, 나머지 기둥들은 간접광을 받을 것임.

여기에 아까처럼 BRDF 표집 + NEE:

![shot2022-03-30_17-46-09](http://www.zyanidelab.com/content/images/size/w1000/2022/04/shot2022-03-30_17-46-09.png)
1회 튕김 BRDF 표집 + NEE (1 SPP)

막 그렇게 좋은 결과는 아님. 그렇다고 위에서처럼 바로 ReSTIR GI를 적용해줄 수 있는 것은 아님. 왜냐면 시야 벡터까지 고려해줘야함. 만약 한 방향으로 계속 빛이 들어오고 있을 때 고개를 돌리기만 해도 이게 확 변할 수도 있음. 심지어 0이 될 수도 있음. RIS 가중치를 좀 수정해야함:

<div style="text-align: center">
<img src="https://raw.githubusercontent.com/Alegruz/alegruz.github.io/master/Images/ReStirGi/SampleRelativeWeight.png" alt="SampleRelativeWeight">
</div>

여기서 그냥 아까처럼 p(y)는 표집할 정반사 BRDF에 대한 PDF, ![TargetPdf](/Images/ReStirGi/TargetPdf.png)는 똑같이 ![image-5](http://www.zyanidelab.com/content/images/2022/04/image-5.png)으로 해줘도 둘 다 결국 시야에 의해 달라지는 값들임. 고개 조금 까딱 돌렸는데 시간적 저장소에 대한 가중치 싹 다 다시 계산하고 그래야함? 아니면 걍 전부 0으로 만들고 다시 계산? 그럴거면 ReSTIR 왜 함? 그럼 또 야코비안 등판해야됨?

![image-16](http://www.zyanidelab.com/content/images/2022/04/image-16.png)
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
<div id="ref_5">5. Mr. Zyanide. <a href="http://www.zyanidelab.com/uniform-sampling-phong/">Uniform Sampling Phong BRDF</a>. </div>

```
@startuml
RenderPass <|-- RayTracedGBufferPass
class RayTracedGBufferPass {
    +{static} create(): SharedPtr
    +~RayTracedGBufferPass()
    #RayTracedGBufferPass()
    #initialize(RenderContext*, ResourceManager::SharedPtr): bool
    #execute(RenderContext*)
    #initScene(RenderContext*, Scene::SharedPtr)
    #requiresScene(): bool
    #usesRayTracing(): bool
    #mpRays: RayLaunch::SharedPtr
    #mpScene: RtScene::SharedPtr
    #mBgColor: vec3
    #mFrameCount: uint32_t
}
@enduml
```

```
@startuml
RenderPass <|-- GBufferBase

enum GBufferBase::SamplePattern {
   Center
   DirectX
   Halton
   Stratified
}

class GBufferBase {
   +renderUI(Gui::Widgets&)
   +execute(RenderContext*, const RenderData&)
   +getScriptingDictionary(): Dictionary
   +setScene(RenderContext*, const Scene::SharedPtr&)
   #GBufferBase(const Info&)
   #parseDictionary(const Dictionary&)
   #setCullMode(RasterizerState::CullMode mode)
   #updateFrameDim(const uint2)
   #updateSamplePattern()
   #getOutput(const RenderData&, const std::string&): Texture::SharedPtr
   #mpScene: Scene::SharedPtr
   #mpSampleGenerator: CPUSampleGenerator::SharedPtr
   #mFrameCount: uint32_t
   #mFrameDim: uint2
   #mInvFrameDim: float2
   #mVBufferFormat: ResourceFormat
   #mOutputSizeSelection: RenderPassHelpers::IOSize
   #mFixedOutputSize: uint2
   #mSamplePattern: SamplePattern
   #mSampleCount: uint32_t
   #mUseAlphaTest: bool
   #mAdjustShadingNormals: bool
   #mForceCullMode: bool
   #mCullMode: RasterizerState::CullMode
   #mOptionsChanged: bool
   #{static} registerBindings(pybind11::module&)
   #friend getPasses(Falcor::RenderPassLibrary&)
}
@enduml
```

```
@startuml
GBufferBase <|-- GBufferRT


class GBufferRT::struct {
    +pProgram: RtProgram::SharedPtr
    +pVars: RtProgramVars::SharedPtr
}

class GBufferRT {
   +{static} kInfo: const Info
   +{static} create(RenderContext*, const Dictionary&): SharedPtr
   +reflect(const CompileData&): RenderPassReflection
   +execute(RenderContext*, const RenderData&)
   +renderUI(Gui::Widgets&)
   +getScriptingDictionary(): Dictionary
   +setScene(RenderContext*, const Scene::SharedPtr&)
   -executeRaytrace(RenderContext*, const RenderData&)
   -executeCompute(RenderContext*, const RenderData&)
   -getShaderDefines(const RenderData&) Program::DefineList
   -setShaderData(const ShaderVar&, const RenderData&)
   -recreatePrograms()
   -GBufferRT(const Dictionary&)
   -parseDictionary(const Dictionary&)
   -mComputeDOF: bool
   -mpSampleGenerator: SampleGenerator::SharedPtr
   -mLODMode: TexLODMode
   -mUseTraceRayInline: bool
   -mUseDOF: bool
   -mRaytrace: struct
   -mpComputePass: ComputePass::SharedPtr
}
@enduml
```