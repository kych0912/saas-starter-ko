import Script from 'next/script';

export default async function BillingPage({searchParams}: {searchParams: Promise<{session: string}>}) {
    const {session} = await searchParams;

    return(
        <>
            <div id='step-shop-embed' data-type='subscription'>
                <script type='application/json'>
                    {JSON.stringify({
                        storeUuid: "3d19f9f2-c278-43a2-8c02-f19ad1152f51",
                        session: session
                    })}
                </script>
            </div>
            <Script defer src='https://cdn.steppay.kr/production-loader.js'/>
        </>
    )
}
