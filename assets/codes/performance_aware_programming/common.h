#pragma once

#if defined(_WIN32) || defined(__WIN32__) || defined(WIN32) || defined(__WIN64__) || defined(_WIN64)
#define RT_FORCE_INLINE __forceinline
#else	// NOT (defined(_WIN32) || defined(__WIN32__) || defined(WIN32) || defined(__WIN64__) || defined(_WIN64))
#define RT_FORCE_INLINE inline __attribute__((always_inline))
#define RT_EMSCRIPTEN
#endif	//	NOT (defined(_WIN32) || defined(__WIN32__) || defined(WIN32) || defined(__WIN64__) || defined(_WIN64))
