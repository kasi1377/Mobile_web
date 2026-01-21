const SQLiteDatabase = require('./database');

const db = new SQLiteDatabase('./dkn.db');

setTimeout(async () => {
  const assets = await db.findAll('knowledgeAssets');
  console.log('\n=== ALL KNOWLEDGE ASSETS ===');
  if (assets.length === 0) {
    console.log('⚠️  NO KNOWLEDGE ASSETS IN DATABASE');
    console.log('Search won\'t work because there\'s nothing to search!');
  } else {
    assets.forEach(a => {
      console.log(`- ${a.title} (${a.status})`);
    });
  }
  console.log(`\nTotal: ${assets.length} knowledge assets`);
  process.exit(0);
}, 1000);
