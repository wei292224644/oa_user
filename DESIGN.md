# Design System

## Overview

OA案件管理系统。暗色优先主题，功能导向设计，轻微科技质感来自精确的排版和结构化的数据呈现，而非装饰性特效。

## Theme

暗色为主、亮色可选。默认暗色模式，因法律工作者长时间查看密集数据，暗色背景减少视觉疲劳。亮色模式作为日间/演示场景备选。

物理场景：律师在晚间办公室或会议室，通过大屏幕查看案件列表和统计，需要长时间专注阅读，环境光偏暗。

## Color Strategy

Restrained → Committed 之间。以中性灰为基底，单一青色/蓝绿色作为功能强调色（用于状态标识、交互反馈、数据高亮），占比约 15-20%。

### Dark Mode (Default)

- Background: `#0d1117` (GitHub-dark 式深蓝灰，非纯黑)
- Surface: `#161b22` (卡片/面板底色)
- Elevated: `#21262d` (悬浮、下拉、模态层)
- Border: `#30363d` (微妙分隔)
- Text Primary: `#c9d1d9`
- Text Secondary: `#8b949e`
- Text Muted: `#6e7681`
- Accent: `#39d0d8` (青绿，用于主按钮、链接、关键数据)
- Accent Hover: `#5ee0e7`
- Success: `#3fb950` (状态：已完成/通过)
- Warning: `#d29922` (状态：待审批/进行中)
- Error: `#f85149` (状态：驳回/异常)
- Info: `#58a6ff` (状态：申请中)

### Light Mode

- Background: `#f6f8fa`
- Surface: `#ffffff`
- Elevated: `#f6f8fa`
- Border: `#d0d7de`
- Text Primary: `#1f2328`
- Text Secondary: `#656d76`
- Text Muted: `#8c959f`
- Accent: `#0969da` (蓝色，暗色下的青绿在亮色下转为饱和蓝)

## Typography

- Font Stack: `Geist Sans` (正文), `Geist Mono` (数据/编号/代码)
- 数据密集区域（案件编号、日期、金额）使用等宽字体，确保对齐
- 标题层级：Page 24px/bold → Section 18px/semibold → Card 16px/medium
- Body: 14px/regular, line-height 1.5
- Data: 13px/mono, line-height 1.4
- 中文正文最小 14px，确保中文可读性

## Spacing

- 紧凑布局为主。Table cell padding: 12px 16px
- Card padding: 16px-20px
- Section gap: 24px
- 不使用大圆角：组件圆角 6px（按钮/输入框），卡片 8px，全局无 16px+ 大圆角

## Components

### Data Table

- 行高 48px，斑马纹不适用（暗色下用 subtle hover）
- 表头文字小一号（12px）、全大写、字距加宽、颜色 muted
- 状态列使用 pill tag（圆角标签），背景色 20% 透明度
- 操作列图标仅在 hover 时显示（减少视觉噪音）

### Stats Cards (仪表盘)

- 拒绝 hero-metric 模板。不使用大数字 + 小标签的 cliché 布局。
- 采用迷你图表（sparkline / mini bar）+ 紧凑数字并排。
- 卡片无阴影，仅靠 border 分隔。

### Navigation

- 顶部导航栏（非侧边栏），节省水平空间给数据表格。
- 标签页切换案件列表/仪表盘/设置。

### Tags / Pills

- 案件类型、状态使用小型 pill：padding 4px 10px，字号 12px，圆角 999px
- 背景使用对应状态色的 15% 透明度

## Elevation

- 不使用阴影表达层级（暗色下阴影不明显）。
- 使用 border 和背景色变化表达层级。
- 悬浮层（下拉菜单、模态框）使用 elevated 背景色 + 1px border。

## Motion

- 最低限度动画。页面切换无 fade/slide。
- 仅保留：hover 状态 150ms ease，下拉菜单 100ms ease-out。
- 数据表格排序时行位置变化使用 200ms 动画。
- 尊重 `prefers-reduced-motion`。

## Absolute Bans (Project-specific)

- 无边框左条纹（border-left accent）
- 无渐变文字
- 无玻璃拟态
- 无 hero-metric 大数字卡片
- 无重复卡片网格（icon+heading+text 重复）
- 无模态框作为默认交互（优先内联展开/抽屉）
