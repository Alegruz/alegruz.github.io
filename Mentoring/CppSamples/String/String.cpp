#include "String.h"

#include <cassert>
#include <iostream>

constexpr bool IsStringSame(const char* pStrLhs, const char* pStrRhs) noexcept;
constexpr bool IsStringSame(const char* pStrLhs, size_t lhsCount, const char* pStrRhs) noexcept;
constexpr bool IsStringSame(const char* pStrLhs, const char* pStrRhs, size_t rhsCount) noexcept;
constexpr bool IsStringSame(const char* pStrLhs, size_t lhsCount, const char* pStrRhs, size_t rhsCount) noexcept;
constexpr void CopyString(char* pDest, const char* pSource) noexcept;
constexpr void CopyString(char* pDest, size_t destSize, const char* pSource) noexcept;
constexpr void CopyString(char* pDest, size_t destSize, const char* pSource, size_t sourceSize) noexcept;
constexpr size_t GetLength(const char* pStr) noexcept;
constexpr uint32_t RoundUpToNextPowerOfTwo(uint32_t number) noexcept;
constexpr void SetToZero(char* pData, size_t size);

String::String() noexcept
    : String(DEFAULT_CAPACITY)
{
    std::cout << "DEFAULT CONSTRUCTOR" << std::endl;
}

String::String(size_t capacity) noexcept
    : mSize(0)
    , mCapacity(capacity)
    , mpString(new char[mCapacity])
{
    Clear();
    std::cout << "String(size_t capacity)" << std::endl;
}

String::String(const char* pStr) noexcept
    : mSize(::GetLength(pStr))
    , mCapacity(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(mSize + 1))))
    , mpString(new char[mCapacity])
{
    Clear();
    CopyString(mpString, mSize, pStr, mSize);
    std::cout << "String(const char* pStr)" << std::endl;
}

String::String(const String& other) noexcept
{
    if (this != &other)
    {
        mSize = other.mSize;
        mCapacity = RoundUpToNextPowerOfTwo(static_cast<uint32_t>(mSize + 1));

        mpString = new char[mCapacity];
        Clear();

        CopyString(mpString, mSize, other.mpString, other.mSize);
    }
    std::cout << "COPY CONSTRUCTOR" << std::endl;
}

String::String(String&& other) noexcept
    : mSize(other.mSize)
    , mCapacity(other.mCapacity)
    , mpString(other.mpString)
{
    other.mSize = 0;
    other.mCapacity = 0;
    other.mpString = nullptr;
    std::cout << "MOVE CONSTRUCTOR" << std::endl;
}

String::~String() noexcept
{
    if (mpString)
    {
        delete[] mpString;
    }
    std::cout << "DESTRUCTOR" << std::endl;
}

String& String::operator=(const String& str) noexcept
{
    if (this != &str)
    {
        if (str.mSize + 1 >= mCapacity)
        {
            mSize = str.mSize;
            mCapacity = static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(mSize + 1)));

            delete[] mpString;
            mpString = new char[mCapacity];
            Clear();
        }

        CopyString(mpString, mSize, str.mpString, str.mSize);
    }
    std::cout << "ASSIGNMENT OPERATOR (COPY)" << std::endl;
    return *this;
}

String& String::operator=(String&& str) noexcept
{
    if (this != &str)
    {
        mSize = str.mSize;
        mCapacity = str.mCapacity;
        delete[] mpString;
        mpString = str.mpString;

        str.mSize = 0;
        str.mCapacity = 0;
        str.mpString = nullptr;
    }
    std::cout << "ASSIGNMENT OPERATOR (MOVE)" << std::endl;
    return *this;
}

String& String::operator=(const char* pStr) noexcept
{
    size_t size = ::GetLength(pStr);

    if (size + 1 >= mCapacity)
    {
        mSize = size;
        mCapacity = static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(mSize + 1)));

        delete[] mpString;
        mpString = new char[mCapacity];
        Clear();
    }

    CopyString(mpString, mSize, pStr, size);
    std::cout << "ASSIGNMENT OPERATOR (COPY C STR)" << std::endl;
    return *this;
}

constexpr char& String::operator[](size_t pos) noexcept
{
    return mpString[pos];
}

constexpr const char& String::operator[](size_t pos) const noexcept
{
    return mpString[pos];
}

constexpr const char* String::GetCString() const noexcept
{
    return mpString;
}

constexpr bool String::IsEmpty() const noexcept
{
    return mSize == 0;
}

constexpr size_t String::GetSize() const noexcept
{
    return mSize;
}

