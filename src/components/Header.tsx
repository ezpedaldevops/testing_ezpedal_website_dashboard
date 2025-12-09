import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white shadow">
      <div className="flex xl:px-32 px-8 w-full py-4 font-poppins font-semibold  justify-between items-center">
        <Link href="/careers">
          <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/bulkemail">
                <div
                  className={`${
                    pathname === "/bulkemail" ? "text-blue-800" : ""
                  }`}
                >
                  Subscribers Email
                </div>
              </Link>
            </li>
           
            {/* <li>
              <Link href="/partnership">
                <div
                  className={`${
                    pathname === "/partnership" ? "text-blue-800" : ""
                  }`}
                >
                  Partnership
                </div>
              </Link>
            </li> */}
            {/* <li>
              <Link href={"/advertise"}>
                <div
                  className={`${
                    pathname === "/advertise" ? "text-blue-800" : ""
                  }`}
                >
                  Advertise
                </div>
              </Link>
            </li> */}
            <li>
              <Link href="/learn">
                <div
                  className={`${pathname === "/learn" ? "text-blue-800" : ""}`}
                >
                  <span className="flex justify-center items-center">
                    Learn
                  </span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/gallery">
                <div
                  className={`${pathname === "/gallery" ? "text-blue-800" : ""}`}
                >
                  <span className="flex justify-center items-center">
                    Gallery
                  </span>
                </div>
              </Link>
            </li>
             <li>
              <Link href="/careers">
                <div
                  className={`${
                    pathname === "/careers" ? "text-blue-800" : ""
                  }`}
                >
                  Careers
                </div>
              </Link>
            </li>
            <li>
              <Link href="/application">
                <div
                  className={`${pathname === "/application" ? "text-blue-800" : ""}`}
                >
                  <span className="flex justify-center items-center">
                    {"Application's"}
                  </span>
                </div>
              </Link>
            </li>
            {/* <li>
              <Link href="/images">
                <div
                  className={`${
                    pathname === "/images" ? "text-blue-800" : ""
                  }`}
                >
                  CHANGE IMAGES
                </div>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
