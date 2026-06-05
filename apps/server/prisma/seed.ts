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
        contentMarkdown: '# 高血压饮食指南\n\n## 低盐饮食\n\n每日食盐摄入量应控制在6克以下...',
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
        contentMarkdown: '# 夏季养生\n\n## 防暑降温\n\n1. 避免中午外出\n2. 多喝水\n3. 穿着透气衣物...',
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
        contentMarkdown: '# 糖尿病管理\n\n## 血糖监测\n\n建议每日监测血糖2-3次...',
        summaryText: '血糖监测、饮食控制和运动建议',
        authorName: '李医生',
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
  await Promise.all([
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_pressure',
        measurementValueJson: { systolic: 128, diastolic: 82 },
        measurementUnit: 'mmHg',
        measuredAt: new Date(),
      },
    }),
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'heart_rate',
        measurementValueJson: { value: 72 },
        measurementUnit: 'bpm',
        measuredAt: new Date(),
      },
    }),
    prisma.healthRecord.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        recordType: 'blood_sugar',
        measurementValueJson: { value: 6.2 },
        measurementUnit: 'mmol/L',
        measuredAt: new Date(),
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
        reminderScheduleJson: ['08:00'],
      },
    }),
    prisma.medication.create({
      data: {
        elderlyProfileId: elderlyProfile.id,
        medicationName: '降糖药',
        dosageDescription: '1片',
        frequencyDescription: '每日两次',
        reminderScheduleJson: ['08:00', '20:00'],
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📱 Demo accounts:');
  console.log('   老人: 13800000001 / 123456');
  console.log('   家属: 13800000002 / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
