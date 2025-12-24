import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  // 'use cache'
  // cacheLife('hours');
  // const response = await fetch(``)
  return (
    <section>
      <h1 className='text-center'>The Hub for Every Developer <br /> Event You Can&apos;t Miss</h1>
    </section>
  )
}

export default Page