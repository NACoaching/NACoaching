-- Add affiliate disclosure to legal mentions
UPDATE site_content 
SET value = value || '

LIENS D''AFFILIATION
Certains liens présents sur ce site (notamment dans la section Le Labo) sont des liens d''affiliation. Cela signifie que si vous cliquez sur l''un de ces liens et effectuez un achat, NA Coaching peut percevoir une commission, sans aucun coût supplémentaire pour vous. Ces recommandations sont basées sur mon expertise professionnelle et mon utilisation personnelle.'
WHERE key = 'legal_mentions' 
AND value NOT LIKE '%AFFILIATION%';
