import * as THREE from "three";

/**
 * 3D Geometry and Model Builders for Ocean & Marine Ecosystem
 * Every object is built with volumetric 3D components for maximum visual realism.
 */

// Helper to tag all child meshes with itemId
export function tagObject(obj, itemId, interactiveList) {
  obj.userData = { itemId };
  obj.traverse((child) => {
    if (child.isMesh) {
      child.userData = { itemId };
      if (interactiveList) interactiveList.push(child);
    }
  });
}

// 1. 3D Floating Ocean Buoy (Represents Ocean)
export function createOceanBuoy() {
  const group = new THREE.Group();
  group.position.set(0, 0.4, 10);

  // Buoy float body (cylinder with tapered ends)
  const floatMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.7, 1.6, 12),
    new THREE.MeshLambertMaterial({ color: 0xef4444, flatShading: true })
  );
  floatMesh.position.y = 0.8;

  // Yellow stripe band
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.82, 0.4, 12),
    new THREE.MeshLambertMaterial({ color: 0xfacc15 })
  );
  band.position.y = 0.8;

  // Lattice beacon tower
  const tower = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 1.4, 4),
    new THREE.MeshLambertMaterial({ color: 0x334155, wireframe: false })
  );
  tower.position.y = 2.1;

  // Blinking lantern top
  const lantern = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
  );
  lantern.position.y = 2.9;

  group.add(floatMesh, band, tower, lantern);
  return { group, lantern };
}

// 2. 3D Beach Resort & Sandcastle (Represents Beach)
export function createBeachArea() {
  const group = new THREE.Group();
  group.position.set(-7, 1.2, 2);

  // Parasol Umbrella
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  pole.position.set(0, 1.2, 0);
  pole.rotation.z = -0.15;

  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 0.9, 8),
    new THREE.MeshLambertMaterial({ color: 0x0284c7, flatShading: true })
  );
  canopy.position.set(-0.2, 2.4, 0);

  // Sun lounger / beach bed
  const lounger = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.2, 2.0),
    new THREE.MeshLambertMaterial({ color: 0xf97316 })
  );
  lounger.position.set(1.2, 0.1, 0.2);
  lounger.rotation.y = 0.3;

  // 3D Sandcastle with towers
  const castleBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 0.6, 6),
    new THREE.MeshLambertMaterial({ color: 0xfde047 })
  );
  castleBase.position.set(-1.4, 0.3, 0.8);

  const castleTower = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 0.5, 4),
    new THREE.MeshLambertMaterial({ color: 0xeab308 })
  );
  castleTower.position.set(-1.4, 0.8, 0.8);

  group.add(pole, canopy, lounger, castleBase, castleTower);
  return group;
}

// 3. 3D Lighthouse with rotating light beam
export function createLighthouse() {
  const group = new THREE.Group();
  group.position.set(-14, 1.6, -9);

  // Rocky Foundation
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(3.2),
    new THREE.MeshLambertMaterial({ color: 0x475569, flatShading: true })
  );
  rock.position.y = 1.0;
  rock.scale.set(1.2, 0.8, 1.2);
  group.add(rock);

  // Striped tower
  const whiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, flatShading: true });
  const redMat = new THREE.MeshLambertMaterial({ color: 0xd97706, flatShading: true });

  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 2.0, 12), redMat);
  s1.position.y = 3.2;
  const s2 = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.5, 2.0, 12), whiteMat);
  s2.position.y = 5.2;
  const s3 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.25, 2.0, 12), redMat);
  s3.position.y = 7.2;
  const s4 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 1.5, 12), whiteMat);
  s4.position.y = 8.8;

  // Balcony gallery
  const gallery = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.35, 0.25, 12),
    new THREE.MeshLambertMaterial({ color: 0x0f172a })
  );
  gallery.position.y = 9.7;

  // Glowing lantern room
  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 1.1, 10),
    new THREE.MeshPhongMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.85 })
  );
  lantern.position.y = 10.35;

  // Conical roof cap
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.95, 1.2, 10),
    new THREE.MeshLambertMaterial({ color: 0x0f172a })
  );
  roof.position.y = 11.45;

  // Light beam
  const beamGeo = new THREE.ConeGeometry(3.5, 18, 10, 1, true);
  beamGeo.rotateX(-Math.PI / 2);
  beamGeo.translate(0, 0, 9);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });
  const lightBeam = new THREE.Mesh(beamGeo, beamMat);
  lightBeam.position.y = 10.35;

  group.add(s1, s2, s3, s4, gallery, lantern, roof, lightBeam);
  return { group, lightBeam };
}