constexpr size_t String::GetLength() const noexcept
{
    return GetSize();
}

constexpr void String::SetCapacity(size_t capacity) noexcept
{
    if (capacity > mCapacity)
    {
        size_t newCapacity = static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(capacity)));
        char* pNewString = new char[newCapacity];
        Clear();

        CopyString(pNewString, mSize, mpString, mSize);
        delete[] mpString;
        mpString = pNewString;
        mCapacity = newCapacity;
    }
}

constexpr size_t String::GetCapacity() const noexcept
{
    return mCapacity;
}

constexpr void String::ShrinkToFit() noexcept
{
    size_t shrinkedCapacity = static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(mSize + 1)));

    if (shrinkedCapacity < mCapacity)
    {
        char* pNewString = new char[shrinkedCapacity];
        Clear();

        CopyString(pNewString, mSize, mpString, mSize);
        delete[] mpString;
        mpString = pNewString;
        mCapacity = shrinkedCapacity;
    }
}

constexpr void String::Clear() noexcept
{
    SetToZero(mpString, mCapacity);
}

constexpr String& String::Insert(size_t index, const char* pStr) noexcept
{
    assert(index < mSize);

    size_t strLength = ::GetLength(pStr);

    return Insert(index, pStr, strLength);
}

constexpr String& String::Insert(size_t index, const char* pStr, size_t count) noexcept
{
    assert(index < mSize);

    if (mSize + count + 1 >= mCapacity)
    {
        size_t newCapacity = static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(mSize + count + 1)));
        SetCapacity(newCapacity);
    }
    CopyString(mpString + index + count, count, mpString + index, mSize - index);
    CopyString(mpString + index, mCapacity - index - 1, pStr, count);

    mSize += count;

    return *this;
}

constexpr String& String::Insert(size_t index, const String& str) noexcept
{
    return Insert(index, str.mpString, str.mSize);
}

constexpr String& String::Erase(size_t index) noexcept
{
    return Erase(index, 1);
}

constexpr String& String::Erase(size_t index, size_t count) noexcept
{
    assert(count > 0);

    for (size_t i = index; i + count <= mSize; ++i)
    {
        mpString[i] = mpString[i + count];
    }
    mSize -= count;
    SetToZero(mpString + mSize, mCapacity - mSize);

    return *this;
}

constexpr void String::PushBack(char ch) noexcept
{
    Insert(mSize, &ch, 1);
}

constexpr void String::PopBack() noexcept
{
    Erase(mSize - 1, 1);
}

constexpr String& String::operator+=(const String& str) noexcept
{
    return Insert(mSize, str);
}

constexpr String& String::operator+=(char ch) noexcept
{
    return Insert(mSize, &ch, 1);
}

constexpr String& String::operator+=(const char* pStr) noexcept
{
    return Insert(mSize, pStr);
}

constexpr int32_t String::Compare(const String& str) const noexcept
{
    return compare(str.mpString, mSize);
}

constexpr int32_t String::Compare(const char* pStr) const noexcept
{
    return compare(pStr, ::GetLength(pStr));
}

constexpr int32_t String::compare(const char* pStr, size_t count) const noexcept
{
    size_t size = mSize > count ? count : mSize;

    for (size_t i = 0; i < size; ++i)
    {
        if (mpString[i] < pStr[i])
        {
            return -1;
        }
        else if (mpString[i] > pStr[i])
        {
            return 1;
        }
    }

    return 0;
}

constexpr bool IsStringSame(const char* pStrLhs, const char* pStrRhs) noexcept
{
    return IsStringSame(pStrLhs, ::GetLength(pStrLhs), pStrRhs, ::GetLength(pStrRhs));
}

constexpr bool IsStringSame(const char* pStrLhs, size_t lhsCount, const char* pStrRhs) noexcept
{
    return IsStringSame(pStrLhs, lhsCount, pStrRhs, ::GetLength(pStrRhs));
}

constexpr bool IsStringSame(const char* pStrLhs, const char* pStrRhs, size_t rhsCount) noexcept
{
    return IsStringSame(pStrLhs, ::GetLength(pStrLhs), pStrRhs, rhsCount);
}

