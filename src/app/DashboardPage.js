class DashboardPage {
    constructor(page) {
        this.page = page;
        this.dateFilter = page.locator("#date-filter");
        this.deviceFilter = page.locator("#device-filter");
        this.chart = page.locator("#chart");
        this.table = page.locator("#table");
        this.exportPDF = page.locator("#export-pdf");
    }

    async openDashboard() {
        await this.page.goto("http://localhost:3000/dashboard");
    }

    async applyDateFilter(startDate, endDate) {
        await this.dateFilter.fill(`${startDate} - ${endDate}`);
        await this.page.keyboard.press("Enter");
    }

    async applyDeviceFilter(device) {
        await this.deviceFilter.selectOption(device);
    }

    async exportPDF() {
        await this.exportPDF.click();
    }
}

module.exports = { DashboardPage };
