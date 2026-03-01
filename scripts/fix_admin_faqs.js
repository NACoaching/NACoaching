const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '../src/app/admin/page.js');
let adminContent = fs.readFileSync(adminPath, 'utf-8');

// The select element currently doesn't have a value prop
const selectStart = `<select
                                    onChange={async (e) => {`;

const newSelectStart = `<select
                                    value={faqTool || ""}
                                    onChange={async (e) => {`;

adminContent = adminContent.replace(selectStart, newSelectStart);

fs.writeFileSync(adminPath, adminContent, 'utf-8');
console.log("✅ Fixed select value in admin page");
