import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge17Test1 } from "../src/data/ielts/cambridge17Test1Data.js";
import { cambridge17Test2 } from "../src/data/ielts/cambridge17Test2Data.js";
import { cambridge17Test3 } from "../src/data/ielts/cambridge17Test3Data.js";
import { cambridge17Test4 } from "../src/data/ielts/cambridge17Test4Data.js";
import { cambridge18Test1 } from "../src/data/ielts/cambridge18Test1Data.js";
import { cambridge18Test2 } from "../src/data/ielts/cambridge18Test2Data.js";
import { cambridge18Test3 } from "../src/data/ielts/cambridge18Test3Data.js";
import { cambridge18Test4 } from "../src/data/ielts/cambridge18Test4Data.js";
import { gradeListeningTest } from "../src/utils/ieltsScoring.js";

const cam17t1Keys = {"1":"litter","2":"dogs","3":"insects","4":"butterflies","5":"wall","6":"island","7":"boots","8":"beginners","9":"spoons","10":"35","11":"A","12":"C","13":"B","14":"B","15":"A","16":"D","17":"B","18":"C","19":"D","20":"E","21":"A","22":"B","23":"B","24":"A","25":"C","26":"C","27":"A","28":"E","29":"F","30":"C","31":"puzzle","32":"logic","33":"confusion","34":"meditation","35":"stone","36":"coins","37":"tree","38":"breathing","39":"paper","40":"anxiety"};
const cam17t2Keys = {"1":"collecting","2":"records","3":"West","4":"transport","5":"art","6":"hospital","7":"garden","8":"quiz","9":"tickets","10":"poster","11":"B","12":"C","13":"C","14":"B","15":"D","16":"C","17":"G","18":"A","19":"E","20":"F","21":"D","22":"E","23":"D","24":"C","25":"A","26":"E","27":"F","28":"B","29":"C","30":"C","31":"321,000","32":"vocabulary","33":"podcast","34":"smartphones","35":"bilingual","36":"playground","37":"picture","38":"grammar","39":"identity","40":"fluent"};
const cam17t3Keys = {"1":"family","2":"fit","3":"hotels","4":"Carrowniskey","5":"week","6":"bay","7":"September","8":"19","9":"30","10":"boots","11":"B","12":"E","13":"C","14":"C","15":"A","16":"E","17":"D","18":"G","19":"F","20":"C","21":"B","22":"A","23":"A","24":"B","25":"C","26":"A","27":"D","28":"B","29":"F","30":"H","31":"mud","32":"feathers","33":"shape","34":"moon","35":"neck","36":"evidence","37":"destinations","38":"oceans","39":"recovery","40":"atlas"};
const cam17t4Keys = {"1":"floors","2":"fridge","3":"shirts","4":"windows","5":"balcony","6":"electrician","7":"dust","8":"police","9":"training","10":"review","11":"A","12":"A","13":"A","14":"C","15":"A","16":"C","17":"B","18":"C","19":"B","20":"A","21":"C","22":"E","23":"A","24":"D","25":"B","26":"F","27":"A","28":"D","29":"C","30":"G","31":"golden","32":"healthy","33":"climate","34":"rocks","35":"diameter","36":"tube","37":"fire","38":"steam","39":"cloudy","40":"litre"};
const cam18t1Keys = {"1":"DW30 7YZ","2":"24th April","3":"dentist","4":"parking","5":"Claxby","6":"late","7":"evening","8":"supermarket","9":"pollution","10":"storage","11":"C","12":"A","13":"A","14":"B","15":"E","16":"B","17":"G","18":"D","19":"A","20":"F","21":"A","22":"B","23":"A","24":"C","25":"B","26":"A","27":"B","28":"E","29":"A","30":"C","31":"fences","32":"family","33":"helicopters","34":"stress","35":"sides","36":"breathing","37":"feet","38":"employment","39":"weapons","40":"tourism"};
const cam18t2Keys = {"1":"training","2":"discount","3":"taxi","4":"service","5":"English","6":"Wivenhoe","7":"equipment","8":"9.75","9":"deliveries","10":"Sunday","11":"B","12":"E","13":"B","14":"C","15":"H","16":"C","17":"D","18":"B","19":"A","20":"I","21":"C","22":"A","23":"B","24":"B","25":"A","26":"B","27":"D","28":"A","29":"C","30":"F","31":"convenient","32":"suits","33":"tailor","34":"profession","35":"visible","36":"strings","37":"waists","38":"perfume","39":"image","40":"handbag"};
const cam18t3Keys = {"1":"Marrowfield","2":"relative","3":"socialise","4":"full","5":"Domestic Life","6":"clouds","7":"timing","8":"Animal Magic","9":"movement","10":"dark","11":"B","12":"D","13":"B","14":"D","15":"C","16":"B","17":"B","18":"C","19":"A","20":"A","21":"C","22":"E","23":"B","24":"D","25":"A","26":"F","27":"A","28":"C","29":"G","30":"A","31":"technical","32":"cheap","33":"thousands","34":"identification","35":"tracking","36":"military","37":"location","38":"prediction","39":"database","40":"trust"};
const cam18t4Keys = {"1":"receptionist","2":"Medical","3":"Chastons","4":"appointments","5":"database","6":"experience","7":"confident","8":"temporary","9":"1.15","10":"parking","11":"B","12":"A","13":"A","14":"C","15":"F","16":"G","17":"E","18":"A","19":"C","20":"B","21":"B","22":"D","23":"D","24":"A","25":"C","26":"G","27":"F","28":"A","29":"B","30":"C","31":"plot","32":"poverty","33":"Europe","34":"poetry","35":"drawings","36":"furniture","37":"lamps","38":"harbour","39":"children","40":"relatives"};

