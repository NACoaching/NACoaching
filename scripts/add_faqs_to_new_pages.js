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

const PAGES_TO_UPDATE = [
    { file: 'src/app/outils/rpe-1rm/page.js', key: 'tool_rpe_faq' },
    { file: 'src/app/outils/macros-avancees/page.js', key: 'tool_macros_faq' },
    { file: 'src/app/outils/test-demi-cooper/page.js', key: 'tool_cooper_faq' },
    { file: 'src/app/outils/score-recuperation/page.js', key: 'tool_recovery_faq' },
    { file: 'src/app/outils/acwr/page.js', key: 'tool_acwr_faq' },
    { file: 'src/app/outils/predictateur-performance/page.js', key: 'tool_predictor_faq' },
    { file: 'src/app/outils/volume-effectif/page.js', key: 'tool_volume_faq' },
];

for (const page of PAGES_TO_UPDATE) {
    const filePath = path.join(__dirname, '..', page.file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if already updated
    if (content.includes('HomeFAQ') && content.includes(page.key)) {
        console.log(`⏭️  Already updated ${page.file}`);
        continue;
    }

    // 1. Add import HomeFAQ
    if (!content.includes('import HomeFAQ')) {
        content = content.replace(/(import .*?;)/, "$1\nimport HomeFAQ from '@/components/HomeFAQ';");
    }

    // 2. Add DEFAULT_FAQ_DATA just before the export default function
    const faqsCode = ALL_FAQS[page.key].faqs.map(faq => {
        return `    {\n        question: "${faq.question.replace(/"/g, '\\"')}",\n        answer: "${faq.answer.replace(/"/g, '\\"')}"\n    }`;
    }).join(',\n');

    const defaultDataStr = `\nconst DEFAULT_FAQ_DATA = [\n${faqsCode}\n];\n\nexport default async function`;
    content = content.replace(/\nexport default async function/, defaultDataStr);

    // 3. Add Component Logic
    const componentLogicMatch = content.match(/(export default async function \w+\(\) {\n    const article = await getToolArticle\(.*?\);\n    const relatedArticles = await getToolRelatedArticles\(article\);)/);

    if (componentLogicMatch) {
        const logicStr = `${componentLogicMatch[1]}

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', '${page.key}').single();
    if (faqItem && faqItem.value) {
        try {
            const parsed = JSON.parse(faqItem.value);
            if (parsed && parsed.length > 0) faqData = parsed;
        } catch (e) { console.error("Error parsing FAQ", e); }
    }

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqData.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer
            }
        }))
    };`;
        content = content.replace(componentLogicMatch[1], logicStr);
    }

    // 4. Inject JSON-LD Script
    content = content.replace(
        /(<script type="application\/ld\+json" dangerouslySetInnerHTML={{ __html: JSON.stringify\(jsonLd\) }} \/>)/,
        `$1\n            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />`
    );

    // 5. Inject <HomeFAQ> component before final closing tags
    // Usually ends with:
    //             </div>
    //         </div>
    //     );
    // }
    content = content.replace(
        /            <\/div>\n        <\/div>\n    \);\n}/,
        `            </div>\n            <div className="bg-white"><HomeFAQ faqData={faqData} /></div>\n        </div>\n    );\n}`
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated ${page.file}`);
}
