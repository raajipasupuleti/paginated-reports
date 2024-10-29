"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productionData } from "@/lib/data";
import { format } from "date-fns";
import { useMemo, useState } from "react";

export function ProductionReport() {
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [startDate, setStartDate] = useState("2024-10-27");
    const [endDate, setEndDate] = useState("2024-10-29");

    const devices = useMemo(
        () => [...new Set(productionData.map((item) => item.deviceKey))],
        []
    );

    const reports = useMemo(() => {
        return devices
            .filter(
                (device) =>
                    selectedDevices.length === 0 ||
                    selectedDevices.includes(device)
            )
            .map((device) => {
                const deviceData = productionData.filter(
                    (item) =>
                        item.deviceKey === device &&
                        new Date(item.start_time) >= new Date(startDate) &&
                        new Date(item.end_time) <= new Date(endDate)
                );

                const summary = deviceData.reduce((acc, curr) => {
                    const state = curr.process_state_display_name;
                    if (!acc[state]) {
                        acc[state] = { good: 0, reject: 0, duration: 0 };
                    }
                    acc[state].good += curr.good_count;
                    acc[state].reject += curr.reject_count;
                    acc[state].duration += curr.duration;
                    return acc;
                }, {} as Record<string, { good: number; reject: number; duration: number }>);

                return { device, summary };
            });
    }, [devices, selectedDevices, startDate, endDate]);

    return (
        <div className="min-h-screen p-8 bg-white">
            {/* Filters - hidden when printing */}
            <div className="mb-8 print:hidden">
                <Card>
                    <CardHeader>
                        <CardTitle>Report Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Devices
                            </label>
                            <div className="flex gap-4">
                                {devices.map((device) => (
                                    <label
                                        key={device}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDevices.includes(
                                                device
                                            )}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDevices([
                                                        ...selectedDevices,
                                                        device,
                                                    ]);
                                                } else {
                                                    setSelectedDevices(
                                                        selectedDevices.filter(
                                                            (d) => d !== device
                                                        )
                                                    );
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        {device}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Pages */}
            {reports.map(({ device, summary }, index) => (
                <div
                    key={device}
                    className={`page-container ${
                        index > 0 ? "report-page" : ""
                    }`}
                >
                    <Card className="h-full">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        {device} Production Report
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {format(
                                            new Date(startDate),
                                            "MMM d, yyyy"
                                        )}{" "}
                                        -
                                        {format(
                                            new Date(endDate),
                                            "MMM d, yyyy"
                                        )}
                                    </span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="border px-4 py-2 text-left font-medium">
                                            Process State
                                        </th>
                                        <th className="border px-4 py-2 text-right font-medium">
                                            Good Count
                                        </th>
                                        <th className="border px-4 py-2 text-right font-medium">
                                            Reject Count
                                        </th>
                                        <th className="border px-4 py-2 text-right font-medium">
                                            Duration (hrs)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(summary).map(
                                        ([state, data]) => (
                                            <tr
                                                key={state}
                                                className="even:bg-muted/20"
                                            >
                                                <td className="border px-4 py-2">
                                                    {state}
                                                </td>
                                                <td className="border px-4 py-2 text-right">
                                                    {Math.round(
                                                        data.good
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="border px-4 py-2 text-right">
                                                    {Math.round(
                                                        data.reject
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="border px-4 py-2 text-right">
                                                    {(
                                                        data.duration / 3600
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            ))}

            {/* Print Button */}
            <Button
                onClick={() => window.print()}
                className="mt-8 print:hidden"
            >
                Print Report
            </Button>
        </div>
    );
}
