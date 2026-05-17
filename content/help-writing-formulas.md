---
title: Help with Writing Formulas and Equations
date: May 17, 2026
---

This guide provides a comprehensive overview of how to write mathematical notation in **Notebook** using LaTeX syntax powered by the KaTeX engine.

## Basics: Delimiters

Notebook uses dollar signs as delimiters for mathematical expressions.

### Inline Math
Use single dollar signs `$ ... $` for math that should appear within a sentence.
*   **Input**: ``The energy-mass relation is `$E = mc^2$` in physics.``
*   **Rendered**: The energy-mass relation is $E = mc^2$ in physics.

### Block Math
Use double dollar signs `$$ ... $$` for math that should be centered and on its own line.
*   **Input**:
    ```markdown
    $$
    a^2 + b^2 = c^2
    $$
    ```
*   **Rendered**:
    $$
    a^2 + b^2 = c^2
    $$

## Common Mathematical Structures

### Superscripts and Subscripts
Use `^` for superscripts and `_` for subscripts. Use curly braces `{}` for multiple characters.
*   **Input**: `$x_{i}^2 + y_{i}^2 = R^2$`
*   **Rendered**: $x_{i}^2 + y_{i}^2 = R^2$

### Fractions
Use `\frac{numerator}{denominator}`.
*   **Input**: `$\frac{1}{n} \sum_{i=1}^{n} x_i$`
*   **Rendered**: $\frac{1}{n} \sum_{i=1}^{n} x_i$

### Roots
Use `\sqrt{...}` for square roots and `\sqrt[n]{...}` for n-th roots.
*   **Input**: `$\sqrt{b^2 - 4ac}$` and `$\sqrt[3]{x}$`
*   **Rendered**: $\sqrt{b^2 - 4ac}$ and $\sqrt[3]{x}$

### Summations and Integrals
*   **Summation**: `\sum_{lower}^{upper}`
*   **Integral**: `\int_{lower}^{upper}`
*   **Input**:
    ```markdown
    $$
    \int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
    $$
    ```
*   **Rendered**:
    $$
    \int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
    $$

## Greek Letters and Symbols

| Symbol | Command | Symbol | Command |
| :--- | :--- | :--- | :--- |
| $\alpha$ | `\alpha` | $\beta$ | `\beta` |
| $\gamma$ | `\gamma$ | $\delta$ | `\delta` |
| $\theta$ | `\theta` | $\lambda$ | `\lambda` |
| $\pi$ | `\pi` | $\omega$ | `\omega$ |
| $\Delta$ | `\Delta` | $\Omega$ | `\Omega` |
| $\hbar$ | `\hbar` | $\infty$ | `\infty` |

## Advanced Formatting

### Matrices
Matrices use the `matrix`, `pmatrix` (parentheses), or `bmatrix` (brackets) environments.

*   **Input**:
    ```markdown
    $$
    \begin{bmatrix}
    a & b \\
    c & d
    \end{bmatrix}
    $$
    ```
*   **Rendered**:
    $$
    \begin{bmatrix}
    a & b \\
    c & d
    \end{bmatrix}
    $$

### Multi-line Equations
Use the `aligned` environment for multi-line derivations.

*   **Input**:
    ```markdown
    $$
    \begin{aligned}
    (x+y)^2 &= (x+y)(x+y) \\
            &= x^2 + xy + yx + y^2 \\
            &= x^2 + 2xy + y^2
    \end{aligned}
    $$
    ```
*   **Rendered**:
    $$
    \begin{aligned}
    (x+y)^2 &= (x+y)(x+y) \\
            &= x^2 + xy + yx + y^2 \\
            &= x^2 + 2xy + y^2
    \end{aligned}
    $$

## Tips for Success
1.  **No Spaces in Delimiters**: While Notebook is configured to be flexible, it's best practice not to have spaces between the `$` and your math (e.g., use `$x$` not `$ x $`).
2.  **Escaping**: If you want to use a literal dollar sign in your text, use `\$`.
3.  **KaTeX Support**: Notebook uses KaTeX, which is faster than MathJax but supports a slightly smaller subset of LaTeX. You can find a full list of supported functions on the [KaTeX website](https://katex.org/docs/supported.html).
