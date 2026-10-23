import test from "node:test";
import assert from "node:assert/strict";
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
} from "../src/components/VisualVocab/ocean3dModels.js";

test("tagObject correctly tags group and child meshes with itemId and populates list", () => {
  const group = new THREE.Group();
  const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(1));
  group.add(mesh1, mesh2);

  const interactiveList = [];
  tagObject(group, "test_item", interactiveList);

  assert.equal(group.userData.itemId, "test_item");
  assert.equal(mesh1.userData.itemId, "test_item");
  assert.equal(mesh2.userData.itemId, "test_item");
  assert.equal(interactiveList.length, 2);
  assert.equal(interactiveList[0], mesh1);
  assert.equal(interactiveList[1], mesh2);
});

test("createOceanBuoy builds 3D buoy group with lantern and correct hierarchy", () => {
  const { group, lantern } = createOceanBuoy();
  assert.ok(group instanceof THREE.Group);
  assert.ok(lantern instanceof THREE.Mesh);
  assert.equal(group.position.y, 0.4);
  assert.equal(group.position.z, 10);
  assert.ok(group.children.length >= 4);
});

test("createBeachArea builds 3D resort area with parasol, lounger, and sandcastle", () => {
  const group = createBeachArea();
  assert.ok(group instanceof THREE.Group);
  assert.equal(group.position.x, -7);
  assert.equal(group.position.z, 2);
  assert.ok(group.children.length >= 4);
});

test("createLighthouse builds 3D lighthouse with cliff base and rotating beam", () => {
  const { group, lightBeam } = createLighthouse();
  assert.ok(group instanceof THREE.Group);
  assert.ok(lightBeam instanceof THREE.Mesh);
  assert.equal(group.position.x, -14);
  assert.ok(group.children.length >= 7);
});

test("createSailboat builds 3D wooden hull and mainsail", () => {
  const group = createSailboat();
  assert.ok(group instanceof THREE.Group);
  assert.equal(group.position.x, 13);
  assert.ok(group.children.length >= 3);
});

test("createDolphin builds 3D cone body, dorsal fin, and tail", () => {
  const group = createDolphin();
  assert.ok(group instanceof THREE.Group);
  assert.equal(group.position.x, 7);
  assert.equal(group.position.z, 7);
  assert.equal(group.children.length, 3);
});

test("createWhale builds 3D torso, belly, tail, and water spout", () => {
  const { group, tail, spout } = createWhale();
  assert.ok(group instanceof THREE.Group);
  assert.ok(tail instanceof THREE.Mesh);
  assert.ok(spout instanceof THREE.Mesh);
  assert.equal(group.position.x, 16);
  assert.ok(group.children.length >= 4);
});

test("createSeaTurtle builds 3D shell, head, and paddling flippers", () => {
  const { group, flipperL, flipperR } = createSeaTurtle();
  assert.ok(group instanceof THREE.Group);
  assert.ok(flipperL instanceof THREE.Mesh);
  assert.ok(flipperR instanceof THREE.Mesh);
  assert.equal(group.position.x, 2);
  assert.equal(group.children.length, 4);
});

test("createSubmarine builds 3D yellow hull, conning tower, and propeller", () => {
  const { group, prop } = createSubmarine();
  assert.ok(group instanceof THREE.Group);
  assert.ok(prop instanceof THREE.Mesh);
  assert.equal(group.position.x, -13);
  assert.equal(group.children.length, 3);
});
