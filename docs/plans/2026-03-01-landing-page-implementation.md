# Landing Page Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the DigiLab landing page into an immersive Digital World experience with reactive circuits, Agumon guide character, and fluid content carousels.

**Architecture:** Canvas-based circuit background with mouse reactivity and glitch effects. Inline SVG Agumon with CSS animations in multiple poses. CSS scroll-snap horizontal carousels for content. Bootstrap Icons for consistency with digilab-app.

**Tech Stack:** Astro, TypeScript, Canvas API, CSS animations, Bootstrap Icons

**Design Doc:** `docs/plans/2026-03-01-landing-page-redesign.md`

**Answers to Open Questions:**
- Auto-scroll: Yes, stops on mouse interaction
- Glitch frequency: Often (every 2-3 seconds)
- Chart aspect ratio: 4:3

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install bootstrap-icons**

```bash
npm install bootstrap-icons
```

**Step 2: Verify installation**

Run: `npm ls bootstrap-icons`
Expected: Shows bootstrap-icons in dependency tree

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add bootstrap-icons dependency"
```

---

## Task 2: Create DigiIcon Component

**Files:**
- Create: `src/components/DigiIcon.astro`

**Step 1: Create the DigiIcon component**

This component wraps Bootstrap Icons and supports custom Digimon SVGs.

```astro
---
// DigiIcon.astro
// Unified icon component - Bootstrap Icons + custom Digimon icons

interface Props {
  name: string;
  size?: string;
  class?: string;
}

const { name, size = '1em', class: className } = Astro.props;

// Custom Digimon icons that aren't in Bootstrap
const customIcons: Record<string, string> = {
  digivice: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="9" r="4"/><rect x="9" y="16" width="6" height="2" rx="1"/><circle cx="8" cy="5" r="0.5" fill="currentColor"/><circle cx="16" cy="5" r="0.5" fill="currentColor"/></svg>`,
  'card-deck': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="12" height="16" rx="2"/><rect x="8" y="2" width="12" height="16" rx="2"/></svg>`,
};

const isCustom = name in customIcons;
---

{isCustom ? (
  <span
    class:list={['digi-icon', className]}
    style={`font-size: ${size}; display: inline-flex; align-items: center; justify-content: center;`}
    set:html={customIcons[name]}
  />
) : (
  <i
    class:list={[`bi bi-${name}`, 'digi-icon', className]}
    style={`font-size: ${size};`}
  />
)}

<style>
  .digi-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
  }

  .digi-icon :global(svg) {
    width: 1em;
    height: 1em;
  }
</style>
```

**Step 2: Add Bootstrap Icons CSS to BaseLayout**

Modify `src/layouts/BaseLayout.astro`, add in `<head>`:

```html
<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
```

**Step 3: Test the component**

Create a test usage in index.astro temporarily:

```astro
import DigiIcon from '../components/DigiIcon.astro';
<!-- Test: --> <DigiIcon name="trophy" size="24px" /> <DigiIcon name="digivice" size="24px" />
```

Run: `npm run dev`
Expected: See trophy icon and digivice icon rendered

**Step 4: Remove test code and commit**

```bash
git add src/components/DigiIcon.astro src/layouts/BaseLayout.astro
git commit -m "feat: add DigiIcon component with Bootstrap + custom icons"
```

---

## Task 3: Rewrite CircuitBackground Component

**Files:**
- Modify: `src/components/CircuitBackground.astro` (complete rewrite)

**Step 1: Rewrite CircuitBackground with dense, reactive, glitchy circuits**

```astro
---
// CircuitBackground.astro
// Dense, reactive circuit background with mouse interaction and glitch effects
// Full-bleed across entire page, more intense in hero and footer regions

interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class:list={['circuit-background', className]} aria-hidden="true">
  <canvas id="circuit-canvas"></canvas>
  <button class="circuit-pause-btn" id="circuit-pause" aria-label="Pause animation" title="Pause circuits">
    <span class="pause-icon">❚❚</span>
    <span class="play-icon">▶</span>
  </button>
</div>

