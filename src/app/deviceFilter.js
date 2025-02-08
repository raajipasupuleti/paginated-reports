const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe("Device Filtering", () => {
    let dashboard;

    test.beforeEach(async ({ page }) => {
        dashboard = new DashboardPage(page);
        await dashboard.openDashboard();
    });

    test("Successfully filter by device", async ({ page }) => {
        await dashboard.applyDeviceFilter("Machine A");

        await expect(dashboard.chart).toContainText("Machine A");
        await expect(dashboard.table).toContainText("Machine A");
    });

    test("Selecting a device with no data", async ({ page }) => {
        await dashboard.applyDeviceFilter("Unknown Machine");

        await expect(page.locator(".error-message")).toHaveText("No data available");
    });
});
