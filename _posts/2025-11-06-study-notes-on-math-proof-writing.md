---
layout: post
title: Study Notes on Math - Proof Writing
date: 2025-11-06 16:05:00 +0900
categories: math logic
lang: "en"
---

# 1. Sentential Logic: The Foundation of Proof

<style>
/* Suggested CSS Enhancements for the Blog Theme */
.argument-box {
    border-left: 5px solid #007bff; /* A nice blue color */
    background-color: #f8f9fa; /* Light grey background */
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
    font-style: italic;
    white-space: pre-wrap; /* Ensures the line breaks are respected */
}
.valid {
    color: #28a745; /* Green for valid */
    font-weight: bold;
}
.invalid {
    color: #dc3545; /* Red for invalid */
    font-weight: bold;
}
.key-term {
    font-weight: bold;
    color: #6f42c1; /* Purple for key terms */
}
</style>

## 1.1. Deductive Reasoning and Logical Connectives 🧠

**Proof writing** in mathematics begins with **valid reasoning**. We often use **deductive reasoning**, where the truth of the premises *guarantees* the truth of the conclusion.

---

### **Example 1: A Valid Argument**

<div class="argument-box">
Premise 1: All humans are mortal.
Premise 2: Socrates is a human.
Conclusion: Socrates is mortal.
</div>

If both <span class="key-term">premises</span> are true, the <span class="key-term">conclusion</span> **must** also be true. This is a classic example of **deductive reasoning** and a **valid argument**.

---

### **Example 2: An Invalid Argument (Fallacy of the Alternative)**

It is crucial to differentiate between an argument where the conclusion *might* be true and one where it *must* be true.

<div class="argument-box">
Premise 1: Either it is raining or it is sunny. ($$R \vee S$$)
Premise 2: Either it is sunny or it is cloudy. ($$S \vee C$$)
Conclusion: Therefore, it is raining or it is cloudy. ($$R \vee C$$)
</div>

This argument is <span class="invalid">invalid</span>. If it is **sunny** ($$S$$is true,$$R$$and$$C$$ are false), both premises are true, but the conclusion ($$R \vee C$$) is false.

---

### **Example 3: An Invalid Argument (Affirming the Consequent)**

<div class="argument-box">
Premise 1: If it is raining, then the ground is wet. ($$R \rightarrow W$$)
Premise 2: The ground is wet. ($$W$$)
Conclusion: Therefore, it is raining. ($$R$$)
</div>

This is also <span class="invalid">invalid</span>. The ground could be wet because of a sprinkler—the conclusion does not **necessarily** follow. This specific flaw is known as **Affirming the Consequent**.

> The reason we analyze **validity** is to ensure our reasoning is **sound**. Invalid arguments, whether in math or everyday life, lead to false beliefs or incorrect conclusions.

---

### **Abstraction into Symbolic Logic**

To analyze arguments objectively, mathematicians <span class="key-term">abstract</span> complex statements into simpler, symbolic forms.

For the argument:
> Premise 1: Either it is raining or it is sunny.
> Premise 2: It is not sunny.
> Conclusion: Therefore, it is raining.

We can assign:
* **R** $$\rightarrow$$ "It is raining."
* **S** $$\rightarrow$$ "It is sunny."

The argument becomes:
<div class="argument-box">
Premise 1: $$R \vee S$$
Premise 2: $$\neg S$$
Conclusion: Therefore, $$R$$
</div>
This is a **valid** form known as **Disjunctive Syllogism**.

### **Logical Connectives: The Building Blocks**

The operations like "or" and "not" are called **logical connectives**—the fundamental building blocks of logical arguments.

| Logical Connective | Name | Connective Symbol | Description |
| :--- | :--- | :--- | :--- |
| **Negation** | Not | **$$\neg$$** | Before a statement (e.g., $$\neg P$$) |
| **Conjunction** | And | **$$\wedge$$** | Between two statements (e.g., $$P \wedge Q$$) |
| **Disjunction** | Or | **$$\vee$$** | Between two statements (e.g., $$P \vee Q$$) |

---

### **Applying Connective Symbols**

1.  Let **P** be "It is raining," and **Q** be "It is sunny."
    * Negation: