    // app/not-found.tsx
    import Link from 'next/link';

    export default function NotFound() {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800'>
          <h1 className=''>404 - Page Not Found</h1>
          <p className=''>The page you are looking for does not exist.</p>
          <Link href="/">Go back to Home</Link>
        </div>
      );
    }