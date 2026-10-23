import * as THREE from "three";

/**
 * Procedural 3D Model Builders for Original 15 Marine & Coastal Features
 * Includes lighthouse, sailboat, dolphin, whale, turtle, clownfish, coral, etc.
 */

// 1. LIGHTHOUSE MODEL
export function buildLighthouseModel() {
  const group = new THREE.Group();
  group.position.set(-20, 1.8, -16);

  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(3.8),
    new THREE.MeshLambertMaterial({ color: 0x475569, flatShading: true })
  );
  rock.position.y = 1.2;
  rock.scale.set(1.4, 0.9, 1.4);
  group.add(rock);

  const whiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, flatShading: true });
  const redMat = new THREE.MeshLambertMaterial({ color: 0xef4444, flatShading: true });

  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 2.2, 12), redMat);
  s1.position.y = 3.5;
  const s2 = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 2.2, 12), whiteMat);
  s2.position.y = 5.7;
  const s3 = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.3, 2.2, 12), redMat);
  s3.position.y = 7.9;
  const s4 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 1.6, 12), whiteMat);
  s4.position.y = 9.8;

  const balcony = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.45, 0.28, 12),
    new THREE.MeshLambertMaterial({ color: 0x0f172a })
  );
  balcony.position.y = 10.7;

  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 1.2, 10),
    new THREE.MeshPhongMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.95 })
  );
  lantern.position.y = 11.45;

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.05, 1.3, 10),
    new THREE.MeshLambertMaterial({ color: 0x0f172a })
  );
  roof.position.y = 12.7;

  const beamGeo = new THREE.ConeGeometry(4.0, 22, 10, 1, true);
  beamGeo.rotateX(-Math.PI / 2);
  beamGeo.translate(0, 0, 11);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });
  const lightBeam = new THREE.Mesh(beamGeo, beamMat);
  lightBeam.position.y = 11.45;

  group.add(s1, s2, s3, s4, balcony, lantern, roof, lightBeam);
  return { group, lightBeam };
}

// 2. PALM TREE MODEL
export function buildPalmTreeModel() {
  const group = new THREE.Group();
  group.position.set(-14, 1.8, -10);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.45, 5.2, 8),
    new THREE.MeshLambertMaterial({ color: 0x78350f, flatShading: true })
  );
  trunk.position.y = 2.6;
  trunk.rotation.z = 0.15;

  const coconutMat = new THREE.MeshLambertMaterial({ color: 0x451a03 });
  for (let i = 0; i < 3; i++) {
    const nut = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), coconutMat);
    nut.position.set(Math.cos(i * 2.1) * 0.35, 5.0, Math.sin(i * 2.1) * 0.35);
    group.add(nut);
  }

  for (let i = 0; i < 6; i++) {
    const frond = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.08, 2.8),
      new THREE.MeshLambertMaterial({ color: 0x16a34a, flatShading: true })
    );
    frond.position.set(0, 5.2, 0);
    frond.rotation.y = (i * Math.PI * 2) / 6;
    frond.rotation.x = 0.45;
    group.add(frond);
  }

  group.add(trunk);
  return { group };
}

// 3. BEACH RESORT & SANDCASTLE
export function buildBeachModel() {
  const group = new THREE.Group();
  group.position.set(-10, 0.6, -4);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  pole.position.set(0, 1.2, 0);
  pole.rotation.z = -0.12;

  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 0.9, 8),
    new THREE.MeshLambertMaterial({ color: 0x0284c7, flatShading: true })
  );
  canopy.position.set(-0.2, 2.4, 0);

  const lounger = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.22, 2.0),
    new THREE.MeshLambertMaterial({ color: 0xf97316 })
  );
  lounger.position.set(1.2, 0.1, 0.2);
  lounger.rotation.y = 0.3;

  const castleBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.8, 0.6, 6),
    new THREE.MeshLambertMaterial({ color: 0xfde047 })
  );
  castleBase.position.set(-1.4, 0.3, 0.8);

  const tower = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.6, 4),
    new THREE.MeshLambertMaterial({ color: 0xeab308 })
  );
  tower.position.set(-1.4, 0.9, 0.8);

  group.add(pole, canopy, lounger, castleBase, tower);
  return { group };
}

