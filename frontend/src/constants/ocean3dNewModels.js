import * as THREE from "three";

/**
 * Procedural 3D Model Builders for 15 Additional Marine & Coastal Features
 * Includes mangrove forest, fishing village, resort, sunset, shipwreck, sea cave, etc.
 */

// 1. Mangrove Forest (Stilt roots + dense green canopy)
export function buildMangroveForestModel() {
  const group = new THREE.Group();
  group.position.set(-24, 0.6, 2);

  const rootMat = new THREE.MeshLambertMaterial({ color: 0x5b3a29 });
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x15803d, flatShading: true });

  for (let i = 0; i < 4; i++) {
    const tree = new THREE.Group();
    tree.position.set(Math.sin(i * 1.5) * 1.8, 0, Math.cos(i * 1.5) * 1.5);

    // Stilt roots
    for (let r = 0; r < 4; r++) {
      const root = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 4), rootMat);
      root.position.set(Math.cos((r * Math.PI) / 2) * 0.4, 0.6, Math.sin((r * Math.PI) / 2) * 0.4);
      root.rotation.z = (r % 2 === 0 ? 1 : -1) * 0.25;
      tree.add(root);
    }

    // Canopy
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0), leafMat);
    foliage.position.y = 1.8;
    tree.add(foliage);
    group.add(tree);
  }

  return { group };
}

// 2. Fishing Village (Stilt wooden huts with thatched roofs and drying nets)
export function buildFishingVillageModel() {
  const group = new THREE.Group();
  group.position.set(-22, 1.2, -6);

  const woodMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
  const thatchMat = new THREE.MeshLambertMaterial({ color: 0xd97706, flatShading: true });

  for (let i = 0; i < 3; i++) {
    const hut = new THREE.Group();
    hut.position.set(i * 2.2 - 2, 0, (i % 2) * 1.2);

    const house = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.4), woodMat);
    house.position.y = 0.5;

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.9, 4), thatchMat);
    roof.position.y = 1.4;
    roof.rotation.y = Math.PI / 4;

    hut.add(house, roof);
    group.add(hut);
  }

  return { group };
}

// 3. Sunset (Luminous glowing sun sphere & warm atmospheric halo)
export function buildSunsetModel() {
  const group = new THREE.Group();
  group.position.set(0, 16, -35);

  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  const sunCore = new THREE.Mesh(new THREE.SphereGeometry(4.5, 16, 16), sunMat);

  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const halo = new THREE.Mesh(new THREE.RingGeometry(4.5, 10.5, 24), haloMat);

  group.add(sunCore, halo);
  return { group };
}

// 4. Coastal Resort (Luxury white villas with cyan swimming pool)
export function buildResortModel() {
  const group = new THREE.Group();
  group.position.set(-12, 1.5, 6);

  const villaMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, flatShading: true });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
  const poolMat = new THREE.MeshPhongMaterial({ color: 0x38bdf8, shininess: 90 });

  const villa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.8), villaMat);
  villa.position.y = 0.7;

  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 2.0), roofMat);
  roof.position.y = 1.5;

  const pool = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.4), poolMat);
  pool.position.set(0, 0.05, 2.0);

  group.add(villa, roof, pool);
  return { group };
}

// 5. Ancient Shipwreck (Tilted weathered hull & broken mast on seabed)
export function buildShipwreckModel() {
  const group = new THREE.Group();
  group.position.set(26, -0.6, 14);

  const wreckMat = new THREE.MeshLambertMaterial({ color: 0x3f3f46, flatShading: true });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 6.0), wreckMat);
  hull.rotation.z = 0.35;
  hull.rotation.y = 0.4;

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 6), wreckMat);
  mast.position.set(0.5, 1.8, 0);
  mast.rotation.z = -0.5;

  group.add(hull, mast);
  return { group };
}

// 6. Bioluminescent Jellyfish (Translucent bell & trailing tentacles)
export function buildJellyfishModel() {
  const group = new THREE.Group();
  group.position.set(8, 0.1, 24);

  const bellMat = new THREE.MeshPhongMaterial({
    color: 0xec4899,
    emissive: 0xbe185d,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
  });

  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), bellMat);
  bell.position.y = 0.8;

  for (let i = 0; i < 5; i++) {
    const tentacle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.01, 1.2, 4),
      new THREE.MeshBasicMaterial({ color: 0xf472b6 })
    );
    tentacle.position.set(Math.cos((i * Math.PI * 2) / 5) * 0.4, 0.2, Math.sin((i * Math.PI * 2) / 5) * 0.4);
    group.add(tentacle);
  }

  group.add(bell);
  return { group, bell };
}