constexpr bool IsStringSame(const char* pStrLhs, size_t lhsCount, const char* pStrRhs, size_t rhsCount) noexcept
{
    if (lhsCount != rhsCount)
    {
        return false;
    }
    size_t sizeIn64 = lhsCount / sizeof(uint64_t);

    for (size_t i = 0; i < sizeIn64; ++i)
    {
        if (reinterpret_cast<const uint64_t*>(pStrLhs)[i] != reinterpret_cast<const uint64_t*>(pStrRhs)[i])
        {
            return false;
        }
    }

    size_t remainingSizeAfter64 = lhsCount % sizeof(uint64_t);
    size_t sizeIn32 = remainingSizeAfter64 / sizeof(uint32_t);

    for (size_t i = 0; i < sizeIn32; ++i)
    {
        if (reinterpret_cast<const uint32_t*>(pStrLhs)[i + sizeIn64 * (sizeof(uint64_t) / sizeof(uint32_t))]
            != reinterpret_cast<const uint32_t*>(pStrRhs)[i + sizeIn64 * (sizeof(uint64_t) / sizeof(uint32_t))])
        {
            return false;
        }
    }

    size_t remainingSizeAfter32 = remainingSizeAfter64 % sizeof(uint32_t);
    size_t sizeIn16 = remainingSizeAfter32 / sizeof(uint16_t);

    for (size_t i = 0; i < sizeIn16; ++i)
    {
        if (reinterpret_cast<const uint32_t*>(pStrLhs)[i
            + sizeIn64 * (sizeof(uint64_t) / sizeof(uint16_t))
            + sizeIn32 * (sizeof(uint32_t) / sizeof(uint16_t))]
            != reinterpret_cast<const uint32_t*>(pStrRhs)[i
            + sizeIn64 * (sizeof(uint64_t) / sizeof(uint16_t))
            + sizeIn32 * (sizeof(uint32_t) / sizeof(uint16_t))])
        {
            return false;
        }
    }

    size_t remainingSize = remainingSizeAfter32 % sizeof(uint16_t);

    for (size_t i = 0; i < remainingSize; ++i)
    {
        if (pStrLhs[i + sizeIn64 * sizeof(uint64_t)
            + sizeIn32 * sizeof(uint32_t)
            + sizeIn16 * sizeof(uint16_t)]
            != pStrRhs[i + sizeIn64 * sizeof(uint64_t)
            + sizeIn32 * sizeof(uint32_t)
            + sizeIn16 * sizeof(uint16_t)])
        {
            return false;
        }
    }
}

constexpr void CopyString(char* pDest, const char* pSource) noexcept
{
    CopyString(pDest, ::GetLength(pDest), pSource, ::GetLength(pSource));
}

constexpr void CopyString(char* pDest, size_t destSize, const char* pSource) noexcept
{
    CopyString(pDest, destSize, pSource, ::GetLength(pSource));
}

constexpr void CopyString(char* pDest, size_t destSize, const char* pSource, size_t sourceSize) noexcept
{
    size_t size = destSize > sourceSize ? sourceSize : destSize;

    for (uint32_t i = 0; i < size; ++i)
    {
        pDest[i] = pSource[i];
    }
    pDest[size] = '\0';
}

constexpr size_t GetLength(const char* pStr) noexcept
{
    size_t length = 0;
    while (*pStr != '\0' && length < ~0x00)
    {
        ++pStr;
        ++length;
    }
    return length;
}

constexpr uint32_t RoundUpToNextPowerOfTwo(uint32_t number) noexcept
{
    --number;
    number |= number >> 1;
    number |= number >> 2;
    number |= number >> 4;
    number |= number >> 8;
    number |= number >> 16;
    number++;

    return number;
}

constexpr void SetToZero(char* pData, size_t size)
{
    size_t sizeIn64 = size / sizeof(uint64_t);

    for (size_t i = 0; i < sizeIn64; ++i)
    {
        reinterpret_cast<uint64_t*>(pData)[i] = 0x00;
    }

    size_t remainingSizeAfter64 = size % sizeof(uint64_t);
    size_t sizeIn32 = remainingSizeAfter64 / sizeof(uint32_t);

    for (size_t i = 0; i < sizeIn32; ++i)
    {
        reinterpret_cast<uint32_t*>(pData)[i + sizeIn64 * (sizeof(uint64_t) / sizeof(uint32_t))] = 0x00;
    }

    size_t remainingSizeAfter32 = remainingSizeAfter64 % sizeof(uint32_t);
    size_t sizeIn16 = remainingSizeAfter32 / sizeof(uint16_t);

    for (size_t i = 0; i < sizeIn16; ++i)
    {
        reinterpret_cast<uint32_t*>(pData)[i 
            + sizeIn64 * (sizeof(uint64_t) / sizeof(uint16_t)) 
            + sizeIn32 * (sizeof(uint32_t) / sizeof(uint16_t))] = 0x00;
    }

    size_t remainingSize = remainingSizeAfter32 % sizeof(uint16_t);
    
    for (size_t i = 0; i < remainingSize; ++i)
    {
        pData[i + sizeIn64 * sizeof(uint64_t) 
            + sizeIn32 * sizeof(uint32_t)
            + sizeIn16 * sizeof(uint16_t)] = 0;
    }
}

