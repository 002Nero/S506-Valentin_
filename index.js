'use strict';

const Https = require('https');
const Path = require('path');
const Fs = require('fs').promises;

const QUOTE_URL = 'https://zenquotes.io/api/random';

const randomQuotePromesse = () => {
    return new Promise((fulfill, reject) => {
        const request = Https.get(QUOTE_URL, (response) => {
            if (response.statusCode !== 200) {
                response.resume();
                return reject(new Error(`HTTP ${response.statusCode} from ${QUOTE_URL}`));
            }

            response.setEncoding('utf8');

            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const quote = parsed?.[0]?.q;

                    if (!quote) {
                        return reject(new Error('Invalid API response: missing quote text'));
                    }

                    return fulfill(quote);
                }
                catch (err) {
                    return reject(err);
                }
            });
        });

        request.on('error', reject);
        request.setTimeout(15_000, () => {
            request.destroy(new Error('Request timeout'));
        });
    });
};

const getTenQuotes = async () => {
    const quotes = [];

    for (let i = 0; i < 10; ++i) {
        // En série pour éviter de spammer l'API et simplifier le TP.
        const quote = await randomQuotePromesse();
        quotes.push(quote);
    }

    return quotes;
};

const writeQuotesToFile = async (quotes, filePath) => {
    const content = quotes
        .map((q, i) => `${i + 1}. ${q}`)
        .join('\n') + '\n';

    await Fs.writeFile(filePath, content, 'utf8');
};

const main = async () => {
    const outputFile = Path.join(process.cwd(), 'quotes.txt');

    const quotes = await getTenQuotes();
    await writeQuotesToFile(quotes, outputFile);

    console.log(`✅ ${quotes.length} citations écrites dans ${outputFile}`);
};

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
