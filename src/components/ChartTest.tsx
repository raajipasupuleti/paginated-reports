"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
];

export default function ChartTest() {
    return (
        <div className="p-8 space-y-8">
            {/* Original working fixed version for reference */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Fixed Size (Known Working)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border border-red-500">
                        <LineChart width={500} height={300} data={data}>
                            <CartesianGrid />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                            />
                        </LineChart>
                    </div>
                </CardContent>
            </Card>

            {/* Attempt 1: Basic ResponsiveContainer */}
            <Card>
                <CardHeader>
                    <CardTitle>2. Basic ResponsiveContainer</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] border border-blue-500">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Attempt 2: With aspect ratio */}
            <Card>
                <CardHeader>
                    <CardTitle>3. With Aspect Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border border-green-500">
                        <ResponsiveContainer width="100%" aspect={2}>
                            <LineChart data={data}>
                                <CartesianGrid />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Attempt 3: With explicit pixel height */}
            <Card>
                <CardHeader>
                    <CardTitle>4. With Pixel Height</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border border-purple-500">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Attempt 4: With position absolute wrapper */}
            <Card>
                <CardHeader>
                    <CardTitle>5. With Position Absolute</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative h-[300px] border border-yellow-500">
                        <div className="absolute inset-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
