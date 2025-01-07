'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Brand Logo</h2>
        </div>
        <div>
          <Link href="/judgments" style={{ marginRight: '1rem' }}>
            Judgments
          </Link>
          <Link href="/ocr">OCR</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
