"use client";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { StatsCards } from "../_components/stats-cards";
import { TypeBarChart } from "../_components/type-bar-chart";
import { TrendChart } from "../_components/trend-chart";

const RECENT_ACTIVITIES = [
  { id: "1", action: "新建案件", target: "合同纠纷 #2024-001", time: "10分钟前", user: "张三" },
  { id: "2", action: "审批通过", target: "劳动争议 #2024-015", time: "30分钟前", user: "李四" },
  { id: "3", action: "案件结案", target: "知识产权 #2024-008", time: "1小时前", user: "王五" },
  { id: "4", action: "更新进度", target: "交通事故 #2024-023", time: "2小时前", user: "赵六" },
  { id: "5", action: "新建案件", target: "房产纠纷 #2024-030", time: "3小时前", user: "张三" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">首页</h1>
        <div className="flex gap-2">
          <Button variant="outline">导出报表</Button>
          <Button variant="default">新建案件</Button>
        </div>
      </div>

      {/* Stats Row */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TypeBarChart />
        <TrendChart />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>最近动态</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>操作</TableHead>
                <TableHead>对象</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_ACTIVITIES.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell>{activity.target}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
