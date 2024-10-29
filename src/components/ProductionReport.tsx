"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productionData } from "@/lib/data";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function ProductionReport() {
    const searchParams = useSearchParams();
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [startDate, setStartDate] = useState("2024-10-27");
    const [endDate, setEndDate] = useState("2024-10-29");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize devices from URL parameters
    useEffect(() => {
        const devicesParam = searchParams.get("devices");
        if (devicesParam) {
            setSelectedDevices(devicesParam.split(","));
        }
        setIsLoaded(true);
    }, [searchParams]);

    const devices = useMemo(
        () => [...new Set(productionData.map((item) => item.deviceKey))],
        []
    );

    const reports = useMemo(() => {
        if (!isLoaded) return [];

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
    }, [devices, selectedDevices, startDate, endDate, isLoaded]);

    const handleDownloadPDF = async () => {
        try {
            setIsGenerating(true);

            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    selectedDevices,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || "Failed to generate PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `production-report-${startDate}-to-${endDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            console.error("Error downloading PDF:", error);
            alert(`Failed to generate PDF: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Only render content when loaded
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8 bg-white">
            {/* Filters */}
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
                            <div className="flex flex-wrap gap-4">
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

            {/* Report Pages Container */}
            <div className="print:p-0 print:m-0">
                {reports.map(({ device, summary }, index) => (
                    <div
                        key={device}
                        className={`print:w-[8.5in] print:h-[11in] print:m-0 print:p-8 ${
                            index < reports.length - 1
                                ? "page-break-after-always"
                                : ""
                        }`}
                    >
                        <Card className="h-full shadow-none print:shadow-none">
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
                                            -{" "}
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
                                            ([state, data], i) => (
                                                <tr
                                                    key={state}
                                                    className="even:bg-muted/20 print:even:bg-gray-100"
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
            </div>

            {/* Print Button */}
            <div className="mt-8 space-x-4 print:hidden">
                <Button onClick={() => window.print()} className="space-x-2">
                    <Printer className="w-4 h-4" />
                    <span>Print Report</span>
                </Button>
                <Button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    variant="outline"
                    className="space-x-2"
                >
                    <Download className="w-4 h-4" />
                    <span>
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </span>
                </Button>
            </div>
        </div>
    );
}
