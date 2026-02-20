const { test, expect } = require('@playwright/test');

// ─────────────────────────────────────────────
// index.html
// ─────────────────────────────────────────────
test.describe('index.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('PIEPPIEPSEPPL');
  });

  test('navigation is present', async ({ page }) => {
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('logo image is present', async ({ page }) => {
    await expect(page.locator('img.logo-img')).toBeVisible();
  });

  test('hero section shows "I AM NO ARTIST"', async ({ page }) => {
    const title = page.locator('.hero-large-title');
    await expect(title).toContainText('I AM NO');
    await expect(title).toContainText('ARTIST');
  });

  test('projects section renders with title and video', async ({ page }) => {
    await expect(page.locator('section#projects')).toBeVisible();
    await expect(page.locator('#projectsTitle')).toBeVisible();
    await expect(page.locator('#projectsVideo')).toBeAttached();
  });

  test('Fabrik project has no .MOV source (regression: Fabrik.MOV removed)', async ({ page }) => {
    // Wait for the IIFE script to run and apply the first project
    await page.waitForFunction(() => {
      const video = document.getElementById('projectsVideo');
      return video && video.querySelectorAll('source').length > 0;
    });
    const movSources = await page.evaluate(() => {
      const video = document.getElementById('projectsVideo');
      return Array.from(video.querySelectorAll('source'))
        .filter(s => s.type === 'video/quicktime')
        .map(s => s.src);
    });
    expect(movSources).toHaveLength(0);
  });

  test('Fabrik project loads the mp4 video source', async ({ page }) => {
    await page.waitForFunction(() => {
      const video = document.getElementById('projectsVideo');
      return video && video.querySelectorAll('source').length > 0;
    });
    const mp4Sources = await page.evaluate(() => {
      const video = document.getElementById('projectsVideo');
      return Array.from(video.querySelectorAll('source'))
        .filter(s => s.type === 'video/mp4')
        .map(s => s.src);
    });
    expect(mp4Sources.length).toBeGreaterThan(0);
    expect(mp4Sources[0]).toContain('Fabrik.mp4');
  });

  test('mail club section is present', async ({ page }) => {
    await expect(page.locator('section#gallery.mail-club-section')).toBeVisible();
  });

  test('mail club subscribe button shows correct price', async ({ page }) => {
    const btn = page.locator('#homeSubscribeBtn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Subscribe — 15€ / month');
  });

  test('subscribe button opens side sheet', async ({ page }) => {
    // Use JS click to avoid scroll-snap / navbar interception across browsers
    await page.evaluate(() => document.getElementById('homeSubscribeBtn').click());
    await expect(page.locator('#subscribe-sheet')).toHaveClass(/is-open/);
    await expect(page.locator('#subscribe-overlay')).toHaveClass(/is-open/);
  });

  test('side sheet closes on Esc key', async ({ page }) => {
    await page.evaluate(() => document.getElementById('homeSubscribeBtn').click());
    await expect(page.locator('#subscribe-sheet')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#subscribe-sheet')).not.toHaveClass(/is-open/);
  });

  test('side sheet closes on overlay click', async ({ page }) => {
    await page.evaluate(() => document.getElementById('homeSubscribeBtn').click());
    await expect(page.locator('#subscribe-sheet')).toHaveClass(/is-open/);
    await page.evaluate(() => document.getElementById('subscribe-overlay').click());
    await expect(page.locator('#subscribe-sheet')).not.toHaveClass(/is-open/);
  });

  test('side sheet artwork count buttons update price', async ({ page }) => {
    await page.evaluate(() => document.getElementById('homeSubscribeBtn').click());
    await expect(page.locator('.subscribe-price-display')).toContainText('8€');
    await page.evaluate(() => document.querySelector('.artwork-count-btn[data-count="2"]').click());
    await expect(page.locator('.subscribe-price-display')).toContainText('11€');
    await page.evaluate(() => document.querySelector('.artwork-count-btn[data-count="3"]').click());
    await expect(page.locator('.subscribe-price-display')).toContainText('15€');
  });

  test('contact section has email link', async ({ page }) => {
    const contact = page.locator('section#contact');
    await expect(contact).toBeVisible();
    await expect(contact.locator('h2.section-title')).toContainText('Subscribe to Mail Club');
    await expect(page.locator('a[href="mailto:hello@pieppiepseppl.com"]')).toBeVisible();
  });

  test('footer has copyright notice', async ({ page }) => {
    const footer = page.locator('footer.footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('PIEPPIEPSEPPL');
  });

  test('spray canvas is injected into the page', async ({ page }) => {
    await expect(page.locator('canvas.spray-canvas')).toBeAttached();
  });
});

// ─────────────────────────────────────────────
// projects.html (Mail Club)
// ─────────────────────────────────────────────
test.describe('projects.html — Mail Club', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects.html');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Mail Club - PIEPPIEPSEPPL');
  });

  test('plan selector has mini, midi, and maxi options', async ({ page }) => {
    const select = page.locator('#planSelect');
    await expect(select).toBeVisible();
    const options = await select.locator('option').allTextContents();
    expect(options.some(o => o.includes('mini'))).toBe(true);
    expect(options.some(o => o.includes('midi'))).toBe(true);
    expect(options.some(o => o.includes('maxi'))).toBe(true);
  });

  test('subscribe button shows 8€ for mini plan', async ({ page }) => {
    await page.locator('#planSelect').selectOption('mini');
    await expect(page.locator('#subscribeBtn')).toContainText('8€');
  });

  test('subscribe button shows 11€ for midi plan', async ({ page }) => {
    await page.locator('#planSelect').selectOption('midi');
    await expect(page.locator('#subscribeBtn')).toContainText('11€');
  });

  test('subscribe button shows 15€ for maxi plan', async ({ page }) => {
    await page.locator('#planSelect').selectOption('maxi');
    await expect(page.locator('#subscribeBtn')).toContainText('15€');
  });

  test('quantity cannot decrease below 1', async ({ page }) => {
    const qty = page.locator('#quantity');
    await expect(qty).toHaveValue('1');
    await page.locator('#decrease-qty').click();
    await expect(qty).toHaveValue('1');
  });

  test('quantity increases correctly', async ({ page }) => {
    const increaseBtn = page.locator('#increase-qty');
    await increaseBtn.click();
    await page.waitForFunction(() => document.getElementById('quantity').value === '2');
    await increaseBtn.click();
    await page.waitForFunction(() => document.getElementById('quantity').value === '3');
  });

  test('?plan=midi URL param preselects midi and updates price', async ({ page }) => {
    await page.goto('/projects.html?plan=midi');
    await expect(page.locator('#planSelect')).toHaveValue('midi');
    await expect(page.locator('#subscribeBtn')).toContainText('11€');
  });

  test('?plan=maxi URL param preselects maxi and updates price', async ({ page }) => {
    await page.goto('/projects.html?plan=maxi');
    await expect(page.locator('#planSelect')).toHaveValue('maxi');
    await expect(page.locator('#subscribeBtn')).toContainText('15€');
  });

  test('one-time purchase radio is checked by default', async ({ page }) => {
    await expect(page.locator('input[name="purchase-type"][value="one-time"]')).toBeChecked();
    await expect(page.locator('input[name="purchase-type"][value="subscribe"]')).not.toBeChecked();
  });

  test('FAQ section is present with at least one item', async ({ page }) => {
    await expect(page.locator('.mail-club-faq')).toBeVisible();
    await expect(page.locator('.faq-item').first()).toBeVisible();
  });

  test('description section is present', async ({ page }) => {
    await expect(page.locator('.mail-club-description')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// gallery.html
// ─────────────────────────────────────────────
test.describe('gallery.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gallery.html');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Gallery - Portfolio');
  });

  test('navigation is present', async ({ page }) => {
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('gallery has at least 4 projects', async ({ page }) => {
    const projects = page.locator('.gallery-project[data-project]');
    const count = await projects.count();
    // Clones are appended by JS, so there may be more than 4
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('initial project title is visible and non-empty', async ({ page }) => {
    const title = page.locator('#currentProjectTitle');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('initial project description is visible and non-empty', async ({ page }) => {
    const desc = page.locator('#currentProjectDescription');
    await expect(desc).toBeVisible();
    await expect(desc).not.toBeEmpty();
  });
});
