import cacheService from './services/cache.service';

async function clear() {
  await cacheService.clear();
  console.log('Cache cleared successfully');
  process.exit(0);
}

clear();
