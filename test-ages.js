// 测试特定年龄的选项
const gameState = { age: 0, health: 100, money: 0, intelligence: 50, charm: 50, luck: 50, fame: 0, skills: [], events: [], job: "婴儿", relationship: 0, careerLevel: 0, history: [] };

const events = {
    0: { npc: "妈妈", choices: [{ text: "健康成长", effect: { health: 10 }, result: "健康成长" }, { text: "哭闹表达", effect: { charm: 5 }, result: "哭闹" }, { text: "安静睡觉", effect: { health: 5 }, result: "睡觉" }, { text: "好奇观察", effect: { intelligence: 5 }, result: "观察" }]},
    3: { npc: "爸爸", choices: [{ text: "玩玩具车", effect: { intelligence: 10, skill: "机械" }, result: "玩车" }, { text: "画画", effect: { intelligence: 5, skill: "绘画" }, result: "画画" }, { text: "和其他小朋友玩", effect: { charm: 10, skill: "社交" }, result: "玩耍" }, { text: "听故事", effect: { intelligence: 10 }, result: "听故事" }]},
    6: { npc: "老师", choices: [{ text: "数学课", effect: { intelligence: 15, skill: "数学" }, result: "数学" }, { text: "语文课", effect: { intelligence: 10, skill: "语文" }, result: "语文" }, { text: "体育课", effect: { health: 15, skill: "运动" }, result: "体育" }, { text: "音乐课", effect: { charm: 10, skill: "音乐" }, result: "音乐" }]},
    9: { npc: "班主任", choices: [{ text: "参加奥数班", effect: { intelligence: 15, money: -2000, skill: "竞赛数学" }, result: "奥数" }, { text: "学钢琴", effect: { charm: 10, money: -3000, skill: "钢琴" }, result: "钢琴" }, { text: "踢足球", effect: { health: 10, skill: "足球" }, result: "足球" }, { text: "看课外书", effect: { intelligence: 10, skill: "阅读" }, result: "阅读" }]},
    12: { npc: "同学", choices: [{ text: "努力学习", effect: { intelligence: 15, fame: 5 }, result: "努力学习" }, { text: "打篮球", effect: { health: 15, skill: "篮球", charm: 10 }, result: "打球" }, { text: "追明星", effect: { charm: 5, fame: 10 }, result: "追星" }, { text: "上网聊天", effect: { intelligence: -5, skill: "电脑" }, result: "上网" }]},
    15: { npc: "家长", choices: [{ text: "专心备考", effect: { intelligence: 20, money: -5000 }, result: "备考" }, { text: "参加竞赛", effect: { fame: 15, intelligence: 10, skill: "竞赛" }, result: "竞赛" }, { text: "谈恋爱", effect: { relationship: 20, charm: 10 }, result: "恋爱" }, { text: "发展兴趣", effect: { skill: "兴趣", charm: 10 }, result: "兴趣" }]},
    18: { npc: "父亲", choices: [{ text: "找工作", effect: { money: 3000, skill: "工作经验", job: "职员", career: 1 }, result: "工作" }, { text: "考大学", effect: { money: -5000, intelligence: 15, skill: "高等教育" }, result: "大学" }, { text: "创业", effect: { luck: 55, skill: "创业经验" }, result: "创业" }, { text: "旅行", effect: { charm: 10, money: -3000, skill: "旅行经验" }, result: "旅行" }]},
    21: { npc: "学长", choices: [{ text: "创业比赛", condition: () => gameState.intelligence > 55, effect: { fame: 20, money: 5000 }, result: "创业比赛" }, { text: "实习", condition: () => gameState.skills.includes('工作经验'), effect: { money: 2000, skill: "实习", career: 1 }, result: "实习" }, { text: "加入社团", effect: { charm: 10, skill: "社交" }, result: "社团" }, { text: "专注学习", effect: { intelligence: 5 }, result: "学习" }]},
    24: { npc: "上司", choices: [{ text: "抓住机会", effect: { career: 3, fame: 20, money: 10000 }, result: "晋升" }, { text: "稳步发展", effect: { career: 1, skill: "专业技能" }, result: "发展" }, { text: "开拓副业", effect: { money: 5000, skill: "副业" }, result: "副业" }, { text: "建立人脉", effect: { charm: 10, fame: 10 }, result: "人脉" }]},
    27: { npc: "朋友", choices: [{ text: "接受表白", condition: () => gameState.relationship > 30, effect: { relationship: 50, charm: 10 }, result: "表白" }, { text: "专注事业", effect: { money: 10000, career: 2 }, result: "事业" }, { text: "学习新技能", effect: { intelligence: 10, skill: "新技能" }, result: "学习" }, { text: "拓展社交", effect: { charm: 15, fame: 10 }, result: "社交" }]},
    30: { npc: "配偶", choices: [{ text: "结婚", condition: () => gameState.relationship > 50, effect: { relationship: 50, health: 10, money: -20000 }, result: "结婚" }, { text: "求婚", condition: () => gameState.relationship > 30, effect: { relationship: 40, money: -10000 }, result: "求婚" }, { text: "专注事业", effect: { career: 3, money: 30000 }, result: "事业" }, { text: "学习进修", effect: { intelligence: 20, skill: "认证" }, result: "进修" }]},
    35: { npc: "配偶", choices: [{ text: "买学区房", effect: { money: -50000, fame: 10 }, result: "买房" }, { text: "保持现状", effect: { health: 10, relationship: 10 }, result: "保持" }, { text: "发展副业", effect: { money: 20000, health: -10, skill: "副业" }, result: "副业" }, { text: "投资理财", effect: { money: 10000, skill: "投资" }, result: "投资" }]},
    40: { npc: "同事", choices: [{ text: "坚守岗位", effect: { career: 2, fame: 10 }, result: "坚守" }, { text: "离职创业", condition: () => gameState.money > 30000, effect: { money: -30000, job: "创业者", fame: 20 }, result: "创业" }, { text: "学习新技能", effect: { intelligence: 15, skill: "技能" }, result: "学习" }, { text: "休息", effect: { health: 20 }, result: "休息" }]},
    50: { npc: "老朋友", choices: [{ text: "分享经验", effect: { fame: 20 }, result: "分享" }, { text: "享受生活", effect: { health: 15, money: -10000 }, result: "享受" }, { text: "投身慈善", effect: { fame: 25, money: -20000 }, result: "慈善" }, { text: "继续奋斗", effect: { money: 30000, health: -10 }, result: "奋斗" }]},
    60: { npc: "子女", choices: [{ text: "写回忆录", effect: { fame: 15, intelligence: 10 }, result: "回忆录" }, { text: "含饴弄孙", effect: { health: 15, relationship: 20 }, result: "弄孙" }, { text: "周游世界", effect: { money: -50000, charm: 20 }, result: "旅游" }, { text: "种花养草", effect: { health: 20 }, result: "养花" }]}
};

function generateDefaultEvent(age) {
    return {
        npc: ["朋友", "同事", "家人"][age % 3],
        choices: [
            { text: "努力工作", effect: { money: 10000, career: 1, health: -5 }, result: "工作" },
            { text: "陪伴家人", effect: { health: 10, relationship: 10 }, result: "家人" },
            { text: "投资理财", effect: { money: 5000, skill: "投资" }, result: "投资" },
            { text: "学习新知识", effect: { intelligence: 10, skill: "技能" }, result: "学习" }
        ]
    };
}

// 测试每个关键年龄
console.log("🧪 测试各年龄的选项...\n");

for (let age = 0; age <= 21; age++) {
    const evt = events[age];
    if (evt) {
        const validChoices = evt.choices.filter(c => !c.condition || c.condition());
        console.log(`年龄 ${age}: ✅ 有 ${validChoices.length} 个选项 - NPC: ${evt.npc}`);
    } else {
        const def = generateDefaultEvent(age);
        console.log(`年龄 ${age}: 🔄 使用默认事件 - NPC: ${def.npc}, ${def.choices.length} 个选项`);
    }
}
