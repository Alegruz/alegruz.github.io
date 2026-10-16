#!/usr/bin/env python3
"""Generate the linear-algebra wiki's figures (requires numpy and matplotlib).

Run from any directory. SVGs are saved in assets/images/wiki. Optional preview
PNGs are saved to the directory passed with --preview-dir.
"""

import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/images/wiki"
BLUE, ORANGE, GRAY = "#1664b5", "#b45309", "#667085"
plt.rcParams.update({"font.size": 12, "svg.fonttype": "none", "axes.spines.top": False,
                     "axes.spines.right": False, "figure.facecolor": "white"})


def save(fig, name, description, preview):
    OUT.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT / f"{name}.svg", bbox_inches="tight",
                metadata={"Title": name.replace("-", " "), "Description": description})
    if preview:
        preview.mkdir(parents=True, exist_ok=True)
        fig.savefig(preview / f"{name}.png", dpi=140, bbox_inches="tight")
    plt.close(fig)


def axes(ax, limit):
    ax.set_aspect("equal")
    ax.set_xlim(*limit)
    ax.set_ylim(*limit)
    ax.axhline(0, color=GRAY, lw=.7)
    ax.axvline(0, color=GRAY, lw=.7)
    ax.grid(alpha=.17)
    ax.set_xlabel("First coordinate")
    ax.set_ylabel("Second coordinate")


def vector(ax, v, color, label):
    ax.annotate("", xy=v, xytext=(0, 0),
                arrowprops={"arrowstyle": "->", "color": color, "lw": 2})
    ax.annotate(label, xy=v, xytext=(6, 6), textcoords="offset points",
                fontsize=11, color=color)


def stages(preview):
    L = np.array([[1, 0], [.5, 1]])
    U = np.array([[4, 2], [0, 2]])
    A = np.array([[4, 2], [2, 3]])
    assert np.allclose(L @ U, A)
    square = np.array([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]).T
    fig, axs = plt.subplots(1, 3, figsize=(13, 4.6), layout="constrained")
    for ax, M, title in zip(axs, [np.eye(2), U, A],
                            ["1. Input square", "2. Apply U", "3. Apply L to the result"]):
        points = M @ square
        axes(ax, (-.8, 7))
        ax.fill(*points, color=BLUE, alpha=.10)
        ax.plot(*points, color=BLUE, lw=2)
        vector(ax, M[:, 0], BLUE, "image of e₁")
        vector(ax, M[:, 1], ORANGE, "image of e₂")
        ax.set_title(title, pad=14)
    save(fig, "matrix-factor-stages", "The same coordinate scale shows a square transformed by U, then L, whose product is A.", preview)


def elimination(preview):
    A = np.array([[2, 1, 1], [4, 3, 3], [8, 7, 9]])
    first = A.copy()
    first[1] -= 2 * first[0]
    first[2] -= 4 * first[0]
    U = first.copy()
    U[2] -= 3 * U[1]
    L = np.array([[1, 0, 0], [2, 1, 0], [4, 3, 1]])
    assert np.array_equal(L @ U, A)
    fig, axs = plt.subplots(2, 2, figsize=(10, 7.7), layout="constrained")
    titles = ["1. Original A", "2. Clear the first column", "3. Clear the second column: U", "4. Keep the multipliers: L"]
    notes = ["Choose the first pivot: 2", "R₂ − 2R₁; R₃ − 4R₁", "R₃ − 3R₂ using the updated rows", "L U reconstructs A"]
    for ax, M, title, note, index in zip(axs.flat, [A, first, U, L], titles, notes, range(4)):
        ax.set_xlim(-.6, 2.6)
        ax.set_ylim(2.6, -.6)
        ax.set_aspect("equal")
        ax.axis("off")
        for i in range(3):
            for j in range(3):
                multiplier = index == 3 and i > j
                ax.add_patch(Rectangle((j-.45, i-.45), .9, .9,
                    facecolor=ORANGE if multiplier else BLUE if M[i,j] != 0 else "#e9edf1",
                    alpha=.18 if M[i,j] != 0 else .55, edgecolor="none"))
                ax.text(j, i, str(M[i,j]), ha="center", va="center", fontsize=23)
        ax.set_title(title, fontsize=15, pad=12)
        ax.text(.5, -.11, note, transform=ax.transAxes, ha="center", fontsize=12)
    save(fig, "lu-elimination", "Three elimination snapshots and the lower triangular record of multipliers.", preview)


