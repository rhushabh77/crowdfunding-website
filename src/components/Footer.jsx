import { Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="p-14 max-sm:p-7 bg-gradient-to-br from-violet-200 via-white to-white pt-8">
      <div className="border-t border-black/70 pt-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-medium">
                Komal
                <br />& Saksham
              </h2>
              <span className="text-gray-500 text-base sm:text-lg">
                #SAKOON
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              {/* <Link href="/" className="text-gray-900 hover:text-gray-600">
                mannix.in
              </Link> */}
              <span className="text-gray-500">
                © 2024 Mannix Infotech Solutions Pvt. Ltd.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:items-end">
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-900"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              {/* <Link
                href="#"
                className="text-gray-500 hover:text-gray-900"
                aria-label="Pinterest"
              >
                <Pinterest className="h-5 w-5" />
              </Link> */}
              <Link
                href="mailto:example@email.com"
                className="text-gray-500 hover:text-gray-900"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            {/* <nav className="flex gap-4 sm:gap-6 text-sm sm:text-base">
              <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-900"
              >
                Privacy
              </Link>
            </nav> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
