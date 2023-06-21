import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <nav className="fixed top-0 bottom-0 left-0 z-30 w-32 border-r border-border">
      <div className="flex flex-col items-center mt-10">
        <Link href="/">
          <Image alt="bear" src="/images/bear.png" width={60} height={80} />
        </Link>

        <div className="mt-14">
          <span className="text-lg font-semibold text-muted-foreground">
            Menu
          </span>
        </div>
      </div>
    </nav>
  );
};
