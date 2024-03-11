import { UserButton, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

function Topbar() {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/logo.svg' alt='logo' width={40} height={40} />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Pivotly</p>
      </Link>

      <div className='flex items-center gap-4'>
        <SignedIn>
          <div className='hidden md:flex'>
            <UserButton afterSignOutUrl='/' />
          </div>
          <div className='flex md:hidden'>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Topbar;
