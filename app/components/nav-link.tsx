import Link from 'next/link';
import React from 'react';

interface NavLinkProps {
  href: string;
  title: string;
}

const NavLink = ({ href, title }: NavLinkProps) => {
  return (
    <Link href={href} className="text-xs text-sky-700">
      {title}
    </Link>
  );
};

export default React.memo(NavLink);
