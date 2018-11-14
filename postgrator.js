if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

  
  const path = require('path');
  const Postgrator = require('postgrator');
  
  const postgrator = new Postgrator({
    migrationDirectory: path.join(__dirname, '/migrations'),
    driver: 'pg',
    connectionString: process.env.DATABASE_URL
  });
  
  // migrate to version specified, or supply 'max' to go all the way up
  postgrator.migrate(process.env.MIGRATE_TO, (err, migrations) => {
    /* eslint-disable no-console */
    if (err) {
      console.log(err);
    } else if (migrations) {
      console.log(['*******************']
        .concat(migrations.map(migration => `checking ${migration.filename}`))
        .join('\n'));
    }
    /* eslint-enable no-console */
    postgrator.endConnection(() => { });
  });
  