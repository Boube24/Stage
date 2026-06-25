import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

try {
  console.log('Starting compression of flutter_code folder...');
  const zip = new AdmZip();
  
  const flutterDirPath = path.resolve('./flutter_code');
  if (!fs.existsSync(flutterDirPath)) {
    throw new Error('flutter_code directory does not exist');
  }

  // Add the local flutter_code folder to the zip archive recursively
  zip.addLocalFolder(flutterDirPath);

  // Ensure public folder exists
  const publicDir = path.resolve('./public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory');
  }

  const outputPath = path.join(publicDir, 'flutter_code.zip');
  zip.writeZip(outputPath);
  console.log(`Successfully zipped flutter_code folder to ${outputPath}`);
} catch (error) {
  console.error('Error during zipping process:', error);
  process.exit(1);
}
