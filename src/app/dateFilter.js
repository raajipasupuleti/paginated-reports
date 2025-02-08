const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe("Date Filtering", () => {
    let dashboard;

    test.beforeEach(async ({ page }) => {
        dashboard = new DashboardPage(page);
        await dashboard.openDashboard();
    });

    test("Successfully filter data by date range", async ({ page }) => {
        await dashboard.applyDateFilter("2024-01-01", "2024-01-31");

        await expect(dashboard.chart).toContainText("January Data");
        await expect(dashboard.table).toContainText("2024-01-01");
    });

    test("Attempting to filter with an invalid date range", async ({ page }) => {
        await dashboard.applyDateFilter("2024-02-01", "2024-01-01");

        await expect(page.locator(".error-message")).toHaveText("Invalid date range");
        await expect(dashboard.chart).not.toBeVisible();
    });
});
