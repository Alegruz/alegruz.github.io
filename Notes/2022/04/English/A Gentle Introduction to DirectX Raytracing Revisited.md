# A Gentle Introduction to DirectX Raytracing Revisited (2022.04.26)
[Home](../../../../README.md)

![A Gentle Introduction to DirectX Raytracing](http://cwyman.org/code/dxrTutors/dxr_tutors.md.html)

This article is based on the tutorial above. The revisited article will be using the same tutorial, but with the newer Falcor 5.1.

# Tutorial 1

## 1. Defining a New Render Pass

Create a render pass in `/Source/RenderPasses/` by running:

```
> .\make_new_pass_project.bat ConstantColorPass
```

Add the project into Falcor and remove Debug/Release configurations.

```cpp
#include "Falcor.h"

using namespace Falcor;

class ConstantColorPass : public RenderPass
{
public:
    using SharedPtr = std::shared_ptr<ConstantColorPass>;

    static const Info kInfo;
    
    static SharedPtr create(RenderContext* pRenderContext = nullptr, const Dictionary& dict = {});

    virtual Dictionary getScriptingDictionary() override;
    virtual RenderPassReflection reflect(const CompileData& compileData) override;
    virtual void compile(RenderContext* pRenderContext, const CompileData& compileData) override {}
    virtual void execute(RenderContext* pRenderContext, const RenderData& renderData) override;
    virtual void renderUI(Gui::Widgets& widget) override;
    virtual void setScene(RenderContext* pRenderContext, const Scene::SharedPtr& pScene) override {}
    virtual bool onMouseEvent(const MouseEvent& mouseEvent) override { return false; }
    virtual bool onKeyEvent(const KeyboardEvent& keyEvent) override { return false; }

private:
    ConstantColorPass() : RenderPass(kInfo) {}
};
```

## 2. Implementing a New Render Pass

```cpp
// ConstantColorPass.cpp
const RenderPass::Info ConstantColorPass::kInfo { "ConstantColorPass", "Constant Color Options." };

...

namespace
{
    const ChannelList kOutputChannels =
    {
        { "color",  "gOutputColor", "Output color", false, ResourceFormat::RGBA32Float },
    };
}

...

RenderPassReflection ConstantColorPass::reflect(const CompileData& compileData)
{
    // Define the required resources here
    RenderPassReflection reflector;

    addRenderPassOutputs(reflector, kOutputChannels);

    return reflector;
}
```
# Tutorial 2

# Tutorial 3

As discussed in our tutorial introduction, our goal is to provide a simple infrastructure for getting a DirectX Raytracing application up and running without digging around in low-level API specification documents. Tutorial 3 continues with our sequence covering some infrastructure basics before we get to the meat of implementing a path tracer. If you wish to move on to a tutorial with actual DirectX Raytracing programming, jump ahead to [Tutorial 4](#tutorial-4).

## 1. Why Create a G-Buffer?

[Tutorial 2](#tutorial-2) showed you how to use a more complex RenderPass to launch a simple HLSL pixel shader. Before moving on to actually using ray tracing in [Tutorial 4](#tutorial-4), we'll walk through how to interact with Falcor-loaded scene files and create a set of traditional vertex and pixel shaders that run over this geometry during rasterization.

The shaders we use to demonstrate this will create a [G-Buffer](https://en.wikipedia.org/wiki/Deferred_shading) that we can use to accelerate ray tracing in later tutorials. In fact, [Tutorial 5](#tutorial-5) uses a *hybrid renderer* that rasterizes primary visibility and only uses DirectX Raytracing to shoot shadow rays.

As an additional benefit, in order to extract the data to populate our G-buffer, we walk through various Falcor shader utilities that allow you to access scene properties like textures and materials.

## 2. A More Complex Rendering Pipeline

In this particular tutorial, `SimpleGBufferPass` creates a [G-Buffer](https://en.wikipedia.org/wiki/Deferred_shading) containing each pixel's position, surface normal, diffuse color, specular color, and z-buffer.

### 3. Handling the Falcor Scene and Launching Rasterization

Start by looking in `SimpleGBufferPass.h`. This should look familiar, as the boilerplate is nearly identical to that from the `RenderPass`es we wrote in [Tutorials 1](#tutorial-1) [and 2](#tutorial-2). The major difference is in our pass' member variables:

```cpp
// Internal state
Scene::SharedPtr                mpScene;

// Rasterization resources
struct
{
    GraphicsState::SharedPtr pState;
    GraphicsProgram::SharedPtr pProgram;
    GraphicsVars::SharedPtr pVars;
} mRaster;
```

#### 3.1. Initializing our G-Buffer Pass

Our `SimpleGBufferPass::reflect(const CompileData& compileData)` method is slightly more complex that in our prior passes:

```cpp
RenderPassReflection SimpleGBufferPass::reflect(const CompileData& compileData)
{
    RenderPassReflection reflector;
    const uint2 sz = RenderPassHelpers::calculateIOSize(mOutputSizeSelection, mFixedOutputSize, compileData.defaultTexDims);

    // Add the required depth output. This always exists.
    reflector.addOutput(kDepthName, "Depth buffer").format(ResourceFormat::D32Float).bindFlags(Resource::BindFlags::DepthStencil).texture2D(sz.x, sz.y);

    // Add all the other outputs.
    // The default channels are written as render targets, the rest as UAVs as there is way to assign/pack render targets yet.
    addRenderPassOutputs(reflector, kGBufferChannels, Resource::BindFlags::RenderTarget, sz);

    return reflector;
}
```

We then create our raster structuer `mRaster` by pointing its `pProgram` to our vertex and pixel shaders.

#### 3.2 Handle Scene Loading

Our tutorial application automatically adds a GUI button to allow users to open a scene file. When Falcor loads a scene, all passes have the option to process it by overriding the `RenderPass::setScene(RenderContext* pRenderContext, const Scene::SharedPtr& pScene)` method:

```cpp
void GBufferRaster::setScene(RenderContext* pRenderContext, const Scene::SharedPtr& pScene)
{
    mpScene = pScene;
    updateSamplePattern();

    mRaster.pVars = nullptr;

    if (pScene)
    {
        if (pScene->getMeshVao() && pScene->getMeshVao()->getPrimitiveTopology() != Vao::Topology::TriangleList)
        {
            throw RuntimeError("GBufferRaster: Requires triangle list geometry due to usage of SV_Barycentrics.");
        }

        mRaster.pProgram->addDefines(pScene->getSceneDefines());
        mRaster.pProgram->setTypeConformances(pScene->getTypeConformances());
    }
}
```

For our G-buffer class, this is very simple:
* Store a copy of the scene pointer so we can access it later.

#### 3.3 Launching our G-Buffer Rasterization pass

Now that we initialized our rendering resources and loaded our scene file, we can launch our G-buffer rasterization.

```
void GBufferRaster::execute(RenderContext* pRenderContext, const RenderData& renderData)
{
    // Update frame dimension based on render pass output.
    auto pDepth = renderData[kDepthName]->asTexture();
    FALCOR_ASSERT(pDepth);
    updateFrameDim(uint2(pDepth->getWidth(), pDepth->getHeight()));

    // Bind primary channels as render targets and clear them.
    for (size_t i = 0; i < kGBufferChannels.size(); ++i)
    {
        Texture::SharedPtr pTex = getOutput(renderData, kGBufferChannels[i].name);
        mpFbo->attachColorTarget(pTex, uint32_t(i));
    }
    pRenderContext->clearFbo(mpFbo.get(), float4(0), 1.f, 0, FboAttachmentType::Color);

    // Clear extra output buffers.
    clearRenderPassChannels(pRenderContext, kGBufferExtraChannels, renderData);

    // If there is no scene, clear depth buffer and return.
    if (mpScene == nullptr)
    {
        pRenderContext->clearDsv(pDepth->getDSV().get(), 1.f, 0);
        return;
    }

    // Set program defines.
    mRaster.pProgram->addDefine("ADJUST_SHADING_NORMALS", mAdjustShadingNormals ? "1" : "0");
    mRaster.pProgram->addDefine("USE_ALPHA_TEST", mUseAlphaTest ? "1" : "0");

    // For optional I/O resources, set 'is_valid_<name>' defines to inform the program of which ones it can access.
    // TODO: This should be moved to a more general mechanism using Slang.
    mRaster.pProgram->addDefines(getValidResourceDefines(kGBufferChannels, renderData));
    mRaster.pProgram->addDefines(getValidResourceDefines(kGBufferExtraChannels, renderData));

    // Create program vars.
    if (!mRaster.pVars)
    {
        mRaster.pVars = GraphicsVars::create(mRaster.pProgram.get());
    }

    // Setup depth pass to use same configuration as this pass.
    RasterizerState::CullMode cullMode = mForceCullMode ? mCullMode : kDefaultCullMode;
    mpDepthPrePass->setCullMode(cullMode);
    mpDepthPrePass->setOutputSize(mFrameDim);
    mpDepthPrePass->setAlphaTest(mUseAlphaTest);

    // Execute depth pass and copy depth buffer.
    mpDepthPrePassGraph->execute(pRenderContext);
    auto pPreDepth = mpDepthPrePassGraph->getOutput("DepthPrePass.depth")->asTexture();
    FALCOR_ASSERT(pPreDepth && pPreDepth->getWidth() == mFrameDim.x && pPreDepth->getHeight() == mFrameDim.y);
    mpFbo->attachDepthStencilTarget(pPreDepth);
    pRenderContext->copyResource(pDepth.get(), pPreDepth.get());

    // Bind extra channels as UAV buffers.
    for (const auto& channel : kGBufferExtraChannels)
    {
        Texture::SharedPtr pTex = getOutput(renderData, channel.name);
        mRaster.pVars[channel.texname] = pTex;
    }

    mRaster.pVars["PerFrameCB"]["gFrameDim"] = mFrameDim;
    mRaster.pState->setFbo(mpFbo); // Sets the viewport

    // Rasterize the scene.
    mpScene->rasterize(pRenderContext, mRaster.pState.get(), mRaster.pVars.get(), cullMode);

    mFrameCount++;
}
```

# Tutorial 4

# Tutorial 5