const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../src/scripts/seed_optimized_faqs.js');
const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');

const allFaqsMatch = seedContent.match(/const ALL_FAQS = (\{[\s\S]*?\n\});\n\nasync function main/);
if (!allFaqsMatch) {
    console.error("Could not extract ALL_FAQS");
    process.exit(1);
}

let ALL_FAQS;
try {
    ALL_FAQS = (new Function(`return (${allFaqsMatch[1]})`))();
} catch (e) {
    console.error("Eval failed", e);
    process.exit(1);
}

const adminPath = path.join(__dirname, '../src/app/admin/page.js');
let adminContent = fs.readFileSync(adminPath, 'utf-8');

// 1. Add DEFAULT_TOOL_FAQS
if (!adminContent.includes('const DEFAULT_TOOL_FAQS = {')) {
    const defaultToolCode = [];
    
    const keyToId = {
        'tool_1rm_faq': '1rm',
        'tool_calories_faq': 'calories',
        'tool_vma_faq': 'vma',
        'tool_hr_faq': 'hr',
        'tool_speed_faq': 'speed',
        'tool_rpe_faq': 'rpe',
        'tool_macros_faq': 'macros',
        'tool_cooper_faq': 'cooper',
        'tool_recovery_faq': 'recovery',
        'tool_acwr_faq': 'acwr',
        'tool_predictor_faq': 'predictor',
        'tool_volume_faq': 'volume'
    };
    
    for (const [key, toolId] of Object.entries(keyToId)) {
        if (ALL_FAQS[key]) {
            const faqsCode = ALL_FAQS[key].faqs.map(faq => {
                return `        {\n            question: "${faq.question.replace(/"/g, '\\"')}",\n            answer: "${faq.answer.replace(/"/g, '\\"')}"\n        }`;
            }).join(',\n');
            defaultToolCode.push(`    "${toolId}": [\n${faqsCode}\n    ]`);
        }
    }
    
    const defaultToolStr = `\nconst DEFAULT_TOOL_FAQS = {\n${defaultToolCode.join(',\n')}\n};\n\nexport default function AdminPage() {`;
    adminContent = adminContent.replace(/export default function AdminPage\(\) \{/, defaultToolStr);
}

fs.writeFileSync(adminPath, adminContent, 'utf-8');
console.log("✅ Admin page updated with new tool FAQs object");
