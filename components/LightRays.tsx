'use client'

import { Renderer } from "ogl";
import { resolve } from "path";
import React, { useEffect, useRef, useState } from "react";

export type RaysOrigin = 
  | "top-center"
  | "top-center-offset"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m 
    ? [
      parseInt(m[1], 16) /255,
      parseInt(m[2], 16) /255,
      parseInt(m[3], 16) /255,
    ] : [1, 1, 1]
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number
): {anchor: [number, number]; dir: [number, number]} => {
  const outside = 0.2;
  switch (origin) {
    case "top-left":
      return {anchor: [0, -outside * h], dir: [0, 1]};
    case "top-right":
      return {anchor: [w, -outside * h], dir: [0, 1]};
    case "top-center-offset":
      return {anchor: [0.5 * w + 0.2 * w, -outside * h], dir: [-0.2, 1]};
    case "left":
      return {anchor: [-outside * w, 0.5 * h], dir: [1, 0]};
    case "right":
      return {anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0]};
    case "bottom-left":
      return {anchor: [0, (1 + outside) * h], dir: [0, -1]};
    case "bottom-center":
      return {anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1]};
    case "bottom-right":
      return {anchor: [w, (1 + outside) * h], dir: [0, -1]};
    default:
      return {anchor: [0.5 * w, -outside * h], dir: [0, 1]};
  }
}

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseRef = useRef({x: 0.5, y: 0.5});
  const smoothMouseRef = useRef({x: 0.5, y:0.5});
  const animationRef = useRef<number | null>(null);
  const meshRef = useRef<any>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      {threshold: 0.1}
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    };

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      await new Promise((resolve) => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.width = "100%";

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vert = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `

      const frag = `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;

        uniform vec2 rayPos;
        uniform vec2 rayDir;
        uniform vec3 raysColor;
        uniform float raysSpread;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        unifrom float fadeDistance;
        uniform float saturation;
        uniform float mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;

        varying vec2 vUv;
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
          vec2 sourceToCoord = coord - raySource;
          vec2 dirNorm = normalize(sourceToCoord);
          float cosAngle = dot(dirNorm, rayRefDirection);

          float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

          float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

          float distance = length(sourceToCoord);
          float maxDistance = iResolution.x * rayLength;
          float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

          
        }
      `
    }
  })
  return (
    <div>LightRays</div>
  )
}

export default LightRays