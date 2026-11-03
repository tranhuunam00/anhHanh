
import { cambridge20Test1 } from './frontend/src/data/ielts/cambridge20Test1Data.js';
import { cambridge20Test2 } from './frontend/src/data/ielts/cambridge20Test2Data.js';
import { cambridge20Test3 } from './frontend/src/data/ielts/cambridge20Test3Data.js';
import { cambridge20Test4 } from './frontend/src/data/ielts/cambridge20Test4Data.js';
import { cambridge21Test1 } from './frontend/src/data/ielts/cambridge21Test1Data.js';
import { cambridge21Test2 } from './frontend/src/data/ielts/cambridge21Test2Data.js';
import { cambridge21Test3 } from './frontend/src/data/ielts/cambridge21Test3Data.js';
import { cambridge21Test4 } from './frontend/src/data/ielts/cambridge21Test4Data.js';

const tests = [cambridge20Test1, cambridge20Test2, cambridge20Test3, cambridge20Test4, cambridge21Test1, cambridge21Test2, cambridge21Test3, cambridge21Test4];

for (const t of tests) {
  const t1 = t.skills.writing.tasks[0];
  console.log(t.id, Object.keys(t1), t1.imageUrl || t1.image || t1.chartImage || t1.diagramImage);
}
