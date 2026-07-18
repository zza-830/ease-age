import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 生成过去N天的日期
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function hoursAgo(n: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d;
}

async function main() {
  console.log('🌱 Seeding database...');

  // 清理旧数据
  console.log('  🧹 Cleaning existing data...');
  await prisma.communityComment.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.healthAlert.deleteMany();
  await prisma.medicationReminder.deleteMany();
  await prisma.dailyCheckin.deleteMany();
  await prisma.moodRecord.deleteMany();
  await prisma.voiceMemo.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.kgEdge.deleteMany();
  await prisma.kgNode.deleteMany();
  await prisma.dailyRoutine.deleteMany();
  await prisma.importantDate.deleteMany();
  await prisma.aiConversationLog.deleteMany();
  await prisma.lifeEvent.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.videoCallRecord.deleteMany();
  await prisma.familyMemory.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.knowledgeCategory.deleteMany();
  await prisma.medicalCheckup.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.familyRelation.deleteMany();
  await prisma.elderlyProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 12);

  // ─── 用户 ───
  const adminUser = await prisma.user.create({
    data: { phoneNumber: '13800000000', password: passwordHash, fullName: '系统管理员', role: 'admin' },
  });

  const elderlyUser = await prisma.user.create({
    data: { phoneNumber: '13800000001', password: passwordHash, fullName: '张秀兰', role: 'elderly' },
  });

  const familyUser1 = await prisma.user.create({
    data: { phoneNumber: '13800000002', password: passwordHash, fullName: '张伟', role: 'family' },
  });

  const familyUser2 = await prisma.user.create({
    data: { phoneNumber: '13800000004', password: passwordHash, fullName: '张丽', role: 'family' },
  });

  const staffUser = await prisma.user.create({
    data: { phoneNumber: '13800000003', password: passwordHash, fullName: '王秀英', role: 'staff' },
  });

  const elderlyUser2 = await prisma.user.create({
    data: { phoneNumber: '13800000005', password: passwordHash, fullName: '李大爷', role: 'elderly' },
  });

  // ─── 老人档案 ───
  const elderlyProfile = await prisma.elderlyProfile.create({
    data: {
      userId: elderlyUser.id,
      fullName: '张秀兰',
      gender: 'female',
      birthDate: new Date('1948-03-15'),
      residentialAddress: '广州市天河区幸福花园小区3栋502',
      emergencyContactPhone: '13800000002',
      bloodType: 'A',
    },
  });

  const elderlyProfile2 = await prisma.elderlyProfile.create({
    data: {
      userId: elderlyUser2.id,
      fullName: '李建国',
      gender: 'male',
      birthDate: new Date('1942-08-20'),
      residentialAddress: '广州市天河区幸福花园小区5栋301',
      emergencyContactPhone: '13800000004',
      bloodType: 'O',
    },
  });

  // ─── 家属关系 ───
  await prisma.familyRelation.create({
    data: { userId: familyUser1.id, elderlyProfileId: elderlyProfile.id, relationshipType: '儿子', isPrimaryContact: true },
  });
  await prisma.familyRelation.create({
    data: { userId: familyUser2.id, elderlyProfileId: elderlyProfile.id, relationshipType: '女儿', isPrimaryContact: false },
  });
  await prisma.familyRelation.create({
    data: { userId: familyUser1.id, elderlyProfileId: elderlyProfile2.id, relationshipType: '侄子', isPrimaryContact: false },
  });

  // ─── 健康记录（30天数据） ───
  console.log('  📊 Creating health records...');
  for (let i = 0; i < 30; i++) {
    const date = daysAgo(i);
    const baseSys = 125 + Math.floor(Math.random() * 10) - 5;
    const baseDia = 80 + Math.floor(Math.random() * 8) - 4;

    await prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_pressure',
        measurementValueJson: JSON.stringify({ systolic: baseSys, diastolic: baseDia }),
        measurementUnit: 'mmHg',
        measuredAt: date,
      },
    });
    await prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'heart_rate',
        measurementValueJson: JSON.stringify({ value: 68 + Math.floor(Math.random() * 10) }),
        measurementUnit: 'bpm',
        measuredAt: date,
      },
    });
    await prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_sugar',
        measurementValueJson: JSON.stringify({ value: +(5.5 + Math.random() * 0.8).toFixed(1) }),
        measurementUnit: 'mmol/L',
        measuredAt: date,
      },
    });
    if (i % 3 === 0) {
      await prisma.healthRecord.create({
        data: {
          elderlyProfileId: elderlyProfile.id,
          recordType: 'body_temperature',
          measurementValueJson: JSON.stringify({ value: +(36.2 + Math.random() * 0.6).toFixed(1) }),
          measurementUnit: '°C',
          measuredAt: date,
        },
      });
      await prisma.healthRecord.create({
        data: {
          elderlyProfileId: elderlyProfile.id,
          recordType: 'blood_oxygen',
          measurementValueJson: JSON.stringify({ value: 96 + Math.floor(Math.random() * 4) }),
          measurementUnit: '%',
          measuredAt: date,
        },
      });
      await prisma.healthRecord.create({
        data: {
          elderlyProfileId: elderlyProfile.id,
          recordType: 'weight',
          measurementValueJson: JSON.stringify({ value: +(64 + Math.random() * 1.5 - 0.75).toFixed(1) }),
          measurementUnit: 'kg',
          measuredAt: date,
        },
      });
    }
  }

  // ─── 用药记录 ───
  console.log('  💊 Creating medications...');
  const med1 = await prisma.medication.create({
    data: {
      elderlyProfileId: elderlyProfile.id,
      medicationName: '苯磺酸氨氯地平片',
      dosageDescription: '5mg/1片',
      frequencyDescription: '每日一次，早晨服用',
      startDate: new Date('2024-01-01'),
      reminderScheduleJson: JSON.stringify(['08:00']),
    },
  });
  const med2 = await prisma.medication.create({
    data: {
      elderlyProfileId: elderlyProfile.id,
      medicationName: '二甲双胍缓释片',
      dosageDescription: '0.5g/1片',
      frequencyDescription: '每日两次，早晚服用',
      startDate: new Date('2024-03-15'),
      reminderScheduleJson: JSON.stringify(['08:00', '20:00']),
    },
  });
  const med3 = await prisma.medication.create({
    data: {
      elderlyProfileId: elderlyProfile.id,
      medicationName: '碳酸钙D3片',
      dosageDescription: '1片',
      frequencyDescription: '每日一次，晚间服用',
      startDate: new Date('2025-01-01'),
      reminderScheduleJson: JSON.stringify(['20:00']),
    },
  });

  // ─── 体检记录 ───
  console.log('  🏥 Creating checkups...');
  await prisma.medicalCheckup.create({
    data: {
      elderlyProfileId: elderlyProfile.id,
      hospitalName: '广州市中心医院',
      checkupDate: daysAgo(90),
      summaryText: '整体健康状况良好，血压略偏高，建议继续服药控制。血糖正常范围内。骨密度检查显示轻度骨质疏松，建议补钙。',
      resultsJson: JSON.stringify({
        bloodPressure: '130/85 mmHg（偏高）',
        bloodSugar: '5.8 mmol/L（正常）',
        cholesterol: '4.5 mmol/L（正常）',
        boneDensity: 'T值 -1.8（轻度骨质疏松）',
        ecg: '正常心电图',
      }),
    },
  });
  await prisma.medicalCheckup.create({
    data: {
      elderlyProfileId: elderlyProfile.id,
      hospitalName: '广州市中心医院',
      checkupDate: daysAgo(365),
      summaryText: '年度体检，各项指标基本正常。',
      resultsJson: JSON.stringify({
        bloodPressure: '126/80 mmHg',
        bloodSugar: '5.6 mmol/L',
        liverFunction: '正常',
        kidneyFunction: '正常',
      }),
    },
  });

  // ─── 服务分类与服务 ───
  console.log('  🛠️ Creating services...');
  const cat1 = await prisma.serviceCategory.create({ data: { categoryName: '家政服务', iconIdentifier: 'home', displayOrder: 1 } });
  const cat2 = await prisma.serviceCategory.create({ data: { categoryName: '送餐服务', iconIdentifier: 'utensils', displayOrder: 2 } });
  const cat3 = await prisma.serviceCategory.create({ data: { categoryName: '陪诊服务', iconIdentifier: 'hospital', displayOrder: 3 } });
  const cat4 = await prisma.serviceCategory.create({ data: { categoryName: '维修服务', iconIdentifier: 'wrench', displayOrder: 4 } });
  const cat5 = await prisma.serviceCategory.create({ data: { categoryName: '健康咨询', iconIdentifier: 'heart', displayOrder: 5 } });
  const cat6 = await prisma.serviceCategory.create({ data: { categoryName: '理发服务', iconIdentifier: 'scissors', displayOrder: 6 } });

  const svc1 = await prisma.service.create({ data: { categoryId: cat1.id, serviceName: '日常保洁', descriptionText: '专业保洁人员上门服务，包含客厅、卧室、厨房、卫生间清洁', basePrice: 80, priceUnit: '次' } });
  const svc2 = await prisma.service.create({ data: { categoryId: cat2.id, serviceName: '营养送餐', descriptionText: '营养师搭配的每日三餐，荤素搭配，健康美味', basePrice: 25, priceUnit: '餐' } });
  const svc3 = await prisma.service.create({ data: { categoryId: cat3.id, serviceName: '医院陪诊', descriptionText: '专业陪诊人员陪同就医，排队挂号、取药、检查陪同', basePrice: 200, priceUnit: '次' } });
  const svc4 = await prisma.service.create({ data: { categoryId: cat4.id, serviceName: '家电维修', descriptionText: '各类家电维修保养，空调、洗衣机、电视等', basePrice: 50, priceUnit: '次' } });
  const svc5 = await prisma.service.create({ data: { categoryId: cat5.id, serviceName: '在线健康咨询', descriptionText: '专业医生在线健康咨询，解答健康疑问', basePrice: 30, priceUnit: '次' } });
  const svc6 = await prisma.service.create({ data: { categoryId: cat6.id, serviceName: '上门理发', descriptionText: '专业理发师上门服务，方便快捷', basePrice: 40, priceUnit: '次' } });

  // ─── 服务订单 ───
  console.log('  📋 Creating service orders...');
  const orders = [
    { serviceId: svc1.id, status: 'completed', daysAgo: 25, price: 80, rating: 5, review: '打扫得很干净，非常满意！' },
    { serviceId: svc2.id, status: 'completed', daysAgo: 20, price: 75, rating: 5, review: '饭菜可口，营养搭配很好' },
    { serviceId: svc3.id, status: 'completed', daysAgo: 15, price: 200, rating: 4, review: '陪诊很细心，排队帮了很多忙' },
    { serviceId: svc6.id, status: 'completed', daysAgo: 10, price: 40, rating: 5, review: '手艺不错，很耐心' },
    { serviceId: svc2.id, status: 'completed', daysAgo: 7, price: 50, rating: 5, review: '' },
    { serviceId: svc4.id, status: 'completed', daysAgo: 5, price: 120, rating: 4, review: '空调修好了，制冷正常' },
    { serviceId: svc5.id, status: 'completed', daysAgo: 3, price: 30, rating: 5, review: '医生很专业，解答很详细' },
    { serviceId: svc2.id, status: 'in_progress', daysAgo: 0, price: 25, rating: null, review: null },
    { serviceId: svc1.id, status: 'pending', daysAgo: 0, price: 80, rating: null, review: null },
  ];

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    await prisma.serviceOrder.create({
      data: {
        orderNumber: `EA${Date.now().toString(36)}${i}`.toUpperCase(),
        userId: elderlyUser.id,
        elderlyProfileId: elderlyProfile.id,
        serviceId: order.serviceId,
        orderStatus: order.status,
        totalAmount: order.price,
        scheduledServiceTime: daysAgo(order.daysAgo),
        serviceAddress: elderlyProfile.residentialAddress,
        customerRating: order.rating,
        reviewText: order.review,
      },
    });
  }

  // ─── 知识库 ───
  console.log('  📚 Creating knowledge base...');
  const kCat1 = await prisma.knowledgeCategory.create({ data: { categoryName: '健康养生', iconIdentifier: 'heart', displayOrder: 1 } });
  const kCat2 = await prisma.knowledgeCategory.create({ data: { categoryName: '疾病预防', iconIdentifier: 'shield', displayOrder: 2 } });
  const kCat3 = await prisma.knowledgeCategory.create({ data: { categoryName: '心理关怀', iconIdentifier: 'brain', displayOrder: 3 } });
  const kCat4 = await prisma.knowledgeCategory.create({ data: { categoryName: '生活常识', iconIdentifier: 'book', displayOrder: 4 } });
  const kCat5 = await prisma.knowledgeCategory.create({ data: { categoryName: '运动健身', iconIdentifier: 'activity', displayOrder: 5 } });

  const articles = [
    { catId: kCat1.id, title: '老年人高血压饮食指南', summary: '了解如何通过饮食控制血压，保持健康', author: '张医生', content: '# 高血压饮食指南\n\n## 低盐饮食\n\n每日食盐摄入量应控制在6克以下。\n\n## 多吃蔬果\n\n新鲜蔬菜和水果富含钾、镁等矿物质。\n\n## 适量蛋白质\n\n选择优质蛋白质，如鱼类、豆制品、瘦肉等。' },
    { catId: kCat1.id, title: '夏季老年人养生要点', summary: '防暑降温、饮食调理建议', author: '赵营养师', content: '# 夏季养生\n\n避免中午11-15点外出，多喝水，少量多次。' },
    { catId: kCat1.id, title: '老年人补钙的重要性', summary: '骨质疏松预防与补钙方法', author: '刘医生', content: '# 补钙指南\n\n老年人每日钙需求量1000-1200mg。' },
    { catId: kCat2.id, title: '糖尿病患者的日常管理', summary: '血糖监测、饮食控制和运动建议', author: '李医生', content: '# 糖尿病管理\n\n每日监测血糖2-3次，定时定量进餐。' },
    { catId: kCat2.id, title: '关节炎的预防与护理', summary: '关节保护、运动建议', author: '陈医生', content: '# 关节保护\n\n避免长时间保持同一姿势，适当运动。' },
    { catId: kCat2.id, title: '老年人跌倒预防指南', summary: '居家安全、出行安全建议', author: '王护士', content: '# 跌倒预防\n\n保持室内光线充足，地面干燥防滑。' },
    { catId: kCat3.id, title: '老年人心理健康指南', summary: '如何保持积极心态，预防抑郁', author: '王心理师', content: '# 心理健康\n\n多与家人朋友交流，培养兴趣爱好。' },
    { catId: kCat3.id, title: '如何应对孤独感', summary: '老年人社交与情感需求', author: '赵心理师', content: '# 应对孤独\n\n参加社区活动，保持社交联系。' },
    { catId: kCat4.id, title: '老年人睡眠改善方法', summary: '失眠原因分析及改善建议', author: '刘医生', content: '# 睡眠改善\n\n固定作息时间，睡前避免使用电子设备。' },
    { catId: kCat4.id, title: '老年人用药安全须知', summary: '正确服药方法与注意事项', author: '李药师', content: '# 用药安全\n\n按时按量服药，不随意增减剂量。' },
    { catId: kCat5.id, title: '适合老年人的太极拳', summary: '太极拳基本动作与健康益处', author: '陈教练', content: '# 太极拳\n\n太极拳能增强平衡能力，预防跌倒。' },
    { catId: kCat5.id, title: '老年人散步的正确方式', summary: '散步时间、强度、注意事项', author: '张教练', content: '# 散步指南\n\n每天30分钟，速度适中，注意补水。' },
  ];

  for (const article of articles) {
    await prisma.knowledgeArticle.create({
      data: {
        categoryId: article.catId,
        title: article.title,
        contentMarkdown: article.content,
        summaryText: article.summary,
        authorName: article.author,
        isPublished: true,
        publishedAt: daysAgo(Math.floor(Math.random() * 60)),
        viewCount: Math.floor(Math.random() * 2000) + 100,
      },
    });
  }

  // ─── 会话与消息 ───
  console.log('  💬 Creating conversations...');
  const conv1 = await prisma.conversation.create({
    data: { conversationType: 'private' },
  });
  await prisma.conversationMember.create({ data: { conversationId: conv1.id, userId: elderlyUser.id } });
  await prisma.conversationMember.create({ data: { conversationId: conv1.id, userId: familyUser1.id } });

  const msgs = [
    { senderId: familyUser1.id, text: '妈，今天感觉怎么样？', minsAgo: 120 },
    { senderId: elderlyUser.id, text: '挺好的，今天去公园散步了', minsAgo: 118 },
    { senderId: familyUser1.id, text: '那就好，记得按时吃药', minsAgo: 115 },
    { senderId: elderlyUser.id, text: '知道了，你工作忙也要注意身体', minsAgo: 110 },
    { senderId: familyUser1.id, text: '好的妈，周末我带孩子来看您', minsAgo: 105 },
    { senderId: elderlyUser.id, text: '好呀，我包饺子给你们吃', minsAgo: 100 },
  ];
  for (const msg of msgs) {
    await prisma.message.create({
      data: {
        conversation: { connect: { id: conv1.id } },
        sender: { connect: { id: msg.senderId } },
        messageType: 'text',
        contentText: msg.text,
        createdAt: new Date(Date.now() - msg.minsAgo * 60000),
      },
    });
  }

  // ─── 视频通话记录 ───
  console.log('  📹 Creating call records...');
  await prisma.videoCallRecord.create({
    data: {
      callerUserId: familyUser1.id,
      calleeUserId: elderlyUser.id,
      callStatus: 'ended',
      startedAt: daysAgo(3),
      endedAt: new Date(daysAgo(3).getTime() + 15 * 60000),
      durationSeconds: 900,
    },
  });
  await prisma.videoCallRecord.create({
    data: {
      callerUserId: familyUser2.id,
      calleeUserId: elderlyUser.id,
      callStatus: 'ended',
      startedAt: daysAgo(1),
      endedAt: new Date(daysAgo(1).getTime() + 22 * 60000),
      durationSeconds: 1320,
    },
  });
  await prisma.videoCallRecord.create({
    data: {
      callerUserId: elderlyUser.id,
      calleeUserId: familyUser1.id,
      callStatus: 'missed',
      startedAt: daysAgo(7),
    },
  });

  // ─── 家庭回忆 ───
  console.log('  📸 Creating family memories...');
  await prisma.familyMemory.create({
    data: {
      elderlyProfile: { connect: { id: elderlyProfile.id } },
      familyUser: { connect: { id: familyUser1.id } },
      memoryType: 'text',
      contentText: '今年过年，儿子女儿都回来了，一家人围在一起包饺子，特别开心。小孙子还帮我擀皮呢！',
      descriptionText: '过年包饺子',
      createdAt: daysAgo(120),
    },
  });
  await prisma.familyMemory.create({
    data: {
      elderlyProfile: { connect: { id: elderlyProfile.id } },
      familyUser: { connect: { id: familyUser2.id } },
      memoryType: 'text',
      contentText: '今天和邻居李阿姨一起去公园看了月季花，拍了好多照片。花开得真好看！',
      descriptionText: '公园赏花',
      createdAt: daysAgo(30),
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  //  知识图谱 (Knowledge Graph)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('  🧠 Building knowledge graph...');

  // ─── 知识图谱节点 ───
  const nodes: Record<string, any> = {};

  // 人物节点
  const personNodes = [
    { label: '张秀兰（自己）', desc: '78岁，居住在天河区幸福花园', attrs: { age: 78, gender: 'female', bloodType: 'A' }, imp: 10 },
    { label: '张伟（儿子）', desc: '在北京工作，IT工程师，每周六下午打电话', attrs: { phone: '13800000002', job: 'IT工程师', city: '北京' }, imp: 9 },
    { label: '张丽（女儿）', desc: '在本地当教师，每周三和周末来看望', attrs: { phone: '13800000004', job: '教师', city: '广州' }, imp: 9 },
    { label: '张建国（老伴）', desc: '已故，2020年因病去世，生前是工程师', attrs: { status: 'deceased', deathDate: '2020-05-12', job: '工程师' }, imp: 10 },
    { label: '张明轩（孙子）', desc: '8岁，小学二年级，最喜欢吃奶奶包的饺子', attrs: { age: 8, grade: '二年级' }, imp: 8 },
    { label: '张诗涵（孙女）', desc: '5岁，幼儿园大班，会弹钢琴', attrs: { age: 5, grade: '大班', skill: '钢琴' }, imp: 8 },
    { label: '王秀英（护工）', desc: '负责日常护理，性格温和', attrs: { phone: '13800000003' }, imp: 7 },
    { label: '李阿姨（邻居）', desc: '住隔壁楼，经常一起散步聊天', attrs: { location: '隔壁楼' }, imp: 6 },
    { label: '李大夫（主治医生）', desc: '市中心医院老年科，负责慢病管理', attrs: { hospital: '市中心医院', dept: '老年科' }, imp: 7 },
  ];

  for (const p of personNodes) {
    const n = await prisma.kgNode.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        nodeType: 'person',
        label: p.label,
        description: p.desc,
        attributesJson: JSON.stringify(p.attrs),
        importance: p.imp,
      },
    });
    nodes[p.label] = n;
  }

  // 偏好节点
  const prefNodes = [
    { label: '喜欢吃红烧肉', desc: '最拿手的菜，逢年过节必做', attrs: { category: 'food' } },
    { label: '喜欢吃饺子', desc: '过年全家一起包饺子是传统', attrs: { category: 'food' } },
    { label: '喜欢喝小米粥', desc: '每天早上必喝，养胃', attrs: { category: 'food' } },
    { label: '不喜欢吃辣', desc: '口味偏清淡', attrs: { category: 'food' } },
    { label: '喜欢听京剧', desc: '每天早上会听一段', attrs: { category: 'music' } },
    { label: '喜欢邓丽君的歌', desc: '《月亮代表我的心》是最爱', attrs: { category: 'music' } },
    { label: '喜欢养花', desc: '阳台种了月季、茉莉、绿萝', attrs: { category: 'hobby' } },
    { label: '喜欢打太极拳', desc: '每天早上在小区花园打太极', attrs: { category: 'hobby' } },
    { label: '喜欢看新闻联播', desc: '每天19:00准时收看', attrs: { category: 'tv' } },
    { label: '喜欢看养生堂', desc: '北京卫视的健康节目', attrs: { category: 'tv' } },
    { label: '喜欢红色和紫色', desc: '衣服大多偏暖色系', attrs: { category: 'color' } },
    { label: '喜欢记日记', desc: '用纸笔写，坚持了30年', attrs: { category: 'habit' } },
  ];

  for (const p of prefNodes) {
    const n = await prisma.kgNode.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        nodeType: 'preference',
        label: p.label,
        description: p.desc,
        attributesJson: JSON.stringify(p.attrs),
        importance: 6,
      },
    });
    nodes[p.label] = n;
  }

  // 健康节点
  const healthNodes = [
    { label: '高血压', desc: '需要长期服药控制，血压控制得还不错', attrs: { severity: 'chronic', diagnosed: '2018' } },
    { label: '轻度糖尿病', desc: '二型，通过饮食和药物控制', attrs: { severity: 'mild', type: '2型' } },
    { label: '轻度骨质疏松', desc: 'T值-1.8，需要补钙', attrs: { severity: 'mild', tScore: -1.8 } },
    { label: '青霉素过敏', desc: '就诊时必须告知医生', attrs: { allergen: '青霉素', severity: 'severe' } },
  ];

  for (const h of healthNodes) {
    const n = await prisma.kgNode.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        nodeType: 'health',
        label: h.label,
        description: h.desc,
        attributesJson: JSON.stringify(h.attrs),
        importance: 9,
      },
    });
    nodes[h.label] = n;
  }

  // 地点节点
  const placeNodes = [
    { label: '幸福花园小区', desc: '广州天河区，住了20多年', attrs: { address: '天河区幸福花园小区3栋502' } },
    { label: '市中心医院', desc: '常去看病的医院，老年科李大夫', attrs: { dept: '老年科' } },
    { label: '小区花园', desc: '每天散步、打太极的地方', attrs: { activity: '散步/太极' } },
    { label: '天河公园', desc: '周末常去，看花、散步', attrs: { frequency: '周末' } },
    { label: '纺织厂', desc: '工作了35年的地方，18岁进厂', attrs: { years: '35', startAge: 18 } },
  ];

  for (const p of placeNodes) {
    const n = await prisma.kgNode.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        nodeType: 'place',
        label: p.label,
        description: p.desc,
        attributesJson: JSON.stringify(p.attrs),
        importance: 7,
      },
    });
    nodes[p.label] = n;
  }

  // 事件节点
  const eventNodes = [
    { label: '过年包饺子', desc: '每年最开心的事，全家团聚', attrs: { emotion: 'happy', frequency: '每年' } },
    { label: '老伴去世', desc: '2020年5月12日，最伤心的事', attrs: { emotion: 'sad', date: '2020-05-12' } },
    { label: '退休', desc: '在纺织厂工作35年后退休', attrs: { year: '2003' } },
    { label: '孩子们上大学', desc: '最自豪的事，省吃俭用供出来的', attrs: { emotion: 'proud' } },
    { label: '想去海南', desc: '还没去过，一直想去看海', attrs: { status: 'wish' } },
  ];

  for (const e of eventNodes) {
    const n = await prisma.kgNode.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        nodeType: 'event',
        label: e.label,
        description: e.desc,
        attributesJson: JSON.stringify(e.attrs),
        importance: 8,
      },
    });
    nodes[e.label] = n;
  }

  // ─── 知识图谱边（关系） ───
  console.log('  🔗 Creating knowledge graph edges...');
  const edgeData = [
    // 家庭关系
    { s: '张秀兰（自己）', t: '张伟（儿子）', r: 'is_parent_of' },
    { s: '张秀兰（自己）', t: '张丽（女儿）', r: 'is_parent_of' },
    { s: '张秀兰（自己）', t: '张建国（老伴）', r: 'married_to' },
    { s: '张伟（儿子）', t: '张明轩（孙子）', r: 'is_parent_of' },
    { s: '张伟（儿子）', t: '张诗涵（孙女）', r: 'is_parent_of' },
    { s: '张丽（女儿）', t: '张明轩（孙子）', r: 'is_aunt_of' },
    { s: '张秀兰（自己）', t: '张明轩（孙子）', r: 'is_grandparent_of' },
    { s: '张秀兰（自己）', t: '张诗涵（孙女）', r: 'is_grandparent_of' },

    // 健康关系
    { s: '张秀兰（自己）', t: '高血压', r: 'has_condition' },
    { s: '张秀兰（自己）', t: '轻度糖尿病', r: 'has_condition' },
    { s: '张秀兰（自己）', t: '轻度骨质疏松', r: 'has_condition' },
    { s: '张秀兰（自己）', t: '青霉素过敏', r: 'allergic_to' },
    { s: '李大夫（主治医生）', t: '高血压', r: 'treats' },
    { s: '李大夫（主治医生）', t: '轻度糖尿病', r: 'treats' },

    // 偏好关系
    { s: '张秀兰（自己）', t: '喜欢吃红烧肉', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢吃饺子', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢喝小米粥', r: 'likes' },
    { s: '张秀兰（自己）', t: '不喜欢吃辣', r: 'dislikes' },
    { s: '张秀兰（自己）', t: '喜欢听京剧', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢邓丽君的歌', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢养花', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢打太极拳', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢看新闻联播', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢看养生堂', r: 'likes' },
    { s: '张秀兰（自己）', t: '喜欢记日记', r: 'has_habit' },

    // 地点关系
    { s: '张秀兰（自己）', t: '幸福花园小区', r: 'lives_at' },
    { s: '张秀兰（自己）', t: '市中心医院', r: 'visits_hospital' },
    { s: '张秀兰（自己）', t: '小区花园', r: 'frequents' },
    { s: '张秀兰（自己）', t: '天河公园', r: 'frequents' },
    { s: '张秀兰（自己）', t: '纺织厂', r: 'worked_at' },
    { s: '李大夫（主治医生）', t: '市中心医院', r: 'works_at' },
    { s: '王秀英（护工）', t: '幸福花园小区', r: 'works_at' },

    // 事件关系
    { s: '张秀兰（自己）', t: '过年包饺子', r: 'participates_in' },
    { s: '张建国（老伴）', t: '老伴去世', r: 'affected_by' },
    { s: '张秀兰（自己）', t: '老伴去世', r: 'affected_by' },
    { s: '张秀兰（自己）', t: '退休', r: 'experienced' },
    { s: '张秀兰（自己）', t: '孩子们上大学', r: 'proud_of' },
    { s: '张秀兰（自己）', t: '想去海南', r: 'wishes' },
    { s: '张伟（儿子）', t: '孩子们上大学', r: 'participates_in' },
    { s: '张丽（女儿）', t: '孩子们上大学', r: 'participates_in' },
    { s: '张明轩（孙子）', t: '过年包饺子', r: 'participates_in' },

    // 社交关系
    { s: '张秀兰（自己）', t: '李阿姨（邻居）', r: 'friend_of' },
    { s: '王秀英（护工）', t: '张秀兰（自己）', r: 'caretaker_of' },
    { s: '张明轩（孙子）', t: '喜欢吃饺子', r: 'likes' },
  ];

  for (const edge of edgeData) {
    const src = nodes[edge.s];
    const tgt = nodes[edge.t];
    if (src && tgt) {
      await prisma.kgEdge.create({
        data: {
          sourceId: src.id,
          targetId: tgt.id,
          relation: edge.r,
          weight: 1.0,
        },
      }).catch(() => {}); // 忽略重复
    }
  }

  // ─── 日常作息 ───
  console.log('  ⏰ Creating daily routines...');
  const routines = [
    { time: '06:00', activity: '起床，在阳台做操', days: '1,2,3,4,5,6,7' },
    { time: '06:30', activity: '听京剧，喝小米粥', days: '1,2,3,4,5,6,7' },
    { time: '07:00', activity: '小区花园打太极拳', days: '1,2,3,4,5,6,7' },
    { time: '08:00', activity: '吃降压药', days: '1,2,3,4,5,6,7' },
    { time: '08:30', activity: '看早间新闻', days: '1,2,3,4,5,6,7' },
    { time: '10:00', activity: '在阳台浇花、养花', days: '1,2,3,4,5,6,7' },
    { time: '12:00', activity: '午饭（清淡为主）', days: '1,2,3,4,5,6,7' },
    { time: '12:30', activity: '午休', days: '1,2,3,4,5,6,7' },
    { time: '14:00', activity: '写日记/看报纸', days: '1,2,3,4,5,6,7' },
    { time: '16:00', activity: '小区散步或与邻居聊天', days: '1,2,3,4,5,6,7' },
    { time: '17:30', activity: '晚饭', days: '1,2,3,4,5,6,7' },
    { time: '18:00', activity: '饭后散步30分钟', days: '1,2,3,4,5,6,7' },
    { time: '19:00', activity: '看新闻联播', days: '1,2,3,4,5,6,7' },
    { time: '19:30', activity: '看养生堂或其他电视节目', days: '1,2,3,4,5,6,7' },
    { time: '20:00', activity: '吃降糖药', days: '1,2,3,4,5,6,7' },
    { time: '20:30', activity: '泡脚20分钟', days: '1,2,3,4,5,6,7' },
    { time: '21:00', activity: '睡觉', days: '1,2,3,4,5,6,7' },
  ];

  for (const r of routines) {
    await prisma.dailyRoutine.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        timeOfDay: r.time,
        activity: r.activity,
        daysOfWeek: r.days,
      },
    });
  }

  // ─── 重要日期 ───
  console.log('  📅 Creating important dates...');
  const dates = [
    { type: 'birthday', label: '自己的生日', monthDay: '03-15', lunar: true, notes: '农历二月初六' },
    { type: 'birthday', label: '儿子张伟的生日', monthDay: '07-22', lunar: false },
    { type: 'birthday', label: '女儿张丽的生日', monthDay: '11-08', lunar: false },
    { type: 'birthday', label: '孙子张明轩的生日', monthDay: '09-15', lunar: false },
    { type: 'birthday', label: '孙女张诗涵的生日', monthDay: '04-20', lunar: false },
    { type: 'anniversary', label: '结婚纪念日', monthDay: '10-01', lunar: false, notes: '1970年结婚' },
    { type: 'memorial', label: '老伴忌日', monthDay: '2020-05-12', lunar: false, notes: '每年会去扫墓' },
    { type: 'holiday', label: '春节', monthDay: '01-29', lunar: true, notes: '全家团聚包饺子' },
    { type: 'holiday', label: '中秋节', monthDay: '09-17', lunar: true, notes: '全家赏月吃月饼' },
    { type: 'holiday', label: '重阳节', monthDay: '10-29', lunar: true, notes: '敬老节' },
  ];

  for (const d of dates) {
    await prisma.importantDate.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        dateType: d.type,
        label: d.label,
        monthDay: d.monthDay,
        isLunar: d.lunar || false,
        notes: d.notes,
      },
    });
  }

  // ─── 生活事件 ───
  console.log('  📝 Creating life events...');
  const events = [
    { type: 'education', title: '小学毕业', desc: '在老家读完小学', date: '1960-07-01', location: '湖南老家', emotion: 'neutral' },
    { type: 'job', title: '进入纺织厂工作', desc: '18岁进厂，成为一名纺织工人', date: '1966-09-01', location: '广州纺织厂', emotion: 'happy' },
    { type: 'celebration', title: '结婚', desc: '与张建国结婚，国庆节', date: '1970-10-01', location: '广州', emotion: 'happy' },
    { type: 'celebration', title: '儿子张伟出生', desc: '第一个孩子', date: '1988-07-22', location: '广州', emotion: 'happy' },
    { type: 'celebration', title: '女儿张丽出生', desc: '第二个孩子', date: '1991-11-08', location: '广州', emotion: 'happy' },
    { type: 'education', title: '儿子考上大学', desc: '考上了北京的大学，全家都很高兴', date: '2006-09-01', location: '北京', emotion: 'proud' },
    { type: 'education', title: '女儿考上大学', desc: '考上了师范大学', date: '2009-09-01', location: '广州', emotion: 'proud' },
    { type: 'job', title: '退休', desc: '在纺织厂工作35年后退休', date: '2003-12-01', location: '广州纺织厂', emotion: 'neutral' },
    { type: 'illness', title: '确诊高血压', desc: '开始长期服药控制', date: '2018-03-15', location: '市中心医院', emotion: 'sad' },
    { type: 'illness', title: '老伴住院', desc: '因病住院治疗', date: '2020-04-01', location: '市中心医院', emotion: 'sad' },
    { type: 'other', title: '老伴去世', desc: '2020年5月12日，最伤心的日子', date: '2020-05-12', location: '广州', emotion: 'sad' },
    { type: 'travel', title: '去北京看儿子', desc: '第一次坐高铁去北京', date: '2023-10-01', location: '北京', emotion: 'happy' },
    { type: 'celebration', title: '孙子上小学', desc: '张明轩上小学一年级', date: '2024-09-01', location: '广州', emotion: 'happy' },
    { type: 'other', title: '开始使用EaseAge', desc: '安装了智慧养老平台', date: '2026-01-15', location: '广州', emotion: 'happy' },
  ];

  for (const e of events) {
    await prisma.lifeEvent.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        eventType: e.type,
        title: e.title,
        description: e.desc,
        eventDate: new Date(e.date),
        location: e.location,
        emotionalTag: e.emotion,
      },
    });
  }

  // ─── AI 对话日志示例 ───
  console.log('  💬 Creating AI conversation logs...');
  const sessionId = 'session_demo_001';
  const aiMessages = [
    { role: 'user', text: '你好，今天感觉有点闷', time: 0 },
    { role: 'assistant', text: '您好呀！闷的话可以去阳台透透气，看看您种的花，心情会好一些。', time: 1 },
    { role: 'user', text: '好的，我去浇浇花。对了，今天星期几？', time: 5 },
    { role: 'assistant', text: '今天是周三，下午张丽会来看您哦！', time: 6 },
    { role: 'user', text: '真的吗？那我包饺子给她吃', time: 8 },
    { role: 'assistant', text: '太好了！张丽最喜欢您包的饺子了。需要我提醒您准备食材吗？', time: 9 },
  ];

  for (const msg of aiMessages) {
    await prisma.aiConversationLog.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        sessionId,
        role: msg.role,
        contentText: msg.text,
        createdAt: new Date(Date.now() - (30 - msg.time) * 60000),
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  社区帖子
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('  📢 Creating community posts...');
  const communityPosts = [
    { authorId: staffUser.id, type: 'notice', title: '小区电梯维修通知', content: '各位业主：本周三（7月20日）上午9:00-12:00，3栋电梯将进行例行维护保养，请提前安排出行。给您带来不便，敬请谅解。', pinned: true },
    { authorId: elderlyUser.id, type: 'share', title: '今天在公园拍的月季花', content: '和李阿姨一起去天河公园，月季花开得真好看！分享给大家看看。', pinned: false },
    { authorId: familyUser2.id, type: 'activity', title: '周末社区象棋比赛', content: '本周六下午2点在社区活动中心举办象棋比赛，欢迎各位叔叔阿姨参加！有小礼品哦~', pinned: false },
    { authorId: staffUser.id, type: 'notice', title: '夏季防暑温馨提示', content: '近日气温较高，请各位老人注意防暑降温：\n1. 避免中午11-15点外出\n2. 多喝水，少量多次\n3. 饮食清淡，多吃水果\n4. 如有不适请及时联系护工或拨打120', pinned: false },
    { authorId: elderlyUser2.id, type: 'help', title: '谁家有梯子借用一下', content: '想换一下客厅的灯泡，家里的梯子坏了，哪位邻居方便借用一下？', pinned: false },
    { authorId: familyUser1.id, type: 'share', title: '推荐一个好吃的营养餐', content: '给妈妈订了一周的营养餐，荤素搭配很合理，妈妈说味道也不错。推荐给有需要的家属们。', pinned: false },
  ];

  for (const post of communityPosts) {
    const created = await prisma.communityPost.create({
      data: {
        authorId: post.authorId,
        postType: post.type,
        title: post.title,
        content: post.content,
        isPinned: post.pinned,
        viewCount: Math.floor(Math.random() * 200) + 10,
        likeCount: Math.floor(Math.random() * 30) + 1,
      },
    });
    // 添加评论
    if (post.type !== 'notice') {
      await prisma.communityComment.create({
        data: {
          postId: created.id,
          authorId: elderlyUser.id,
          content: '好的，谢谢分享！',
        },
      }).catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  通知
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('  🔔 Creating notifications...');
  const notifications = [
    { userId: elderlyUser.id, type: 'health_alert', title: '血压偏高提醒', content: '您今日血压130/85mmHg，略高于正常范围，请注意休息并按时服药。', priority: 'high' },
    { userId: elderlyUser.id, type: 'medication', title: '用药提醒', content: '该服用降压药了（苯磺酸氨氯地平片 5mg）。', priority: 'normal' },
    { userId: elderlyUser.id, type: 'family', title: '张丽发来消息', content: '妈妈，这周末我带明轩来看您，想吃您包的饺子！', priority: 'normal' },
    { userId: elderlyUser.id, type: 'service', title: '送餐服务已接单', content: '今日午餐（营养送餐）已由王师傅接单，预计11:30送达。', priority: 'normal' },
    { userId: elderlyUser.id, type: 'system', title: '社区活动通知', content: '本周六下午2点社区活动中心举办象棋比赛，欢迎参加！', priority: 'low' },
    { userId: familyUser1.id, type: 'health_alert', title: '母亲健康提醒', content: '张秀兰今日血压偏高（130/85mmHg），建议关注。', priority: 'high' },
  ];

  for (const noti of notifications) {
    await prisma.notification.create({
      data: {
        userId: noti.userId,
        notificationType: noti.type,
        title: noti.title,
        content: noti.content,
        priority: noti.priority,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  每日签到和情绪记录
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('  📝 Creating daily checkins and mood records...');
  for (let i = 0; i < 14; i++) {
    const date = daysAgo(i);
    date.setHours(0, 0, 0, 0);
    await prisma.dailyCheckin.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        checkinDate: date,
        moodScore: Math.floor(Math.random() * 2) + 4, // 4-5
        sleepQuality: Math.floor(Math.random() * 2) + 3, // 3-4
        appetiteLevel: Math.floor(Math.random() * 2) + 4, // 4-5
        activityLevel: Math.floor(Math.random() * 2) + 3, // 3-4
      },
    }).catch(() => {});
  }

  const moods = ['happy', 'calm', 'happy', 'calm', 'happy', 'tired', 'happy'];
  for (let i = 0; i < moods.length; i++) {
    await prisma.moodRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        moodType: moods[i],
        intensity: Math.floor(Math.random() * 2) + 3,
        trigger: moods[i] === 'happy' ? '和家人聊天' : moods[i] === 'tired' ? '散步走远了' : '正常',
      },
    }).catch(() => {});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  紧急联系人
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('  🚨 Creating emergency contacts...');
  await prisma.emergencyContact.createMany({
    data: [
      { elderlyProfileId: elderlyProfile.id, contactName: '张伟', relationship: '儿子', phoneNumber: '13800000002', isPrimary: true },
      { elderlyProfileId: elderlyProfile.id, contactName: '张丽', relationship: '女儿', phoneNumber: '13800000004', isPrimary: false },
      { elderlyProfileId: elderlyProfile.id, contactName: '王秀英', relationship: '护工', phoneNumber: '13800000003', isPrimary: false },
      { elderlyProfileId: elderlyProfile.id, contactName: '120急救', relationship: '急救', phoneNumber: '120', isPrimary: false },
    ],
  });

  // ═══════════════════════════════════════════════════════════════════════════
  //  审计日志
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('  📋 Creating audit logs...');
  const auditActions = [
    { userId: elderlyUser.id, action: 'login', resource: 'user' },
    { userId: elderlyUser.id, action: 'ai_chat', resource: 'voice' },
    { userId: elderlyUser.id, action: 'create', resource: 'health' },
    { userId: familyUser1.id, action: 'login', resource: 'user' },
    { userId: familyUser1.id, action: 'create', resource: 'service' },
    { userId: adminUser.id, action: 'login', resource: 'user' },
  ];
  for (const log of auditActions) {
    await prisma.auditLog.create({
      data: { ...log, detailJson: '{}' },
    }).catch(() => {});
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📱 Demo accounts:');
  console.log('   管理员: 13800000000 / 123456');
  console.log('   老人: 13800000001 / 123456');
  console.log('   家属: 13800000002 / 123456');
  console.log('   护工: 13800000003 / 123456');
  console.log('   家属2: 13800000004 / 123456');
  console.log('   老人2: 13800000005 / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