<script>
  const canvas = document.getElementById('circuit-canvas') as HTMLCanvasElement;
  const pauseBtn = document.getElementById('circuit-pause');
  const ctx = canvas.getContext('2d');

  if (ctx && canvas) {
    // ===== CONFIGURATION =====
    const CONFIG = {
      // Density - 3-4x more than before
      maxCircuits: 60,
      spawnRate: 150, // ms between spawns

      // Appearance
      baseColor: { r: 0, g: 200, b: 255 },
      glitchColor: { r: 247, g: 148, b: 29 }, // Orange accent
      lineWidth: 1,
      nodeRadius: 3,

      // Movement
      baseSpeed: 1.5,
      speedVariation: 0.8,

      // Line properties
      minLength: 50,
      maxLength: 400,

      // Branching
      branchProbability: 0.15,
      maxBranchDepth: 2,

      // Mouse reactivity
      mouseInfluenceRadius: 150,
      mouseInfluenceStrength: 0.5,
      wakeSpawnRate: 50, // ms between wake spawns when mouse moving

      // Glitch effects
      glitchFrequency: 0.02, // per frame per circuit
      screenGlitchInterval: 3000, // ms between screen glitches
      screenGlitchDuration: 100,

      // Fade
      fadeSpeed: 0.008,

      // Intensity zones (0-1 normalized Y position)
      heroZone: 0.3, // Top 30% is hero
      footerZone: 0.85, // Bottom 15% is footer
      intensityMultiplier: 1.5,
    };

    // ===== STATE =====
    interface Point { x: number; y: number; }
    interface Circuit {
      points: Point[];
      direction: Point;
      speed: number;
      length: number;
      maxLength: number;
      opacity: number;
      fading: boolean;
      glitching: boolean;
      glitchFrames: number;
      hasNode: boolean;
      nodeIndex: number;
      depth: number;
    }

    let circuits: Circuit[] = [];
    let mousePos: Point = { x: -1000, y: -1000 };
    let lastMousePos: Point = { x: -1000, y: -1000 };
    let mouseMoving = false;
    let lastSpawnTime = 0;
    let lastWakeSpawn = 0;
    let lastScreenGlitch = 0;
    let screenGlitching = false;
    let isPaused = false;
    let animationId: number;
    let isVisible = true;

    // ===== HELPERS =====
    const isDarkMode = () => {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches &&
         document.documentElement.getAttribute('data-theme') !== 'light');
    };

    const getBaseOpacity = () => isDarkMode() ? 0.25 : 0.18;
    const getNodeOpacity = () => isDarkMode() ? 0.5 : 0.4;

    const getIntensity = (y: number): number => {
      const normalizedY = y / canvas.height;
      if (normalizedY < CONFIG.heroZone || normalizedY > CONFIG.footerZone) {
        return CONFIG.intensityMultiplier;
      }
      return 1;
    };

    const getRandomEdge = (): { point: Point; direction: Point } => {
      const edge = Math.floor(Math.random() * 4);
      const margin = 50;

      switch (edge) {
        case 0: // Top
          return {
            point: { x: Math.random() * canvas.width, y: -margin },
            direction: { x: (Math.random() - 0.5) * 0.3, y: 1 }
          };
        case 1: // Right
          return {
            point: { x: canvas.width + margin, y: Math.random() * canvas.height },
            direction: { x: -1, y: (Math.random() - 0.5) * 0.3 }
          };
        case 2: // Bottom
          return {
            point: { x: Math.random() * canvas.width, y: canvas.height + margin },
            direction: { x: (Math.random() - 0.5) * 0.3, y: -1 }
          };
        default: // Left
          return {
            point: { x: -margin, y: Math.random() * canvas.height },
            direction: { x: 1, y: (Math.random() - 0.5) * 0.3 }
          };
      }
    };

    const normalizeDirection = (dir: Point): Point => {
      const mag = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
      return mag > 0 ? { x: dir.x / mag, y: dir.y / mag } : { x: 1, y: 0 };
    };

    const createCircuit = (
      start: Point,
      direction: Point,
      depth: number = 0
    ): Circuit => {
      const normalizedDir = normalizeDirection(direction);
      return {
        points: [{ ...start }],
        direction: normalizedDir,
        speed: CONFIG.baseSpeed + (Math.random() - 0.5) * CONFIG.speedVariation,
        length: 0,
        maxLength: CONFIG.minLength + Math.random() * (CONFIG.maxLength - CONFIG.minLength),
        opacity: 1,
        fading: false,
        glitching: false,
        glitchFrames: 0,
        hasNode: false,
        nodeIndex: -1,
        depth,
      };
    };

    const spawnCircuit = () => {
      if (circuits.length >= CONFIG.maxCircuits) return;
      const { point, direction } = getRandomEdge();
      circuits.push(createCircuit(point, direction, 0));
    };

    const spawnWakeCircuit = () => {
      if (circuits.length >= CONFIG.maxCircuits) return;

      // Spawn near mouse with random direction
      const angle = Math.random() * Math.PI * 2;
      const offset = 20 + Math.random() * 30;
      const start = {
        x: mousePos.x + Math.cos(angle) * offset,
        y: mousePos.y + Math.sin(angle) * offset
      };
      const direction = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };

      const circuit = createCircuit(start, direction, 0);
      circuit.maxLength = CONFIG.minLength * 0.5; // Shorter wake circuits
      circuit.opacity = 0.7;
      circuits.push(circuit);
    };

    // ===== UPDATE =====
    const updateCircuit = (circuit: Circuit): Circuit[] => {
      const newCircuits: Circuit[] = [];

      if (circuit.fading) {
        circuit.opacity -= CONFIG.fadeSpeed;
        return newCircuits;
      }

      // Glitch check
      if (!circuit.glitching && Math.random() < CONFIG.glitchFrequency) {
        circuit.glitching = true;
        circuit.glitchFrames = 5 + Math.floor(Math.random() * 10);
      }

      if (circuit.glitching) {
        circuit.glitchFrames--;
        if (circuit.glitchFrames <= 0) {
          circuit.glitching = false;
        }
      }

      // Get last point
      const last = circuit.points[circuit.points.length - 1];

      // Apply mouse influence
      let dir = { ...circuit.direction };
      const dx = mousePos.x - last.x;
      const dy = mousePos.y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseInfluenceRadius && dist > 0) {
        const influence = (1 - dist / CONFIG.mouseInfluenceRadius) * CONFIG.mouseInfluenceStrength;
        // Bend toward mouse
        dir.x += (dx / dist) * influence;
        dir.y += (dy / dist) * influence;
        dir = normalizeDirection(dir);
      }

      // Move
      const intensity = getIntensity(last.y);
      const newPoint = {
        x: last.x + dir.x * circuit.speed * intensity,
        y: last.y + dir.y * circuit.speed * intensity,
      };

      // Bounds check
      const margin = 100;
      if (newPoint.x < -margin || newPoint.x > canvas.width + margin ||
          newPoint.y < -margin || newPoint.y > canvas.height + margin) {
        circuit.fading = true;
        return newCircuits;
      }

      circuit.points.push(newPoint);
      circuit.length += circuit.speed;
      circuit.direction = dir;

      // Branch check
      if (!circuit.hasNode &&
          circuit.depth < CONFIG.maxBranchDepth &&
          circuit.length > circuit.maxLength * 0.3 &&
          Math.random() < CONFIG.branchProbability) {
        circuit.hasNode = true;
        circuit.nodeIndex = circuit.points.length - 1;

        // Create branch perpendicular
        const perpendicular = Math.random() > 0.5
          ? { x: -dir.y, y: dir.x }
          : { x: dir.y, y: -dir.x };

        if (circuits.length < CONFIG.maxCircuits) {
          newCircuits.push(createCircuit(newPoint, perpendicular, circuit.depth + 1));
        }
      }

      // Max length reached
      if (circuit.length >= circuit.maxLength) {
        circuit.fading = true;
      }

      return newCircuits;
    };

    // ===== DRAW =====
    const drawCircuit = (circuit: Circuit) => {
      if (circuit.points.length < 2) return;

      const baseOpacity = getBaseOpacity();
      const color = circuit.glitching ? CONFIG.glitchColor : CONFIG.baseColor;
      const opacity = circuit.opacity * baseOpacity * (circuit.glitching ? 2 : 1);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
      ctx.lineWidth = CONFIG.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Glitch effect: offset some segments
      if (circuit.glitching) {
        for (let i = 0; i < circuit.points.length - 1; i++) {
          const glitchOffset = (Math.random() - 0.5) * 4;
          ctx.moveTo(circuit.points[i].x + glitchOffset, circuit.points[i].y);
          ctx.lineTo(circuit.points[i + 1].x + glitchOffset, circuit.points[i + 1].y);
        }
      } else {
        ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
        for (let i = 1; i < circuit.points.length; i++) {
          ctx.lineTo(circuit.points[i].x, circuit.points[i].y);
        }
      }
      ctx.stroke();

      // Draw node
      if (circuit.hasNode && circuit.nodeIndex >= 0 && circuit.nodeIndex < circuit.points.length) {
        const node = circuit.points[circuit.nodeIndex];
        const nodeOpacity = circuit.opacity * getNodeOpacity();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${nodeOpacity})`;
        ctx.arc(node.x, node.y, CONFIG.nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${nodeOpacity * 0.3})`;
        ctx.arc(node.x, node.y, CONFIG.nodeRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawScreenGlitch = () => {
      if (!screenGlitching) return;

      // Random horizontal slices
      const sliceCount = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < sliceCount; i++) {
        const y = Math.random() * canvas.height;
        const h = 2 + Math.random() * 10;
        const offset = (Math.random() - 0.5) * 20;

        const imageData = ctx.getImageData(0, y, canvas.width, h);
        ctx.putImageData(imageData, offset, y);
      }

      // Color aberration overlay
      ctx.fillStyle = `rgba(${CONFIG.glitchColor.r}, ${CONFIG.glitchColor.g}, ${CONFIG.glitchColor.b}, 0.03)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // ===== ANIMATION LOOP =====
    const animate = (timestamp: number) => {
      if (!isVisible || isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new circuits
      if (timestamp - lastSpawnTime > CONFIG.spawnRate) {
        spawnCircuit();
        lastSpawnTime = timestamp;
      }

      // Spawn wake circuits when mouse moving
      if (mouseMoving && timestamp - lastWakeSpawn > CONFIG.wakeSpawnRate) {
        spawnWakeCircuit();
        lastWakeSpawn = timestamp;
      }

      // Screen glitch check
      if (timestamp - lastScreenGlitch > CONFIG.screenGlitchInterval) {
        if (Math.random() < 0.3) {
          screenGlitching = true;
          setTimeout(() => { screenGlitching = false; }, CONFIG.screenGlitchDuration);
        }
        lastScreenGlitch = timestamp;
      }

      // Update and draw circuits
      const newCircuits: Circuit[] = [];
      circuits = circuits.filter(circuit => {
        const spawned = updateCircuit(circuit);
        newCircuits.push(...spawned);
        drawCircuit(circuit);
        return circuit.opacity > 0;
      });
      circuits.push(...newCircuits);

      // Screen glitch overlay
      drawScreenGlitch();

      animationId = requestAnimationFrame(animate);
    };

    // ===== RESIZE =====
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    // ===== EVENT HANDLERS =====
    let mouseTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      if (isPaused) return;

      lastMousePos = { ...mousePos };
      mousePos = { x: e.clientX, y: e.clientY };
      mouseMoving = true;

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseMoving = false;
      }, 100);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    const togglePause = () => {
      isPaused = !isPaused;
      pauseBtn?.classList.toggle('paused', isPaused);
    };

    // ===== INIT =====
    const init = () => {
      resize();

      // Spawn initial circuits
      for (let i = 0; i < 15; i++) {
        spawnCircuit();
      }

      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      pauseBtn?.addEventListener('click', togglePause);

      // Theme observer
      const observer = new MutationObserver(() => {});
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      // Reduced motion check
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (!prefersReducedMotion.matches) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Static version: just draw some circuits once
        for (let i = 0; i < 30; i++) {
          const { point, direction } = getRandomEdge();
          const circuit = createCircuit(point, direction, 0);
          for (let j = 0; j < 50; j++) updateCircuit(circuit);
          drawCircuit(circuit);
        }
      }

      // Cleanup
      document.addEventListener('astro:before-swap', () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        observer.disconnect();
      });
    };

    init();
  }
</script>

<style>
  .circuit-background {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
  }

  #circuit-canvas {
    width: 100%;
    height: 100%;
  }

  .circuit-pause-btn {
    position: fixed;
    bottom: var(--space-4);
    left: var(--space-4);
    width: 32px;
    height: 32px;
    padding: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    pointer-events: auto;
    opacity: 0.5;
    transition: opacity var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
  }

  .circuit-pause-btn:hover {
    opacity: 1;
  }

  .circuit-pause-btn .play-icon {
    display: none;
  }

  .circuit-pause-btn.paused .pause-icon {
    display: none;
  }

  .circuit-pause-btn.paused .play-icon {
    display: block;
  }

  @media (max-width: 640px) {
    .circuit-pause-btn {
      display: none;
    }
  }
</style>
```

**Step 2: Test the circuit background**

Run: `npm run dev`
Expected:
- Dense circuits flowing across entire page
- Mouse movement bends nearby circuits and spawns wake particles
- Occasional orange glitch flashes on individual circuits
- Occasional screen-wide glitch effect
- Pause button in bottom-left corner works

**Step 3: Commit**

```bash
git add src/components/CircuitBackground.astro
git commit -m "feat: rewrite CircuitBackground with dense reactive circuits and glitch effects"
```

---

## Task 4: Create AgumonGuide Component

**Files:**
- Create: `src/components/AgumonGuide.astro`
- Delete: `src/components/PixelAgumon.astro` (after AgumonGuide is working)

**Step 1: Create AgumonGuide component with pose variants**

```astro
---
// AgumonGuide.astro
// Animated Agumon SVG mascot with different poses for different contexts

interface Props {
  pose?: 'waving' | 'pointing' | 'curious' | 'sleeping' | 'excited';
  size?: string;
  class?: string;
  flipX?: boolean;
}

const {
  pose = 'waving',
  size = '64px',
  class: className,
  flipX = false
} = Astro.props;
---

<div
  class:list={['agumon-guide', `agumon-${pose}`, className]}
  style={`--agumon-size: ${size}; ${flipX ? 'transform: scaleX(-1);' : ''}`}
  aria-hidden="true"
>
  <svg
    class="agumon-svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g class="agumon-body" transform="matrix(0.83 0 0 0.83 12 12)">
      <g>
        <!-- Head/body outline -->
        <g class="agumon-head" transform="matrix(1 0 0 1 -1.37 -5.11)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-10.63, -6.89)" d="M 11.7644 9.4961 L 9.18799 10.7838 C 8.91075 10.9225 8.60501 10.9948 8.29501 10.9948 L 4.24725 10.9948 C 3.80632 10.9948 3.37002 10.905 2.96493 10.7308 C 2.55985 10.5567 2.19447 10.3018 1.89107 9.98189 C 1.58767 9.66195 1.3526 9.28356 1.20018 8.86981 C 1.04777 8.45606 0.981209 8.01561 1.00456 7.57529 C 1.07944 6.7239 1.47496 5.93274 2.11109 5.36191 C 2.74721 4.79109 3.57642 4.48324 4.43093 4.50064 L 7.99897 4.50064 C 8.45142 3.62999 9.09522 2.87314 9.88204 2.28691 C 10.6689 1.70068 11.5783 1.3003 12.542 1.11583 C 13.5057 0.931367 14.4986 0.967605 15.4463 1.22183 C 16.394 1.47605 17.2718 1.94164 18.0138 2.58367 C 18.7558 3.22569 19.3427 4.02746 19.7305 4.92877 C 20.1183 5.83009 20.2969 6.80755 20.2528 7.78776 C 20.2088 8.76797 19.9433 9.72547 19.4762 10.5884 C 19.0091 11.4513 18.3527 12.1972 17.5561 12.7701"/>
        </g>
        <!-- Eye (left) -->
        <g class="agumon-eye agumon-eye-left" transform="matrix(1 0 0 1 1.54 -6.6)">
          <path style="stroke: currentColor; stroke-width: 1.5; fill: none;" transform="translate(-13.54, -5.4)" d="M 13.7203 5.76587 C 13.518 5.76587 13.3539 5.60184 13.3539 5.39949 C 13.3539 5.19714 13.518 5.03311 13.7203 5.03311"/>
        </g>
        <!-- Eye (right) -->
        <g class="agumon-eye agumon-eye-right" transform="matrix(1 0 0 1 1.9 -6.6)">
          <path style="stroke: currentColor; stroke-width: 1.5; fill: none;" transform="translate(-13.9, -5.4)" d="M 13.7203 5.76587 C 13.9227 5.76587 14.0867 5.60184 14.0867 5.39949 C 14.0867 5.19714 13.9227 5.03311 13.7203 5.03311"/>
        </g>
        <!-- Head spike -->
        <g transform="matrix(1 0 0 1 -5.73 -1.75)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-6.27, -10.25)" d="M 6.26871 10.9948 L 6.26871 9.49609"/>
        </g>
        <!-- Mouth/jaw -->
        <g class="agumon-mouth" transform="matrix(1 0 0 1 -2.96 -0.54)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-9.04, -11.46)" d="M 8.80695 10.9284 L 9.26614 11.9943"/>
        </g>
        <!-- Left arm -->
        <g class="agumon-arm-left" transform="matrix(1 0 0 1 -5.23 0.49)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-6.77, -12.49)" d="M 10.2657 13.9923 L 5.26923 13.9923 C 5.00681 13.9924 4.74694 13.9408 4.50448 13.8405 C 4.26201 13.7401 4.04171 13.5929 3.85615 13.4074 C 3.6706 13.2218 3.52343 13.0015 3.42307 12.7591 C 3.3227 12.5166 3.27111 12.2567 3.27124 11.9943 L 3.27124 11.9943 C 3.27111 11.8631 3.29684 11.7332 3.34697 11.6119 C 3.39709 11.4906 3.47062 11.3805 3.56335 11.2876 C 3.65608 11.1948 3.7662 11.1212 3.88741 11.0709 C 4.00862 11.0207 4.13854 10.9948 4.26974 10.9948"/>
        </g>
        <!-- Left leg -->
        <g transform="matrix(1 0 0 1 -4.31 8.75)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-7.69, -20.75)" d="M 9.72048 18.51 C 8.13265 18.9942 6.76427 20.0187 5.8525 21.4058 C 5.74594 21.5552 5.68258 21.7311 5.66935 21.9141 C 5.65612 22.0972 5.69353 22.2803 5.77749 22.4435 C 5.86145 22.6066 5.98871 22.7436 6.14533 22.8392 C 6.30194 22.9348 6.48186 22.9855 6.66537 22.9857 L 9.65502 22.9857"/>
        </g>
        <!-- Body + right leg + tail -->
        <g transform="matrix(1 0 0 1 3.78 5.88)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-15.78, -17.88)" d="M 17.5561 12.7701 L 18.2918 14.1799 C 18.4788 14.5382 18.7379 14.854 19.0528 15.1073 C 19.3677 15.3607 19.7316 15.5462 20.1217 15.6522 C 20.5117 15.7582 20.9195 15.7823 21.3193 15.7231 C 21.7192 15.664 22.1024 15.5227 22.4451 15.3083 L 23 14.9615 C 23 18.51 21.7299 20.335 19.7583 20.4875 L 19.7583 21.9862 C 19.7583 22.2513 19.653 22.5055 19.4655 22.6929 C 19.2781 22.8804 19.0239 22.9857 18.7588 22.9857 L 13.2191 22.9857 C 13.0356 22.9855 12.8557 22.9348 12.6991 22.8392 C 12.5425 22.7436 12.4152 22.6066 12.3313 22.4435 C 12.2473 22.2803 12.2099 22.0972 12.2231 21.9141 C 12.2364 21.7311 12.2997 21.5552 12.4063 21.4058 L 12.758 20.9173 C 12.9076 20.7108 13.0768 20.519 13.2631 20.3448 C 11.5494 19.8944 8.57346 18.3488 8.57346 16.4934 L 8.56076 13.9952"/>
        </g>
        <!-- Belly/chest detail -->
        <g transform="matrix(1 0 0 1 3.05 3.98)">
          <path style="stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none;" transform="translate(-15.05, -15.98)" d="M 16.8282 16.4641 L 15.5581 17.2614 C 15.3913 17.3659 15.2056 17.4366 15.0115 17.4694 C 14.8173 17.5022 14.6187 17.4964 14.4268 17.4524 C 14.2349 17.4084 14.0536 17.327 13.8931 17.213 C 13.7327 17.0989 13.5963 16.9543 13.4917 16.7875 C 13.3872 16.6207 13.3165 16.435 13.2837 16.2409 C 13.2509 16.0467 13.2567 15.8481 13.3007 15.6562 C 13.3447 15.4643 13.4261 15.283 13.5402 15.1225 C 13.6542 14.9621 13.7988 14.8257 13.9656 14.7211 L 14.3564 14.4779"/>
        </g>
      </g>
    </g>
  </svg>

  <!-- Speech bubble (optional, controlled by JS) -->
  <div class="agumon-speech" id="agumon-speech"></div>
</div>

<style>
  .agumon-guide {
    position: relative;
    width: var(--agumon-size);
    height: var(--agumon-size);
    color: var(--color-accent, #F7941D);
  }

  .agumon-svg {
    width: 100%;
    height: 100%;
  }

  /* ===== Base Idle Animation ===== */
  .agumon-body {
    animation: agumon-idle 2s ease-in-out infinite;
    transform-origin: center bottom;
  }

  @keyframes agumon-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }

  /* ===== Blink Animation ===== */
  .agumon-eye {
    animation: agumon-blink 4s ease-in-out infinite;
  }

  .agumon-eye-right {
    animation-delay: 0.1s;
  }

  @keyframes agumon-blink {
    0%, 45%, 55%, 100% { opacity: 1; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(0.1); }
  }

  /* ===== WAVING POSE ===== */
  .agumon-waving .agumon-arm-left {
    animation: agumon-wave 0.6s ease-in-out infinite;
    transform-origin: right center;
  }

  @keyframes agumon-wave {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-25deg); }
  }

  /* ===== POINTING POSE ===== */
  .agumon-pointing .agumon-arm-left {
    transform: rotate(-45deg) translateX(-2px);
    transform-origin: right center;
  }

  .agumon-pointing .agumon-head {
    animation: agumon-point-look 2s ease-in-out infinite;
  }

  @keyframes agumon-point-look {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(5deg); }
  }

  /* ===== CURIOUS POSE ===== */
  .agumon-curious .agumon-head {
    animation: agumon-curious-tilt 3s ease-in-out infinite;
  }

  @keyframes agumon-curious-tilt {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-10deg); }
  }

  /* ===== SLEEPING POSE ===== */
  .agumon-sleeping .agumon-body {
    animation: agumon-sleep-breathe 3s ease-in-out infinite;
  }

  .agumon-sleeping .agumon-eye {
    transform: scaleY(0.1);
    animation: none;
  }

  @keyframes agumon-sleep-breathe {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(1px) scale(1.02); }
  }

  /* ===== EXCITED POSE ===== */
  .agumon-excited .agumon-body {
    animation: agumon-excited-bounce 0.4s ease-in-out infinite;
  }

  .agumon-excited .agumon-arm-left {
    animation: agumon-wave 0.3s ease-in-out infinite;
    transform-origin: right center;
  }

  @keyframes agumon-excited-bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-5px) scale(1.05); }
  }

  /* ===== Speech Bubble ===== */
  .agumon-speech {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: var(--space-2, 8px);
    padding: var(--space-2, 8px) var(--space-3, 12px);
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    font-size: var(--font-size-xs, 12px);
    color: var(--color-text, #1a202c);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1));
  }

  .agumon-speech::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-surface, #fff);
  }

  .agumon-speech.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(-4px);
  }

  /* ===== Reduced Motion ===== */
  @media (prefers-reduced-motion: reduce) {
    .agumon-body,
    .agumon-eye,
    .agumon-arm-left,
    .agumon-head {
      animation: none !important;
    }
  }
</style>
```

**Step 2: Test the component**

Add to index.astro temporarily:

```astro
import AgumonGuide from '../components/AgumonGuide.astro';
<!-- Test poses -->
<AgumonGuide pose="waving" size="64px" />
<AgumonGuide pose="pointing" size="64px" />
<AgumonGuide pose="sleeping" size="64px" />
```

Run: `npm run dev`
Expected: See Agumon in different poses with appropriate animations

**Step 3: Remove test code, delete old PixelAgumon, commit**

```bash
rm src/components/PixelAgumon.astro
git add src/components/AgumonGuide.astro
git rm src/components/PixelAgumon.astro
git commit -m "feat: add AgumonGuide component with pose variants, remove PixelAgumon"
```

---

## Task 5: Create ContentCarousel Component

**Files:**
- Create: `src/components/ContentCarousel.astro`

**Step 1: Create the fluid horizontal scroll carousel**

```astro
---
// ContentCarousel.astro
// Fluid horizontal scroll carousel with auto-scroll that pauses on interaction

interface Props {
  class?: string;
  autoScroll?: boolean;
  autoScrollSpeed?: number; // pixels per second
}

const {
  class: className,
  autoScroll = true,
  autoScrollSpeed = 30
} = Astro.props;

const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
---

<div class:list={['content-carousel', className]} data-carousel-id={carouselId}>
  <div class="carousel-track" id={carouselId}>
    <slot />
  </div>
</div>

<script define:vars={{ carouselId, autoScroll, autoScrollSpeed }}>
  const track = document.getElementById(carouselId);
  if (!track) throw new Error('Carousel track not found');

  let isAutoScrolling = autoScroll;
  let isPaused = false;
  let lastTime = 0;
  let animationId;

  // Auto-scroll animation
  const animate = (timestamp) => {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (isAutoScrolling && !isPaused) {
      const scrollAmount = (autoScrollSpeed * delta) / 1000;
      track.scrollLeft += scrollAmount;

      // Loop back when reaching end
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
        track.scrollLeft = 0;
      }
    }

    animationId = requestAnimationFrame(animate);
  };

  // Pause on any interaction
  const pauseAutoScroll = () => {
    isPaused = true;
  };

  const resumeAutoScroll = () => {
    // Resume after 3 seconds of no interaction
    setTimeout(() => {
      isPaused = false;
    }, 3000);
  };

  // Event listeners
  track.addEventListener('mouseenter', pauseAutoScroll);
  track.addEventListener('mouseleave', resumeAutoScroll);
  track.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  track.addEventListener('touchend', resumeAutoScroll);
  track.addEventListener('wheel', () => {
    pauseAutoScroll();
    resumeAutoScroll();
  }, { passive: true });

  // Drag scrolling
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.style.cursor = 'grabbing';
    pauseAutoScroll();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    track.scrollLeft = scrollStart - dx;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      track.style.cursor = '';
      resumeAutoScroll();
    }
  });

  // Start animation if auto-scroll enabled
  if (autoScroll) {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      animationId = requestAnimationFrame(animate);
    }
  }

  // Cleanup
  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(animationId);
  });
</script>

<style>
  .content-carousel {
    width: 100%;
    position: relative;
  }

  .carousel-track {
    display: flex;
    gap: var(--space-4, 16px);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding: var(--space-4, 16px) var(--space-4, 16px);
    margin: 0 calc(-1 * var(--space-4, 16px));
    cursor: grab;

    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .carousel-track::-webkit-scrollbar {
    display: none;
  }

  .carousel-track > :global(*) {
    scroll-snap-align: start;
    flex-shrink: 0;
  }
</style>
```

**Step 2: Test with placeholder content**

```astro
<ContentCarousel>
  <div style="width: 300px; height: 200px; background: var(--color-surface); border-radius: 8px;">Card 1</div>
  <div style="width: 300px; height: 200px; background: var(--color-surface); border-radius: 8px;">Card 2</div>
  <div style="width: 300px; height: 200px; background: var(--color-surface); border-radius: 8px;">Card 3</div>
</ContentCarousel>
```

Run: `npm run dev`
Expected:
- Cards scroll horizontally with smooth momentum
- Auto-scrolls slowly to the right
- Pauses when mouse enters or during drag
- Resumes 3 seconds after interaction stops

**Step 3: Commit**

```bash
git add src/components/ContentCarousel.astro
git commit -m "feat: add ContentCarousel with fluid scroll and auto-scroll"
```

---

## Task 6: Create PostCard Component

**Files:**
- Create: `src/components/PostCard.astro`

**Step 1: Create the post card for carousel**

```astro
---
// PostCard.astro
// Card for displaying blog posts in the carousel with preview support

interface Props {
  title: string;
  description: string;
  date: Date;
  category: string;
  slug: string;
  image?: string;
  chartEmbed?: string;
}

const { title, description, date, category, slug, image, chartEmbed } = Astro.props;

const categoryIcons: Record<string, string> = {
  announcement: 'megaphone',
  technical: 'code-slash',
  analysis: 'graph-up-arrow',
  spotlight: 'star',
  devlog: 'journal-code',
};

const iconName = categoryIcons[category] || 'file-text';
const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
---

<a href={`/blog/${slug}`} class="post-card">
  <div class="post-card-preview">
    {chartEmbed ? (
      <iframe
        src={chartEmbed}
        class="post-card-chart"
        loading="lazy"
        title={`Chart: ${title}`}
      />
    ) : image ? (
      <img src={image} alt="" class="post-card-image" loading="lazy" />
    ) : (
      <div class="post-card-placeholder">
        <i class={`bi bi-${iconName}`}></i>
      </div>
    )}
  </div>

  <div class="post-card-content">
    <div class="post-card-meta">
      <span class="post-card-category">
        <i class={`bi bi-${iconName}`}></i>
        {category}
      </span>
      <span class="post-card-date">{formattedDate}</span>
    </div>

    <h3 class="post-card-title">{title}</h3>
    <p class="post-card-description">{description}</p>
  </div>
</a>

<style>
  .post-card {
    display: flex;
    flex-direction: column;
    width: 320px;
    background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: var(--color-text);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg), var(--glow-digital);
  }

  /* Preview area - 4:3 aspect ratio */
  .post-card-preview {
    aspect-ratio: 4 / 3;
    background: var(--color-primary-dark);
    position: relative;
    overflow: hidden;
  }

  .post-card-chart {
    width: 100%;
    height: 100%;
    border: none;
    pointer-events: none; /* Prevent interaction in card */
  }

  .post-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .post-card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--color-digital);
    opacity: 0.5;
  }

  .post-card-content {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .post-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--font-size-xs);
  }

  .post-card-category {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: var(--radius-sm);
    text-transform: capitalize;
  }

  .post-card-date {
    color: var(--color-text-muted);
  }

  .post-card-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    margin: 0;
  }

  .post-card-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Dark mode adjustments */
  :global([data-theme="dark"]) .post-card {
    background: rgba(45, 55, 72, 0.9);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "feat: add PostCard component with preview support"
```

---

## Task 7: Create WhatsNewCard Component

**Files:**
- Create: `src/components/WhatsNewCard.astro`

**Step 1: Create the compact What's New card**

```astro
---
// WhatsNewCard.astro
// Compact card for What's New carousel items

interface Props {
  text: string;
  icon: string;
  isNew?: boolean;
  link?: string;
}

const { text, icon, isNew = false, link } = Astro.props;

const Tag = link ? 'a' : 'div';
---

<Tag href={link} class:list={['whats-new-card', { 'has-link': !!link }]}>
  <span class="whats-new-icon">
    <i class={`bi bi-${icon}`}></i>
  </span>
  <span class="whats-new-text">{text}</span>
  {isNew && <span class="whats-new-badge">New</span>}
</Tag>

<style>
  .whats-new-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    white-space: nowrap;
    text-decoration: none;
    color: var(--color-text);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .whats-new-card.has-link:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md), var(--glow-digital);
  }

  .whats-new-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-base);
  }

  .whats-new-text {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .whats-new-badge {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    padding: 0.15em 0.5em;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
    color: white;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    animation: badge-shimmer 2s ease-in-out infinite;
  }

  @keyframes badge-shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  /* Dark mode */
  :global([data-theme="dark"]) .whats-new-card {
    background: rgba(45, 55, 72, 0.9);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/WhatsNewCard.astro
git commit -m "feat: add WhatsNewCard component"
```

---

## Task 8: Update Content Schema

**Files:**
- Modify: `src/content/config.ts`

**Step 1: Add chartEmbed field to blog schema**

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['announcement', 'technical', 'analysis', 'spotlight', 'devlog']),
    tags: z.array(z.string()).optional(),
    author: z.string().default('Michael Lopez'),
    image: z.string().optional(),
    chartEmbed: z.string().optional(), // NEW: Path to embedded chart HTML
    featured: z.boolean().default(false), // NEW: Featured in carousel
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add chartEmbed and featured fields to blog schema"
```

---

## Task 9: Update Landing Page

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Rewrite index.astro with new components**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import AgumonGuide from '../components/AgumonGuide.astro';
import ContentCarousel from '../components/ContentCarousel.astro';
import PostCard from '../components/PostCard.astro';
import WhatsNewCard from '../components/WhatsNewCard.astro';
import DigiIcon from '../components/DigiIcon.astro';
import { getCollection } from 'astro:content';

// Get recent blog posts
const allPosts = await getCollection('blog', ({ data }) => !data.draft);
const recentPosts = allPosts
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 8);

// What's new items
const whatsNew = [
  { text: '5 regions now tracking', icon: 'globe', isNew: true },
  { text: 'Rating system v2.0', icon: 'graph-up-arrow', isNew: true },
  { text: 'Deck meta analysis', icon: 'pie-chart', isNew: false },
  { text: 'Store directory', icon: 'shop', isNew: false },
  { text: 'Tournament history', icon: 'trophy', isNew: false },
  { text: 'Player profiles', icon: 'person-badge', isNew: false },
];
---

<BaseLayout title="Track Your Local Digimon TCG Scene">
  <Header />

  <main>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <h1>Track your local<br />Digimon TCG scene</h1>
          <p class="hero-subtitle">
            Player ratings, deck meta, and tournament history for competitive players.
          </p>
          <div class="hero-actions">
            <a href="https://app.digilab.cards" class="btn btn-primary btn-lg">
              <DigiIcon name="digivice" size="20px" />
              Launch App
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
            <a href="https://discord.gg/digilab" target="_blank" rel="noopener" class="btn btn-ghost">
              <DigiIcon name="discord" size="20px" />
              Join Discord
            </a>
          </div>
        </div>

        <div class="hero-mascot">
          <AgumonGuide pose="waving" size="120px" />
        </div>
      </div>
    </section>

    <!-- What's New Section -->
    <section class="whats-new-section">
      <div class="container">
        <div class="section-header">
          <h2>
            <DigiIcon name="lightning-charge" size="24px" />
            What's New
          </h2>
          <AgumonGuide pose="pointing" size="48px" class="section-mascot" />
        </div>
      </div>

      <ContentCarousel autoScrollSpeed={25}>
        {whatsNew.map((item) => (
          <WhatsNewCard
            text={item.text}
            icon={item.icon}
            isNew={item.isNew}
          />
        ))}
      </ContentCarousel>
    </section>

    <!-- Recent Posts Section -->
    <section class="posts-section">
      <div class="container">
        <div class="section-header">
          <h2>
            <DigiIcon name="journal-text" size="24px" />
            Recent Posts
          </h2>
          <a href="/blog" class="view-all-link">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>

      <ContentCarousel autoScrollSpeed={20}>
        {recentPosts.map((post) => (
          <PostCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            category={post.data.category}
            slug={post.slug}
            image={post.data.image}
            chartEmbed={post.data.chartEmbed}
          />
        ))}
      </ContentCarousel>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <AgumonGuide pose="excited" size="80px" />
          <div class="cta-text">
            <h2>Ready to track your scene?</h2>
            <p>Join players across 5 regions already using DigiLab.</p>
          </div>
          <a href="https://app.digilab.cards" class="btn btn-primary btn-lg">
            Get Started
          </a>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</BaseLayout>

<style>
  /* ===== Hero Section ===== */
  .hero {
    position: relative;
    padding: var(--space-16) 0 var(--space-20);
  }

  .hero-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-8);
  }

  .hero-text {
    max-width: 550px;
  }

  .hero h1 {
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    margin-bottom: var(--space-4);
    line-height: 1.1;
    background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: var(--font-size-xl);
    color: var(--color-text-muted);
    margin-bottom: var(--space-8);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .hero-mascot {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .hero-content {
      flex-direction: column;
      text-align: center;
    }

    .hero-actions {
      justify-content: center;
    }

    .hero-mascot {
      order: -1;
    }
  }

  /* ===== Section Styles ===== */
  .whats-new-section,
  .posts-section {
    padding: var(--space-12) 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-6);
    gap: var(--space-4);
  }

  .section-header h2 {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-2xl);
    margin: 0;
  }

  .section-mascot {
    opacity: 0.8;
  }

  .view-all-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
  }

  .view-all-link:hover {
    color: var(--color-accent);
  }

  .view-all-link svg {
    transition: transform var(--transition-fast);
  }

  .view-all-link:hover svg {
    transform: translateX(4px);
  }

  /* ===== CTA Section ===== */
  .cta-section {
    padding: var(--space-16) 0;
  }

  .cta-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-8);
    padding: var(--space-10);
    background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    text-align: center;
  }

  .cta-text h2 {
    margin: 0 0 var(--space-2);
  }

  .cta-text p {
    color: var(--color-text-muted);
    margin: 0;
  }

  @media (max-width: 768px) {
    .cta-content {
      flex-direction: column;
      gap: var(--space-4);
    }
  }

  /* ===== Dark Mode ===== */
  :global([data-theme="dark"]) .hero h1 {
    background: linear-gradient(135deg, var(--color-text) 0%, var(--color-digital) 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }

  :global([data-theme="dark"]) .cta-content {
    background: rgba(45, 55, 72, 0.8);
  }
</style>
```

**Step 2: Test the page**

Run: `npm run dev`
Expected:
- Hero with gradient text and waving Agumon
- What's New carousel with auto-scrolling cards
- Recent Posts carousel with post cards
- CTA section with excited Agumon
- Circuits flowing throughout entire page

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redesign landing page with carousels and Agumon guides"
```

---

## Task 10: Update BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Update BaseLayout to use AgumonGuide instead of PixelAgumon**

The layout was already updated in earlier tasks to include CircuitBackground. Now remove the PixelAgumon import and add a sleeping Agumon to the footer area (conditionally).

```astro
---
import '../styles/tokens.css';
import '../styles/global.css';
import CircuitBackground from '../components/CircuitBackground.astro';
import AgumonGuide from '../components/AgumonGuide.astro';

interface Props {
  title: string;
  description?: string;
  image?: string;
  showCircuits?: boolean;
  showAgumon?: boolean;
}

const {
  title,
  description = "Track local Digimon TCG tournament results, player standings, and deck meta.",
  image = "/images/og-image.png",
  showCircuits = true,
  showAgumon = false, // Changed default - Agumon now placed contextually in pages
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | DigiLab</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={canonicalURL}>

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content={canonicalURL}>
  <meta property="og:title" content={`${title} | DigiLab`}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={new URL(image, Astro.site)}>
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={`${title} | DigiLab`}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content={new URL(image, Astro.site)}>

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- Preconnect to external resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-NJ3SMG8HGG"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NJ3SMG8HGG', {
      cookie_domain: '.digilab.cards',
      linker: {
        domains: ['digilab.cards', 'app.digilab.cards', 'insights.digilab.cards']
      }
    });
  </script>
