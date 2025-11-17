import { PrismaClient, InstitutionType, UserRole, ReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning existing data...');
    await prisma.reviewFlag.deleteMany();
    await prisma.review.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
    await prisma.institution.deleteMany();
  }

  // ============================================================================
  // 1. Create Institutions
  // ============================================================================
  console.log('🏫 Creating institutions...');

  const iba = await prisma.institution.create({
    data: {
      name: 'Institute of Business Administration',
      abbreviation: 'IBA',
      type: InstitutionType.UNIVERSITY,
      location: 'University Road, Karachi',
      website: 'https://www.iba.edu.pk',
    },
  });

  const neduet = await prisma.institution.create({
    data: {
      name: 'NED University of Engineering and Technology',
      abbreviation: 'NEDUET',
      type: InstitutionType.UNIVERSITY,
      location: 'University Road, Karachi',
      website: 'https://www.neduet.edu.pk',
    },
  });

  const ku = await prisma.institution.create({
    data: {
      name: 'University of Karachi',
      abbreviation: 'KU',
      type: InstitutionType.UNIVERSITY,
      location: 'University Road, Karachi',
      website: 'https://www.uok.edu.pk',
    },
  });

  console.log(`✅ Created ${[iba, neduet, ku].length} institutions`);

  // ============================================================================
  // 2. Create Departments
  // ============================================================================
  console.log('📚 Creating departments...');

  // IBA Departments
  const ibaCS = await prisma.department.create({
    data: { name: 'Computer Science', institutionId: iba.id },
  });

  const ibaBusiness = await prisma.department.create({
    data: { name: 'Business Administration', institutionId: iba.id },
  });

  const ibaEcon = await prisma.department.create({
    data: { name: 'Economics', institutionId: iba.id },
  });

  // NEDUET Departments
  const neduetCS = await prisma.department.create({
    data: { name: 'Computer Science', institutionId: neduet.id },
  });

  const neduetElec = await prisma.department.create({
    data: { name: 'Electrical Engineering', institutionId: neduet.id },
  });

  const neduetMech = await prisma.department.create({
    data: { name: 'Mechanical Engineering', institutionId: neduet.id },
  });

  // KU Departments
  const kuCS = await prisma.department.create({
    data: { name: 'Computer Science', institutionId: ku.id },
  });

  const kuMath = await prisma.department.create({
    data: { name: 'Mathematics', institutionId: ku.id },
  });

  console.log('✅ Created 8 departments');

  // ============================================================================
  // 3. Create Users (Admin + Students)
  // ============================================================================
  console.log('👥 Creating users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mashwara.pk',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  // Student users
  const student1 = await prisma.user.create({
    data: {
      email: 'ahmed.khan@iba.edu.pk',
      password: hashedPassword,
      firstName: 'Ahmed',
      lastName: 'Khan',
      role: UserRole.STUDENT,
      institutionId: iba.id,
      isVerified: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'fatima.ali@iba.edu.pk',
      password: hashedPassword,
      firstName: 'Fatima',
      lastName: 'Ali',
      role: UserRole.STUDENT,
      institutionId: iba.id,
      isVerified: true,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'hassan.raza@neduet.edu.pk',
      password: hashedPassword,
      firstName: 'Hassan',
      lastName: 'Raza',
      role: UserRole.STUDENT,
      institutionId: neduet.id,
      isVerified: true,
    },
  });

  const student4 = await prisma.user.create({
    data: {
      email: 'ayesha.malik@uok.edu.pk',
      password: hashedPassword,
      firstName: 'Ayesha',
      lastName: 'Malik',
      role: UserRole.STUDENT,
      institutionId: ku.id,
      isVerified: true,
    },
  });

  console.log('✅ Created 5 users (1 admin, 4 students)');

  // ============================================================================
  // 4. Create Teachers
  // ============================================================================
  console.log('👨‍🏫 Creating teachers...');

  // IBA Teachers
  const teachersData = [
    // IBA CS
    { firstName: 'Dr. Muhammad', lastName: 'Saeed', title: 'Dr.', institutionId: iba.id, departmentId: ibaCS.id },
    { firstName: 'Dr. Sana', lastName: 'Ahmed', title: 'Dr.', institutionId: iba.id, departmentId: ibaCS.id },
    { firstName: 'Asad', lastName: 'Malik', title: 'Professor', institutionId: iba.id, departmentId: ibaCS.id },

    // IBA Business
    { firstName: 'Dr. Fahad', lastName: 'Sheikh', title: 'Dr.', institutionId: iba.id, departmentId: ibaBusiness.id },
    { firstName: 'Nadia', lastName: 'Jamil', title: 'Professor', institutionId: iba.id, departmentId: ibaBusiness.id },

    // NEDUET
    { firstName: 'Dr. Tariq', lastName: 'Mahmood', title: 'Dr.', institutionId: neduet.id, departmentId: neduetCS.id },
    { firstName: 'Engr. Bilal', lastName: 'Khan', title: 'Engr.', institutionId: neduet.id, departmentId: neduetElec.id },
    { firstName: 'Dr. Rabia', lastName: 'Noor', title: 'Dr.', institutionId: neduet.id, departmentId: neduetCS.id },

    // KU
    { firstName: 'Dr. Imran', lastName: 'Rashid', title: 'Dr.', institutionId: ku.id, departmentId: kuCS.id },
    { firstName: 'Prof. Zainab', lastName: 'Hasan', title: 'Prof.', institutionId: ku.id, departmentId: kuMath.id },
  ];

  const teachers = await Promise.all(
    teachersData.map((teacher) => prisma.teacher.create({ data: teacher }))
  );

  console.log(`✅ Created ${teachers.length} teachers`);

  // ============================================================================
  // 5. Create Reviews
  // ============================================================================
  console.log('⭐ Creating reviews...');

  const reviewsData = [
    // Approved reviews
    {
      userId: student1.id,
      teacherId: teachers[0].id, // Dr. Muhammad Saeed
      rating: 5,
      comment: 'Excellent professor! Very clear explanations and helpful during office hours.',
      courseCode: 'CS-101',
      courseName: 'Introduction to Programming',
      semester: 'Fall 2024',
      status: ReviewStatus.APPROVED,
      moderatedBy: admin.id,
      moderatedAt: new Date(),
    },
    {
      userId: student2.id,
      teacherId: teachers[0].id, // Dr. Muhammad Saeed
      rating: 4,
      comment: 'Good teacher, assignments were challenging but fair.',
      courseCode: 'CS-101',
      courseName: 'Introduction to Programming',
      semester: 'Fall 2024',
      status: ReviewStatus.APPROVED,
      moderatedBy: admin.id,
      moderatedAt: new Date(),
    },
    {
      userId: student1.id,
      teacherId: teachers[1].id, // Dr. Sana Ahmed
      rating: 5,
      comment: 'Best Data Structures teacher! Makes complex topics easy to understand.',
      courseCode: 'CS-201',
      courseName: 'Data Structures',
      semester: 'Spring 2024',
      status: ReviewStatus.APPROVED,
      moderatedBy: admin.id,
      moderatedAt: new Date(),
    },

    // Pending reviews
    {
      userId: student3.id,
      teacherId: teachers[5].id, // Dr. Tariq Mahmood
      rating: 4,
      comment: 'Great professor, very knowledgeable in AI and ML topics.',
      courseCode: 'CS-401',
      courseName: 'Artificial Intelligence',
      semester: 'Fall 2024',
      status: ReviewStatus.PENDING,
    },
    {
      userId: student4.id,
      teacherId: teachers[8].id, // Dr. Imran Rashid
      rating: 3,
      comment: 'Decent teacher but lectures can be a bit dry sometimes.',
      courseCode: 'CS-102',
      courseName: 'Programming Fundamentals',
      semester: 'Fall 2024',
      status: ReviewStatus.PENDING,
    },

    // Rejected review (inappropriate)
    {
      userId: student2.id,
      teacherId: teachers[2].id,
      rating: 1,
      comment: 'This review was flagged as inappropriate and removed.',
      courseCode: 'CS-301',
      courseName: 'Database Systems',
      semester: 'Fall 2024',
      status: ReviewStatus.REJECTED,
      moderatedBy: admin.id,
      moderatedAt: new Date(),
      moderationNotes: 'Contains inappropriate language',
    },
  ];

  const reviews = await Promise.all(
    reviewsData.map((review) => prisma.review.create({ data: review }))
  );

  console.log(`✅ Created ${reviews.length} reviews`);

  // ============================================================================
  // 6. Update Teacher Ratings
  // ============================================================================
  console.log('📊 Updating teacher ratings...');

  // Update Dr. Muhammad Saeed (2 approved reviews: 5 and 4)
  await prisma.teacher.update({
    where: { id: teachers[0].id },
    data: {
      averageRating: 4.5,
      totalReviews: 2,
    },
  });

  // Update Dr. Sana Ahmed (1 approved review: 5)
  await prisma.teacher.update({
    where: { id: teachers[1].id },
    data: {
      averageRating: 5.0,
      totalReviews: 1,
    },
  });

  console.log('✅ Updated teacher ratings');

  // ============================================================================
  // Summary
  // ============================================================================
  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Institutions: 3 (IBA, NEDUET, KU)`);
  console.log(`   - Departments: 8`);
  console.log(`   - Users: 5 (1 admin, 4 students)`);
  console.log(`   - Teachers: ${teachers.length}`);
  console.log(`   - Reviews: ${reviews.length} (3 approved, 2 pending, 1 rejected)`);
  console.log('\n🔑 Test credentials:');
  console.log('   Admin: admin@mashwara.pk / password123');
  console.log('   Student: ahmed.khan@iba.edu.pk / password123');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
