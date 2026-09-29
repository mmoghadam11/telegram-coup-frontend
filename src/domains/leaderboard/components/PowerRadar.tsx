import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

interface Stats {
    total_games: number;
    total_wins: number;
    total_kills: number;
    total_coups: number;
    total_successful_bluffs: number;
    total_caught_bluffs: number;
    total_correct_challenges: number;
    total_wrong_challenges: number;
}

interface Props {
    stats: Stats;
}

function pct(numerator: number, denominator: number): number {
    if (denominator <= 0) return 0;
    return Math.round((numerator / denominator) * 100);
}

export default function PowerRadar({ stats }: Props) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const winRate = pct(stats.total_wins, stats.total_games);
    const bluffSuccessRate = pct(stats.total_successful_bluffs, stats.total_successful_bluffs + stats.total_caught_bluffs);
    const challengeSuccessRate = pct(stats.total_correct_challenges, stats.total_correct_challenges + stats.total_wrong_challenges);
    // نرخ کشتار/کودتا رو نسبت به تعداد بازی‌ها می‌سنجیم (میانگین در هر بازی)، سقف رو برای نرمال‌سازی به درصد در نظر می‌گیریم
    const aggressionRate = Math.min(100, pct(stats.total_kills + stats.total_coups, stats.total_games * 2));

    const data = [
        { subject: "برد", value: winRate },
        { subject: "بلوف موفق", value: bluffSuccessRate },
        { subject: "تشخیص بلوف", value: challengeSuccessRate },
        { subject: "تهاجم", value: aggressionRate },
    ];

    return (
        <Box sx={{ width: "100%", height: 260 }}>
            <Typography variant="subtitle2" textAlign="center" gutterBottom>
                پنجره‌ی قدرت
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} outerRadius="70%">
                    <PolarGrid stroke={isDark?"rgba(255,255,255,.15)":"rgba(0, 0, 0, 0.15)"} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: isDark?"#fff":"#000", fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="#e0a52f" fill="#e0a52f" fillOpacity={0.45} />
                </RadarChart>
            </ResponsiveContainer>
        </Box>
    );
}