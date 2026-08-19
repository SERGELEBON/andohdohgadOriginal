#!/usr/bin/env node
/**
 * Driver script for Andoh & Dohgad Consulting website
 * Tests navigation, page loads, and takes screenshots
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const screenshotDir = join(__dirname, 'screenshots');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'fr-FR'
  });
  const page = await context.newPage();

  try {
    // 1. Test homepage
    console.log('📄 Loading homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await wait(2000); // Wait for animations

    const title = await page.title();
    console.log(`   Title: ${title}`);

    await page.screenshot({
      path: join(screenshotDir, '01-homepage.png'),
      fullPage: true
    });
    console.log('   ✓ Screenshot: 01-homepage.png');

    // 2. Test navigation - Services page
    console.log('📄 Testing navigation to Services...');
    await page.click('a[href="/services"]');
    await page.waitForURL('**/services', { timeout: 5000 });
    await wait(2000);

    await page.screenshot({
      path: join(screenshotDir, '02-services.png'),
      fullPage: true
    });
    console.log('   ✓ Screenshot: 02-services.png');

    // 3. Test About page
    console.log('📄 Testing navigation to About...');
    await page.click('a[href="/a-propos"]');
    await page.waitForURL('**/a-propos', { timeout: 5000 });
    await wait(2000);

    await page.screenshot({
      path: join(screenshotDir, '03-about.png'),
      fullPage: true
    });
    console.log('   ✓ Screenshot: 03-about.png');

    // 4. Test Contact page
    console.log('📄 Testing navigation to Contact...');
    await page.click('a[href="/contact"]');
    await page.waitForURL('**/contact', { timeout: 5000 });
    await wait(2000);

    // Check for contact form
    const hasForm = await page.locator('form').count() > 0;
    console.log(`   Form present: ${hasForm}`);

    await page.screenshot({
      path: join(screenshotDir, '04-contact.png'),
      fullPage: true
    });
    console.log('   ✓ Screenshot: 04-contact.png');

    // 5. Test language switcher
    console.log('🌍 Testing language switcher...');
    await page.goto(BASE_URL);
    await wait(1000);

    // Try to find and click language switcher (might be EN button)
    const langButton = page.locator('button:has-text("EN"), button:has-text("English")').first();
    if (await langButton.count() > 0) {
      await langButton.click();
      await wait(1000);

      await page.screenshot({
        path: join(screenshotDir, '05-english.png'),
        fullPage: true
      });
      console.log('   ✓ Screenshot: 05-english.png (English version)');
    } else {
      console.log('   ⚠ Language switcher not found');
    }

    // 6. Test mobile menu (if visible)
    console.log('📱 Testing mobile viewport...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await wait(1000);

    await page.screenshot({
      path: join(screenshotDir, '06-mobile.png'),
      fullPage: true
    });
    console.log('   ✓ Screenshot: 06-mobile.png');

    console.log('\n✅ All tests passed!');
    console.log(`📸 Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n❌ Error during tests:', error.message);

    // Take error screenshot
    try {
      await page.screenshot({
        path: join(screenshotDir, 'error.png'),
        fullPage: true
      });
      console.log('📸 Error screenshot saved');
    } catch (e) {
      // Ignore screenshot errors
    }

    throw error;
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
import { mkdirSync } from 'fs';
mkdirSync(screenshotDir, { recursive: true });

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
