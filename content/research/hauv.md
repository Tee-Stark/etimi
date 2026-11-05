---
# Source: PLAN.md §3.4A, Q5–Q8, Q24, Q27. Research summary only: no build
# specs, hardware roadmap, commercial plans, field-trial plans, funding or
# target venues. Results are withheld until the exact poster wording is
# supplied (O2). The co-author is not named until they consent (O3), so no
# name is stored here. The explainer embed stays hidden pending O1.
title: HAUV
slug: hauv
fullTitle: "Autonomous Hull Screening for Nigerian Ports: Stable Air–Water Transition for a Hybrid Aerial-Underwater Vehicle"
summary: >-
  A small autonomous vehicle that can fly to a ship, inspect its hull from the
  air, enter the water, inspect below the waterline and come back. My research
  asks how to keep it stable as it crosses the boundary between air and water.
visibility: public
status: active
threads: [research, engineering]
featured: true
order: 1
updated: 2026-11-05
affiliation: University of Lagos
notice: These results come from simulation. They have not been validated on a physical prototype or in the field.
publications:
  - title: "Autonomous Hull Screening for Nigerian Ports: Stable Air–Water Transition for a Hybrid Aerial-Underwater Vehicle"
    kind: poster
    venue: MIRG-ICAIR 2026, University of Lagos
    date: 2026-11-04
    visibility: public
updates:
  - date: 2026-11-04
    title: Poster presented at MIRG-ICAIR 2026
    summary: I presented this work as a poster at MIRG-ICAIR 2026 at the University of Lagos.
embeds:
  - url: https://virl-hauv-research.netlify.app
    title: HAUV interactive explainer
    visibility: hidden
    sandbox: allow-scripts
---
## The problem

Marine growth on a ship's hull, known as fouling, makes the ship burn more fuel and produce more emissions. Inspecting a hull usually means sending divers or a tethered remotely operated vehicle (ROV). Both are slow and costly, and both are limited by the weather and by how clearly you can see underwater.

The band from the waterline down to about 5 metres, the photic zone, is where fouling is worst. It is also the hardest part of the hull to inspect.

## Why it's interesting

A hybrid aerial–underwater vehicle (HAUV) could inspect a hull above and below the waterline in a single deployment. The same kind of vehicle could also help inspect oil and gas and subsea infrastructure. There, its job would be detecting problems and verifying them independently, not cleaning anything up.

The hard part is the crossing. A controller that keeps a vehicle stable in the air, or underwater, is not automatically stable while it switches between the two.

## The mathematics

I treat the vehicle as a **hybrid dynamical system**: its behaviour follows different equations in each of three modes (aerial, transition and underwater), and a supervisory controller decides when to switch between them.

$$
\dot{x} = f_{\sigma(t)}(x, u), \qquad \sigma(t) \in \{\text{aerial},\ \text{transition},\ \text{underwater}\}
$$

Here $x$ is the vehicle's state, $u$ its control input, and $\sigma(t)$ the mode it is in at time $t$.

Underwater motion is described by the standard marine-vehicle model associated with Fossen:

$$
M\dot{\nu} + C(\nu)\,\nu + D(\nu)\,\nu + g(\eta) = \tau
$$

where $\nu$ is the vehicle's velocity, $\eta$ its position and orientation, $M$ its inertia including **added mass** (the water it has to push along with it), $C$ the Coriolis terms, $D$ the drag, $g$ the restoring forces and $\tau$ the forces from its thrusters.

To know where it is and how it is moving, the vehicle needs **state estimation**. An Extended Kalman Filter (EKF) combines noisy sensor readings with the model's predictions into a single best estimate.

Switching between stable modes can itself make a system unstable. A standard remedy is a **dwell-time condition**: if consecutive switching times $t_k$ are always at least some $\tau_d$ apart,

$$
t_{k+1} - t_k \geq \tau_d ,
$$

stability can be guaranteed. In plain English, it is a minimum time the controller must stay in one mode before it is allowed to switch again.

## Approach

My contribution is a stability result for the vehicle's **heave** (its up-and-down motion) across the air–water transition. The model is nonlinear and has three zones, with quadratic drag and added mass that scales with how submerged the vehicle is. Stability holds under an explicit dwell-time condition on the supervisory switching.

## Implementation

The results so far come from simulation. There is no physical prototype or field validation behind them.

## Results and findings

I presented this work as a poster at MIRG-ICAIR 2026 at the University of Lagos. I will add the detailed results here once the poster is published.

## Future directions

- Model Predictive Control (MPC), which plans control actions by looking ahead over a short horizon, is a direction I want to explore for this vehicle.
- The work is aimed at autonomous hull inspection, and at detecting and independently verifying problems on subsea infrastructure.
