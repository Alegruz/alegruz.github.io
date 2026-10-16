#!/usr/bin/env python3
"""Reproduce the convexity wiki's SVG figures (numpy and matplotlib required)."""

import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/images/wiki"
BLUE, ORANGE = "#1664b5", "#b45309"
plt.rcParams.update({"font.size": 12, "svg.fonttype": "none",
                     "axes.spines.top": False, "axes.spines.right": False})


def save(fig, name, description, preview):
    OUT.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT / f"{name}.svg", bbox_inches="tight",
                metadata={"Title": name.replace("-", " "), "Description": description})
    svg = OUT / f"{name}.svg"
    svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines()) + "\n")
    if preview:
        preview.mkdir(parents=True, exist_ok=True)
        fig.savefig(preview / f"{name}.png", dpi=140, bbox_inches="tight")
    plt.close(fig)


def machine_segment(preview):
    # Published Table 1 rates; allocations are modern exact re-derivations.
    S = np.array([2, 9/5, 8/11])
    O = np.array([8/3, 3, 0])
    M = (S + O) / 2
    polygon = np.array([[3/5, 1], [12/5, 1], [3, 8/11], [3, 0], [14/5, 0]])
    for plan in [S, M, O]:
        assert np.all(plan >= 0) and np.all(plan <= [3, 3, 1])
        assert np.isclose(np.dot([30, 50, 110], plan), 230)
        assert np.isclose(np.dot([10, 20, 30], plan),
                          230 - np.dot([20, 30, 80], plan))
    fig, ax = plt.subplots(figsize=(8, 5.5), layout="constrained")
    ax.fill(polygon[:, 0], polygon[:, 1], color=BLUE, alpha=.12)
    closed = np.vstack([polygon, polygon[0]])
    ax.plot(closed[:, 0], closed[:, 1], color=BLUE, lw=2)
    ax.plot([S[1], O[1]], [S[2], O[2]], color=ORANGE, lw=3)
    for plan, label, offset in [(S, "S = (9/5, 8/11)", (-95, 17)),
                                (M, "M = (12/5, 4/11)", (10, 10)),
                                (O, "O = (3, 0)", (-170, 5))]:
        ax.scatter(plan[1], plan[2], color=ORANGE, s=45, zorder=3)
        ax.annotate(label, (plan[1], plan[2]), xytext=offset,
                    textcoords="offset points", fontsize=12)
    ax.text(.84, .93, "Feasible plans", color=BLUE)
    ax.set(xlim=(0, 3.3), ylim=(-.08, 1.12),
           xlabel="Turret Part I time t (machine-days)",
           ylabel="Automatic Part I time a (machine-days)",
           title="Mixing two feasible production plans")
    ax.grid(alpha=.18)
    save(fig, "convexity-machine-segment",
         "Published machine rates, modern re-derivation. The feasible polygon contains "
         "the whole segment from separately balanced S to optimal O and its midpoint M. "
         "Coordinates label (t,a), with m recovered from 30m+50t+110a=230.", preview)


def chords(preview):
    u = np.linspace(-.2, 2.2, 241)
    fig, axs = plt.subplots(1, 2, figsize=(11, 5), layout="constrained")
    for ax, sign, title in zip(axs, [1, -1],
                              ["Convex: f(u) = u²", "Concave: f(u) = −u²"]):
        ax.plot(u, sign*u*u, color=BLUE, lw=2.5, label="Function graph")
        ax.plot([0, 2], [0, sign*4], color=ORANGE, lw=2.5,
                ls="--", label="Endpoint chord")
        ax.plot([1, 1], [sign, sign*2], color="black", lw=1.5)
        ax.scatter([0, 2], [0, sign*4], color=ORANGE, zorder=3)
        ax.scatter([1], [sign], color=BLUE, zorder=4)
        ax.scatter([1], [sign*2], facecolors="white", edgecolors=ORANGE, zorder=3)
        ax.annotate(f"Graph: {sign}", (1, sign), xytext=(-67, -23 if sign > 0 else 18),
                    textcoords="offset points", color=BLUE)
        ax.annotate(f"Chord: {sign*2}", (1, sign*2), xytext=(-90, 18 if sign > 0 else -25),
                    textcoords="offset points", color=ORANGE)
        ax.set(xlabel="Input u", ylabel="Value f(u)", title=title,
               xlim=(-.2, 2.2), ylim=(-.7, 5.2) if sign > 0 else (-5.2, .7))
        ax.set_xticks([0, 1, 2])
        ax.grid(alpha=.18)
        ax.legend(loc="upper left" if sign > 0 else "lower left", fontsize=10)
    save(fig, "convexity-chords",
         "Supplementary invented examples. At midpoint input 1 the square has graph "
         "height 1 and chord height 2; the negative square has heights -1 and -2. "
         "Convex graphs lie below their chords; concave graphs lie above.", preview)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview-dir", type=Path)
    args = parser.parse_args()
    machine_segment(args.preview_dir)
    chords(args.preview_dir)
    print("Generated two convexity diagrams; checked machine allocations and balances.")
