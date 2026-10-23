import * as THREE from "three";
import { OCEAN_3D_MODEL_DEFINITIONS, tagObject } from "../../constants/ocean3dModelConstants";

/**
 * Builds a high-fidelity 3D Ocean ecosystem using reusable model constants.
 * The island is located in the North-West, leaving open water for marine creatures.
 * Every object is in its natural habitat with zero overlap.
 */
export function buildOcean3DScene(scene) {
  const interactiveMeshes = [];
  const modelHandles = {};

  const tagInteractive = (obj, itemId) => {
    tagObject(obj, itemId, interactiveMeshes);
  };

  // 1. SKY & LIGHTING
  scene.background = new THREE.Color(0x7dd3fc);
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.009);

  const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.0);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
  sunLight.position.set(25, 45, 20);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
  fillLight.position.set(-25, 18, -25);
  scene.add(fillLight);

  // 2. OCEAN WATER PLANE (CALM, GLOSSY SURFACE - ZERO SHAKE)
  const waterGeo = new THREE.PlaneGeometry(100, 100, 32, 32);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.88,
    shininess: 95,
    flatShading: true,
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = 0;
  scene.add(waterMesh);

  // 3. NORTH-WEST ISLAND BASE & SANDY BEACH (COMPACT, DOES NOT INTRUDE ON SEA)
  const islandGroup = new THREE.Group();
  islandGroup.position.set(-14, 0, -10);

  const sandMat = new THREE.MeshLambertMaterial({ color: 0xfef08a, flatShading: true });
  const grassMat = new THREE.MeshLambertMaterial({ color: 0x86efac, flatShading: true });

  const islandBase = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 11, 2.0, 20), sandMat);
  islandBase.position.y = 0.9;

  const islandGrass = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 8.0, 0.8, 16), grassMat);
  islandGrass.position.set(-1, 2.0, -1);

  islandGroup.add(islandBase, islandGrass);
  scene.add(islandGroup);

  // 4. INSTANTIATE ALL 15 REUSABLE 3D MODELS FROM CONSTANTS
  Object.entries(OCEAN_3D_MODEL_DEFINITIONS).forEach(([itemId, builderFn]) => {
    const result = builderFn();
    const group = result.group || result;
    tagInteractive(group, itemId);
    scene.add(group);
    modelHandles[itemId] = result;
  });

  // ANIMATION LOOP (Only individual animal / vehicle mechanics, ZERO MAP SHAKING)
  return {
    interactiveMeshes,
    modelHandles,
    update: (time) => {
      // 1. Lighthouse rotating beam
      if (modelHandles.lighthouse?.lightBeam) {
        modelHandles.lighthouse.lightBeam.rotation.y = time * 1.2;
      }

      // 2. Sailboat gentle float
      if (modelHandles.sailboat?.group) {
        modelHandles.sailboat.group.position.y = 0.5 + Math.sin(time * 1.8) * 0.1;
        modelHandles.sailboat.group.rotation.z = Math.sin(time * 1.6) * 0.05;
      }

      // 3. Ocean Buoy bobbing
      if (modelHandles.ocean?.group) {
        modelHandles.ocean.group.position.y = 0.4 + Math.sin(time * 2.0) * 0.08;
      }

      // 4. Dolphin jumping in graceful arc
      if (modelHandles.dolphin?.group) {
        const jumpCycle = (time * 0.8) % 4.5;
        if (jumpCycle < 2) {
          const t = jumpCycle / 2;
          modelHandles.dolphin.group.position.y = Math.sin(t * Math.PI) * 3.2 + 0.2;
          modelHandles.dolphin.group.position.x = 12 + Math.sin(t * Math.PI) * 1.5;
          modelHandles.dolphin.group.rotation.z = (t - 0.5) * -1.8;
        } else {
          modelHandles.dolphin.group.position.y = -1.2;
        }
      }

      // 5. Whale bobbing & spout spray
      if (modelHandles.whale?.group) {
        modelHandles.whale.group.position.y = 0.9 + Math.sin(time * 1.2) * 0.08;
        if (modelHandles.whale.tail) {
          modelHandles.whale.tail.rotation.x = Math.sin(time * 2.5) * 0.18;
        }
        if (modelHandles.whale.spout) {
          modelHandles.whale.spout.scale.y = 1.0 + Math.sin(time * 4) * 0.45;
        }
      }

      // 6. Sea turtle swimming
      if (modelHandles.sea_turtle?.group) {
        modelHandles.sea_turtle.group.position.x = 4 + Math.sin(time * 0.6) * 0.9;
        modelHandles.sea_turtle.group.position.z = 16 + Math.cos(time * 0.6) * 0.9;
        if (modelHandles.sea_turtle.flipperL) {
          modelHandles.sea_turtle.flipperL.rotation.y = Math.sin(time * 2.8) * 0.32;
        }
        if (modelHandles.sea_turtle.flipperR) {
          modelHandles.sea_turtle.flipperR.rotation.y = -Math.sin(time * 2.8) * 0.32;
        }
      }

      // 7. Clownfish schooling
      if (modelHandles.clownfish?.group) {
        modelHandles.clownfish.group.rotation.y = time * 0.55;
      }

      // 8. Crab scuttling
      if (modelHandles.crab?.group) {
        modelHandles.crab.group.position.x = -7.5 + Math.sin(time * 2.2) * 0.6;
      }

      // 9. Seagull circling in sky
      if (modelHandles.seagull?.group) {
        modelHandles.seagull.group.position.x = Math.cos(time * 1.2) * 6.0;
        modelHandles.seagull.group.position.z = -6 + Math.sin(time * 1.2) * 6.0;
        modelHandles.seagull.group.rotation.y = -time * 1.2 + Math.PI / 2;
        if (modelHandles.seagull.wingL) {
          modelHandles.seagull.wingL.rotation.z = Math.sin(time * 11) * 0.42;
        }
        if (modelHandles.seagull.wingR) {
          modelHandles.seagull.wingR.rotation.z = -Math.sin(time * 11) * 0.42;
        }
      }

      // 10. Submarine propeller
      if (modelHandles.submarine?.prop) {
        modelHandles.submarine.prop.rotation.x = time * 15;
      }
    },
    dispose: () => {
      waterGeo.dispose();
      waterMat.dispose();
      islandBase.geometry.dispose();
      islandGrass.geometry.dispose();
      sandMat.dispose();
      grassMat.dispose();
    },
  };
}
