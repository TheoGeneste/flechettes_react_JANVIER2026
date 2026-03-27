import fs from 'fs';
const segments = [];
for (let i = 1; i <= 20; i++) {
  segments.push({ code: `S${i}`, value: i, description: `Single ${i}` });
  segments.push({ code: `D${i}`, value: i * 2, description: `Double ${i}` });
  segments.push({ code: `T${i}`, value: i * 3, description: `Triple ${i}` });
}
segments.push({ code: 'S25', value: 25, description: 'Single 25' });
segments.push({ code: 'D25', value: 50, description: 'Double 25 (bull)' });

const finishSingles = segments.filter(s => s.code.startsWith('S'));
const finishDoubles = segments.filter(s => s.code.startsWith('D'));
const allThrows = segments;

function joinDescription(throwsList) {
  return throwsList.map(t => t.description).join(' + ');
}

function stringifySuggestion(throwsList) {
  return throwsList.map(t => t.code).join(' ');
}

function generateFinishFile(targetMin, targetMax, finishSet, fileName, rootKey) {
  const output = {};

  for (let target = targetMin; target <= targetMax; target++) {
    const options = [];

    // 1-dart finish
    for (const last of finishSet) {
      if (last.value === target) options.push({ throws: [last], darts: 1 });
    }

    // 2-dart finish
    if (options.length === 0) {
      for (const first of allThrows) {
        for (const last of finishSet) {
          if (first.value + last.value === target) options.push({ throws: [first, last], darts: 2 });
        }
      }
    }

    // 3-dart finish
    if (options.length === 0) {
      for (const first of allThrows) {
        for (const second of allThrows) {
          for (const last of finishSet) {
            if (first.value + second.value + last.value === target) options.push({ throws: [first, second, last], darts: 3 });
          }
        }
      }
    }

    if (options.length > 0) {
      options.sort((a,b) => {
        if (a.darts !== b.darts) return a.darts - b.darts;
        for (let i=0; i<a.throws.length; i++) {
          if (a.throws[i].value !== b.throws[i].value) return b.throws[i].value - a.throws[i].value;
        }
        return 0;
      });
      const best = options[0];
      output[target] = [{
        score: target,
        suggestion: stringifySuggestion(best.throws),
        description: joinDescription(best.throws),
        dartsNeeded: best.darts
      }];
    }
  }

  const full = { [rootKey]: output };
  fs.writeFileSync(fileName, JSON.stringify(full, null, 2));
  console.log(`${fileName} generated with`, Object.keys(output).length, 'entries');
}

// generate both files, one for double-out, one for single-out
generateFinishFile(1, 170, finishDoubles, 'src/assets/doubleOutSuggestions.json', 'doubleOutSuggestions');
generateFinishFile(1, 170, finishSingles, 'src/assets/singleOutSuggestions.json', 'singleOutSuggestions');
