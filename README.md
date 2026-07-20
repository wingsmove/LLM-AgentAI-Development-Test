# USPSA-Match-Planner-with-LLM

一个基于 **OpenAI Agents SDK** 的实践项目：自动爬取 [PractiScore](https://practiscore.com) 俱乐部页面的「即将进行的比赛」信息，接受用户自行输入的成绩信息并保存到本地数据库（现版本为JSON文件）。
可以用不同的 AI Agent 基于比赛信息或输入与保存的过往成绩为射手生成**比赛规划**与**成绩分析**。

## 功能简介

- **爬虫（`scraper.py`）**：读取 `Informations/clubs.json` 中的俱乐部列表，抓取每个俱乐部页面公开展示的 *Upcoming Matches*，解析出比赛名称、日期、项目/级别、报名状态与链接（仅保留 USPSA / IPSC 比赛）。
- **两个 AI Agent（`main.py`）**：
  - **比赛规划 Agent**（`planning_agent`）：只负责参赛日程规划——梳理比赛时间线、给出参赛建议、报名提醒与链接。
  - **成绩分析 Agent**（`score_agent`）：负责训练与提升的深入分析——总体评价、失分点、升级重点、阶段性训练计划、备赛重点。该 Agent 挂载了两个工具，可由模型**自行决定是否调用**：
    - `get_past_scores`：读取历史成绩（`Past_Scores/`），做纵向对比、判断趋势。
    - `get_past_reports`：读取历史报告（`Past_Reports/`），保持建议连贯。
- **结构化成绩存储**：成绩分析模式下，用户粘贴的成绩会被解析为结构化 JSON 存入 `Past_Scores/`，便于后续查询、对比或做成数据库。
- **归档输出**：所有保存的输出文件名自动带时间戳，避免覆盖历史结果。

## 目录结构

```
.
├── main.py            # 主程序：选择模式 -> 抓取/输入 -> Agent 分析 -> 输出
├── scraper.py         # 爬虫模块：抓取并解析 Upcoming Matches
├── Informations/
│   └── clubs.json     # 俱乐部列表（name + url）
├── requirements.txt   # 依赖
├── Matches/           # 爬取数据输出目录（自动生成，已被 .gitignore 忽略）
├── Past_Scores/       # 结构化成绩 JSON 目录（自动生成，已被 .gitignore 忽略）
├── Past_Reports/      # LLM 报告归档目录（自动生成，已被 .gitignore 忽略）
└── .env               # 环境变量（需自行创建，见下）
```

## 环境要求

- Python 3.10+
- 一个有效的 OpenAI API Key（模式2或模式3的纯输出模式除外）

## 安装

```bash
pip install -r requirements.txt
```

## 配置

在项目根目录创建 `.env` 文件，写入你的 OpenAI API Key：

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

## 使用方法

编辑 `Informations/clubs.json`，填入想要跟踪的俱乐部：

```json
[
  {
    "name": "Club Name",
    "url": "https://practiscore.com/clubs/club_name"
  }
]
```

然后运行主程序：

```bash
python main.py
```

启动时会先选择**运行模式**：

### 模式 1：使用 LLM 生成比赛规划（默认）

1. 抓取 `Informations/clubs.json` 中所有俱乐部的即将进行的比赛；
2. 由 `planning_agent` 生成参赛日程规划；
3. 选择输出方式（打印 / 保存 / 两者），报告保存到 `Past_Reports/report_<时间戳>.md`。

### 模式 2：仅输出爬取的比赛（不调用 LLM）

1. 抓取并解析所有俱乐部的即将进行的比赛（只抓取一次，复用数据）；
2. 选择输出方式；保存时同时生成两份文件到 `Matches/`：
   - `matches_<时间戳>.json`：结构化 JSON 数据
   - `matches_<时间戳>.txt`：与交给 LLM 相同的格式化文本
3. 此模式不调用 OpenAI，无需配置 API Key。

### 模式 3：成绩分析

1. 按提示逐行粘贴成绩数据，列顺序如下（`Div` 用简写 CO / LO / Limited / Open / PCC 等），全部粘贴完成后在新行输入 `END` 结束：

   ```
   %  Pts  Time  % psbl  Div  Class  PF  A  C  D  M  NPM  NS  Proc  Apen
   示例：42.66% 193.5518 260.40 41.79 CO U MINOR 79 15 2 5 - - - -
   ```

2. 成绩会被解析为结构化 JSON 并保存到 `Past_Scores/scores_<时间戳>.json`；
3. 询问是否调用大模型：
   - `2`：仅导出 JSON（不调用 LLM）；
   - `1`（默认）：由 `score_agent` 进行成绩分析，期间模型可自行调用工具读取历史成绩/报告做对比；
4. 选择输出方式，分析报告保存到 `Past_Reports/score_report_<时间戳>.md`。

> 运行时终端会打印 `[调试]` 信息，显示本次 Agent 是否调用了工具及调用次数。

### 单独运行爬虫（可选）

只想查看抓取结果、不调用大模型时：

```bash
python scraper.py
```

## 说明

- 输出均带时间戳：爬取数据在 `Matches/`，结构化成绩在 `Past_Scores/`，LLM 报告在 `Past_Reports/`。
- 上述三个输出目录以及 `.env`、`*.txt`、`*.pdf` 等均已在 `.gitignore` 中忽略，不会被提交（其中含个人成绩与密钥，请勿手动加入版本库）。
- `Past_Scores/` 的历史成绩与 `Past_Reports/` 的历史报告，会作为成绩分析 Agent 工具的数据来源，用于纵向对比与延续建议。
- 当前 Agent 的指令假设使用者是一名希望从 **C 级升到 B 级** 的 USPSA 射手，可在 `coach_agents.py` 中调整各 Agent 的 `instructions`。

## 使用须知

- 本项目仅用于个人学习与研究，抓取的是网站上公开可见的比赛信息。
- 请自行遵守目标网站的服务条款（Terms of Service）与 `robots.txt`，控制请求频率，避免对站点造成压力或用于商业用途。
- 数据的时效性与准确性以网站原始页面为准，本项目不对抓取结果作任何担保。

## 依赖

主要依赖：`openai-agents`（Agents SDK）、`openai`、`python-dotenv`、`cloudscraper`、`beautifulsoup4`（完整列表见 `requirements.txt`）。

## 使用与输出范例

### 模式1：（比赛规划）
```
请选择运行模式（1: 使用 LLM 生成比赛规划，2: 仅输出爬取的比赛，3: 成绩分析，默认 1）：1
正在抓取俱乐部比赛信息，请稍候……
正在调用大模型，请稍候……
[调试] 本次调用工具 1 次：get_past_scores
请选择输出方式（1: 打印到屏幕，2: 保存为文件，3: 同时打印+保存，默认 1）：3
已保存到：Past_Reports\report_20260720_015224.md
## 时间顺序与状态
- 2026-07-26｜Briar Rabbit July USPSA｜L1｜open  
  https://practiscore.com/briar-rabbit-july-uspsa-2026/register
- 2026-08-02｜Cardinal Practical Shooters – August｜L1｜open  
  https://practiscore.com/cardinal-practical-shooters-august-2026/register
- 2026-08-09｜PCSI USPSA AUGUST｜L1｜opens in 6 days  
  https://practiscore.com/pcsi-uspsa-august-9-2026/register
- 2026-08-15｜Intro to USPSA – Your First Match Guided – AUG｜L1｜open
  https://practiscore.com/intro-to-uspsa-your-first-match-guided-aug/register
- 2026-08-19｜Vortex Optics Race Gun Nationals｜L3｜closed
  https://practiscore.com/vortex-optics-race-gun-nationals-presented-by-kimber/register
- 2026-08-22｜ACTC USPSA｜L1｜opens in 1 week
  https://practiscore.com/actc-uspsa-clone-clone/register
- 2026-08-23｜Briar Rabbit August USPSA｜L1｜opens in 6 days
  https://practiscore.com/briar-rabbit-august-uspsa-2026/register
- 2026-09-12｜Private Match｜L1｜Private: opens in 2 weeks（无链接）
- 2026-09-13｜Private Match｜L1｜Private: opens in 2 weeks（无链接）
- 2026-09-13｜ACTC USPSA｜L1｜opens in 4 weeks
  https://practiscore.com/actc-uspsa-clone-3/register
- 2027-05-20｜Ohio State Buckeye Blast｜L2｜opens in 5 months
  https://practiscore.com/2027-ohio-state-buckeye-blast/register

## 参赛建议（以晋级B为目标）
- 近期立刻报：7/26、8/2、8/15（均open）。
- 待开报设提醒：8/09、8/22、8/23（各自开放当日即报，名额快）。
- 9/13撞期：在ACTC与PCSI二选一；优先选你常去且分组稳定的场地。
- Private Match：两周后留意俱乐部通知，无链接需联系人/群内消息。
- 月度节奏：每月2–3场本地L1，结合你近期CO组出枪节奏，连续两月保持参赛密度。
- 中期目标：锁定2027 Buckeye Blast（L2）作为段位认证赛事，提前准备住宿/分组。

备注：Nationals均closed，可忽略本周期报到计划。
```
### 模式2仅输出文件与比赛列表

### 模式3：（成绩分析）

```
请选择运行模式（1: 使用 LLM 生成比赛规划，2: 仅输出爬取的比赛，3: 成绩分析，默认 1）：3
列顺序如下：
%  Pts  Time  % psbl  Div  Class  PF  A  C  D  M  NPM  NS  Proc  Apen
Div 可用简写：CO / LO / Limited / Open / PCC 等
示例：42.66% 193.5518 260.40 41.79 CO U MINOR 79 15 2 5 - - - -
请逐行粘贴成绩数据，全部粘贴完成后，在新的一行输入 END 回车结束：
40.03 295.3553 218.01 43.21 CO C MINOR 114 29 4 11 - 1 - -
END
本次 1 条成绩已写入数据库：Past_Scores\scores_db.json
是否调用大模型分析成绩？（1: 是，进行分析，2: 否，仅导出 JSON，默认 1）：1
正在调用大模型，请稍候……
[调试] 本次未调用任何工具
请选择输出方式（1: 打印到屏幕，2: 保存为文件，3: 同时打印+保存，默认 1）：3
已保存到：Past_Reports\score_report_20260720_020155.md
## 1) 总体表现
- 综合百分比：40.03%（C 水平中段）
- 命中分布：A 114、C 29、D 4、M 11、NS 1（未记录程序罚分）
- 粗略命中质量：A 77.6%，C 19.7%，D 2.7%；失误率≈7%（M/(A+C+D+M)）
- 主要结论：分数下滑的主因是高额罚分（11×M + 1×NS），其次是C/D 偏多；速度相对信息不足，但从“percent_possible 43.21”看，命中效率仍有较大提升空间。

## 2) 主要失分点
- 脱靶 M 过多：对总分杀伤最大（每个 -10，还额外浪费补枪时间）
- 误击禁靶 NS：高风险决策与视觉确认不足
- C/D 偏多：尤其在移动或困难角度上，视觉停留与扳机控制不足
- 速度与命中失衡：为追速度牺牲命中（从M与NS推断）

## 3) 升级到 B 级的关键指标
- 将 M 控制到 ≤1–2/整场；NS 归零
- A 命中率≥85%（C ≤12%，D ≤1–2%）
- 保持稳定节奏：困难目标“减速到能打A”，容易目标“提速不丢A/C”

## 4) 训练建议与阶段计划（4–6 周）
通用标准与量化
- 练习中每100发 M ≤1；A≥90%；计时器分组记录
- 目标尺寸/距离：7–15米为主，穿插20–25米精度段

周计划
- 第1–2周（止血：稳定A、消灭M/NS）
  - 干火（每日15–20分钟）：出枪至A区、转移视线-枪口一致，快瞄停稳再击发；门框/小圆贴作“A”
  - 实弹（每周1）：精准控扳机与视觉耐心
    - Doubles（7–10米）：跟枪而非抢扳机，分组看弹着团
    - 10-10-10（10米10发10秒，目标A/C线内≥9A）
    - 远距离精度（20–25米）：单发与双发，只要出C/D立即降速
- 第3–4周（效率：在控制下提速）
  - Bill Drill（7–10米）：6发，目标≥5A，分组逐步降时
  - 2x2x2、Blake Drill（3靶转移）：先“看A再走”，转移提前目光
  - 进入/退出靶位空枪+少量实弹：进入后第一枪A、退出前最后一枪A
- 第5–6周（场景化与容错）
  - 小型组合科目：含遮挡、摆角、位置变换
  - 罚分压力练：设“丢A或出M加俯卧撑/重来”规则
  - 弱/强手单手击发（7–10米）：稳A为先

配套
- 记录每次训练的A/C/D/M数据与时间，周周复盘
- 调整光学瞄准器亮度与零位；确认握把一致性和扳机路径

## 5) 赛前备战重点（下场比赛）
- 策略：硬靶/远靶/小窗位“降速保A”，仅在近大靶大胆提速
- 视觉：瞄具清晰+确认A区边缘稳定再击发，拒绝“半停枪”出枪
- 计划：确保无程序性风险路线；不赌角度、不赌弹
- 执行：发现第一发漂移，立刻补枪，不拖延；守纪律把NS风险降为0
- 心态：以“零M零NS”为KPI，名次其次，先把命中质量拉满
```