import * as THREE from "three";

/**
 * Builds the complete low-poly 3D Ocean ecosystem with animated elements.
 * Returns an object containing the meshes, groups, and an update(time) function.
 */
export function buildOcean3DScene(scene) {
  const animatedObjects = [];

  // 1. SKY & LIGHTING
  scene.background = new THREE.Color(0x7dd3fc);
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.012);

  const ambientLight = new THREE.AmbientLight(0xe0f2fe, 0.85);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
  sunLight.position.set(20, 35, 15);
  scene.add(sunLight);

  const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x0284c7, 0.4);
  scene.add(hemiLight);

  // 2. OCEAN WATER PLANE (Animated Waves)
  const waterGeo = new THREE.PlaneGeometry(80, 80, 36, 36);
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

  // Store original positions for wave displacement
  const waterPosAttr = waterGeo.attributes.position;
  const initialYPositions = new Float32Array(waterPosAttr.count);
  for (let i = 0; i < waterPosAttr.count; i++) {
    initialYPositions[i] = waterPosAttr.getY(i);
  }

  // 3. SANDY ISLAND & BEACH
  const islandGroup = new THREE.Group();
  const islandGeo = new THREE.CylinderGeometry(14, 18, 2.2, 16);
  const sandMat = new THREE.MeshLambertMaterial({ color: 0xfef08a, flatShading: true });
  const islandMesh = new THREE.Mesh(islandGeo, sandMat);
  islandMesh.position.set(-10, 0.4, -2);
  islandMesh.scale.set(1.1, 0.8, 1);
  islandGroup.add(islandMesh);

  // Sandy shoreline extension
  const shoreGeo = new THREE.CylinderGeometry(18, 22, 0.6, 16);
  const shoreMat = new THREE.MeshLambertMaterial({ color: 0xfde047, flatShading: true });
  const shoreMesh = new THREE.Mesh(shoreGeo, shoreMat);
  shoreMesh.position.set(-10, 0.1, -2);
  islandGroup.add(shoreMesh);
  scene.add(islandGroup);

  // 4. LIGHTHOUSE
  const lighthouseGroup = new THREE.Group();
  lighthouseGroup.position.set(-13, 1.2, -9);

  // Base rock
  const baseRock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(2.5),
    new THREE.MeshLambertMaterial({ color: 0x64748b, flatShading: true })
  );
  baseRock.position.y = 0.5;
  lighthouseGroup.add(baseRock);

  // Red & White striped tower segments
  const whiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, flatShading: true });
  const redMat = new THREE.MeshLambertMaterial({ color: 0xef4444, flatShading: true });

  const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1.8, 10), redMat);
  seg1.position.y = 2.4;
  const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 1.8, 10), whiteMat);
  seg2.position.y = 4.2;
  const seg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 1.8, 10), redMat);
  seg3.position.y = 6.0;
  const seg4 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 1.2, 10), whiteMat);
  seg4.position.y = 7.5;

  // Lantern room & glowing lamp
  const lanternRoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 1.0, 8),
    new THREE.MeshPhongMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.6 })
  );
  lanternRoom.position.y = 8.6;

  // Roof dome
  const roofDome = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 1.0, 10),
    new THREE.MeshLambertMaterial({ color: 0x1e293b })
  );
  roofDome.position.y = 9.6;

  // Rotating Light Beam
  const beamGeo = new THREE.ConeGeometry(3, 14, 8, 1, true);
  beamGeo.rotateX(-Math.PI / 2);
  beamGeo.translate(0, 0, 7);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  const lightBeam = new THREE.Mesh(beamGeo, beamMat);
  lightBeam.position.y = 8.6;
  lighthouseGroup.add(lightBeam);

  lighthouseGroup.add(seg1, seg2, seg3, seg4, lanternRoom, roofDome);
  scene.add(lighthouseGroup);

  // 5. SAILBOAT (Floating and rocking on water)
  const boatGroup = new THREE.Group();
  boatGroup.position.set(12, 0.2, -5);

  const hullGeo = new THREE.BoxGeometry(2.2, 1.0, 5.0);
  const hullMat = new THREE.MeshLambertMaterial({ color: 0x9a3412, flatShading: true });
  const hullMesh = new THREE.Mesh(hullGeo, hullMat);
  hullMesh.position.y = 0.4;
  boatGroup.add(hullMesh);

  // Mast
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 4.8, 6),
    new THREE.MeshLambertMaterial({ color: 0x78350f })
  );
  mast.position.set(0, 2.8, 0.3);
  boatGroup.add(mast);

  // White triangular sail
  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0);
  sailShape.lineTo(0, 4.0);
  sailShape.lineTo(1.8, 0.5);
  sailShape.closePath();
  const sailGeo = new THREE.ShapeGeometry(sailShape);
  const sailMat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const sailMesh = new THREE.Mesh(sailGeo, sailMat);
  sailMesh.position.set(0.05, 0.9, 0.2);
  sailMesh.rotateY(Math.PI / 2);
  boatGroup.add(sailMesh);
  scene.add(boatGroup);

  // 6. ANIMATED DOLPHINS (Jumping arc)
  const dolphinGroup = new THREE.Group();
  dolphinGroup.position.set(7, 0, 7);

  const dolphinBody = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 2.8, 8),
    new THREE.MeshLambertMaterial({ color: 0x38bdf8, flatShading: true })
  );
  dolphinBody.rotateX(Math.PI / 2);
  dolphinGroup.add(dolphinBody);

  const finL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.4), new THREE.MeshLambertMaterial({ color: 0x0284c7 }));
  finL.position.set(-0.6, -0.1, 0);
  const finR = finL.clone();
  finR.position.set(0.6, -0.1, 0);
  dolphinGroup.add(finL, finR);
  scene.add(dolphinGroup);

  // 7. BLUE WHALE
  const whaleGroup = new THREE.Group();
  whaleGroup.position.set(16, 0.2, 3);
  const whaleBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 2.2, 7.5),
    new THREE.MeshLambertMaterial({ color: 0x1e3a8a, flatShading: true })
  );
  whaleGroup.add(whaleBody);

  // Water fountain spray
  const spoutGeo = new THREE.CylinderGeometry(0.1, 0.7, 2.4, 6);
  const spoutMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65 });
  const spout = new THREE.Mesh(spoutGeo, spoutMat);
  spout.position.set(0, 2.2, 1.2);
  whaleGroup.add(spout);
  scene.add(whaleGroup);

  // 8. SEA TURTLE
  const turtleGroup = new THREE.Group();
  turtleGroup.position.set(2, 0.2, 8);
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0x15803d, flatShading: true })
  );
  shell.scale.set(1.2, 0.5, 1.5);
  turtleGroup.add(shell);

  const flipperL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.5), new THREE.MeshLambertMaterial({ color: 0x16a34a }));
  flipperL.position.set(-1.3, -0.1, 0.6);
  const flipperR = flipperL.clone();
  flipperR.position.set(1.3, -0.1, 0.6);
  turtleGroup.add(flipperL, flipperR);
  scene.add(turtleGroup);

  // 9. CLOWNFISH SCHOOL & CORAL REEF
  const coralGroup = new THREE.Group();
  coralGroup.position.set(-5, -0.5, 9);
  const coralColors = [0xf43f5e, 0xa855f7, 0x06b6d4, 0xeab308];
  for (let i = 0; i < 7; i++) {
    const col = coralColors[i % coralColors.length];
    const cMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.5 + Math.random() * 0.4, 1.5 + Math.random() * 1.2, 6),
      new THREE.MeshLambertMaterial({ color: col, flatShading: true })
    );
    cMesh.position.set((Math.random() - 0.5) * 3, 0.6, (Math.random() - 0.5) * 3);
    coralGroup.add(cMesh);
  }
  scene.add(coralGroup);

  // Clownfish
  const fishGroup = new THREE.Group();
  fishGroup.position.set(-2, -0.3, 11);
  for (let i = 0; i < 4; i++) {
    const fMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 6, 4),
      new THREE.MeshLambertMaterial({ color: 0xf97316, flatShading: true })
    );
    fMesh.scale.set(0.6, 0.8, 1.5);
    fMesh.position.set((i - 1.5) * 0.8, (i % 2) * 0.3, (i % 3) * 0.4);
    fishGroup.add(fMesh);
  }
  scene.add(fishGroup);

  // 10. PALM TREES
  const createPalm = (x, z, h) => {
    const palm = new THREE.Group();
    palm.position.set(x, 1.2, z);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.35, h, 6),
      new THREE.MeshLambertMaterial({ color: 0x78350f, flatShading: true })
    );
    trunk.position.y = h / 2;
    trunk.rotation.z = 0.15;
    palm.add(trunk);

    // Leaves
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.1, 2.2),
        new THREE.MeshLambertMaterial({ color: 0x16a34a, flatShading: true })
      );
      leaf.position.set(0, h, 0);
      leaf.rotation.y = (i * Math.PI * 2) / 5;
      leaf.rotation.x = 0.45;
      palm.add(leaf);
    }
    return palm;
  };
  scene.add(createPalm(-11, -2, 4.5));
  scene.add(createPalm(-9, 1, 3.8));

  // 11. CRAB ON BEACH
  const crabGroup = new THREE.Group();
  crabGroup.position.set(-5.5, 0.6, 4.5);
  const crabBody = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 4), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
  crabBody.scale.set(1.2, 0.6, 0.8);
  crabGroup.add(crabBody);
  scene.add(crabGroup);

  // 12. SEASHELL
  const shellMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 0.45, 6),
    new THREE.MeshLambertMaterial({ color: 0xfbcfe8, flatShading: true })
  );
  shellMesh.position.set(-3.5, 0.5, 3.5);
  shellMesh.rotation.x = Math.PI / 3;
  scene.add(shellMesh);

  // 13. SEAGULLS (Circling in sky)
  const seagullGroup = new THREE.Group();
  seagullGroup.position.set(1.5, 6.5, -2);
  const birdBody = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
  birdBody.rotateX(Math.PI / 2);
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
  wingL.position.set(-0.7, 0, 0);
  const wingR = wingL.clone();
  wingR.position.set(0.7, 0, 0);
  seagullGroup.add(birdBody, wingL, wingR);
  scene.add(seagullGroup);

  // 14. SUBMARINE
  const subGroup = new THREE.Group();
  subGroup.position.set(-13, 0.3, 12);
  const subHull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 3.8, 8),
    new THREE.MeshLambertMaterial({ color: 0xfacc15, flatShading: true })
  );
  subHull.rotateZ(Math.PI / 2);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.8), new THREE.MeshLambertMaterial({ color: 0xeab308 }));
  tower.position.y = 0.8;
  const prop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.8), new THREE.MeshLambertMaterial({ color: 0x334155 }));
  prop.position.x = -2.0;
  subGroup.add(subHull, tower, prop);
  scene.add(subGroup);

  // 15. ANCHOR
  const anchorMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.1, 6, 8, Math.PI),
    new THREE.MeshLambertMaterial({ color: 0x334155, flatShading: true })
  );
  anchorMesh.position.set(-9, 0.6, 5.5);
  anchorMesh.rotation.x = Math.PI / 2;
  scene.add(anchorMesh);

  // ANIMATION LOOP UPDATE FUNCTION
  return {
    update: (time) => {
      // 1. Water waves vertex animation
      const pos = waterGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getZ(i);
        const wave = Math.sin(u * 0.3 + time * 2.2) * 0.22 + Math.cos(v * 0.3 + time * 1.8) * 0.16;
        pos.setY(i, initialYPositions[i] + wave);
      }
      waterGeo.computeVertexNormals();
      pos.needsUpdate = true;

      // 2. Lighthouse rotating beam
      lightBeam.rotation.y = time * 1.2;

      // 3. Sailboat rocking on water
      boatGroup.position.y = 0.2 + Math.sin(time * 2.0) * 0.15;
      boatGroup.rotation.z = Math.sin(time * 1.8) * 0.08;
      boatGroup.rotation.x = Math.cos(time * 1.5) * 0.05;

      // 4. Dolphin jumping in arc
      const jumpCycle = (time * 0.8) % 4;
      if (jumpCycle < 2) {
        const t = jumpCycle / 2;
        dolphinGroup.position.y = Math.sin(t * Math.PI) * 2.8 - 0.5;
        dolphinGroup.position.x = 7 + Math.sin(t * Math.PI) * 1.2;
        dolphinGroup.rotation.z = (t - 0.5) * -1.8;
      } else {
        dolphinGroup.position.y = -1.5; // Under water
      }

      // 5. Whale bobbing & spout pulsing
      whaleGroup.position.y = 0.2 + Math.sin(time * 1.2) * 0.12;
      spout.scale.y = 1.0 + Math.sin(time * 4) * 0.4;

      // 6. Sea turtle swimming
      turtleGroup.position.x = 2 + Math.sin(time * 0.7) * 0.8;
      turtleGroup.position.z = 8 + Math.cos(time * 0.7) * 0.8;
      flipperL.rotation.y = Math.sin(time * 3) * 0.3;
      flipperR.rotation.y = -Math.sin(time * 3) * 0.3;

      // 7. Clownfish schooling
      fishGroup.rotation.y = time * 0.6;

      // 8. Crab scuttling sideways
      crabGroup.position.x = -5.5 + Math.sin(time * 2.5) * 0.8;

      // 9. Seagull circling in sky & flapping
      seagullGroup.position.x = 1.5 + Math.cos(time * 1.4) * 4.5;
      seagullGroup.position.z = -2 + Math.sin(time * 1.4) * 4.5;
      seagullGroup.rotation.y = -time * 1.4 + Math.PI / 2;
      wingL.rotation.z = Math.sin(time * 12) * 0.4;
      wingR.rotation.z = -Math.sin(time * 12) * 0.4;

      // 10. Submarine propeller
      prop.rotation.x = time * 15;
    },
    dispose: () => {
      waterGeo.dispose();
      waterMat.dispose();
      islandGeo.dispose();
      sandMat.dispose();
    },
  };
}
