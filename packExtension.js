import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname, resolve } from 'path';
import ChromeExtension from 'crx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const crx = new ChromeExtension({
  codebase: 'http://localhost:8000/taigaSprintBurndown.crx',
  privateKey: fs.readFileSync('./key.pem')
});

crx.load(resolve(__dirname, './dist'))
  .then(crx => crx.pack())
  .then(crxBuffer => {
    const updateXML = crx.generateUpdateXML();

    fs.writeFileSync(resolve(__dirname, 'dist/update.xml'), updateXML);
    fs.writeFileSync(resolve(__dirname, 'dist/taigaSprintBurndown.crx'), crxBuffer);
  })
  .catch(err => {
    console.error('Erro ao empacotar a extensão:', err);
  });
