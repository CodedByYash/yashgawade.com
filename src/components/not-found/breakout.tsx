"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/* The bricks spell "404" in a 5x7 pixel font, like the wordmark in the footer. */
const FOUR = ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."];
const ZERO = [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."];
const DIGITS = [FOUR, ZERO, FOUR];

const W = 680;
const H = 420;
const CELL = 30;
const GAP = 4;
const PITCH = CELL + GAP;
const COLS = DIGITS.length * 5 + (DIGITS.length - 1); // one empty column between digits
const BRICKS_LEFT = (W - (COLS * PITCH - GAP)) / 2;
const BRICKS_TOP = 34;

const PADDLE_W = 96;
const PADDLE_H = 10;
const PADDLE_Y = H - 34;
const RADIUS = 6;
const START_SPEED = 300;
const MAX_SPEED = 520;
const LIVES = 3;
const STORAGE_KEY = "breakout-404-best";

type Phase = "ready" | "playing" | "paused" | "won" | "lost";
type Brick = { x: number; y: number; alive: boolean };

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  DIGITS.forEach((digit, d) => {
    digit.forEach((row, y) =>
      [...row].forEach((cell, x) => {
        if (cell !== "#") return;
        bricks.push({ x: BRICKS_LEFT + (d * 6 + x) * PITCH, y: BRICKS_TOP + y * PITCH, alive: true });
      }),
    );
  });
  return bricks;
}

type Colors = { background: string; brick: string; ink: string; muted: string };

/** CSS colour tokens use light-dark(), so resolve them through a real element. */
function readColors(host: HTMLElement): Colors {
  const probe = document.createElement("span");
  host.appendChild(probe);
  const resolve = (token: string) => {
    probe.style.color = `var(${token})`;
    return getComputedStyle(probe).color;
  };
  const colors = {
    background: resolve("--background"),
    brick: resolve("--wordmark"),
    ink: resolve("--foreground"),
    muted: resolve("--muted"),
  };
  probe.remove();
  return colors;
}

const BEST_EVENT = "breakout-best";

