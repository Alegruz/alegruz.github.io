#define _CRTDBG_MAP_ALLOC
#include <stdlib.h>
#include <crtdbg.h>

#ifdef _DEBUG
    #define DBG_NEW new ( _NORMAL_BLOCK , __FILE__ , __LINE__ )
    // Replace _NORMAL_BLOCK with _CLIENT_BLOCK if you want the
    // allocations to be of _CLIENT_BLOCK type
#else
    #define DBG_NEW new
#endif

#include <iostream>

#include "String.h"

int main(int, char**)
{
#ifdef _DEBUG
    _CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
#endif

    {
        String s00;

        // String s10(0);
        String s11(24);

        String s20("Hi");
        char test21[] = { 'H', 'e', 'l', 'l', 'o', '\0' };
        String s21(test21);
        char test22[] = { 'H', 'e', 'l', 'l', 'o' };
        String s22(test22);
        // String s23(nullptr);

        String s30(s20);
        String s31(s00);
        // String s32(s10);
        String s33(s11);
        String s34(s21);

        String s40(std::move(s30));
        String s41(std::move(s31));
        // String s42(std::move(s32));
        String s43(std::move(s33));
        String s44(std::move(s34));
    }

    {
        String s0 = "Hello";
        String s1 = "World!";

        String s2 = s0;
        String s3 = s1;

        String s4 = "What";
        String s5 = "Nope";

        s4 = s0;
        s5 = s1;

        s4 = "Cyka";
        s5 = "Blyat";

        s4 = std::move(s2);
        s5 = std::move(s3);
    }

    std::cout << "Hello, world!\n";

    _CrtDumpMemoryLeaks();
}