// 4. ANCHOR MODEL
export function buildAnchorModel() {
  const group = new THREE.Group();
  group.position.set(-16, 0.5, -4);

  const mat = new THREE.MeshLambertMaterial({ color: 0x334155, flatShading: true });
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), mat);
  shank.rotation.z = Math.PI / 4;

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 6, 12), mat);
  ring.position.set(-0.8, 0.8, 0);

  const arms = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.12, 6, 8, Math.PI), mat);
  arms.position.set(0.6, -0.6, 0);
  arms.rotation.z = Math.PI / 4;

  group.add(shank, ring, arms);
  return { group };
}

// 5. CRAB MODEL
export function buildCrabModel() {
  const group = new THREE.Group();
  group.position.set(-7.5, 0.5, 1.5);

  const redMat = new THREE.MeshLambertMaterial({ color: 0xef4444, flatShading: true });
  const darkRed = new THREE.MeshLambertMaterial({ color: 0x991b1b });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6), redMat);
  body.scale.set(1.4, 0.5, 1.0);

  const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.45), darkRed);
  clawL.position.set(-0.7, 0.15, 0.45);
  const clawR = clawL.clone();
  clawR.position.set(0.7, 0.15, 0.45);

  const eyeL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35), redMat);
  eyeL.position.set(-0.25, 0.4, 0.35);
  const eyeR = eyeL.clone();
  eyeR.position.set(0.25, 0.4, 0.35);

  group.add(body, clawL, clawR, eyeL, eyeR);
  return { group };
}

// 6. SEASHELL MODEL
export function buildSeashellModel() {
  const group = new THREE.Group();
  group.position.set(-12, 0.4, 1.0);

  const shell = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 0.7, 8),
    new THREE.MeshLambertMaterial({ color: 0xfbcfe8, flatShading: true })
  );
  shell.rotation.x = Math.PI / 3;
  shell.rotation.z = 0.2;

  group.add(shell);
  return { group };
}

// 7. OCEAN BUOY MODEL
export function buildOceanBuoyModel() {
  const group = new THREE.Group();
  group.position.set(0, 0.4, 0);

  const floatMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.75, 1.8, 12),
    new THREE.MeshLambertMaterial({ color: 0xef4444, flatShading: true })
  );
  floatMesh.position.y = 0.9;

  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 0.92, 0.45, 12),
    new THREE.MeshLambertMaterial({ color: 0xfacc15 })
  );
  band.position.y = 0.9;

  const tower = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 1.5, 4),
    new THREE.MeshLambertMaterial({ color: 0x1e293b })
  );
  tower.position.y = 2.3;

  const lantern = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
  );
  lantern.position.y = 3.1;

  group.add(floatMesh, band, tower, lantern);
  return { group, lantern };
}

// 8. SEAGULL MODEL
export function buildSeagullModel() {
  const group = new THREE.Group();
  group.position.set(0, 8.5, -6);

  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.0, 5), mat);
  body.rotateX(Math.PI / 2);

  const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.4), mat);
  wingL.position.set(-0.9, 0, 0);
  const wingR = wingL.clone();
  wingR.position.set(0.9, 0, 0);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 4), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
  beak.position.set(0, -0.05, 0.6);
  beak.rotateX(Math.PI / 2);

  group.add(body, wingL, wingR, beak);
  return { group, wingL, wingR };
}

// 9. SAILBOAT MODEL
export function buildSailboatModel() {
  const group = new THREE.Group();
  group.position.set(16, 0.5, -12);

  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.2, 5.6),
    new THREE.MeshLambertMaterial({ color: 0x9a3412, flatShading: true })
  );
  hull.position.y = 0.6;

  const bow = new THREE.Mesh(
    new THREE.ConeGeometry(1.3, 2.0, 4),
    new THREE.MeshLambertMaterial({ color: 0x9a3412, flatShading: true })
  );
  bow.position.set(0, 0.6, 3.1);
  bow.rotation.x = -Math.PI / 2;

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 5.6, 6),
    new THREE.MeshLambertMaterial({ color: 0x78350f })
  );
  mast.position.set(0, 3.4, 0.2);

  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0);
  sailShape.lineTo(0, 4.8);
  sailShape.lineTo(2.4, 0.8);
  sailShape.closePath();
  const mainSail = new THREE.Mesh(
    new THREE.ShapeGeometry(sailShape),
    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  mainSail.position.set(0.05, 1.0, 0.2);
  mainSail.rotateY(Math.PI / 2);

  group.add(hull, bow, mast, mainSail);
  return { group };
}

