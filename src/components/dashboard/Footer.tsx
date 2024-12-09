import React from "react";
import Link from "next/link";

interface ActionItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface FooterProps {
  actionItems: ActionItem[];
}

export default function Footer({ actionItems }: FooterProps) {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About MAP</h3>
            <p className="text-sm">
              MAP provides approved credit for prior learning opportunities,
              helping students accelerate their educational journey.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <ul className="space-y-2 text-sm">
              {actionItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target="_blank"
                    className="hover:text-primary flex items-center"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-sm not-italic">
              <p>473 E. Carnegie Drive</p>
              <p>Suite # 200</p>
              <p>San Bernardino, CA 92408</p>
              <p>
                Email:{" "}
                <a href="mailto:tech.support@theinfotechpartners.com">
                  tech.support@theinfotechpartners.com
                </a>
              </p>
              <p>Phone: (909) 862-8078</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} MAP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
