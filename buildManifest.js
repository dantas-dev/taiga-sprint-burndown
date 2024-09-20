import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const publicManifestPath = path.resolve('public', 'manifest.json');
const distManifestPath = path.resolve('dist', 'manifest.json');

let manifest = fs.readFileSync(publicManifestPath, 'utf8');
manifest = manifest.replace(/\$\{VITE_TAIGA_URL\}/g, process.env.VITE_TAIGA_URL);

if (!fs.existsSync(path.dirname(distManifestPath))) {
  fs.mkdirSync(path.dirname(distManifestPath), { recursive: true });
}
fs.writeFileSync(distManifestPath, manifest);

