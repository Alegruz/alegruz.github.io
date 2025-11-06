---
layout: post
title: Study Notes on Math - Proof Writing
date: 2025-11-06 16:05:00 +0900
categories: math logic
lang: "en"
---

# 1. Sentential Logic

## 1.1. Deductive Reasoning and Logical Connectives

Premise 1: All humans are mortal.
Premise 2: Socrates is a human.
Conclusion: Socrates is mortal.

If both **premises** are true, then the **conclusion** must also be true. This is an example of **deductive reasoning**.

This kind of easy example might hide the fact that the **argument** is **invalid**. For example,

Premise 1: Either it is raining or it is sunny.
Premise 2: Either it is sunny or it is cloudy.
Conclusion: Therefore, it is raining or it is cloudy.

This argument is invalid because even if both premises are true, the conclusion does not necessarily follow. It could be sunny, which would make both premises true, but the conclusion false. Let's give another example:

Premise 1: If it is raining, then the ground is wet.
Premise 2: The ground is wet.
Conclusion: Therefore, it is raining.

This argument is also invalid. The ground could be wet for other reasons, such as someone watering the garden. Thus, even if both premises are true, the conclusion does not necessarily follow.

The reason we need to know whether an argument is **valid** or not is to ensure that our reasoning is sound. If we base our conclusions on invalid arguments, we may end up with false beliefs or incorrect conclusions. This doesn't only apply to mathematics, but also to everyday life. For example, if we hear a news report that makes an argument based on invalid reasoning, we may be misled into believing something that is not true. Therefore, it is important to be able to identify valid and invalid arguments in order to make informed decisions and form accurate beliefs.

For example, let's try to come up with a bit controversial argument, and tell whether it is valid or not.

Premise 1: Most of East Asians are Chinese.
Premise 2: People love when people speak their native language.
Conclusion: Therefore, speaking Chinese to an East Asian person will make them happy.

Even before we talk about validity, everyone knows that saying "ni hao" to every East Asian person you meet is not a good idea. Does that intuition come from the invalidity of the argument? Yes, it does. Even if both premises are true, the conclusion does not necessarily follow. There are many East Asian people who are not Chinese, and some even don't like being spoken to in Chinese. Thus, the argument is invalid.

Let's try a trickier one.

Premise 1: Jean Valjean stole a bread.
Premise 2: Jean Valjean was extremely hungry and poor.
Conclusion: Jean Valjean had a justifiable reason for stealing the bread.

This argument is also invalid. Even if both premises are true, the conclusion does not necessarily follow. Just because Jean Valjean was hungry and poor does not mean that his reason for stealing the bread was justifiable. He could have hated the baker and stolen the bread out of spite. Thus, the argument is invalid.

We are surrounded with arguments every day. Some are valid, some are invalid. But some of the premises, conclusions, or the entire argument itself can be difficult to understand. This is where mathematics comes in. Mathematicians are good at abstracting complex ideas into simpler forms, and this is exactly what we need to do in order to analyze arguments. For example,

Premise 1: Either it is raining or it is sunny.
Premise 2: It is not sunny.
Conclusion: Therefore, it is raining.

This is not a very complex argument, but we can still represent it in a simpler form using symbols. Let's use "R" to represent "it is raining" and "S" to represent "it is sunny". Then, we can rewrite the argument as follows:

Premise 1: R or S.
Premise 2: Not S.
Conclusion: Therefore, R.

We have abstracted the argument into a simpler form using symbols. However, what we can do more is to abstract certain operations in the argument. For example, what does "or" mean? What does "not" mean? These are called **logical connectives**, and they are the building blocks of logical arguments. By understanding these connectives, we can analyze arguments more effectively. These logical connectives are:

1. **Negation**, or Not
2. **Conjunction**, or And
3. **Disjunction**, or Or

Just as we have abstracted statements into symbols, we can also abstract these logical connectives into symbols known as **connective symbols**. They are:

| Logical Connective | Name        | Connective Symbol | Description            |
|--------------------|-------------|-------------------|------------------------|
| Negation           | Not         | ¬                 | Before a statement     |
| Conjunction        | And         | ∧                 | Between two statements |
| Disjunction        | Or          | ∨                 | Between two statements |

For example, let's use connective symbols to rewrite the following statements:

1. Let P be "It is raining.", and Q be "It is sunny."
   - Negation: ¬P (It is not raining.)
   - Conjunction: P ∧ Q (It is raining and it is sunny.)
   - Disjunction: P ∨ Q (It is raining or it is sunny.)
2. Let A be "Jean Valjean stole a bread.", and B be "Jean Valjean was extremely hungry and poor."
   - Negation: ¬A (Jean Valjean did not steal a bread.)
   - Conjunction: A ∧ B (Jean Valjean stole a bread and he was extremely hungry and poor.)
   - Disjunction: A ∨ B (Jean Valjean stole a bread or he was extremely hungry and poor.)

Just like the use of parentheses in arithmetic expressions, we can use parentheses to group statements together. For example,
(P ∨ Q) ∧ ¬R
means "Either it is raining or it is sunny, and it is not windy."

Statements that correctly use the connective symbols or parentheses are called **well-formed formulas** or **formula**. For example, statements like (P ∨ Q) ∧ ¬R are well-formed formulas, but statements like P ∨ ∧ Q are not well-formed formulas.

## 1.2. Truth Tables

## 1.3. Variables and Sets