function readBest() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function subscribeBest(onChange: () => void) {
  window.addEventListener(BEST_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(BEST_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const message = {
  ready: "Click, tap or press Space to launch",
  paused: "Paused. Click or press Space to resume",
  won: "You cleared the 404. Click to play again",
  lost: "Game over. Click to try again",
} as const;

/**
 * Breakout where the bricks spell 404. Mouse, touch drag or arrow keys move the
 * paddle; Space, click or tap launches, pauses and restarts. Nothing starts by
 * itself, and the game pauses when the tab is hidden.
 */
export function Breakout() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [announcement, setAnnouncement] = useState("");
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);
  const act = useRef<() => void>(() => {});
  const togglePause = useRef<() => void>(() => {});

  useEffect(() => {
    const el = canvas.current;
    const wrap = host.current;
    if (!el || !wrap) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors(wrap);
    let bricks = makeBricks();
    let phase: Phase = "ready";
    let lives = LIVES;
    let score = 0;
    let bestScore = 0;
    let speed = START_SPEED;
    let paddleX = W / 2;
    let targetX = W / 2;
    let ball = { x: W / 2, y: PADDLE_Y - RADIUS - 1, vx: 0, vy: 0 };
    const trail: { x: number; y: number }[] = [];
    const keys = { left: false, right: false };
    let frame = 0;
    let last = 0;
    let scale = 1;

    const alive = () => bricks.reduce((n, b) => n + (b.alive ? 1 : 0), 0);

    /** Mirrors the state into data attributes (read by tests) and the live region. */
    const publish = (text?: string) => {
      wrap.dataset.phase = phase;
      wrap.dataset.bricks = String(alive());
      wrap.dataset.score = String(score);
      wrap.dataset.lives = String(lives);
      if (text) setAnnouncement(text);
    };

    const parkBall = () => {
      ball = { x: paddleX, y: PADDLE_Y - RADIUS - 1, vx: 0, vy: 0 };
      trail.length = 0;
    };

    const reset = () => {
      bricks = makeBricks();
      lives = LIVES;
      score = 0;
      speed = START_SPEED;
      phase = "ready";
      parkBall();
      publish("New game. Launch when ready.");
    };

    const launch = () => {
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180);
      ball.vx = Math.sin(angle) * speed;
      ball.vy = -Math.cos(angle) * speed;
      phase = "playing";
      last = 0;
      publish();
      loop();
    };

    const finish = (won: boolean) => {
      phase = won ? "won" : "lost";
      if (score > bestScore) {
        bestScore = score;
        try {
          localStorage.setItem(STORAGE_KEY, String(score));
          window.dispatchEvent(new Event(BEST_EVENT));
        } catch {
          // Storage can be blocked; the game works without a saved best.
        }
      }
      publish(won ? `You cleared the 404 with ${score} points.` : `Game over. ${score} points.`);
      draw();
    };

    const hitBrick = () => {
      for (const brick of bricks) {
        if (!brick.alive) continue;
        const nearX = Math.max(brick.x, Math.min(ball.x, brick.x + CELL));
        const nearY = Math.max(brick.y, Math.min(ball.y, brick.y + CELL));
        const dx = ball.x - nearX;
        const dy = ball.y - nearY;
        if (dx * dx + dy * dy > RADIUS * RADIUS) continue;
        brick.alive = false;
        score += 10;
        // Bounce off the side the ball came in through.
        if (Math.abs(dx) > Math.abs(dy)) ball.vx = Math.abs(ball.vx) * Math.sign(dx || -ball.vx);
        else ball.vy = Math.abs(ball.vy) * Math.sign(dy || -ball.vy);
        const left = alive();
        speed = Math.min(MAX_SPEED, START_SPEED + (bricks.length - left) * 4);
        const norm = Math.hypot(ball.vx, ball.vy) || 1;
        ball.vx = (ball.vx / norm) * speed;
        ball.vy = (ball.vy / norm) * speed;
        publish();
        if (left === 0) finish(true);
        return;
      }
    };

    const step = (dt: number) => {
      // Paddle: keys move it, the pointer sets a target it follows.
      if (keys.left) targetX -= 560 * dt;
      if (keys.right) targetX += 560 * dt;
      targetX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, targetX));
      paddleX = targetX;

      // Move the ball in small steps so it never tunnels through a brick.
      const distance = speed * dt;
      const steps = Math.max(1, Math.ceil(distance / 3));
      for (let i = 0; i < steps && phase === "playing"; i++) {
        ball.x += (ball.vx * dt) / steps;
        ball.y += (ball.vy * dt) / steps;

        if (ball.x < RADIUS) {
          ball.x = RADIUS;
          ball.vx = Math.abs(ball.vx);
        }
        if (ball.x > W - RADIUS) {
          ball.x = W - RADIUS;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y < RADIUS) {
          ball.y = RADIUS;
          ball.vy = Math.abs(ball.vy);
        }

        if (
          ball.vy > 0 &&
          ball.y + RADIUS >= PADDLE_Y &&
          ball.y - RADIUS <= PADDLE_Y + PADDLE_H &&
          Math.abs(ball.x - paddleX) <= PADDLE_W / 2 + RADIUS
        ) {
          const offset = Math.max(-1, Math.min(1, (ball.x - paddleX) / (PADDLE_W / 2)));
          const angle = offset * 62 * (Math.PI / 180);
          ball.vx = Math.sin(angle) * speed;
          ball.vy = -Math.cos(angle) * speed;
          ball.y = PADDLE_Y - RADIUS;
        }

        hitBrick();

        if (ball.y - RADIUS > H) {
          lives -= 1;
          if (lives <= 0) {
            finish(false);
          } else {
            phase = "ready";
            parkBall();
            publish(`Ball lost. ${lives} ${lives === 1 ? "life" : "lives"} left.`);
          }
        }
      }
      if (phase === "ready") parkBall();
    };

    function draw() {
      ctx!.setTransform(scale, 0, 0, scale, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = colors.background;
      ctx!.fillRect(0, 0, W, H);

      ctx!.fillStyle = colors.brick;
      for (const b of bricks) if (b.alive) ctx!.fillRect(b.x, b.y, CELL, CELL);

      // Paddle and ball
      ctx!.fillStyle = colors.ink;
      ctx!.fillRect(paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H);
      if (!reduced) {
        trail.forEach((p, i) => {
          ctx!.globalAlpha = ((i + 1) / trail.length) * 0.25;
          ctx!.fillRect(p.x - RADIUS * 0.7, p.y - RADIUS * 0.7, RADIUS * 1.4, RADIUS * 1.4);
        });
        ctx!.globalAlpha = 1;
      }
      ctx!.fillRect(ball.x - RADIUS, ball.y - RADIUS, RADIUS * 2, RADIUS * 2);

      // Score and lives
      ctx!.font = "12px ui-monospace, monospace";
      ctx!.fillStyle = colors.muted;
      ctx!.textBaseline = "alphabetic";
      ctx!.textAlign = "left";
      ctx!.fillText(`SCORE ${String(score).padStart(4, "0")}`, 12, H - 10);
      for (let i = 0; i < LIVES; i++) {
        ctx!.globalAlpha = i < lives ? 1 : 0.25;
        ctx!.fillStyle = colors.ink;
        ctx!.fillRect(W - 22 - i * 16, H - 20, 10, 10);
      }
      ctx!.globalAlpha = 1;

      if (phase !== "playing") {
        const text = message[phase];
        ctx!.font = "600 14px ui-monospace, monospace";
        ctx!.textAlign = "center";
        const width = ctx!.measureText(text).width + 32;
        ctx!.fillStyle = colors.background;
        ctx!.globalAlpha = 0.9;
        ctx!.fillRect(W / 2 - width / 2, H / 2 + 90, width, 34);
        ctx!.globalAlpha = 1;
        ctx!.strokeStyle = colors.muted;
        ctx!.setLineDash([4, 3]);
        ctx!.strokeRect(W / 2 - width / 2 + 0.5, H / 2 + 90.5, width - 1, 33);
        ctx!.setLineDash([]);
        ctx!.fillStyle = colors.ink;
        ctx!.fillText(text, W / 2, H / 2 + 112);
      }
    }

    function loop() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame((now) => {
        if (phase !== "playing") return;
        const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
        last = now;
        trail.push({ x: ball.x, y: ball.y });
        if (trail.length > 6) trail.shift();
        step(dt);
        draw();
        if (phase === "playing") loop();
      });
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = el.clientWidth;
      scale = (width * dpr) / W;
      el.width = Math.round(width * dpr);
      el.height = Math.round(width * dpr * (H / W));
      draw();
    };

    const toWorldX = (clientX: number) => ((clientX - el.getBoundingClientRect().left) / el.clientWidth) * W;

    const pause = () => {
      if (phase === "playing") {
        phase = "paused";
        publish("Paused.");
        draw();
      }
    };

    act.current = () => {
      if (phase === "ready") launch();
      else if (phase === "paused") {
        phase = "playing";
        last = 0;
        publish();
        loop();
      } else if (phase === "won" || phase === "lost") {
        reset();
        draw();
      }
    };
    togglePause.current = () => {
      if (phase === "playing") pause();
      else if (phase === "paused") act.current();
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = toWorldX(e.clientX);
      if (phase !== "playing") {
        paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, targetX));
        if (phase === "ready") parkBall();
        draw();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      targetX = toWorldX(e.clientX);
      el.focus({ preventScroll: true });
      act.current();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
      else if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
      else if (e.key === " " || e.key === "Enter") act.current();
      else if (e.key === "p" || e.key === "Escape") togglePause.current();
      else return;
      e.preventDefault();
      if (phase !== "playing") {
        // Keys also move the paddle while waiting to launch.
        const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        targetX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, targetX + move * 24));
        paddleX = targetX;
        if (phase === "ready") parkBall();
        draw();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
    };
    const onVisibility = () => document.hidden && pause();
    const onBlur = () => {
      keys.left = keys.right = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const themeWatcher = new MutationObserver(() => {
      colors = readColors(wrap);
      draw();
    });
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("keyup", onKeyUp);
    el.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    bestScore = readBest();
    publish();
    resize();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      themeWatcher.disconnect();
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const pauseClick = useCallback(() => togglePause.current(), []);

  return (
    <div ref={host} data-phase="ready" className="mx-auto w-full max-w-[680px]">
      <canvas
        ref={canvas}
        tabIndex={0}
        role="application"
        aria-label="Breakout game. The bricks spell 404. Move the paddle with the mouse, your finger or the arrow keys. Space launches the ball and pauses."
        className="block aspect-[680/420] w-full touch-none border border-dashed border-line bg-background"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs text-muted">
        <p>
          Move: mouse, touch or ← →. Launch: Space or tap.
          {best > 0 && <span className="ml-3 text-foreground">Best {best}</span>}
        </p>
        <button
          type="button"
          onClick={pauseClick}
          className="border border-dashed border-chip-line px-2 py-1 text-nav-muted transition-colors hover:text-foreground"
        >
          Pause / resume
        </button>
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
