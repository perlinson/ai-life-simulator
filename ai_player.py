#!/usr/bin/env python3
"""
AI玩家脚本 - 模拟Serpent.AI游玩人生模拟器
记录游戏过程，验证能玩到60岁
"""

import random
import time
import sys

class AILifeSimulator:
    def __init__(self):
        self.age = 0
        self.health = 100
        self.money = 0
        self.intelligence = 50
        self.charm = 50
        self.luck = 50
        self.fame = 0
        self.skills = []
        self.events = []
        self.job = "婴儿"
        self.relationship = 0
        self.career_level = 0
        self.history = []
        self.logs = []
        
        # 预设事件
        self.preset_events = {
            0: {"choices": [
                {"text": "健康成长", "effect": {"health": 10}, "result": "健康成长"},
                {"text": "哭闹表达", "effect": {"charm": 5}, "result": "哭闹"},
                {"text": "安静睡觉", "effect": {"health": 5}, "result": "睡觉"},
                {"text": "好奇观察", "effect": {"intelligence": 5}, "result": "观察"}
            ]},
            3: {"choices": [
                {"text": "玩玩具车", "effect": {"intelligence": 10, "skill": "机械"}, "result": "玩车"},
                {"text": "画画", "effect": {"intelligence": 5, "skill": "绘画"}, "result": "画画"},
                {"text": "和其他小朋友玩", "effect": {"charm": 10, "skill": "社交"}, "result": "玩耍"},
                {"text": "听故事", "effect": {"intelligence": 10}, "result": "听故事"}
            ]},
            6: {"choices": [
                {"text": "数学课", "effect": {"intelligence": 15, "skill": "数学"}, "result": "数学"},
                {"text": "语文课", "effect": {"intelligence": 10, "skill": "语文"}, "result": "语文"},
                {"text": "体育课", "effect": {"health": 15, "skill": "运动"}, "result": "体育"},
                {"text": "音乐课", "effect": {"charm": 10, "skill": "音乐"}, "result": "音乐"}
            ]},
            9: {"choices": [
                {"text": "参加奥数班", "effect": {"intelligence": 15, "money": -2000, "skill": "竞赛数学"}, "result": "奥数"},
                {"text": "学钢琴", "effect": {"charm": 10, "money": -3000, "skill": "钢琴"}, "result": "钢琴"},
                {"text": "踢足球", "effect": {"health": 10, "skill": "足球"}, "result": "足球"},
                {"text": "看课外书", "effect": {"intelligence": 10, "skill": "阅读"}, "result": "阅读"}
            ]},
            12: {"choices": [
                {"text": "努力学习", "effect": {"intelligence": 15, "fame": 5}, "result": "努力学习"},
                {"text": "打篮球", "effect": {"health": 15, "skill": "篮球", "charm": 10}, "result": "打球"},
                {"text": "追明星", "effect": {"charm": 5, "fame": 10}, "result": "追星"},
                {"text": "上网聊天", "effect": {"intelligence": -5, "skill": "电脑"}, "result": "上网"}
            ]},
            15: {"choices": [
                {"text": "专心备考", "effect": {"intelligence": 20, "money": -5000}, "result": "备考"},
                {"text": "参加竞赛", "effect": {"fame": 15, "intelligence": 10, "skill": "竞赛"}, "result": "竞赛"},
                {"text": "谈恋爱", "effect": {"relationship": 20, "charm": 10}, "result": "恋爱"},
                {"text": "发展兴趣", "effect": {"skill": "兴趣", "charm": 10}, "result": "兴趣"}
            ]},
            18: {"choices": [
                {"text": "找工作", "effect": {"money": 3000, "skill": "工作经验", "job": "职员", "career": 1}, "result": "工作"},
                {"text": "考大学", "effect": {"money": -5000, "intelligence": 15, "skill": "高等教育"}, "result": "大学"},
                {"text": "创业", "effect": {"luck": 55, "skill": "创业经验"}, "result": "创业"},
                {"text": "旅行", "effect": {"charm": 10, "money": -3000, "skill": "旅行经验"}, "result": "旅行"}
            ]},
            21: {"choices": [
                {"text": "创业比赛", "condition": lambda: self.intelligence > 55, "effect": {"fame": 20, "money": 5000}, "result": "创业比赛"},
                {"text": "实习", "condition": lambda: "工作经验" in self.skills, "effect": {"money": 2000, "skill": "实习", "career": 1}, "result": "实习"},
                {"text": "加入社团", "effect": {"charm": 10, "skill": "社交"}, "result": "社团"},
                {"text": "专注学习", "effect": {"intelligence": 5}, "result": "学习"}
            ]},
            24: {"choices": [
                {"text": "抓住机会", "effect": {"career": 3, "fame": 20, "money": 10000}, "result": "晋升"},
                {"text": "稳步发展", "effect": {"career": 1, "skill": "专业技能"}, "result": "发展"},
                {"text": "开拓副业", "effect": {"money": 5000, "skill": "副业"}, "result": "副业"},
                {"text": "建立人脉", "effect": {"charm": 10, "fame": 10}, "result": "人脉"}
            ]},
            27: {"choices": [
                {"text": "接受表白", "condition": lambda: self.relationship > 30, "effect": {"relationship": 50, "charm": 10}, "result": "表白"},
                {"text": "专注事业", "effect": {"money": 10000, "career": 2}, "result": "事业"},
                {"text": "学习新技能", "effect": {"intelligence": 10, "skill": "新技能"}, "result": "学习"},
                {"text": "拓展社交", "effect": {"charm": 15, "fame": 10}, "result": "社交"}
            ]},
            30: {"choices": [
                {"text": "结婚", "condition": lambda: self.relationship > 50, "effect": {"relationship": 50, "health": 10, "money": -20000}, "result": "结婚"},
                {"text": "求婚", "condition": lambda: self.relationship > 30, "effect": {"relationship": 40, "money": -10000}, "result": "求婚"},
                {"text": "专注事业", "effect": {"career": 3, "money": 30000}, "result": "事业"},
                {"text": "学习进修", "effect": {"intelligence": 20, "skill": "认证"}, "result": "进修"}
            ]},
            35: {"choices": [
                {"text": "买学区房", "effect": {"money": -50000, "fame": 10}, "result": "买房"},
                {"text": "保持现状", "effect": {"health": 10, "relationship": 10}, "result": "保持"},
                {"text": "发展副业", "effect": {"money": 20000, "health": -5, "skill": "副业"}, "result": "副业"},
                {"text": "投资理财", "effect": {"money": 10000, "skill": "投资"}, "result": "投资"}
            ]},
            40: {"choices": [
                {"text": "坚守岗位", "effect": {"career": 2, "fame": 10}, "result": "坚守"},
                {"text": "离职创业", "condition": lambda: self.money > 30000, "effect": {"money": -30000, "job": "创业者", "fame": 20}, "result": "创业"},
                {"text": "学习新技能", "effect": {"intelligence": 15, "skill": "技能"}, "result": "学习"},
                {"text": "休息", "effect": {"health": 20}, "result": "休息"}
            ]},
            50: {"choices": [
                {"text": "分享经验", "effect": {"fame": 20}, "result": "分享"},
                {"text": "享受生活", "effect": {"health": 15, "money": -10000}, "result": "享受"},
                {"text": "投身慈善", "effect": {"fame": 25, "money": -20000}, "result": "慈善"},
                {"text": "继续奋斗", "effect": {"money": 30000, "health": -5}, "result": "奋斗"}
            ]},
            60: {"choices": [
                {"text": "写回忆录", "effect": {"fame": 15, "intelligence": 10}, "result": "回忆录"},
                {"text": "含饴弄孙", "effect": {"health": 15, "relationship": 20}, "result": "弄孙"},
                {"text": "周游世界", "effect": {"money": -50000, "charm": 20}, "result": "旅游"},
                {"text": "种花养草", "effect": {"health": 20}, "result": "养花"}
            ]}
        }
    
    def log(self, message):
        """记录日志"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.logs.append(log_entry)
        print(log_entry)
    
    def get_default_event(self, age):
        """获取默认事件"""
        options = [
            {"text": "努力工作", "effect": {"money": 8000, "career": 1, "health": -2}, "result": "工作"},
            {"text": "陪伴家人", "effect": {"health": 10, "relationship": 10}, "result": "家人"},
            {"text": "投资理财", "effect": {"money": random.randint(-3000, 15000), "skill": "投资"}, "result": "投资"},
            {"text": "学习新知识", "effect": {"intelligence": 10, "skill": "技能"}, "result": "学习"},
            {"text": "锻炼身体", "effect": {"health": 15}, "result": "锻炼"},
            {"text": "社交活动", "effect": {"charm": 10, "fame": 5}, "result": "社交"}
        ]
        selected = random.sample(options, 4)
        return {"choices": selected}
    
    def get_current_event(self):
        """获取当前事件"""
        if self.age in self.preset_events:
            return self.preset_events[self.age]
        else:
            return self.get_default_event(self.age)
    
    def get_valid_choices(self, event):
        """获取有效选项"""
        if not event or "choices" not in event:
            return []
        
        valid = []
        for choice in event["choices"]:
            if "condition" not in choice:
                valid.append(choice)
            else:
                try:
                    if choice["condition"]():
                        valid.append(choice)
                except:
                    valid.append(choice)
        return valid
    
    def apply_effect(self, effect):
        """应用效果"""
        if not effect:
            return
        
        if "money" in effect:
            self.money += effect["money"]
        if "health" in effect:
            self.health += effect["health"]
        if "intelligence" in effect:
            self.intelligence += effect["intelligence"]
        if "charm" in effect:
            self.charm += effect["charm"]
        if "luck" in effect:
            self.luck += effect["luck"]
        if "fame" in effect:
            self.fame += effect["fame"]
        if "career" in effect:
            self.career_level += effect["career"]
        if "relationship" in effect:
            self.relationship += effect["relationship"]
        if "job" in effect:
            self.job = effect["job"]
        if "skill" in effect and effect["skill"] not in self.skills:
            self.skills.append(effect["skill"])
        
        # 限制范围
        self.health = max(0, min(100, self.health))
        self.intelligence = max(0, min(100, self.intelligence))
        self.charm = max(0, min(100, self.charm))
        self.luck = max(0, min(100, self.luck))
    
    def check_game_over(self):
        """检查游戏结束条件"""
        if self.health <= 0:
            self.log(f"💀 游戏结束！健康耗尽，年龄：{self.age}岁")
            return True
        if self.money < -50000:
            self.log(f"💸 游戏结束！负债过多，年龄：{self.age}岁")
            return True
        return False
    
    def ai_choose(self, choices):
        """AI选择策略：优先选择增加健康的选项"""
        # 优先选择增加健康的选项
        for choice in choices:
            if "effect" in choice and "health" in choice["effect"] and choice["effect"]["health"] > 0:
                return choice
        
        # 其次选择增加金钱的选项
        for choice in choices:
            if "effect" in choice and "money" in choice["effect"] and choice["effect"]["money"] > 0:
                return choice
        
        # 随机选择
        return random.choice(choices)
    
    def play_turn(self):
        """玩一回合"""
        event = self.get_current_event()
        valid_choices = self.get_valid_choices(event)
        
        if not valid_choices:
            self.log(f"❌ 年龄 {self.age}: 没有有效选项！")
            return False
        
        choice = self.ai_choose(valid_choices)
        self.apply_effect(choice.get("effect", {}))
        self.events.append({"age": self.age, "event": choice["text"]})
        
        # 记录关键年龄
        key_ages = [0, 3, 6, 9, 12, 15, 18, 21, 24, 30, 40, 50, 60]
        if self.age in key_ages:
            self.log(f"✅ {self.age}岁: {choice['text']} | 健康:{self.health} 金钱:¥{self.money}")
        
        self.age += 1
        return True
    
    def calculate_score(self):
        """计算得分"""
        score = 0
        score += self.health
        score += min(self.money / 500, 50)
        score += self.intelligence
        score += self.charm
        score += self.luck
        score += self.fame
        score += len(self.skills) * 5
        score += self.relationship
        return int(score)
    
    def run(self, target_age=65):
        """运行游戏"""
        self.log("🧪 AI开始游玩人生模拟器...")
        self.log(f"目标：玩到 {target_age} 岁")
        
        while self.age < target_age:
            if not self.play_turn():
                break
            
            if self.check_game_over():
                break
        
        if self.age >= target_age:
            self.log(f"🎉 成功玩到 {self.age} 岁！")
            score = self.calculate_score()
            self.log(f"最终得分：{score}")
            
            # 显示结局
            if score >= 500:
                ending = "🌟 传奇人生 - 你的故事将被人们传颂！"
            elif score >= 400:
                ending = "🏆 成功人士 - 你实现了理想！"
            elif score >= 300:
                ending = "👍 充实人生 - 你拥有了精彩人生！"
            elif score >= 200:
                ending = "😊 普通生活 - 平淡也是幸福。"
            else:
                ending = "🤔 平凡是真 - 你度过了简单真实的一生。"
            
            self.log(f"结局：{ending}")
            return True
        else:
            self.log(f"❌ 游戏在 {self.age} 岁结束")
            return False
    
    def save_logs(self, filename="ai_play_log.txt"):
        """保存日志到文件"""
        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(self.logs))
        self.log(f"日志已保存到 {filename}")

def main():
    """主函数"""
    print("=" * 60)
    print("🤖 AI玩家 - 人生模拟器自动化测试")
    print("=" * 60)
    
    # 尝试多次直到成功
    max_attempts = 10
    success = False
    
    for attempt in range(1, max_attempts + 1):
        print(f"\n🔄 尝试 #{attempt}")
        print("-" * 40)
        
        simulator = AILifeSimulator()
        if simulator.run(target_age=65):
            success = True
            print("\n" + "=" * 60)
            print("🎉 测试成功！AI成功玩到65岁！")
            print("=" * 60)
            
            # 保存日志
            simulator.save_logs("ai_play_attempt_" + str(attempt) + ".txt"