def energy(preview):
    t = np.linspace(-2.5, 2.5, 301)
    X, Y = np.meshgrid(t, t)
    fig, axs = plt.subplots(1, 3, figsize=(13, 4.8), layout="constrained")
    values = [4*X**2+4*X*Y+3*Y**2, X**2, X**2-Y**2]
    titles = ["Positive definite", "Positive semidefinite", "Indefinite"]
    equations = ["q(x) = 4x₁² + 4x₁x₂ + 3x₂²", "q(x) = x₁²: flat along x₂", "q(x) = x₁² − x₂²: both signs"]
    levels = [1, 2, 4]
    label = lambda value: f"q(x) = {value:g}"
    for ax, Z, title, equation, i in zip(axs, values, titles, equations, range(3)):
        axes(ax, (-2.5, 2.5))
        ax.set_xlabel("x₁")
        ax.set_ylabel("x₂")
        contour_labels = []
        if i == 2:
            neg = ax.contour(X, Y, Z, levels=[-value for value in reversed(levels)], colors=ORANGE, linestyles="dashed")
            contour_labels.extend(ax.clabel(neg, fmt=label, fontsize=9, inline=False,
                      manual=[(0, sign * np.sqrt(value)) for sign in [-1, 1] for value in levels]))
            zero = ax.contour(X, Y, Z, levels=[0], colors=GRAY, linewidths=.9)
            contour_labels.extend(ax.clabel(zero, fmt=label, fontsize=9, inline=False,
                                           manual=[(-1.7, 1.7), (1.7, 1.7)]))
        pos = ax.contour(X, Y, Z, levels=levels, colors=BLUE)
        positions = [(sign * np.sqrt(value + (height**2 if i == 2 else 0)), height)
                     for sign in [-1, 1] for value, height in zip(levels, [1.1, 0, -.65])]
        contour_labels.extend(ax.clabel(pos, fmt=label, fontsize=9, inline=False,
                                       manual=positions if i else False))
        for contour_label in contour_labels:
            contour_label.set_rotation(0)
            contour_label.set_bbox(dict(facecolor="white", edgecolor="none", pad=1.5))
        if i == 1:
            ax.plot([0, 0], [-1.9, 1.9], color=GRAY, lw=2, linestyle="dotted")
            ax.text(.08, 0, "q(x) = 0", color=GRAY, fontsize=9)
        ax.set_title(title + "\n" + equation, fontsize=13, pad=12)
    save(fig, "cholesky-energy", "Each curve connects input vectors with the same q(x) = x transpose A x. All panels use positive levels 1, 2, 4; the indefinite panel also shows negative levels -1, -2, -4 and zero. Blue solid curves are positive, orange dashed curves negative, and gray curves zero.", preview)


def covariance(preview):
    theta = np.linspace(0, 2*np.pi, 361)
    circle = np.vstack((np.cos(theta), np.sin(theta)))
    L = np.array([[2, 0], [1, np.sqrt(2)]])
    assert np.allclose(L @ L.T, [[4, 2], [2, 3]])
    fig, axs = plt.subplots(1, 2, figsize=(10, 4.8), layout="constrained")
    for ax, M, title in zip(axs, [np.eye(2), L], ["Independent input coordinates z", "Correlated output coordinates u = Lz"]):
        axes(ax, (-2.7, 2.7))
        pts = M @ circle
        ax.plot(*pts, color=BLUE, lw=2)
        vector(ax, M[:, 0], BLUE, "first column")
        vector(ax, M[:, 1], ORANGE, "second column")
        ax.set_title(title, fontsize=13, pad=12)
    save(fig, "cholesky-covariance", "A unit circle mapped by a Cholesky factor; the image satisfies u transpose A inverse u equals one.", preview)


def svd(preview):
    theta = np.linspace(0, 2*np.pi, 361)
    circle = np.vstack((np.cos(theta), np.sin(theta)))
    fig, axs = plt.subplots(1, 3, figsize=(13, 4.6), layout="constrained")
    for ax, M, title in zip(axs, [np.eye(2), np.diag([3,1]), np.diag([3,0])],
                            ["Input: unit circle", "Singular values (3, 1)", "Singular values (3, 0)"]):
        axes(ax, (-3.7, 3.7))
        pts = M @ circle
        ax.plot(*pts, color=BLUE, lw=2)
        for p, label, color in [(np.array([1,0]), "e₁", BLUE), (np.array([0,1]), "e₂", ORANGE)]:
            v = M @ p
            ax.scatter(*v, color=color, s=40, zorder=3)
            ax.annotate(label, xy=v, xytext=(8, 8), textcoords="offset points", color=color)
        ax.set_title(title, fontsize=13, pad=12)
    save(fig, "svd-stretch", "A unit circle mapped to an ellipse by diagonal scaling, then to a segment when one singular value is zero.", preview)


def householder(preview):
    x = np.array([3., 4.])
    v = np.array([2., 1.])
    H = np.eye(2) - 2 * np.outer(v, v) / (v @ v)
    y = H @ x
    midpoint = (x + y) / 2
    assert np.allclose(y, [-5, 0])
    assert np.allclose(H @ H, np.eye(2))
    assert np.allclose(v @ midpoint, 0)
    fig, ax = plt.subplots(figsize=(7, 6.6), layout="constrained")
    axes(ax, (-6.3, 6.3))
    ax.plot([-3, 3], [6, -6], color=GRAY, lw=1.8, ls="--",
            label="Mirror: 2z₁ + z₂ = 0")
    ax.plot([x[0], y[0]], [x[1], y[1]], color=GRAY, lw=1.6, ls=":")
    vector(ax, x, BLUE, "x = (3, 4)")
    ax.annotate("", xy=y, xytext=(0, 0),
                arrowprops={"arrowstyle": "->", "color": ORANGE, "lw": 2})
    ax.annotate("Hx = (−5, 0)", xy=y, xytext=(-6, -22),
                textcoords="offset points", color=ORANGE, fontsize=11)
    ax.scatter(*midpoint, color=GRAY, s=35, zorder=4)
    ax.annotate("Midpoint (−1, 2)", xy=midpoint, xytext=(-113, 10),
                textcoords="offset points", color=GRAY, fontsize=11)
    vector(ax, v, GRAY, "Normal (2, 1)")
    ax.set_title("One reflection removes the tail; both lengths are 5", pad=16)
    ax.legend(loc="lower right", fontsize=10)
    save(fig, "householder-reflection", "Invented reflection example on equal coordinate scales. The mirror 2z1 + z2 = 0 bisects the segment joining (3,4) and (-5,0) at (-1,2). Both vectors have length 5.", preview)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview-dir", type=Path)
    parser.add_argument("--only", choices=["householder"], help="Generate only the requested figure.")
    args = parser.parse_args()
    generators = [householder] if args.only == "householder" else [stages, elimination, energy, covariance, svd, householder]
    for generate in generators:
        generate(args.preview_dir)
    print(f"Generated {len(generators)} verified linear-algebra diagram(s).")
