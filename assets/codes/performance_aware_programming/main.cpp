#define _CRT_SECURE_NO_WARNINGS
#include "common.h"
#include <limits>
#include <memory>
#include <string>

#if defined(RT_EMSCRIPTEN)
#include <emscripten/emscripten.h>
#endif  // defined(RT_EMSCRIPTEN)

enum class eInstructionType : uint8_t
{
    INVALID,
    MOV,
    COUNT,
};

enum class eMoveType : uint8_t
{
    RM_TO_FROM_RM,
};

struct InstructionTrieNode final
{
    bool Bit;
    eInstructionType InstructionType;
    std::unique_ptr<InstructionTrieNode> TrueChild;
    std::unique_ptr<InstructionTrieNode> FalseChild;

    RT_FORCE_INLINE constexpr InstructionTrieNode() noexcept : Bit(false), InstructionType(eInstructionType::INVALID), TrueChild(nullptr), FalseChild(nullptr) {}
    RT_FORCE_INLINE constexpr InstructionTrieNode& operator[](const uint8_t bit) noexcept { return bit == 1 ? *TrueChild : *FalseChild; }
};

void BuildTrie(InstructionTrieNode& inoutRootNode, const uint32_t depth)
{
    if (depth == 0)
    {
        return;
    }

    inoutRootNode.TrueChild = std::make_unique<InstructionTrieNode>();
    inoutRootNode.TrueChild->Bit = true;
    inoutRootNode.FalseChild = std::make_unique<InstructionTrieNode>();
    inoutRootNode.FalseChild->Bit = false;

    BuildTrie(*inoutRootNode.TrueChild, depth - 1);
    BuildTrie(*inoutRootNode.FalseChild, depth - 1);
}

static InstructionTrieNode sInstructionTrieRoot = InstructionTrieNode();
static std::string sDisassemblyOutput;

#if defined(RT_EMSCRIPTEN)
extern "C" EMSCRIPTEN_KEEPALIVE
#endif  // defined(RT_EMSCRIPTEN)
void initialize()
{
    BuildTrie(sInstructionTrieRoot, 8); // Build a trie with a depth of 8
    sInstructionTrieRoot[1][0][0][0][1][0].InstructionType = eInstructionType::MOV;
}

#if defined(RT_EMSCRIPTEN)
extern "C" EMSCRIPTEN_KEEPALIVE
#endif  // defined(RT_EMSCRIPTEN)
uint8_t* decode(const uint8_t* input_stream, const size_t length)
{
    for(size_t i = 0; i < length; ++i)
    {
        const uint8_t byte = input_stream[i];
        InstructionTrieNode* currentNode = &sInstructionTrieRoot;

        for (uint8_t bitIndex = 0; bitIndex < 8; ++bitIndex)
        {
            const bool bit = (byte & (1 << (7 - bitIndex))) != 0;
            if (bit)
            {
                if (currentNode->TrueChild)
                {
                    currentNode = currentNode->TrueChild.get();
                }
                else
                {
                    return nullptr; // Invalid instruction
                }
            }
            else
            {
                if (currentNode->FalseChild)
                {
                    currentNode = currentNode->FalseChild.get();
                }
                else
                {
                    return nullptr; // Invalid instruction
                }
            }

            if (currentNode->InstructionType != eInstructionType::INVALID)
            {
                // Process the instruction
                if (currentNode->InstructionType == eInstructionType::MOV)
                {
                    sDisassemblyOutput.append("MOV ");
                }
            }
        }
    }

    return reinterpret_cast<uint8_t*>(const_cast<char*>(sDisassemblyOutput.c_str()));
}

#if !defined(RT_EMSCRIPTEN)
int main()
{
    initialize(); // Initialize the module
    return 0;
}
#endif  // NOT defined(RT_EMSCRIPTEN)