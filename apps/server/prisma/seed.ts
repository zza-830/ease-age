import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: { categoryName: '家政服务', iconIdentifier: 'home', displayOrder: 1 },
    }),
    prisma.serviceCategory.create({
      data: { categoryName: '送餐服务', iconIdentifier: 'utensils', displayOrder: 2 },
    }),
    prisma.serviceCategory.create({
      data: { categoryName: '陪诊服务', iconIdentifier: 'hospital', displayOrder: 3 },
    }),
    prisma.serviceCategory.create({
      data: { categoryName: '维修服务', iconIdentifier: 'wrench', displayOrder: 4 },
    }),
    prisma.serviceCategory.create({
      data: { categoryName: '健康咨询', iconIdentifier: 'heart', displayOrder: 5 },
    }),
  ]);

  // Create services
  await Promise.all([
    prisma.service.create({
      data: {
        categoryId: categories[0].id,
        serviceName: '日常保洁',
        descriptionText: '专业保洁人员上门服务，包含客厅、卧室、厨房、卫生间清洁',
        basePrice: 80,
        priceUnit: '次',
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[1].id,
        serviceName: '营养送餐',
        descriptionText: '营养师搭配的每日三餐，荤素搭配，健康美味',
        basePrice: 25,
        priceUnit: '餐',
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[2].id,
        serviceName: '医院陪诊',
        descriptionText: '专业陪诊人员陪同就医，排队挂号、取药、检查陪同',
        basePrice: 200,
        priceUnit: '次',
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[3].id,
        serviceName: '家电维修',
        descriptionText: '各类家电维修保养，空调、洗衣机、电视等',
        basePrice: 50,
        priceUnit: '次',
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[4].id,
        serviceName: '健康咨询',
        descriptionText: '专业医生在线健康咨询，解答健康疑问',
        basePrice: 30,
        priceUnit: '次',
      },
    }),
  ]);

  // Create knowledge categories
  const knowledgeCategories = await Promise.all([
    prisma.knowledgeCategory.create({
      data: { categoryName: '健康养生', iconIdentifier: 'heart', displayOrder: 1 },
    }),
    prisma.knowledgeCategory.create({
      data: { categoryName: '疾病预防', iconIdentifier: 'shield', displayOrder: 2 },
    }),
    prisma.knowledgeCategory.create({
      data: { categoryName: '心理关怀', iconIdentifier: 'brain', displayOrder: 3 },
    }),
    prisma.knowledgeCategory.create({
      data: { categoryName: '生活常识', iconIdentifier: 'book', displayOrder: 4 },
    }),
  ]);

  // Create knowledge articles
  await Promise.all([
    prisma.knowledgeArticle.create({
      data: {
        categoryId: knowledgeCategories[0].id,
        title: '老年人高血压饮食指南',
        contentMarkdown: '# 高血压饮食指南\n\n## 低盐饮食\n\n每日食盐摄入量应控制在6克以下，减少腌制食品的摄入。\n\n## 多吃蔬果\n\n新鲜蔬菜和水果富含钾、镁等矿物质，有助于控制血压。\n\n## 适量蛋白质\n\n选择优质蛋白质，如鱼类、豆制品、瘦肉等。',
        summaryText: '了解如何通过饮食控制血压，保持健康',
        authorName: '张医生',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        categoryId: knowledgeCategories[0].id,
        title: '夏季老年人养生要点',
        contentMarkdown: '# 夏季养生\n\n## 防暑降温\n\n1. 避免中午11点-15点外出\n2. 多喝水，少量多次\n3. 穿着透气、浅色衣物\n\n## 饮食调理\n\n- 多吃清淡、易消化食物\n- 适当食用绿豆汤、西瓜等消暑食品\n- 避免过多冷饮',
        summaryText: '夏季防暑降温、饮食调理建议',
        authorName: '赵营养师',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        categoryId: knowledgeCategories[1].id,
        title: '糖尿病患者的日常管理',
        contentMarkdown: '# 糖尿病管理\n\n## 血糖监测\n\n建议每日监测血糖2-3次，记录数据供医生参考。\n\n## 饮食控制\n\n- 控制总热量摄入\n- 定时定量进餐\n- 减少高糖食物\n\n## 适量运动\n\n每天坚持30分钟中等强度运动，如散步、太极拳等。',
        summaryText: '血糖监测、饮食控制和运动建议',
        authorName: '李医生',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        categoryId: knowledgeCategories[2].id,
        title: '老年人心理健康指南',
        contentMarkdown: '# 心理健康\n\n## 保持社交\n\n多与家人、朋友交流，参加社区活动。\n\n## 培养兴趣\n\n发展书法、绘画、园艺等兴趣爱好。\n\n## 规律作息\n\n保持规律的生活节奏，充足睡眠。',
        summaryText: '如何保持积极心态，预防抑郁',
        authorName: '王心理师',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        categoryId: knowledgeCategories[3].id,
        title: '老年人睡眠改善方法',
        contentMarkdown: '# 睡眠改善\n\n## 良好习惯\n\n1. 固定作息时间\n2. 睡前避免使用电子设备\n3. 保持卧室安静、舒适\n\n## 饮食注意\n\n- 睡前2小时不进食\n- 避免咖啡、浓茶\n- 可适量饮用温牛奶',
        summaryText: '失眠原因分析及改善建议',
        authorName: '刘医生',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
  ]);

  // Create demo users
  const passwordHash = await bcrypt.hash('123456', 12);

  const elderlyUser = await prisma.user.create({
    data: {
      phoneNumber: '13800000001',
      password: passwordHash,
      fullName: '张奶奶',
      role: 'elderly',
    },
  });

  const familyUser = await prisma.user.create({
    data: {
      phoneNumber: '13800000002',
      password: passwordHash,
      fullName: '张三',
      role: 'family',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      phoneNumber: '13800000003',
      password: passwordHash,
      fullName: '王护工',
      role: 'staff',
    },
  });

  // Create elderly profile
  const elderlyProfile = await prisma.elderlyProfile.create({
    data: {
      userId: elderlyUser.id,
      fullName: '张奶奶',
      gender: 'female',
      birthDate: new Date('1945-05-15'),
      residentialAddress: '广州市天河区xxx小区',
      emergencyContactPhone: '13800000002',
      bloodType: 'A',
    },
  });

  // Create family relation
  await prisma.familyRelation.create({
    data: {
      userId: familyUser.id,
      elderlyProfileId: elderlyProfile.id,
      relationshipType: '子女',
      isPrimaryContact: true,
    },
  });

  // Create health records
  const now = new Date();
  await Promise.all([
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_pressure',
        measurementValueJson: JSON.stringify({ systolic: 128, diastolic: 82 }),
        measurementUnit: 'mmHg',
        measuredAt: now,
      },
    }),
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'heart_rate',
        measurementValueJson: JSON.stringify({ value: 72 }),
        measurementUnit: 'bpm',
        measuredAt: now,
      },
    }),
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_sugar',
        measurementValueJson: JSON.stringify({ value: 6.2 }),
        measurementUnit: 'mmol/L',
        measuredAt: now,
      },
    }),
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'body_temperature',
        measurementValueJson: JSON.stringify({ value: 36.5 }),
        measurementUnit: '°C',
        measuredAt: new Date(now.getTime() - 3600000),
      },
    }),
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_oxygen',
        measurementValueJson: JSON.stringify({ value: 98 }),
        measurementUnit: '%',
        measuredAt: now,
      },
    }),
  ]);

  // Create medications
  await Promise.all([
    prisma.medication.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        medicationName: '降压药',
        dosageDescription: '1片',
        frequencyDescription: '每日一次',
        reminderScheduleJson: JSON.stringify(['08:00']),
      },
    }),
    prisma.medication.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        medicationName: '降糖药',
        dosageDescription: '1片',
        frequencyDescription: '每日两次',
        reminderScheduleJson: JSON.stringify(['08:00', '20:00']),
      },
    }),
    prisma.medication.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        medicationName: '钙片',
        dosageDescription: '2片',
        frequencyDescription: '每日一次',
        reminderScheduleJson: JSON.stringify(['20:00']),
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📱 Demo accounts:');
  console.log('   老人: 13800000001 / 123456');
  console.log('   家属: 13800000002 / 123456');
  console.log('   护工: 13800000003 / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