// 7. Giant Octopus (Rounded bulb mantle & spreading tentacles)
export function buildOctopusModel() {
  const group = new THREE.Group();
  group.position.set(-14, -0.4, 22);

  const octoMat = new THREE.MeshLambertMaterial({ color: 0x9333ea, flatShading: true });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 8), octoMat);
  head.scale.set(1.0, 1.2, 1.0);
  head.position.y = 0.9;
  group.add(head);

  for (let i = 0; i < 8; i++) {
    const tentacle = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 4, 8, Math.PI), octoMat);
    tentacle.position.set(Math.cos((i * Math.PI) / 4) * 0.9, 0.2, Math.sin((i * Math.PI) / 4) * 0.9);
    tentacle.rotation.x = Math.PI / 2;
    tentacle.rotation.z = (i * Math.PI) / 4;
    group.add(tentacle);
  }

  return { group };
}

// 8. Giant Manta Ray (Wide winged diamond body)
export function buildMantaRayModel() {
  const group = new THREE.Group();
  group.position.set(18, 0.4, -4);

  const mantaMat = new THREE.MeshLambertMaterial({ color: 0x1e293b, flatShading: true });
  const whiteMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });

  const body = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.6, 4), mantaMat);
  body.scale.set(1.8, 0.15, 1.2);
  body.rotateX(-Math.PI / 2);

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.01, 2.4, 4), mantaMat);
  tail.position.set(0, 0, -1.8);
  tail.rotateX(-Math.PI / 2);

  group.add(body, tail);
  return { group };
}

// 9. Wooden Pier (Boardwalk stretching into the blue sea)
export function buildPierModel() {
  const group = new THREE.Group();
  group.position.set(-6, 0.5, -8);

  const woodMat = new THREE.MeshLambertMaterial({ color: 0x854d0e, flatShading: true });

  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 5.0), woodMat);
  deck.position.y = 0.5;

  for (let i = 0; i < 4; i++) {
    const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), woodMat);
    pillarL.position.set(-0.5, 0, i * 1.4 - 2.1);
    const pillarR = pillarL.clone();
    pillarR.position.x = 0.5;
    group.add(pillarL, pillarR);
  }

  group.add(deck);
  return { group };
}

// 10. Sea Cliff (Dramatic rock face)
export function buildCliffModel() {
  const group = new THREE.Group();
  group.position.set(-25, 5.0, -18);

  const cliff = new THREE.Mesh(
    new THREE.DodecahedronGeometry(5.2),
    new THREE.MeshLambertMaterial({ color: 0x334155, flatShading: true })
  );
  cliff.scale.set(1.2, 1.6, 1.1);

  group.add(cliff);
  return { group };
}

// 11. Colorful Starfish (5-pointed star on sand)
export function buildStarfishModel() {
  const group = new THREE.Group();
  group.position.set(-5, 0.3, 4);

  const starMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });

  for (let i = 0; i < 5; i++) {
    const arm = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.8, 4), starMat);
    arm.rotation.z = -Math.PI / 2;
    arm.rotation.y = (i * Math.PI * 2) / 5;
    arm.position.set(Math.cos((i * Math.PI * 2) / 5) * 0.35, 0.05, Math.sin((i * Math.PI * 2) / 5) * 0.35);
    group.add(arm);
  }

  return { group };
}

// 12. Island Volcano (Towering crater peak with lava glow)
export function buildVolcanoModel() {
  const group = new THREE.Group();
  group.position.set(-16, 7.5, -24);

  const volMat = new THREE.MeshLambertMaterial({ color: 0x27272a, flatShading: true });
  const lavaMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 6.5, 8.0, 10), volMat);
  cone.position.y = 4.0;

  const craterLava = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.2, 10), lavaMat);
  craterLava.position.y = 8.05;

  group.add(cone, craterLava);
  return { group };
}

// 13. Ocean Kayak (Sporty red kayak & double paddle)
export function buildKayakModel() {
  const group = new THREE.Group();
  group.position.set(6, 0.3, 5);

  const kayakMat = new THREE.MeshLambertMaterial({ color: 0xdc2626, flatShading: true });
  const paddleMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.3, 2.8), kayakMat);
  body.position.y = 0.15;

  const paddle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 4), paddleMat);
  paddle.position.set(0, 0.35, 0);
  paddle.rotation.z = Math.PI / 3;

  group.add(body, paddle);
  return { group };
}

// 14. Island Waterfall (Cliff wall with shimmering water torrent)
export function buildWaterfallModel() {
  const group = new THREE.Group();
  group.position.set(-22, 3.2, -12);

  const rockMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
  const waterMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.85 });

  const rockBack = new THREE.Mesh(new THREE.BoxGeometry(3.0, 5.0, 1.2), rockMat);
  rockBack.position.y = 2.5;

  const torrent = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 4.8), waterMat);
  torrent.position.set(0, 2.4, 0.65);

  group.add(rockBack, torrent);
  return { group, torrent };
}

// 15. Sea Cave (Arch rock formation over water)
export function buildSeaCaveModel() {
  const group = new THREE.Group();
  group.position.set(-26, 1.8, -14);

  const rockMat = new THREE.MeshLambertMaterial({ color: 0x1e293b, flatShading: true });

  const arch = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.9, 6, 8, Math.PI), rockMat);
  arch.position.y = 1.0;
  arch.rotation.y = Math.PI / 4;

  group.add(arch);
  return { group };
}
