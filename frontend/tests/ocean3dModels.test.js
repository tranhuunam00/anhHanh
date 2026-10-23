import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  tagObject,
  OCEAN_3D_MODEL_DEFINITIONS,
} from "../src/constants/ocean3dModelConstants.js";

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

test("OCEAN_3D_MODEL_DEFINITIONS contains all 30 required ocean models", () => {
  const requiredKeys = [
    // Original 15
    "lighthouse",
    "palm_tree",
    "beach",
    "anchor",
    "crab",
    "seashell",
    "ocean",
    "seagull",
    "sailboat",
    "whale",
    "dolphin",
    "sea_turtle",
    "coral_reef",
    "clownfish",
    "submarine",
    // 15 New Models
    "mangrove_forest",
    "fishing_village",
    "sunset",
    "resort",
    "shipwreck",
    "jellyfish",
    "octopus",
    "manta_ray",
    "pier",
    "cliff",
    "starfish",
    "volcano",
    "kayak",
    "waterfall",
    "sea_cave",
  ];

  assert.equal(requiredKeys.length, 30);

  requiredKeys.forEach((key) => {
    assert.ok(typeof OCEAN_3D_MODEL_DEFINITIONS[key] === "function", `Missing builder for ${key}`);
    const result = OCEAN_3D_MODEL_DEFINITIONS[key]();
    const group = result.group || result;
    assert.ok(group instanceof THREE.Group, `${key} builder must return a THREE.Group`);
    assert.ok(group.children.length > 0, `${key} must have geometric 3D children`);
  });
});

test("lighthouse model builds with cliff rock and rotating lightBeam", () => {
  const { group, lightBeam } = OCEAN_3D_MODEL_DEFINITIONS.lighthouse();
  assert.ok(group instanceof THREE.Group);
  assert.ok(lightBeam instanceof THREE.Mesh);
  assert.equal(group.position.x, -20);
});

test("dolphin model builds with arched body and flippers", () => {
  const { group } = OCEAN_3D_MODEL_DEFINITIONS.dolphin();
  assert.ok(group instanceof THREE.Group);
  assert.equal(group.position.x, 12);
  assert.equal(group.position.z, 12);
});

test("submarine model builds with yellow hull and propeller", () => {
  const { group, prop } = OCEAN_3D_MODEL_DEFINITIONS.submarine();
  assert.ok(group instanceof THREE.Group);
  assert.ok(prop instanceof THREE.Mesh);
  assert.equal(group.position.x, 18);
});

test("new models build correctly: mangrove, resort, sunset, shipwreck", () => {
  const { group: mangrove } = OCEAN_3D_MODEL_DEFINITIONS.mangrove_forest();
  assert.ok(mangrove instanceof THREE.Group);
  assert.equal(mangrove.position.x, -24);

  const { group: resort } = OCEAN_3D_MODEL_DEFINITIONS.resort();
  assert.ok(resort instanceof THREE.Group);
  assert.equal(resort.position.x, -12);

  const { group: sunset } = OCEAN_3D_MODEL_DEFINITIONS.sunset();
  assert.ok(sunset instanceof THREE.Group);
  assert.equal(sunset.position.y, 16);

  const { group: shipwreck } = OCEAN_3D_MODEL_DEFINITIONS.shipwreck();
  assert.ok(shipwreck instanceof THREE.Group);
  assert.equal(shipwreck.position.x, 26);
});
