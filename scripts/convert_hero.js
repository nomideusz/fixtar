import sharp from 'sharp';
async function run() {
    try {
        await sharp('src/lib/images/hero/hero-person-tool-01.png')
            .webp({ quality: 85 })
            .toFile('src/lib/images/hero/hero-person-tool-01.webp');
        console.log('Converted hero image to webp');
    } catch (e) {
        console.error(e);
    }
}
run();