</head>
<body>
  {showCircuits && <CircuitBackground />}
  <slot />
  {showAgumon && (
    <div class="floating-agumon">
      <AgumonGuide pose="sleeping" size="48px" />
    </div>
  )}
</body>
</html>

<style is:global>
  .floating-agumon {
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-6);
    z-index: var(--z-companion);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    .floating-agumon {
      display: none;
    }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "refactor: update BaseLayout to use AgumonGuide, add Bootstrap Icons CDN"
```

---

## Task 11: Add CSS Variables for Surface RGB

**Files:**
- Modify: `src/styles/tokens.css`

**Step 1: Add RGB variants for backdrop-filter support**

The PostCard and WhatsNewCard use `rgba(var(--color-surface-rgb, ...))` for backdrop-filter. Add these variables:

```css
/* Add after line 18 (--color-surface-elevated) in :root */
  --color-surface-rgb: 255, 255, 255;  /* RGB for rgba() usage */
```

```css
/* Add after line 43 (--color-border-light-dark) in :root */
  --color-surface-dark-rgb: 45, 55, 72;  /* RGB for rgba() usage */
```

```css
/* Add inside [data-theme="dark"] selector, after --color-border-light */
  --color-surface-rgb: var(--color-surface-dark-rgb);
```

```css
/* Add inside @media (prefers-color-scheme: dark) :root:not([data-theme="light"]) */
  --color-surface-rgb: var(--color-surface-dark-rgb);
