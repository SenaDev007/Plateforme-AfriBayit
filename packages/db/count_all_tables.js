const { PrismaClient } = require('./generated/client');
const prisma = new PrismaClient();

async function main() {
  const res = await prisma.$queryRawUnsafe(`
    SELECT table_name, 
           (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I', table_name), false, true, '')))[1]::text::int AS count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY count DESC, table_name
  `);
  console.log('\n=== RAPPORT COMPLET DES TABLES ===\n');
  let empty = 0, filled = 0;
  for (const row of res) {
    const status = row.count === 0 ? '❌ VIDE' : `✅ ${row.count} enreg.`;
    if (row.count === 0) empty++; else filled++;
    console.log(`${status.padEnd(18)} ${row.table_name}`);
  }
  console.log(`\nTotal: ${res.length} tables — ${filled} remplies, ${empty} vides`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
