import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex items-center gap-2">
      <NavbarButton>
        <Link
          href="https://veteransmapsearch.azurewebsites.net/default.aspx"
          target="_blank"
        >
          Upload you JST
        </Link>
      </NavbarButton>
      <NavbarButton>
        <Link href="https://mappingarticulatedpathways.azurewebsites.net/modules/security/Login.aspx" target='_blank'>
          Sign into MAP
        </Link>
      </NavbarButton>
    </nav>
  );
}
function NavbarButton({children}:{children:React.ReactNode}) {
  return (
    <Button variant="secondary" className="bg-yellow-500">
      {children}
    </Button>
  );
}