export default function SidebarHeader() {
  return (
    <div className="border-b border-pink-100 p-6">

      <h1 className="text-2xl font-black text-pink-600">
        DONARA
      </h1>

      <div className="mt-4 flex items-center gap-3">

        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">
          👤
        </div>

        <div>

          <p className="font-bold">
            Administrator
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500">

            <div className="h-2 w-2 rounded-full bg-green-500" />

            Online

          </div>

        </div>

      </div>

    </div>
  );
}