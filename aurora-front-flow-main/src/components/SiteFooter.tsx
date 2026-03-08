import { Link } from "react-router-dom";

const footerLinks = {
  "Về chúng tôi": [
    { label: "Giới thiệu", href: "/about" },
  ],
  "Hỗ trợ": [
    { label: "Trung tâm trợ giúp", href: "/help" },
    { label: "Chính sách đổi trả", href: "/return-policy" },
    { label: "Liên hệ", href: "/contact" },
  ],
  "Thanh toán": [
    { label: "Visa / Mastercard", href: "/card-policy" },
    { label: "Momo", href: "/momo-policy" },
    { label: "COD", href: "/cod-policy" },
  ],
};

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="container-main py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">Stitch</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nền tảng thương mại điện tử thông minh với gợi ý sản phẩm AI.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Stitch IntelliCore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
