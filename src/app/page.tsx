import ChessBoard from "../components/ChessBoard";

export default function Home() {
  return (
    <>
   

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
  {/* <!-- col-lg-4 col-md-6 col-sm-12 --> */}
  <div className="col-span-1 md:col-span-1 lg:col-span-2 rounded-2xl light-square shadow-md p-5">
  <main className="w-full h-full flex flex-col items-center justify-between">
      <ChessBoard />
    </main>
  </div>

  {/* <!-- col-lg-8 col-md-6 col-sm-12 --> */}
  <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl shadow-md light-square p-4">
    
  </div>
</div>

    </>
    
  )
}

