---
title: Engine Showcase - Syntax and Math
date: May 18, 2026
tags: ["meta", "engine", "math"]
---

This post validates the rendering engine, showcasing **Shiki**-powered syntax highlighting and **KaTeX** math integration.

## Syntax Highlighting (Shiki)

Notebook supports multi-language syntax highlighting out of the box using VS Code themes.

### TypeScript

```typescript
interface NotebookProps {
    theme: "snowwhite" | "void";
    activeSection: string;
}

const renderEngine = (props: NotebookProps) => {
    return props.theme === "snowwhite" ? "Clean" : "Dark";
};
```

### Python

```python
def calculate_entropy(data):
    import math
    return -sum(p * math.log(p) for p in data if p > 0)
```

## Mathematical Notation (KaTeX)

High-performance server-side LaTeX rendering.

### The Quadratic Formula

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### Maxwell's Equations

The foundational laws of electromagnetism:

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\left(\mathbf{J} + \epsilon_0\frac{\partial \mathbf{E}}{\partial t}\right)
\end{aligned}
$$

### Schrödinger's Equation

$$
\hat{H}\psi = E\psi
$$

## Conclusion

Everything is rendering as expected. The engine is primed.
