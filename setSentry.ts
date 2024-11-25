import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function replaceDSN(file: string) {
    let sentryConfigPath = path.join(__dirname, `sentry.${file}.config.ts`);
    let sentryConfigContent = fs.readFileSync(sentryConfigPath, 'utf8');

    let sentryDsn = process.env.SENTRY_DSN;
    if (!sentryDsn) {
        sentryDsn = 'nope'
    }

    let updatedSentryConfigContent = sentryConfigContent.replace(/dsn: ".*?"/, `dsn: "${sentryDsn}"`);

    fs.writeFileSync(sentryConfigPath, updatedSentryConfigContent);
    console.log(`sentry.${file}.config.ts updated successfully; ${sentryDsn}`);
}

(async () => {
    await replaceDSN('server');
    await replaceDSN('client');
    await replaceDSN('edge');

})()