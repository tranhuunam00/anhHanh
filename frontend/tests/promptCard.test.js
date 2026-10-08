import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Task 1 Prompt Card Image & Visual Metadata Parsing", () => {
  const samplePromptWithImage = {
    id: "t1_cam19_line",
    title: "Production of Three Types of Fuel in the UK (Cambridge 19)",
    prompt: "The line graph shows the production of three types of energy fuel...",
    sub_type: "line_graph",
    image_url: "/images/writing/uk_fuel_production_cam19.png",
    visual_data: {
      type: "line_graph",
      image_url: "/images/writing/uk_fuel_production_cam19.png",
      title: "UK Fuel Production in Energy Units (1981 - 2000)",
    },
    keywords: ["overall downward trajectory", "fluctuated notably"],
    outline: {
      body1: "Overview of petroleum and natural gas trends.",
      body2: "Decline of coal production.",
    },
  };

  test("correctly resolves image_url from top-level or visual_data", () => {
    const resolveImageUrl = (item) => item?.image_url || item?.visual_data?.image_url || null;

    assert.equal(
      resolveImageUrl(samplePromptWithImage),
      "/images/writing/uk_fuel_production_cam19.png"
    );

    // Fallback when top-level is omitted
    const itemVisualOnly = { visual_data: { image_url: "/img/test.png" } };
    assert.equal(resolveImageUrl(itemVisualOnly), "/img/test.png");

    // Null safety
    assert.equal(resolveImageUrl(null), null);
    assert.equal(resolveImageUrl({}), null);
  });

  test("handles Task 1 sub-types correctly", () => {
    const validSubTypes = new Set([
      "line_graph",
      "bar_chart",
      "pie_chart",
      "table",
      "process",
      "map",
    ]);

    assert.ok(validSubTypes.has(samplePromptWithImage.sub_type));
  });

  test("verifies required Task 1 prompt structure", () => {
    assert.ok(samplePromptWithImage.id);
    assert.ok(samplePromptWithImage.title);
    assert.ok(samplePromptWithImage.prompt);
    assert.ok(samplePromptWithImage.image_url);
    assert.ok(samplePromptWithImage.visual_data);
    assert.ok(Array.isArray(samplePromptWithImage.keywords));
    assert.ok(samplePromptWithImage.keywords.length > 0);
  });
});
