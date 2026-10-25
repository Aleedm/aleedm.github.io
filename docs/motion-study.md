# Motion study and revision

The first prototype was mechanically functional but did not meet the intended movement or visual quality. This revision treats idle motion, user input, and recovery as separate behaviours.

## References examined

- [OGL mouse flowmap: live demo](https://oframe.github.io/ogl/examples/mouse-flowmap.html) and [original implementation](https://github.com/oframe/ogl/blob/master/src/extras/Flowmap.js). The live demo was exercised with a horizontal gesture and a stationary pointer. The useful principle is a persistent directional field that dissipates; its illustrated water texture is not the visual reference for this site.
- [Robin Delaporte, Mouse Flowmap Deformation with OGL](https://tympanus.net/codrops/2019/09/25/mouse-flowmap-deformation-with-ogl/). Distortion uses pointer velocity as well as position. Codrops' live demo was blocked by an automated browser challenge, so the original GitHub Pages demo above was used instead.
- [Mark Finch, GPU Gems: Effective Water Simulation from Physical Models](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models). Independent directional waves and their derivatives can describe a continuous surface normal. Small, overlapping waves suit calm water better than an expanding cursor-centred pattern.
- [Jamie Wong, Fluid Simulation](https://jamie-wong.com/2016/08/05/webgl-fluid-simulation/). Semi-Lagrangian backtracing and bilinear sampling explain how an existing velocity field transports itself. A complete incompressible fluid solver also needs pressure projection; the site's flowmap intentionally does not claim that level of simulation.

The implementations in this repository are original and do not incorporate demo code or third-party demo textures.

## Space

A star's state has position, travelling velocity, and a slow drift velocity. There is no stored initial/home position. Pointer proximity applies outward acceleration; damping restores the travelling speed rather than pulling a star to a location. Stars wrap through the edges. Layout-only changes no longer reseed the field.

Acceptance: continuous movement at idle, greater outward motion nearby, no orbiting force, no spring return after the pointer leaves, no stationary star cloud tied to a fixed shape.

## The descent (replaces the earlier Nature and Sea chapters)

The earlier prototype treated nature and sea as two backdrops — a generated pothos cutout on ivory and a generated drone photograph — joined by a cross-fade. Neither related to the space chapter or to each other, and a houseplant said nothing about outdoor sport.

They are now one procedural world seen from directly above, and scrolling is the camera's altitude:

- **Re-entry.** Stars fade, the camera zooms from ~0.28× to 1×, a cloud layer passes, and the night map's contours appear summits-first.
- **The Alps.** A Swiss-style relief map: north-west hill shading with cool shadows and brown contours every ~105 m (index every ~525 m). A GPS trail descends past the sports waypoints, each with an elevation read from the same heightfield. The pointer raises a soft rise that trails behind it, and the contours ring around it.
- **Sea level.** The same terrain keeps descending and crosses zero: a coastline with lapping foam. Below it, depth-based absorption (red first), seagrass, rock, and refraction show the seabed.
- **Seabed.** Deeper water darkens; the copy turns pale. The altimeter reads down to −40 m.

Caustics are not a texture. A calm swell of seven directional waves (golden-angle directions, so no lattice forms) is differentiated analytically; light intensity is 1/|det(I + f·H)|, where H is the surface curvature and f grows with depth. The visitor's current (the CPU flow field below) shifts the swell, brightens the surface, and pushes the floating photographs.

Every height blend is C2-smooth (quintic noise fade, smootherstep, soft max) and the lattice hash is integer PCG2D: hill shading reads the slope, so any C1 kink or correlated hash appears as a straight seam or a rectangular block.

Acceptance: one continuous world from orbit to seabed; no lakes among the mountains; land descends monotonically to the coast; contours follow the pointer on land; current direction follows the gesture at sea and fades; photographs drift about 100 px and return; readable copy over map and water.

## Verification

Run `npm run test:motion` for behavioural checks covering travelling stars, repulsion, absence of spring return, wrapping, frame-rate consistency, directional flow, decay, stationary input, and terrain descent. Run `npm run build` for type checking and static build.

Browser review exercises idle, horizontal gesture, release, vertical gesture, the pointer rise on the map, waypoint cards, floating photographs, scrolling, pause, reduced motion, desktop and narrow layouts, and WebGL fallback. Visual captures are reviewed at several points through the gesture, rather than treating a successful shader compilation as proof of convincing motion.

Automated Chrome uses software WebGL. It checks rendering and behaviour but cannot establish frame rate or feel on every physical phone or GPU. The final aesthetic remains subject to the owner's review.

Simple Analytics remains production-only and is excluded from local review.
