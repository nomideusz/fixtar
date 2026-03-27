import sharp from 'sharp';

async function run() {
    try {
        await sharp('src/lib/images/logo/fixtar-logo-teal-faded.png')
            .trim()
            .webp()
            .toFile('src/lib/images/logo/fixtar-logo-teal-faded.webp');
        console.log('Processed logo');
        
        await sharp('src/lib/images/logo/fixtar-icon-teal-faded.png')
            .trim()
            .webp()
            .toFile('src/lib/images/logo/fixtar-icon-teal-faded.webp');
        console.log('Processed icon');
    } catch (e) {
        console.error(e);
    }
}
run();