```

**Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add RGB color variants for backdrop-filter support"
```

---

## Task 12: Final Testing and Cleanup

**Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds without errors

**Step 2: Preview production build**

```bash
npm run preview
```

Expected: All features work in production build

**Step 3: Test checklist**

- [ ] Circuits dense and flowing across entire page
- [ ] Mouse interaction bends circuits and spawns wake
- [ ] Glitch effects visible (individual + screen)
- [ ] Pause button works
- [ ] Agumon waving in hero
- [ ] Agumon pointing at What's New
- [ ] Auto-scroll carousels work
- [ ] Carousels pause on hover/drag
- [ ] Post cards show preview (or placeholder)
- [ ] Dark mode works throughout
- [ ] Mobile responsive
- [ ] No console errors

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: landing page redesign complete"
```

---

## Summary

| Task | Component | Status |
|------|-----------|--------|
| 1 | Install dependencies | Complete |
| 2 | DigiIcon | Complete |
| 3 | CircuitBackground rewrite | Complete |
| 4 | AgumonGuide | Complete |
| 5 | ContentCarousel | Complete |
| 6 | PostCard | Complete |
| 7 | WhatsNewCard | Complete |
| 8 | Content schema update | Complete |
| 9 | Landing page rewrite | Complete |
| 10 | BaseLayout update | Complete |
| 11 | CSS variables | Complete |
| 12 | Final testing | Complete |

**Actual commits:** 18 (12 feature commits + additional fixes)

## Post-Implementation Fixes

- Fixed Agumon SVG clipping by adding `overflow="visible"` to SVG element
- Restored hero blue gradient background with proper fade to page background
- Updated hero text colors for readability on dark background
