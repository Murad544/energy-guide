"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Energy, Mode, Part } from "./simulation";

type Props = {
  mode: Mode;
  energy: Energy;
  selected: Part;
  onSelect: (part: Part) => void;
  paused: boolean;
  view: number;
};

export default function SolarScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(props);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    current.current = props;
  }, [props]);

  useEffect(() => {
    const container = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      // WebGL capability is only known after attempting external renderer setup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor("#132e29");
    container.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.setAttribute(
      "aria-label",
      "Günəş sisteminin 3D modeli. Komponent seçimi üçün aşağıdakı düymələrdən də istifadə edə bilərsiniz.",
    );
    canvas.setAttribute("role", "img");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 24;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2.15;
    const reset = () => {
      camera.position.set(10, 10, 13);
      controls.target.set(0, 0.7, 0);
      controls.update();
    };
    reset();
    scene.add(new THREE.HemisphereLight(0xd9f3e7, 0x354839, 2.5));
    const sun = new THREE.DirectionalLight(0xffefd0, 3);
    sun.position.set(-3, 8, 4);
    scene.add(sun);
    const groups = {} as Record<Part, THREE.Group>;
    for (const id of [
      "panel",
      "inverter",
      "house",
      "battery",
      "grid",
    ] as Part[]) {
      const group = new THREE.Group();
      group.userData.part = id;
      groups[id] = group;
      scene.add(group);
    }
    function box(
      parent: THREE.Object3D,
      size: number[],
      position: number[],
      color: string,
    ) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...(size as [number, number, number])),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.65,
          metalness: 0.12,
        }),
      );
      mesh.position.set(...(position as [number, number, number]));
      parent.add(mesh);
      return mesh;
    }
    box(scene, [10, 0.22, 7], [0, -0.2, 0], "#375d4c");
    const gridHelper = new THREE.GridHelper(10, 20, 0x62806a, 0x456651);
    gridHelper.position.y = -0.075;
    scene.add(gridHelper);
    groups.panel.position.set(-3, 0, 0.2);
    for (const x of [-0.8, 0.8]) {
      box(groups.panel, [0.1, 1, 0.1], [x, 0.5, 0], "#c2d3ce");
      const rack = new THREE.Group();
      rack.position.set(x, 1.15, 0);
      rack.rotation.x = -0.35;
      groups.panel.add(rack);
      box(rack, [1.45, 0.12, 2.3], [0, 0, 0], "#c2d3ce");
      for (let row = 0; row < 5; row++)
        for (let col = 0; col < 3; col++) {
          box(
            rack,
            [0.42, 0.04, 0.4],
            [(col - 1) * 0.46, 0.08, (row - 2) * 0.44],
            "#164e6b",
          );
        }
    }
    groups.inverter.position.set(0, 0, 0.2);
    box(groups.inverter, [0.85, 1.3, 0.55], [0, 0.65, 0], "#e1e8df");
    box(groups.inverter, [0.48, 0.28, 0.04], [0, 0.87, 0.3], "#163d33");
    box(groups.inverter, [0.3, 0.06, 0.05], [0, 0.87, 0.33], "#d9f279");
    groups.house.position.set(3, 0, -0.5);
    box(groups.house, [2.1, 1.7, 2], [0, 0.85, 0], "#e4e9d8");
    const roof = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 1.85, 1, 4),
      new THREE.MeshStandardMaterial({ color: "#63816b" }),
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2.15;
    groups.house.add(roof);
    box(groups.house, [0.5, 0.95, 0.06], [0, 0.48, 1.03], "#23483e");
    const windows = [-0.7, 0.7].map((x) =>
      box(groups.house, [0.4, 0.48, 0.06], [x, 1.1, 1.03], "#f0cf6e"),
    );
    groups.battery.position.set(-0.5, 0, 2.3);
    box(groups.battery, [1.1, 1.05, 0.65], [0, 0.53, 0], "#25483e");
    box(groups.battery, [0.4, 0.12, 0.25], [0, 1.1, 0], "#d8dfd4");
    for (let i = 0; i < 3; i++)
      box(
        groups.battery,
        [0.65, 0.13, 0.04],
        [0, 0.3 + i * 0.24, 0.35],
        "#d9f279",
      );
    groups.grid.position.set(1, 0, -2.5);
    box(groups.grid, [0.16, 2.7, 0.16], [0, 1.35, 0], "#acbdb0");
    box(groups.grid, [1.6, 0.12, 0.15], [0, 2.4, 0], "#acbdb0");
    for (const x of [-0.65, 0, 0.65])
      box(groups.grid, [0.12, 0.28, 0.12], [x, 2.58, 0], "#d9f279");
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 20, 12),
      new THREE.MeshBasicMaterial({ color: "#f0d87e" }),
    );
    orb.position.set(-3.7, 3.7, -1.8);
    scene.add(orb);
    const selection = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.035, 8, 48),
      new THREE.MeshBasicMaterial({ color: "#d9f279" }),
    );
    selection.rotation.x = -Math.PI / 2;
    scene.add(selection);
    const routes = [
      {
        from: "panel",
        to: "inverter",
        amount: (e: Energy) => e.solar - e.curtailed,
      },
      { from: "inverter", to: "house", amount: (e: Energy) => e.supplied },
      {
        from: "inverter",
        to: "battery",
        amount: (e: Energy) => e.charge - e.discharge,
      },
      {
        from: "grid",
        to: "inverter",
        amount: (e: Energy) => e.imported - e.exported,
      },
    ].map((route) => {
      const start = groups[route.from as Part].position.clone().setY(0.12);
      const end = groups[route.to as Part].position.clone().setY(0.12);
      const curve = new THREE.LineCurve3(start, end);
      const wire = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 1, 0.025, 6, false),
        new THREE.MeshBasicMaterial({ color: "#6c9580" }),
      );
      scene.add(wire);
      const dots = Array.from({ length: 4 }, () => {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 8, 6),
          new THREE.MeshBasicMaterial({ color: "#d9f279" }),
        );
        scene.add(dot);
        return dot;
      });
      return { ...route, curve, wire, dots };
    });
    const raycaster = new THREE.Raycaster();
    let down = { x: 0, y: 0 };
    const pointerDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY };
    };
    const pointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6)
        return;
      const rect = canvas.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          (-(event.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      );
      const hit = raycaster.intersectObjects(
        Object.values(groups).filter((group) => group.visible),
        true,
      )[0];
      if (!hit) return;
      let object: THREE.Object3D | null = hit.object;
      while (object && !object.userData.part) object = object.parent;
      if (object) current.current.onSelect(object.userData.part as Part);
    };
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointerup", pointerUp);
    let needsRender = true;
    let renderedProps: Props | undefined;
    const invalidate = () => {
      needsRender = true;
    };
    controls.addEventListener("change", invalidate);
    const resize = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      needsRender = true;
    });
    resize.observe(container);
    let visible = false;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      needsRender = true;
    });
    intersection.observe(container);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastTime = 0,
      elapsed = 0,
      lastView = current.current.view;
    const contextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
      renderer.setAnimationLoop(null);
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    renderer.setAnimationLoop((time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!visible || document.hidden) return;
      const { mode, energy, selected, paused, view } = current.current;
      if (
        (paused || reduced.matches) &&
        !needsRender &&
        renderedProps === current.current
      )
        return;
      if (view !== lastView) {
        reset();
        lastView = view;
      }
      if (!paused && !reduced.matches) elapsed += delta;
      groups.battery.visible = mode !== "onGrid";
      groups.grid.visible = mode !== "offGrid";
      sun.intensity = 0.6 + energy.solar * 0.5;
      orb.scale.setScalar(0.65 + energy.solar * 0.07);
      selection.position.copy(groups[selected].position).setY(0.08);
      windows.forEach((window) => {
        window.material.color.set(energy.supplied > 0 ? "#f0cf6e" : "#526e68");
      });
      routes.forEach((route) => {
        const connected =
          groups[route.from as Part].visible &&
          groups[route.to as Part].visible;
        const power = route.amount(energy);
        route.wire.visible = connected;
        route.dots.forEach((dot, index) => {
          dot.visible = connected && Math.abs(power) > 0.001;
          const fraction = (elapsed * 0.22 + index / 4) % 1;
          dot.position.copy(
            route.curve.getPoint(power >= 0 ? fraction : 1 - fraction),
          );
        });
      });
      controls.update();
      renderer.render(scene, camera);
      needsRender = false;
      renderedProps = current.current;
    });
    return () => {
      renderer.setAnimationLoop(null);
      resize.disconnect();
      intersection.disconnect();
      controls.removeEventListener("change", invalidate);
      controls.dispose();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("webglcontextlost", contextLost);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-ink">
      <div
        ref={host}
        className="h-[320px] w-full cursor-grab active:cursor-grabbing sm:h-[420px]"
      />
      {failed && (
        <div
          role="status"
          className="absolute inset-0 grid place-content-center p-8 text-center text-white"
        >
          <p>3D görünüş bu cihazda əlçatan deyil.</p>
          <p className="mt-3 text-sm text-white/70">
            Aşağıdakı idarəetmələr və enerji göstəriciləri ilə simulyatoru
            istifadə edə bilərsiniz.
          </p>
        </div>
      )}
      {!failed && (
        <p className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-2 text-[11px] tracking-wider text-white/80">
          CANLI ENERJİ MODELİ · 3D
        </p>
      )}
    </div>
  );
}
