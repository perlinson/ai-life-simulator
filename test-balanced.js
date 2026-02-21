// 改进版测试 - 更平衡的游戏逻辑
var gameState = { age: 0, health: 100, money: 0, intelligence: 50, charm: 50, luck: 50, fame: 0, skills: [], events: [], job: "婴儿", relationship: 0, careerLevel: 0, history: [] };

var events = {
    0: { choices: [{ text: "健康成长", effect: { health: 10 }, result: "健康成长" }, { text: "哭闹表达", effect: { charm: 5 }, result: "哭闹" }, { text: "安静睡觉", effect: { health: 5 }, result: "睡觉" }, { text: "好奇观察", effect: { intelligence: 5 }, result: "观察" }]},
    3: { choices: [{ text: "玩玩具车", effect: { intelligence: 10, skill: "机械" }, result: "玩车" }, { text: "画画", effect: { intelligence: 5, skill: "绘画" }, result: "画画" }, { text: "和其他小朋友玩", effect: { charm: 10, skill: "社交" }, result: "玩耍" }, { text: "听故事", effect: { intelligence: 10 }, result: "听故事" }]},
    6: { choices: [{ text: "数学课", effect: { intelligence: 15, skill: "数学" }, result: "数学" }, { text: "语文课", effect: { intelligence: 10, skill: "语文" }, result: "语文" }, { text: "体育课", effect: { health: 15, skill: "运动" }, result: "体育" }, { text: "音乐课", effect: { charm: 10, skill: "music" }, result: "音乐" }]},
    9: { choices: [{ text: "参加奥数班", effect: { intelligence: 15, money: -2000, skill: "竞赛数学" }, result: "奥数" }, { text: "学钢琴", effect: { charm: 10, money: -3000, skill: "钢琴" }, result: "钢琴" }, { text: "踢足球", effect: { health: 10, skill: "足球" }, result: "足球" }, { text: "看课外书", effect: { intelligence: 10, skill: "阅读" }, result: "阅读" }]},
    12: { choices: [{ text: "努力学习", effect: { intelligence: 15, fame: 5 }, result: "努力学习" }, { text: "打篮球", effect: { health: 15, skill: "篮球", charm: 10 }, result: "打球" }, { text: "追明星", effect: { charm: 5, fame: 10 }, result: "追星" }, { text: "上网聊天", effect: { intelligence: -5, skill: "电脑" }, result: "上网" }]},
    15: { choices: [{ text: "专心备考", effect: { intelligence: 20, money: -5000 }, result: "备考" }, { text: "参加竞赛", effect: { fame: 15, intelligence: 10, skill: "竞赛" }, result: "竞赛" }, { text: "谈恋爱", effect: { relationship: 20, charm: 10 }, result: "恋爱" }, { text: "发展兴趣", effect: { skill: "兴趣", charm: 10 }, result: "兴趣" }]},
    18: { choices: [{ text: "找工作", effect: { money: 3000, skill: "工作经验", job: "职员", career: 1 }, result: "工作" }, { text: "考大学", effect: { money: -5000, intelligence: 15, skill: "高等教育" }, result: "大学" }, { text: "创业", effect: { luck: 55, skill: "创业经验" }, result: "创业" }, { text: "旅行", effect: { charm: 10, money: -3000, skill: "旅行经验" }, result: "旅行" }]},
    21: { choices: [{ text: "创业比赛", condition: function() { return gameState.intelligence > 55; }, effect: { fame: 20, money: 5000 }, result: "创业比赛" }, { text: "实习", condition: function() { return gameState.skills.indexOf('工作经验') !== -1; }, effect: { money: 2000, skill: "实习", career: 1 }, result: "实习" }, { text: "加入社团", effect: { charm: 10, skill: "社交" }, result: "社团" }, { text: "专注学习", effect: { intelligence: 5 }, result: "学习" }]},
    24: { choices: [{ text: "抓住机会", effect: { career: 3, fame: 20, money: 10000 }, result: "晋升" }, { text: "稳步发展", effect: { career: 1, skill: "专业技能" }, result: "发展" }, { text: "开拓副业", effect: { money: 5000, skill: "副业" }, result: "副业" }, { text: "建立人脉", effect: { charm: 10, fame: 10 }, result: "人脉" }]},
    27: { choices: [{ text: "接受表白", condition: function() { return gameState.relationship > 30; }, effect: { relationship: 50, charm: 10 }, result: "表白" }, { text: "专注事业", effect: { money: 10000, career: 2 }, result: "事业" }, { text: "学习新技能", effect: { intelligence: 10, skill: "新技能" }, result: "学习" }, { text: "拓展社交", effect: { charm: 15, fame: 10 }, result: "社交" }]},
    30: { choices: [{ text: "结婚", condition: function() { return gameState.relationship > 50; }, effect: { relationship: 50, health: 10, money: -20000 }, result: "结婚" }, { text: "求婚", condition: function() { return gameState.relationship > 30; }, effect: { relationship: 40, money: -10000 }, result: "求婚" }, { text: "专注事业", effect: { career: 3, money: 30000 }, result: "事业" }, { text: "学习进修", effect: { intelligence: 20, skill: "认证" }, result: "进修" }]},
    35: { choices: [{ text: "买学区房", effect: { money: -50000, fame: 10 }, result: "买房" }, { text: "保持现状", effect: { health: 10, relationship: 10 }, result: "保持" }, { text: "发展副业", effect: { money: 20000, health: -5, skill: "副业" }, result: "副业" }, { text: "投资理财", effect: { money: 10000, skill: "投资" }, result: "投资" }]},
    40: { choices: [{ text: "坚守岗位", effect: { career: 2, fame: 10 }, result: "坚守" }, { text: "离职创业", condition: function() { return gameState.money > 30000; }, effect: { money: -30000, job: "创业者", fame: 20 }, result: "创业" }, { text: "学习新技能", effect: { intelligence: 15, skill: "技能" }, result: "学习" }, { text: "休息", effect: { health: 20 }, result: "休息" }]},
    50: { choices: [{ text: "分享经验", effect: { fame: 20 }, result: "分享" }, { text: "享受生活", effect: { health: 15, money: -10000 }, result: "享受" }, { text: "投身慈善", effect: { fame: 25, money: -20000 }, result: "慈善" }, { text: "继续奋斗", effect: { money: 30000, health: -5 }, result: "奋斗" }]},
    60: { choices: [{ text: "写回忆录", effect: { fame: 15, intelligence: 10 }, result: "回忆录" }, { text: "含饴弄孙", effect: { health: 15, relationship: 20 }, result: "弄孙" }, { text: "周游世界", effect: { money: -50000, charm: 20 }, result: "旅游" }, { text: "种花养草", effect: { health: 20 }, result: "养花" }]}
};

