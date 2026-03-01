const fs = require('fs');
const lines = fs.readFileSync('./scripts/extracted_ideas.txt', 'utf8').split('\n');
let sql = 'INSERT INTO articles (title, category, subcategory, excerpt, content, is_published, tool_hints) VALUES\n';
const values = [];
let currentVolume = 'Non Classé';
let currentSubcategory = 'Général';

for (let text of lines) {
    text = text.trim();
    if (!text) continue;
    if (text.toUpperCase().includes('VOLUME III') || text.toUpperCase().includes('NUTRITION AVANCÉE')) {
        currentVolume = 'Volume 3 : La Science de la Santé';
        continue;
    } else if (text.toUpperCase().startsWith('VOLUME 1') || text.toUpperCase().includes('LA SCIENCE DE LA FORCE')) {
        currentVolume = 'Volume 1 : La Science de la Force';
        continue;
    } else if (text.toUpperCase().startsWith('VOLUME 2') || text.toUpperCase().includes("LA SCIENCE DE L'ENDURANCE")) {
        currentVolume = "Volume 2 : La Science de l'Endurance";
        continue;
    } else if (text.toUpperCase().startsWith('VOLUME')) {
        currentVolume = text.split(':')[0].trim();
        continue;
    }
    if (text.match(/^[✅🚀🏋️👟🧠🍽️⚕️💊].*/)) {
        currentSubcategory = text.replace(/^[✅🚀🏋️👟🧠🍽️⚕️💊]\s*/, '').trim();
        continue;
    }
    if (text.includes(' : ') || text.includes(' :')) {
        const parts = text.split(' : ');
        const titlePart = parts[0].trim().replace(/'/g, "''");
        let descPart = parts.slice(1).join(' : ').trim().replace(/'/g, "''");
        let subcatTag = currentSubcategory.replace(/'/g, "''");
        const tagMatch = descPart.match(/\[(.*?)\]/);
        if (tagMatch) {
            subcatTag = tagMatch[1].replace(/'/g, "''");
            descPart = descPart.replace(/\[.*?\]/g, '').trim();
        }
        const content = ('## Introduction\n\n' + descPart).replace(/'/g, "''");
        const excerpt = descPart.substring(0, 140) + (descPart.length > 140 ? '...' : '');
        values.push(`('${titlePart}', '${currentVolume}', '${subcatTag}', '${excerpt}', '${content}', false, '{}'::jsonb)`);
    }
}

sql += values.join(',\n') + ';';
fs.writeFileSync('./scripts/seed_encyclopedia.sql', sql);
console.log('SQL generated: ' + values.length + ' rows.');