// 4. 3D Sailboat
export function createSailboat() {
  const group = new THREE.Group();
  group.position.set(13, 0.2, -5);

  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.1, 5.2),
    new THREE.MeshLambertMaterial({ color: 0x9a3412, flatShading: true })
  );
  hull.position.y = 0.5;

  const bow = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 1.8, 4),
    new THREE.MeshLambertMaterial({ color: 0x9a3412, flatShading: true })
  );
  bow.position.set(0, 0.5, 2.9);
  bow.rotation.x = -Math.PI / 2;

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 5.2, 6),
    new THREE.MeshLambertMaterial({ color: 0x78350f })
  );
  mast.position.set(0, 3.1, 0.2);

  const mainSailShape = new THREE.Shape();
  mainSailShape.moveTo(0, 0);
  mainSailShape.lineTo(0, 4.4);
  mainSailShape.lineTo(2.2, 0.6);
  mainSailShape.closePath();
  const mainSail = new THREE.Mesh(
    new THREE.ShapeGeometry(mainSailShape),
    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  mainSail.position.set(0.05, 0.9, 0.2);
  mainSail.rotateY(Math.PI / 2);

  group.add(hull, bow, mast, mainSail);
  return group;
}

// 5. 3D Dolphin
export function createDolphin() {
  const group = new THREE.Group();
  group.position.set(7, 0, 7);

  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 3.2, 8),
    new THREE.MeshLambertMaterial({ color: 0x38bdf8, flatShading: true })
  );
  body.rotateX(Math.PI / 2);

  const fin = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.8, 4),
    new THREE.MeshLambertMaterial({ color: 0x0284c7, flatShading: true })
  );
  fin.position.set(0, 0.7, 0.2);
  fin.rotation.x = -0.4;

  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.1, 0.5),
    new THREE.MeshLambertMaterial({ color: 0x0284c7 })
  );
  tail.position.set(0, 0, -1.6);

  group.add(body, fin, tail);
  return group;
}

// 6. 3D Whale with Spout
export function createWhale() {
  const group = new THREE.Group();
  group.position.set(16, 0.2, 3);

  const torso = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 10, 8),
    new THREE.MeshLambertMaterial({ color: 0x1e3a8a, flatShading: true })
  );
  torso.scale.set(1.2, 1.0, 2.6);

  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0xe0f2fe, flatShading: true })
  );
  belly.scale.set(1.1, 0.5, 2.3);
  belly.position.y = -0.6;

  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.18, 1.2),
    new THREE.MeshLambertMaterial({ color: 0x1e3a8a })
  );
  tail.position.set(0, 0.4, -4.8);

  const spout = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 2.8, 6),
    new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.75 })
  );
  spout.position.set(0, 2.3, 1.4);

  group.add(torso, belly, tail, spout);
  return { group, tail, spout };
}

// 7. 3D Sea Turtle
export function createSeaTurtle() {
  const group = new THREE.Group();
  group.position.set(2, 0.2, 8);

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0x15803d, flatShading: true })
  );
  shell.scale.set(1.2, 0.5, 1.5);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 6, 6),
    new THREE.MeshLambertMaterial({ color: 0x16a34a })
  );
  head.position.set(0, 0.1, 1.8);

  const flipperL = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.08, 0.5),
    new THREE.MeshLambertMaterial({ color: 0x16a34a })
  );
  flipperL.position.set(-1.4, -0.1, 0.8);

  const flipperR = flipperL.clone();
  flipperR.position.set(1.4, -0.1, 0.8);

  group.add(shell, head, flipperL, flipperR);
  return { group, flipperL, flipperR };
}

// 8. 3D Submarine
export function createSubmarine() {
  const group = new THREE.Group();
  group.position.set(-13, 0.2, 12);

  const hull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 4.2, 10),
    new THREE.MeshLambertMaterial({ color: 0xfacc15, flatShading: true })
  );
  hull.rotateZ(Math.PI / 2);

  const conningTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.9, 0.9),
    new THREE.MeshLambertMaterial({ color: 0xeab308 })
  );
  conningTower.position.y = 0.9;

  const prop = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.9, 0.9),
    new THREE.MeshLambertMaterial({ color: 0x1e293b })
  );
  prop.position.x = -2.2;

  group.add(hull, conningTower, prop);
  return { group, prop };
}
