// cloudinary-test.js
// Projenin root klasörüne koy ve çalıştır: node cloudinary-test.js

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testConnection() {
  console.log('🔍 Cloudinary Bağlantı Testi\n');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  
  try {
    // Ping test - hesap bilgilerini al
    const result = await cloudinary.api.ping();
    console.log('✅ Bağlantı başarılı!', result);
    return true;
  } catch (error) {
    console.log('❌ Bağlantı hatası:', error.message);
    return false;
  }
}

async function createFolderStructure() {
  console.log('\n📁 Klasör Yapısı Oluşturuluyor...\n');
  
  // Cloudinary'de klasör oluşturmak için o klasöre bir placeholder dosya yüklamamız gerekiyor
  // Sonra silebiliriz veya bırakabiliriz
  
  const folders = [
    'halikarnas/products',
    'halikarnas/products/thumbnails',
    'halikarnas/categories',
    'halikarnas/banners',
    'halikarnas/about',
    'halikarnas/temp'
  ];
  
  for (const folder of folders) {
    try {
      // Placeholder image ile klasör oluştur
      // 1x1 transparent pixel base64
      const placeholderBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      
      const result = await cloudinary.uploader.upload(placeholderBase64, {
        folder: folder,
        public_id: '.placeholder',
        overwrite: true
      });
      
      console.log(`✅ ${folder} oluşturuldu`);
    } catch (error) {
      console.log(`⚠️  ${folder}: ${error.message}`);
    }
  }
}

async function listExistingFolders() {
  console.log('\n📂 Mevcut Klasörler:\n');
  
  try {
    const result = await cloudinary.api.root_folders();
    
    if (result.folders.length === 0) {
      console.log('   (henüz klasör yok)');
    } else {
      result.folders.forEach(folder => {
        console.log(`   📁 ${folder.name}`);
      });
    }
  } catch (error) {
    console.log('Klasörler listelenemedi:', error.message);
  }
}

async function uploadTestImage() {
  console.log('\n🖼️  Test Resmi Yükleniyor...\n');
  
  try {
    // Basit bir test resmi (kırmızı kare)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8DwHwMSYBxVSF8FAOdABf95vLxDAAAAAElFTkSuQmCC';
    
    const result = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'halikarnas/temp',
      public_id: 'test-image',
      overwrite: true
    });
    
    console.log('✅ Test resmi yüklendi!');
    console.log('   URL:', result.secure_url);
    console.log('   Public ID:', result.public_id);
    
    return result;
  } catch (error) {
    console.log('❌ Yükleme hatası:', error.message);
    return null;
  }
}

async function main() {
  console.log('═'.repeat(50));
  console.log('   CLOUDINARY TEST & SETUP');
  console.log('═'.repeat(50));
  
  // 1. Bağlantı testi
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n⛔ Bağlantı kurulamadı. .env dosyanı kontrol et.');
    process.exit(1);
  }
  
  // 2. Mevcut klasörleri listele
  await listExistingFolders();
  
  // 3. Klasör yapısı oluştur
  await createFolderStructure();
  
  // 4. Test resmi yükle
  await uploadTestImage();
  
  // 5. Son durum
  console.log('\n' + '═'.repeat(50));
  console.log('   TAMAMLANDI!');
  console.log('═'.repeat(50));
  console.log('\nCloudinary Dashboard: https://console.cloudinary.com');
}

main();
