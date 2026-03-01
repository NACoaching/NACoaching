const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../src/scripts/seed_optimized_faqs.js');
const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');

// Extract ALL_FAQS object via tricky eval
const allFaqsMatch = seedContent.match(/const ALL_FAQS = (\{[\s\S]*?\n\});\n\nasync function main/);
if (!allFaqsMatch) {
    console.error("Could not extract ALL_FAQS");
    process.exit(1);
}

// Convert the matched string into an actual JS object
let ALL_FAQS;
try {
    ALL_FAQS = (new Function(`return (${allFaqsMatch[1]})`))();
} catch (e) {
    console.error("Eval failed", e);
    process.exit(1);
}

const PAGES_TO_UPDATE = {
    'home_faq': { file: 'src/app/page.js', varName: 'DEFAULT_HOME_FAQS' },
    'contact_faq': { file: 'src/app/contact/page.js', varName: 'DEFAULT_CONTACT_FAQS' },
    'tool_1rm_faq': { file: 'src/app/outils/calculateur-1rm/page.js', varName: 'DEFAULT_FAQ_DATA' },
    'tool_calories_faq': { file: 'src/app/outils/besoins-caloriques/page.js', varName: 'DEFAULT_FAQ_DATA' },
    'tool_vma_faq': { file: 'src/app/outils/vma-vo2/page.js', varName: 'DEFAULT_FAQ_DATA' },
    'tool_hr_faq': { file: 'src/app/outils/frequence-cardiaque/page.js', varName: 'DEFAULT_FAQ_DATA' },
    'tool_speed_faq': { file: 'src/app/outils/convertisseur-vitesse/page.js', varName: 'DEFAULT_FAQ_DATA' },
};

for (const [key, mapping] of Object.entries(PAGES_TO_UPDATE)) {
    const filePath = path.join(__dirname, '..', mapping.file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // We want the output to be proper JS array
    const faqsCode = ALL_FAQS[key].faqs.map(faq => {
        return `    {\n        question: "${faq.question.replace(/"/g, '\\"')}",\n        answer: "${faq.answer.replace(/"/g, '\\"')}"\n    }`;
    }).join(',\n');

    const replacement = `const ${mapping.varName} = [\n${faqsCode}\n];`;

    // Regex to match existing array declaration
    const regex = new RegExp(`const ${mapping.varName} = \\[[\\s\\S]*?\\];`);

    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Updated ${mapping.file}`);
    } else {
        console.error(`❌ Could not find ${mapping.varName} in ${mapping.file}`);
    }
}