const testCases = [
  { name: "Cambridge 17 Test 1", data: cambridge17Test1, keys: cam17t1Keys },
  { name: "Cambridge 17 Test 2", data: cambridge17Test2, keys: cam17t2Keys },
  { name: "Cambridge 17 Test 3", data: cambridge17Test3, keys: cam17t3Keys },
  { name: "Cambridge 17 Test 4", data: cambridge17Test4, keys: cam17t4Keys },
  { name: "Cambridge 18 Test 1", data: cambridge18Test1, keys: cam18t1Keys },
  { name: "Cambridge 18 Test 2", data: cambridge18Test2, keys: cam18t2Keys },
  { name: "Cambridge 18 Test 3", data: cambridge18Test3, keys: cam18t3Keys },
  { name: "Cambridge 18 Test 4", data: cambridge18Test4, keys: cam18t4Keys },
];

describe("Cambridge IELTS 17 & 18 - All 8 Listening Tests (320 Questions) Integrity", () => {
  testCases.forEach(({ name, data, keys }) => {
    describe(name, () => {
      test("Structure: 4 parts, 40 total questions numbered 1 to 40", () => {
        const parts = data.skills.listening.parts;
        assert.equal(parts.length, 4, "Must have 4 parts");
        const allItems = parts.flatMap((p) => p.items);
        assert.equal(allItems.length, 40, "Must have 40 total items");
        allItems.forEach((it, idx) => {
          assert.equal(it.number, idx + 1, `Item ${idx} must be numbered ${idx + 1}`);
        });
      });

      test("Group headers present for all question sub-ranges", () => {
        const parts = data.skills.listening.parts;
        assert.ok(parts[1].items[0].groupHeader, `${name} Part 2 first item must have groupHeader`);
        assert.ok(parts[2].items[0].groupHeader, `${name} Part 3 first item must have groupHeader`);
      });

      test("Authentic answer key grades 40/40 Band 9.0", () => {
        const res = gradeListeningTest(data.skills.listening, keys);
        assert.equal(res.correctCount, 40, `${name} must score 40/40 (got ${res.correctCount})`);
        assert.equal(res.bandScore, 9.0, `${name} must achieve Band 9.0`);
      });
    });
  });
});
