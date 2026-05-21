"use client";

import { useState } from "react";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { CaseTable } from "../../_components/case-table";
import { CaseDrawer } from "../../_components/case-drawer";

export default function CasesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">案件列表</h1>
        <div className="flex gap-2">
          <Button variant="outline">导出</Button>
          <Button variant="default">新建案件</Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="搜索案件编号、名称..."
          className="w-64"
        />
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <option value="">全部类型</option>
          <option value="刑事诉讼">刑事诉讼</option>
          <option value="民事诉讼">民事诉讼</option>
          <option value="法律顾问">法律顾问</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <option value="">全部状态</option>
          <option value="申请中">申请中</option>
          <option value="已审批">已审批</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <option value="">全部承办人</option>
          <option value="张三">张三</option>
          <option value="李四">李四</option>
          <option value="王五">王五</option>
        </select>
      </div>

      {/* Case Table */}
      <CaseTable
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      />

      {/* Detail Drawer */}
      <CaseDrawer
        caseId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