// 10. WHALE MODEL
export function buildWhaleModel() {
  const group = new THREE.Group();
  group.position.set(22, 0.9, 4);

  const torso = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 10, 8),
    new THREE.MeshLambertMaterial({ color: 0x1e3a8a, flatShading: true })
  );
  torso.scale.set(1.2, 1.0, 2.8);

  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0xe0f2fe, flatShading: true })
  );
  belly.scale.set(1.1, 0.5, 2.4);
  belly.position.y = -0.7;

  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.2, 1.4),
    new THREE.MeshLambertMaterial({ color: 0x1e3a8a })
  );
  tail.position.set(0, 0.5, -5.2);

  const spout = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 3.2, 6),
    new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.8 })
  );
  spout.position.set(0, 2.6, 1.6);

  group.add(torso, belly, tail, spout);
  return { group, tail, spout };
}

// 11. DOLPHIN MODEL
export function buildDolphinModel() {
  const group = new THREE.Group();
  group.position.set(12, 1.5, 12);

  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 3.6, 8),
    new THREE.MeshLambertMaterial({ color: 0x38bdf8, flatShading: true })
  );
  body.rotateX(Math.PI / 2);

  const fin = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 0.9, 4),
    new THREE.MeshLambertMaterial({ color: 0x0284c7, flatShading: true })
  );
  fin.position.set(0, 0.8, 0.2);
  fin.rotation.x = -0.4;

  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.12, 0.6),
    new THREE.MeshLambertMaterial({ color: 0x0284c7 })
  );
  tail.position.set(0, 0, -1.8);

  group.add(body, fin, tail);
  return { group };
}

// 12. SEA TURTLE MODEL
export function buildSeaTurtleModel() {
  const group = new THREE.Group();
  group.position.set(4, 0.2, 16);

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0x15803d, flatShading: true })
  );
  shell.scale.set(1.2, 0.5, 1.6);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 6, 6),
    new THREE.MeshLambertMaterial({ color: 0x16a34a })
  );
  head.position.set(0, 0.1, 2.0);

  const flipperL = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.08, 0.6),
    new THREE.MeshLambertMaterial({ color: 0x16a34a })
  );
  flipperL.position.set(-1.5, -0.1, 0.9);
  const flipperR = flipperL.clone();
  flipperR.position.set(1.5, -0.1, 0.9);

  group.add(shell, head, flipperL, flipperR);
  return { group, flipperL, flipperR };
}

// 13. CORAL REEF MODEL
export function buildCoralReefModel() {
  const group = new THREE.Group();
  group.position.set(-6, -0.4, 18);

  const colors = [0xf43f5e, 0xa855f7, 0x06b6d4, 0xf59e0b];
  for (let i = 0; i < 9; i++) {
    const col = colors[i % colors.length];
    const cMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.6, 1.8 + (i % 3) * 0.4, 6),
      new THREE.MeshLambertMaterial({ color: col, flatShading: true })
    );
    cMesh.position.set(Math.sin(i * 0.8) * 2.8, 0.8, Math.cos(i * 0.8) * 2.5);
    group.add(cMesh);
  }

  return { group };
}

// 14. CLOWNFISH MODEL
export function buildClownfishModel() {
  const group = new THREE.Group();
  group.position.set(-1, -0.2, 20);

  for (let i = 0; i < 4; i++) {
    const fish = new THREE.Group();
    fish.position.set((i - 1.5) * 1.0, (i % 2) * 0.3, (i % 3) * 0.5);

    const body = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.1, 6),
      new THREE.MeshLambertMaterial({ color: 0xf97316, flatShading: true })
    );
    body.scale.set(0.6, 0.9, 1.2);
    body.rotation.x = Math.PI / 2;

    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.22, 6),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    stripe.rotation.x = Math.PI / 2;

    fish.add(body, stripe);
    group.add(fish);
  }

  return { group };
}

// 15. SUBMARINE MODEL
export function buildSubmarineModel() {
  const group = new THREE.Group();
  group.position.set(18, 0.2, 20);

  const hull = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 1.0, 4.6, 10),
    new THREE.MeshLambertMaterial({ color: 0xfacc15, flatShading: true })
  );
  hull.rotateZ(Math.PI / 2);

  const conningTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.0, 1.0),
    new THREE.MeshLambertMaterial({ color: 0xeab308 })
  );
  conningTower.position.y = 1.0;

  const prop = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.0, 1.0),
    new THREE.MeshLambertMaterial({ color: 0x1e293b })
  );
  prop.position.x = -2.4;

  group.add(hull, conningTower, prop);
  return { group, prop };
}
