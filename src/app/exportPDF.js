const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/DashboardPage');

test("Export data as PDF", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openDashboard();
    await dashboard.exportPDF();

    const download = await page.waitForEvent("download");
    expect(download.suggestedFilename()).toContain(".pdf");
});
