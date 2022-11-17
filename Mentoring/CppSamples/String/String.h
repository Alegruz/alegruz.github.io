#pragma once

#include <cstdint>

class String final
{
    friend String operator+(const String& lhs, const String& rhs) noexcept;
    friend String operator+(const String& lhs, const char* pStrRhs) noexcept;
    friend String operator+(const String& lhs, char rhs) noexcept;
    friend String operator+(const char* pStrLhs, const String& rhs) noexcept;
    friend String operator+(char lhs, const String& rhs) noexcept;
    friend String operator+(String&& lhs, String&& rhs) noexcept;
    friend String operator+(String&& lhs, const String& rhs) noexcept;
    friend String operator+(String&& lhs, const char* pStrRhs) noexcept;
    friend String operator+(String&& lhs, char rhs) noexcept;
    friend String operator+(const String& lhs, String&& rhs) noexcept;
    friend String operator+(const char* pStrLhs, String&& rhs) noexcept;
    friend String operator+(char lhs, String&& rhs) noexcept;

    friend constexpr bool operator==(const String& lhs, const String& rhs) noexcept;
    friend constexpr bool operator!=(const String& lhs, const String& rhs) noexcept;
    friend constexpr bool operator<(const String& lhs, const String& rhs) noexcept;
    friend constexpr bool operator<=(const String& lhs, const String& rhs) noexcept;
    friend constexpr bool operator>(const String& lhs, const String& rhs) noexcept;
    friend constexpr bool operator>=(const String& lhs, const String& rhs) noexcept;

    friend constexpr bool operator==(const String& lhs, const char* pStrRhs) noexcept;
    friend constexpr bool operator==(const char* pStrLhs, const String& rhs) noexcept;
    friend constexpr bool operator!=(const String& lhs, const char* pStrRhs) noexcept;
    friend constexpr bool operator!=(const char* pStrLhs, const String& rhs) noexcept;
    friend constexpr bool operator<(const String& lhs, const char* pStrRhs) noexcept;
    friend constexpr bool operator<(const char* pStrLhs, const String& rhs) noexcept;
    friend constexpr bool operator<=(const String& lhs, const char* pStrRhs) noexcept;
    friend constexpr bool operator<=(const char* pStrLhs, const String& rhs) noexcept;
    friend constexpr bool operator>(const String& lhs, const char* pStrRhs) noexcept;
    friend constexpr bool operator>(const char* pStrLhs, const String& rhs) noexcept;
    friend constexpr bool operator>=(const String& lhs, const char* pStrRhs) noexcept;
    friend constexpr bool operator>=(const char* pStrLhs, const String& rhs) noexcept;
public:
    // Constructors
    // 
    // Default constructor. 
    // Constructs empty string (zero size and unspecified capacity).
    String() noexcept;
    // Constructs empty string with given capacity.
    String(size_t capacity) noexcept;
    // Constructs the string with the contents initialized with 
    // a copy of the null-terminated character string pointed to by pString.
    // The length of the string is determined by the first null character.
    String(const char* pStr) noexcept;
    // Copy constructor. 
    // Constructs the string with a copy of the contents of other.
    String(const String& other) noexcept;
    // Move constructor. 
    // Constructs the string with the contents of other using move semantics. 
    // other is left in valid, but unspecified state.
    String(String&& other) noexcept;
    // String cannot be constructed from nullptr
    String(std::nullptr_t) = delete;

    // Destructor
    ~String() noexcept;

    // operator=
    String& operator=(const String& str) noexcept;
    String& operator=(String&& str) noexcept;
    String& operator=(const char* pStr) noexcept;
    constexpr String& operator=(std::nullptr_t) = delete;

    // Element Access
    constexpr char& operator[](size_t pos) noexcept;
    constexpr const char& operator[](size_t pos) const noexcept;
    constexpr const char* GetCString() const noexcept;

    // Capacity
    [[nodiscard]] constexpr bool IsEmpty() const noexcept;
    constexpr size_t GetSize() const noexcept;
    constexpr size_t GetLength() const noexcept;
    constexpr void SetCapacity(size_t capacity) noexcept;
    constexpr size_t GetCapacity() const noexcept;
    constexpr void ShrinkToFit() noexcept;

    // Operations
    constexpr void Clear() noexcept;
    constexpr String& Insert(size_t index, const char* pStr) noexcept;
    constexpr String& Insert(size_t index, const char* pStr, size_t count) noexcept;
    constexpr String& Insert(size_t index, const String& str) noexcept;
    constexpr String& Erase(size_t index) noexcept;
    constexpr String& Erase(size_t index, size_t count) noexcept;
    constexpr void PushBack(char ch) noexcept;
    constexpr void PopBack() noexcept;
    constexpr String& operator+=(const String& str) noexcept;
    constexpr String& operator+=(char ch) noexcept;
    constexpr String& operator+=(const char* pStr) noexcept;
    constexpr int32_t Compare(const String& str) const noexcept;
    constexpr int32_t Compare(const char* pStr) const noexcept;
private:
    constexpr int32_t compare(const char* pStr, size_t count) const noexcept;

private:
    static constexpr const size_t DEFAULT_CAPACITY = 16;

private:
    size_t mSize;
    size_t mCapacity;
    char* mpString;
};

//String operator+(const String& lhs, const String& rhs) noexcept;
//String operator+(const String& lhs, const char* pStrRhs) noexcept;
//String operator+(const String& lhs, char rhs) noexcept;
//String operator+(const char* pStrLhs, const String& rhs) noexcept;
//String operator+(char lhs, const String& rhs) noexcept;
//String operator+(String&& lhs, String&& rhs) noexcept;
//String operator+(String&& lhs, const String& rhs) noexcept;
//String operator+(String&& lhs, const char* pStrRhs) noexcept;
//String operator+(String&& lhs, char rhs) noexcept;
//String operator+(const String& lhs, String&& rhs) noexcept;
//String operator+(const char* pStrLhs, String&& rhs) noexcept;
//String operator+(char lhs, String&& rhs) noexcept;
//
//constexpr bool operator==(const String& lhs, const String& rhs) noexcept;
//constexpr bool operator!=(const String& lhs, const String& rhs) noexcept;
//constexpr bool operator<(const String& lhs, const String& rhs) noexcept;
//constexpr bool operator<=(const String& lhs, const String& rhs) noexcept;
//constexpr bool operator>(const String& lhs, const String& rhs) noexcept;
//constexpr bool operator>=(const String& lhs, const String& rhs) noexcept;
//
//constexpr bool operator==(const String& lhs, const char* pStrRhs) noexcept;
//constexpr bool operator==(const char* pStrLhs, const String& rhs) noexcept;
//constexpr bool operator!=(const String& lhs, const char* pStrRhs) noexcept;
//constexpr bool operator!=(const char* pStrLhs, const String& rhs) noexcept;
//constexpr bool operator<(const String& lhs, const char* pStrRhs) noexcept;
//constexpr bool operator<(const char* pStrLhs, const String& rhs) noexcept;
//constexpr bool operator<=(const String& lhs, const char* pStrRhs) noexcept;
//constexpr bool operator<=(const char* pStrLhs, const String& rhs) noexcept;
//constexpr bool operator>(const String& lhs, const char* pStrRhs) noexcept;
//constexpr bool operator>(const char* pStrLhs, const String& rhs) noexcept;
//constexpr bool operator>=(const String& lhs, const char* pStrRhs) noexcept;
//constexpr bool operator>=(const char* pStrLhs, const String& rhs) noexcept;