function getDefaultEvent(age) {
    // 更平衡的默认事件
    var options = [
        { text: "努力工作", effect: { money: 8000, career: 1, health: -2 }, result: "工作" },
        { text: "陪伴家人", effect: { health: 10, relationship: 10 }, result: "家人" },
        { text: "投资理财", effect: { money: Math.floor(Math.random() * 15000 - 3000), skill: "投资" }, result: "投资" },
        { text: "学习新知识", effect: { intelligence: 10, skill: "技能" }, result: "学习" },
        { text: "锻炼身体", effect: { health: 15 }, result: "锻炼" },
        { text: "社交活动", effect: { charm: 10, fame: 5 }, result: "社交" }
    ];
    // 随机选择4个选项
    var selected = [];
    for (var i = 0; i < 4; i++) {
        selected.push(options[Math.floor(Math.random() * options.length)]);
    }
    return { choices: selected };
}

function getCurrentEvent() {
    return events[gameState.age] || getDefaultEvent(gameState.age);
}

function getValidChoices(evt) {
    if (!evt || !evt.choices) return [];
    return evt.choices.filter(function(c) {
        if (!c.condition) return true;
        try { return c.condition(); } catch(e) { return true; }
    });
}

function applyEffect(effect) {
    if (!effect) return;
    if (effect.money) gameState.money += effect.money;
    if (effect.health) gameState.health += effect.health;
    if (effect.intelligence) gameState.intelligence += effect.intelligence;
    if (effect.charm) gameState.charm += effect.charm;
    if (effect.luck) gameState.luck += effect.luck;
    if (effect.fame) gameState.fame += effect.fame;
    if (effect.career) gameState.careerLevel += effect.career;
    if (effect.relationship) gameState.relationship += effect.relationship;
    if (effect.job) gameState.job = effect.job;
    if (effect.skill && gameState.skills.indexOf(effect.skill) === -1) gameState.skills.push(effect.skill);
    gameState.health = Math.max(0, Math.min(100, gameState.health));
    gameState.intelligence = Math.max(0, Math.min(100, gameState.intelligence));
    gameState.charm = Math.max(0, Math.min(100, gameState.charm));
    gameState.luck = Math.max(0, Math.min(100, gameState.luck));
}

console.log("🧪 开始测试人生模拟器（改进版）...\n");

var logs = [];

while (gameState.age < 65) {
    var evt = getCurrentEvent();
    var validChoices = getValidChoices(evt);
    
    if (validChoices.length === 0) {
        logs.push("❌ 年龄 " + gameState.age + ": 没有有效选项！");
        break;
    }
    
    // 智能选择：优先选择增加健康的选项
    var choice = validChoices[0];
    for (var i = 0; i < validChoices.length; i++) {
        if (validChoices[i].effect && validChoices[i].effect.health > 0) {
            choice = validChoices[i];
            break;
        }
    }
    
    applyEffect(choice.effect);
    gameState.events.push({ age: gameState.age, event: choice.text });
    
    // 检查游戏结束
    if (gameState.health <= 0) {
        logs.push("💀 年龄 " + gameState.age + ": 健康耗尽！");
        break;
    }
    if (gameState.money < -50000) {
        logs.push("💸 年龄 " + gameState.age + ": 负债过多！");
        break;
    }
    
    var oldAge = gameState.age;
    gameState.age++;
    
    // 记录关键年龄
    if (oldAge === 0 || oldAge === 3 || oldAge === 6 || oldAge === 9 || oldAge === 12 || 
        oldAge === 15 || oldAge === 18 || oldAge === 21 || oldAge === 24 || oldAge === 30 || 
        oldAge === 40 || oldAge === 50 || oldAge === 60) {
        logs.push("✅ " + oldAge + " → " + gameState.age + "岁: " + choice.text + " | 健康:" + gameState.health + " 金钱:¥" + gameState.money);
    }
}

if (gameState.age >= 65) {
    console.log("🎉 测试通过！成功玩到 " + gameState.age + " 岁！");
    console.log("\n关键节点记录:");
    logs.forEach(function(log) { console.log(log); });
    console.log("\n最终状态:");
    console.log("  年龄: " + gameState.age + "岁");
    console.log("  健康: " + gameState.health);
    console.log("  金钱: ¥" + gameState.money);
    console.log("  智力: " + gameState.intelligence);
    console.log("  魅力: " + gameState.charm);
    console.log("  技能: " + gameState.skills.join(", "));
} else {
    console.log("❌ 测试失败！游戏在 " + gameState.age + " 岁结束");
    logs.forEach(function(log) { console.log(log); });
}