String operator+(const String& lhs, const String& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + rhs.mSize + 1))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(const String& lhs, const char* pStrRhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + ::GetLength(pStrRhs) + 1))));
    str = lhs;

    str += pStrRhs;

    return str;

    return str;
}

String operator+(const String& lhs, char rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + 2))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(const char* pStrLhs, const String& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(::GetLength(pStrLhs) + rhs.mSize + 1))));
    str = pStrLhs;

    str += rhs;

    return str;
}

String operator+(char lhs, const String& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(1 + rhs.mSize + 1))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(String&& lhs, String&& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + rhs.mSize + 1))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(String&& lhs, const String& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + rhs.mSize + 1))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(String&& lhs, const char* pStrRhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + ::GetLength(pStrRhs) + 1))));
    str = lhs;

    str += pStrRhs;

    return str;
}

String operator+(String&& lhs, char rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + 2))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(const String& lhs, String&& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(lhs.mSize + rhs.mSize + 1))));
    str = lhs;

    str += rhs;

    return str;
}

String operator+(const char* pStrLhs, String&& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(::GetLength(pStrLhs) + rhs.mSize + 1))));
    str = pStrLhs;

    str += rhs;

    return str;
}

String operator+(char lhs, String&& rhs) noexcept
{
    String str(static_cast<size_t>(RoundUpToNextPowerOfTwo(static_cast<uint32_t>(1 + rhs.mSize + 1))));
    str = lhs;

    str += rhs;

    return str;
}

constexpr bool operator==(const String& lhs, const String& rhs) noexcept
{
    return IsStringSame(lhs.mpString, lhs.mSize, rhs.mpString, rhs.mSize);
}

constexpr bool operator!=(const String& lhs, const String& rhs) noexcept
{
    return !(lhs == rhs);
}

constexpr bool operator<(const String& lhs, const String& rhs) noexcept
{
    return lhs.Compare(rhs) < 0;
}

constexpr bool operator<=(const String& lhs, const String& rhs) noexcept
{
    return lhs.Compare(rhs) <= 0;
}

constexpr bool operator>(const String& lhs, const String& rhs) noexcept
{
    return lhs.Compare(rhs) > 0;;
}

constexpr bool operator>=(const String& lhs, const String& rhs) noexcept
{
    return lhs.Compare(rhs) >= 0;
}

constexpr bool operator==(const String& lhs, const char* pStrRhs) noexcept
{
    return IsStringSame(lhs.mpString, lhs.mSize, pStrRhs);
}

constexpr bool operator==(const char* pStrLhs, const String& rhs) noexcept
{
    return IsStringSame(pStrLhs, rhs.mpString, rhs.mSize);
}

constexpr bool operator!=(const String& lhs, const char* pStrRhs) noexcept
{
    return !(lhs == pStrRhs);
}

constexpr bool operator!=(const char* pStrLhs, const String& rhs) noexcept
{
    return !(pStrLhs == rhs);
}

constexpr bool operator<(const String& lhs, const char* pStrRhs) noexcept
{
    return lhs.Compare(pStrRhs) < 0;
}

constexpr bool operator<(const char* pStrLhs, const String& rhs) noexcept
{
    return rhs.Compare(pStrLhs) >= 0;
}

constexpr bool operator<=(const String& lhs, const char* pStrRhs) noexcept
{
    return lhs.Compare(pStrRhs) <= 0;
}

constexpr bool operator<=(const char* pStrLhs, const String& rhs) noexcept
{
    return rhs.Compare(pStrLhs) > 0;
}

constexpr bool operator>(const String& lhs, const char* pStrRhs) noexcept
{
    return lhs.Compare(pStrRhs) > 0;
}

constexpr bool operator>(const char* pStrLhs, const String& rhs) noexcept
{
    return rhs.Compare(pStrLhs) <= 0;
}

constexpr bool operator>=(const String& lhs, const char* pStrRhs) noexcept
{
    return lhs.Compare(pStrRhs) >= 0;
}

constexpr bool operator>=(const char* pStrLhs, const String& rhs) noexcept
{
    return rhs.Compare(pStrLhs) < 0;
}
