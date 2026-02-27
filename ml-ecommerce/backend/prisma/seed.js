// ==========================================
// Prisma Seed Script
// Populates DB with sample data for development
// ==========================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ==========================================
  // Create Admin User
  // ==========================================
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mlecommerce.com' },
    update: {},
    create: {
      email: 'admin@mlecommerce.com',
      passwordHash: adminPassword,
      fullName: 'System Admin',
      role: 'admin',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      passwordHash: customerPassword,
      fullName: 'Test Customer',
      role: 'customer',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Test customer created:', customer.email);

  // ==========================================
  // Create Brands
  // ==========================================
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'apple' },
      update: {},
      create: { name: 'Apple', slug: 'apple', description: 'Think Different', isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: 'samsung' },
      update: {},
      create: { name: 'Samsung', slug: 'samsung', description: 'Do What You Can\'t', isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: 'nike' },
      update: {},
      create: { name: 'Nike', slug: 'nike', description: 'Just Do It', isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: 'adidas' },
      update: {},
      create: { name: 'Adidas', slug: 'adidas', description: 'Impossible is Nothing', isActive: true },
    }),
  ]);
  console.log('✅ Brands created:', brands.length);

  // ==========================================
  // Create Categories
  // ==========================================
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Điện Tử',
      slug: 'electronics',
      description: 'Thiết bị điện tử công nghệ cao',
      sortOrder: 1,
      isActive: true,
    },
  });

  const phones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Điện Thoại',
      slug: 'smartphones',
      description: 'Điện thoại thông minh',
      parentId: electronics.id,
      sortOrder: 1,
      isActive: true,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptop',
      slug: 'laptops',
      description: 'Máy tính xách tay',
      parentId: electronics.id,
      sortOrder: 2,
      isActive: true,
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Thời Trang',
      slug: 'fashion',
      description: 'Quần áo và phụ kiện thời trang',
      sortOrder: 2,
      isActive: true,
    },
  });

  const shoes = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: {
      name: 'Giày Dép',
      slug: 'shoes',
      description: 'Giày dép thể thao và thời trang',
      parentId: fashion.id,
      sortOrder: 1,
      isActive: true,
    },
  });

  console.log('✅ Categories created');

  // ==========================================
  // Create Products
  // ==========================================
  const products = [
    {
      name: 'iPhone 15 Pro Max 256GB',
      slug: 'iphone-15-pro-max-256gb',
      categoryId: phones.id,
      brandId: brands[0].id, // Apple
      description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.7 inch.',
      shortDescription: 'Flagship iPhone với chip A17 Pro',
      basePrice: 34990000,
      salePrice: 32990000,
      sku: 'IPH15PM-256',
      stockQuantity: 50,
      tags: ['iphone', 'apple', 'smartphone', 'flagship', '5g'],
      isActive: true,
      isFeatured: true,
      viewCount: 1250,
      purchaseCount: 89,
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB',
      slug: 'samsung-galaxy-s24-ultra-512gb',
      categoryId: phones.id,
      brandId: brands[1].id, // Samsung
      description: 'Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch.',
      shortDescription: 'Flagship Samsung với S Pen và camera 200MP',
      basePrice: 33990000,
      salePrice: 31990000,
      sku: 'SGS24U-512',
      stockQuantity: 35,
      tags: ['samsung', 'galaxy', 'smartphone', 'flagship', 's-pen'],
      isActive: true,
      isFeatured: true,
      viewCount: 980,
      purchaseCount: 67,
    },
    {
      name: 'MacBook Pro 14 inch M3 Pro',
      slug: 'macbook-pro-14-m3-pro',
      categoryId: laptops.id,
      brandId: brands[0].id, // Apple
      description: 'MacBook Pro 14 inch với chip M3 Pro, màn hình Liquid Retina XDR, pin 18 giờ.',
      shortDescription: 'Laptop chuyên nghiệp với chip M3 Pro',
      basePrice: 52990000,
      salePrice: null,
      sku: 'MBP14-M3P',
      stockQuantity: 20,
      tags: ['macbook', 'apple', 'laptop', 'm3', 'professional'],
      isActive: true,
      isFeatured: true,
      viewCount: 750,
      purchaseCount: 34,
    },
    {
      name: 'Nike Air Max 270 React',
      slug: 'nike-air-max-270-react',
      categoryId: shoes.id,
      brandId: brands[2].id, // Nike
      description: 'Giày thể thao Nike Air Max 270 React với đệm Air Max lớn nhất từ trước đến nay.',
      shortDescription: 'Giày thể thao với đệm Air Max 270',
      basePrice: 3290000,
      salePrice: 2790000,
      sku: 'NK-AM270R-42',
      stockQuantity: 100,
      tags: ['nike', 'air-max', 'sneakers', 'running', 'sport'],
      isActive: true,
      isFeatured: false,
      viewCount: 560,
      purchaseCount: 145,
    },
    {
      name: 'Adidas Ultraboost 23',
      slug: 'adidas-ultraboost-23',
      categoryId: shoes.id,
      brandId: brands[3].id, // Adidas
      description: 'Giày chạy bộ Adidas Ultraboost 23 với công nghệ Boost mang lại năng lượng tối đa.',
      shortDescription: 'Giày chạy bộ với công nghệ Boost',
      basePrice: 4290000,
      salePrice: 3590000,
      sku: 'AD-UB23-43',
      stockQuantity: 80,
      tags: ['adidas', 'ultraboost', 'running', 'sport', 'boost'],
      isActive: true,
      isFeatured: false,
      viewCount: 430,
      purchaseCount: 98,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }
  console.log('✅ Products created:', products.length);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('  Admin: admin@mlecommerce.com / Admin@123456');
  console.log('  Customer: customer@test.com / Customer@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
