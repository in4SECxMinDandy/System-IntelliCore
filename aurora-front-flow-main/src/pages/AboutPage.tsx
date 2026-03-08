import { Users, Target, Heart, Zap } from "lucide-react";

const values = [
  { icon: Heart, title: "Khách hàng là trung tâm", desc: "Mọi quyết định đều hướng đến trải nghiệm tốt nhất cho khách hàng." },
  { icon: Zap, title: "Đổi mới không ngừng", desc: "Ứng dụng AI và công nghệ mới để mang lại giá trị vượt trội." },
  { icon: Target, title: "Chất lượng hàng đầu", desc: "Cam kết chỉ cung cấp sản phẩm chính hãng, chất lượng cao." },
  { icon: Users, title: "Cộng đồng gắn kết", desc: "Xây dựng cộng đồng mua sắm thông minh và bền vững." },
];

const team = [
  { name: "Nguyễn Minh Tuấn", role: "CEO & Founder", desc: "10+ năm kinh nghiệm trong lĩnh vực thương mại điện tử." },
  { name: "Trần Thị Hương", role: "CTO", desc: "Chuyên gia AI với niềm đam mê cá nhân hóa trải nghiệm." },
  { name: "Lê Văn Đức", role: "Head of Product", desc: "Kiến tạo sản phẩm lấy người dùng làm trung tâm." },
  { name: "Phạm Ngọc Lan", role: "Head of Operations", desc: "Đảm bảo vận hành trơn tru và dịch vụ xuất sắc." },
];

const AboutPage = () => {
  return (
    <div className="container-main py-8 md:py-12 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Về Stitch IntelliCore</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Stitch IntelliCore là nền tảng thương mại điện tử thông minh, ứng dụng trí tuệ nhân tạo để mang đến trải nghiệm mua sắm cá nhân hóa, tiện lợi và đáng tin cậy cho mọi khách hàng.
        </p>
      </div>

      {/* Sứ mệnh */}
      <section className="mb-12 p-6 md:p-8 rounded-2xl border border-border bg-card">
        <h2 className="text-xl font-bold text-foreground mb-3">Sứ mệnh</h2>
        <p className="text-muted-foreground leading-relaxed">
          Chúng tôi tin rằng mọi người đều xứng đáng có trải nghiệm mua sắm tuyệt vời. Sứ mệnh của Stitch IntelliCore là kết nối khách hàng với những sản phẩm phù hợp nhất thông qua công nghệ AI tiên tiến, đồng thời xây dựng một hệ sinh thái thương mại điện tử minh bạch, bền vững và lấy con người làm trung tâm.
        </p>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">Giá trị cốt lõi</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">Đội ngũ lãnh đạo</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {team.map((m) => (
            <div key={m.name} className="p-5 rounded-xl border border-border bg-card text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                <span className="text-lg font-bold text-primary">{m.name.charAt(0)}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-primary font-medium mb-1">{m.role}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
