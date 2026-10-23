import * as THREE from "three";
import {
  tagObject,
  createOceanBuoy,
  createBeachArea,
  createLighthouse,
  createSailboat,
  createDolphin,
  createWhale,
  createSeaTurtle,
  createSubmarine,
} from "./ocean3dModels";

/**
 * Builds a high-fidelity, completely stable 3D Ocean ecosystem.
 * All objects have true 3D spatial depth. The map does NOT shake or wobble.
 */
export function buildOcean3DScene(scene) {
  const interactiveMeshes = [];

  const tagInteractive = (obj, itemId) => {
    tagObject(obj, itemId, interactiveMeshes);
  };

  // 1. SKY & LIGHTING
  scene.background = new THREE.Color(0x7dd3fc);
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.012);

  const ambientLight = new THREE.AmbientLight(0xe0f2fe, 0.95);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.3);
  sunLight.position.set(25, 40, 20);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
  fillLight.position.set(-20, 15, -20);
  scene.add(fillLight);

  // 2. OCEAN WATER PLANE (ROCK-SOLID CALM SEA - ZERO SHAKE OR WOBBLE)
  const waterGeo = new THREE.PlaneGeometry(80, 80, 24, 24);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.88,
    shininess: 90,
    flatShading: true,
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = 0;
  scene.add(waterMesh);

  // 3. ROCK-SOLID ISLAND TERRAIN & RESORT
  const islandGroup = new THREE.Group();
  islandGroup.position.set(-10, 0, -2);

  const sandMat = new THREE.MeshLambertMaterial({ color: 0xfef08a, flatShading: true });
  const islandBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 18, 2.0, 24), sandMat);
  islandBase.position.y = 0.9;
  const sandHill = new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 1.4, 20), sandMat);
  sandHill.position.set(-1, 2.0, -1);
  islandGroup.add(islandBase, sandHill);
  scene.add(islandGroup);

  // Beach resort (Umbrella, loungers, sandcastle) -> itemId: "beach"
  const beachResort = createBeachArea();
  tagInteractive(beachResort, "beach");
  scene.add(beachResort);

  // 4. FLOATING OCEAN BUOY -> itemId: "ocean"
  const { group: buoyGroup } = createOceanBuoy();
  tagInteractive(buoyGroup, "ocean");
  scene.add(buoyGroup);

  // 5. LIGHTHOUSE -> itemId: "lighthouse"
  const { group: lighthouseGroup, lightBeam } = createLighthouse();
  tagInteractive(lighthouseGroup, "lighthouse");
  scene.add(lighthouseGroup);

  // 6. SAILBOAT -> itemId: "sailboat"
  const boatGroup = createSailboat();
  tagInteractive(boatGroup, "sailboat");
  scene.add(boatGroup);

  // 7. DOLPHIN -> itemId: "dolphin"
  const dolphinGroup = createDolphin();
  tagInteractive(dolphinGroup, "dolphin");
  scene.add(dolphinGroup);

  // 8. BLUE WHALE -> itemId: "whale"
  const { group: whaleGroup, tail: whaleTail, spout: spoutMesh } = createWhale();
  tagInteractive(whaleGroup, "whale");
  scene.add(whaleGroup);

  // 9. SEA TURTLE -> itemId: "sea_turtle"
  const { group: turtleGroup, flipperL, flipperR } = createSeaTurtle();
  tagInteractive(turtleGroup, "sea_turtle");
  scene.add(turtleGroup);

  // 10. COLORFUL CORAL REEF -> itemId: "coral_reef"
  const coralGroup = new THREE.Group();
  coralGroup.position.set(-5, -0.4, 9);
  const coralColors = [0xf43f5e, 0xa855f7, 0x06b6d4, 0xf59e0b];
  for (let i = 0; i < 8; i++) {
    const col = coralColors[i % coralColors.length];
    const cMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.55, 1.6 + (i % 3) * 0.4, 6),
      new THREE.MeshLambertMaterial({ color: col, flatShading: true })
    );
    cMesh.position.set(Math.sin(i * 0.9) * 2.5, 0.7, Math.cos(i * 0.9) * 2.2);
    coralGroup.add(cMesh);
  }
  tagInteractive(coralGroup, "coral_reef");
  scene.add(coralGroup);

  // 11. SCHOOL OF CLOWNFISH -> itemId: "clownfish"
  const fishGroup = new THREE.Group();
  fishGroup.position.set(-2, -0.2, 11);
  for (let i = 0; i < 4; i++) {
    const cf = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 1.0, 6),
      new THREE.MeshLambertMaterial({ color: 0xf97316, flatShading: true })
    );
    cf.scale.set(0.6, 0.9, 1.2);
    cf.rotation.x = Math.PI / 2;
    cf.position.set((i - 1.5) * 0.9, (i % 2) * 0.25, (i % 3) * 0.4);
    fishGroup.add(cf);
  }
  tagInteractive(fishGroup, "clownfish");
  scene.add(fishGroup);

  // 12. PALM TREES WITH COCONUTS -> itemId: "palm_tree"
  const palmGroup = new THREE.Group();
  const buildTree = (x, z, h) => {
    const tree = new THREE.Group();
    tree.position.set(x, 1.8, z);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.4, h, 6),
      new THREE.MeshLambertMaterial({ color: 0x78350f, flatShading: true })
    );
    trunk.position.y = h / 2;
    trunk.rotation.z = 0.12;
    tree.add(trunk);

    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.08, 2.4),
        new THREE.MeshLambertMaterial({ color: 0x16a34a, flatShading: true })
      );
      leaf.position.set(0, h, 0);
      leaf.rotation.y = (i * Math.PI * 2) / 6;
      leaf.rotation.x = 0.5;
      tree.add(leaf);
    }
    return tree;
  };
  palmGroup.add(buildTree(-11, -2, 4.8), buildTree(-8.5, 1, 4.0));
  tagInteractive(palmGroup, "palm_tree");
  scene.add(palmGroup);

  // 13. CRAB -> itemId: "crab"
  const crabGroup = new THREE.Group();
  crabGroup.position.set(-6, 1.2, 4.5);
  const crabBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0xef4444, flatShading: true })
  );
  crabBody.scale.set(1.3, 0.5, 0.9);
  const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), new THREE.MeshLambertMaterial({ color: 0xb91c1c }));
  clawL.position.set(-0.6, 0.1, 0.4);
  const clawR = clawL.clone();
  clawR.position.set(0.6, 0.1, 0.4);
  crabGroup.add(crabBody, clawL, clawR);
  tagInteractive(crabGroup, "crab");
  scene.add(crabGroup);

  // 14. SEASHELL -> itemId: "seashell"
  const shellMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.55, 6),
    new THREE.MeshLambertMaterial({ color: 0xfbcfe8, flatShading: true })
  );
  shellMesh.position.set(-3.5, 1.0, 3.5);
  shellMesh.rotation.x = Math.PI / 3;
  tagInteractive(shellMesh, "seashell");
  scene.add(shellMesh);

  // 15. SEAGULL -> itemId: "seagull"
  const seagullGroup = new THREE.Group();
  seagullGroup.position.set(2, 7.5, -2);
  const gBody = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
  gBody.rotateX(Math.PI / 2);
  const gWingL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.35), new THREE.MeshLambertMaterial({ color: 0xffffff }));
  gWingL.position.set(-0.8, 0, 0);
  const gWingR = gWingL.clone();
  gWingR.position.set(0.8, 0, 0);
  seagullGroup.add(gBody, gWingL, gWingR);
  tagInteractive(seagullGroup, "seagull");
  scene.add(seagullGroup);

  // 16. SUBMARINE -> itemId: "submarine"
  const { group: subGroup, prop } = createSubmarine();
  tagInteractive(subGroup, "submarine");
  scene.add(subGroup);

  // 17. ANCHOR -> itemId: "anchor"
  const anchorMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.12, 6, 8, Math.PI),
    new THREE.MeshLambertMaterial({ color: 0x334155, flatShading: true })
  );
  anchorMesh.position.set(-8.5, 1.2, 5.5);
  anchorMesh.rotation.x = Math.PI / 2;
  tagInteractive(anchorMesh, "anchor");
  scene.add(anchorMesh);

  // ANIMATION LOOP (Only individual animal / vehicle mechanics, ZERO MAP SHAKING)
  return {
    interactiveMeshes,
    update: (time) => {
      // 1. Lighthouse rotating beam
      lightBeam.rotation.y = time * 1.2;

      // 2. Sailboat gentle float
      boatGroup.position.y = 0.2 + Math.sin(time * 1.8) * 0.1;
      boatGroup.rotation.z = Math.sin(time * 1.6) * 0.05;

      // 3. Buoy bobbing
      buoyGroup.position.y = 0.4 + Math.sin(time * 2.0) * 0.08;

      // 4. Dolphin jumping in graceful arc
      const jumpCycle = (time * 0.8) % 4.5;
      if (jumpCycle < 2) {
        const t = jumpCycle / 2;
        dolphinGroup.position.y = Math.sin(t * Math.PI) * 3.0 - 0.4;
        dolphinGroup.position.x = 7 + Math.sin(t * Math.PI) * 1.5;
        dolphinGroup.rotation.z = (t - 0.5) * -1.8;
      } else {
        dolphinGroup.position.y = -1.6;
      }

      // 5. Whale bobbing & spout spray
      whaleGroup.position.y = 0.2 + Math.sin(time * 1.2) * 0.08;
      whaleTail.rotation.x = Math.sin(time * 2.5) * 0.18;
      spoutMesh.scale.y = 1.0 + Math.sin(time * 4) * 0.45;

      // 6. Sea turtle swimming
      turtleGroup.position.x = 2 + Math.sin(time * 0.6) * 0.9;
      turtleGroup.position.z = 8 + Math.cos(time * 0.6) * 0.9;
      flipperL.rotation.y = Math.sin(time * 2.8) * 0.32;
      flipperR.rotation.y = -Math.sin(time * 2.8) * 0.32;

      // 7. Clownfish schooling
      fishGroup.rotation.y = time * 0.55;

      // 8. Crab scuttling
      crabGroup.position.x = -6 + Math.sin(time * 2.2) * 0.7;

      // 9. Seagull circling
      seagullGroup.position.x = 2 + Math.cos(time * 1.3) * 5.0;
      seagullGroup.position.z = -2 + Math.sin(time * 1.3) * 5.0;
      seagullGroup.rotation.y = -time * 1.3 + Math.PI / 2;
      gWingL.rotation.z = Math.sin(time * 11) * 0.42;
      gWingR.rotation.z = -Math.sin(time * 11) * 0.42;

      // 10. Submarine propeller
      prop.rotation.x = time * 15;
    },
    dispose: () => {
      waterGeo.dispose();
      waterMat.dispose();
      islandBase.geometry.dispose();
      sandHill.geometry.dispose();
      sandMat.dispose();
    },
  };
}
