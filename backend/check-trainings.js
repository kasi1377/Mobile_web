const SQLiteDatabase = require('./database');

const db = new SQLiteDatabase('./dkn.db');

setTimeout(async () => {
  const trainings = await db.findAll('trainings');
  console.log('\n=== ALL TRAINING MODULES ===');
  trainings.forEach(t => {
    console.log(`- ${t.title} (${t.duration})`);
  });
  console.log(`\nTotal: ${trainings.length} training modules`);
  process.exit(0);
}, 1000);
