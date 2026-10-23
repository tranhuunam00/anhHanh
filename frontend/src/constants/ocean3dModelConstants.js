import {
  buildLighthouseModel,
  buildPalmTreeModel,
  buildBeachModel,
  buildAnchorModel,
  buildCrabModel,
  buildSeashellModel,
  buildOceanBuoyModel,
  buildSeagullModel,
  buildSailboatModel,
  buildWhaleModel,
  buildDolphinModel,
  buildSeaTurtleModel,
  buildCoralReefModel,
  buildClownfishModel,
  buildSubmarineModel,
} from "../components/VisualVocab/ocean3dModels.js";

import {
  buildMangroveForestModel,
  buildFishingVillageModel,
  buildSunsetModel,
  buildResortModel,
  buildShipwreckModel,
  buildJellyfishModel,
  buildOctopusModel,
  buildMantaRayModel,
  buildPierModel,
  buildCliffModel,
  buildStarfishModel,
  buildVolcanoModel,
  buildKayakModel,
  buildWaterfallModel,
  buildSeaCaveModel,
} from "./ocean3dNewModels.js";

// Helper to tag meshes for raycasting
export function tagObject(obj, itemId, interactiveList) {
  obj.userData = { itemId };
  obj.traverse((child) => {
    if (child.isMesh) {
      child.userData = { itemId };
      if (interactiveList) interactiveList.push(child);
    }
  });
}

// Master Constant Dictionary for all 30 Ocean 3D Models
export const OCEAN_3D_MODEL_DEFINITIONS = {
  // Original 15 Models
  lighthouse: buildLighthouseModel,
  palm_tree: buildPalmTreeModel,
  beach: buildBeachModel,
  anchor: buildAnchorModel,
  crab: buildCrabModel,
  seashell: buildSeashellModel,
  ocean: buildOceanBuoyModel,
  seagull: buildSeagullModel,
  sailboat: buildSailboatModel,
  whale: buildWhaleModel,
  dolphin: buildDolphinModel,
  sea_turtle: buildSeaTurtleModel,
  coral_reef: buildCoralReefModel,
  clownfish: buildClownfishModel,
  submarine: buildSubmarineModel,

  // 15 New Models
  mangrove_forest: buildMangroveForestModel,
  fishing_village: buildFishingVillageModel,
  sunset: buildSunsetModel,
  resort: buildResortModel,
  shipwreck: buildShipwreckModel,
  jellyfish: buildJellyfishModel,
  octopus: buildOctopusModel,
  manta_ray: buildMantaRayModel,
  pier: buildPierModel,
  cliff: buildCliffModel,
  starfish: buildStarfishModel,
  volcano: buildVolcanoModel,
  kayak: buildKayakModel,
  waterfall: buildWaterfallModel,
  sea_cave: buildSeaCaveModel,
};
