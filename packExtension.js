import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import ChromeExtension from 'crx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pack = path.resolve(__dirname, './pack_chrome');

if (!fs.existsSync(pack)) {
  fs.mkdirSync(pack, { recursive: true });
}

const crx = new ChromeExtension({
  codebase: 'http://localhost:8000/taigaSprintBurndown.crx',
  privateKey: fs.readFileSync('./key.pem')
});

crx.load(path.resolve(__dirname, './dist'))
  .then(crx => crx.pack())
  .then(crxBuffer => {
    const updateXML = crx.generateUpdateXML();

    fs.writeFileSync(path.resolve(pack, 'update.xml'), updateXML);
    fs.writeFileSync(path.resolve(pack, 'taigaSprintBurndown.crx'), crxBuffer);
  })
  .catch(err => {
    console.error('Erro ao empacotar a extensão:', err);
  });
