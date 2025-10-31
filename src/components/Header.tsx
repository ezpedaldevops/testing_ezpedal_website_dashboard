import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white shadow">
      <div className="flex xl:px-32 px-8 w-full py-4 justify-between items-center">
        <Link href="/careers">
          <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/careers">
                <div
                  className={`${
                    pathname === "/careers" ? "text-orange-600" : ""
                  }`}
                >
                  CAREERS
                </div>
              </Link>
            </li>
            <li>
              <Link href="/partnership">
                <div
                  className={`${
                    pathname === "/partnership" ? "text-orange-600" : ""
                  }`}
                >
                  PARTNERSHIP
                </div>
              </Link>
            </li>
            <li>
              <Link href={"/advertise"}>
                <div
                  className={`${
                    pathname === "/advertise" ? "text-orange-600" : ""
                  }`}
                >
                  ADVERTISE
                </div>
              </Link>
            </li>
            <li>
              <Link href="/learn">
                <div
                  className={`${
                    pathname === "/learn" ? "text-orange-600" : ""
                  }`}
                >
                 <span className="flex justify-center items-center">LEARN</span> 
                </div>
              </Link>
            </li>
            <li>
              <Link href="/images">
                <div
                  className={`${
                    pathname === "/images" ? "text-orange-600" : ""
                  }`}
                >
                  CHANGE IMAGES
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
