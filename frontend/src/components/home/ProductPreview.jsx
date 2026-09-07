function ProductPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">

        {/* Top bar */}
        <div className="flex h-10 items-center justify-between border-b border-white/5 px-4">

          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          </div>

          <span className="text-[10px] text-slate-600">
            DevMentor AI Workspace
          </span>

          <div className="flex items-center gap-2 text-[10px] text-lime-300">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            AI Online
          </div>

        </div>


        {/* Workspace */}
        <div className="grid md:grid-cols-[150px_1fr_310px]">

          {/* Sidebar */}
          <aside className="hidden border-r border-white/5 p-4 md:block">

            <p className="mb-4 text-[9px] uppercase tracking-widest text-slate-600">
              Workspace
            </p>

            <div className="space-y-2">

              <div className="rounded-md bg-lime-300/10 px-3 py-2 text-xs text-lime-200">
                ✦ Ask AI
              </div>

              <div className="rounded-md px-3 py-2 text-xs text-slate-500">
                ⌁ Debug Code
              </div>

              <div className="rounded-md px-3 py-2 text-xs text-slate-500">
                &lt;/&gt; Explain
              </div>

            </div>

          </aside>


          {/* Code Editor */}
          <div className="border-b border-white/5 md:border-b-0 md:border-r">

            <div className="border-b border-white/5 px-4 py-3">
              <span className="text-[10px] text-slate-500">
                example.js
              </span>
            </div>

            <div className="p-5 font-mono text-xs leading-7">

              <p>
                <span className="mr-5 text-slate-700">01</span>
                <span className="text-purple-300">function</span>{" "}
                <span className="text-blue-300">
                  calculateTotal
                </span>
                <span className="text-slate-500">
                  (items) {"{"}
                </span>
              </p>

              <p>
                <span className="mr-5 text-slate-700">02</span>
                <span className="text-slate-500">
                  &nbsp;&nbsp;let total = 0;
                </span>
              </p>

              <p>
                <span className="mr-5 text-slate-700">03</span>
                <span className="text-slate-500">
                  &nbsp;&nbsp;items.forEach(item =&gt; {"{"}
                </span>
              </p>

              <p>
                <span className="mr-5 text-slate-700">04</span>
                <span className="text-slate-500">
                  &nbsp;&nbsp;&nbsp;&nbsp;total += item.price;
                </span>
              </p>

              <p>
                <span className="mr-5 text-slate-700">05</span>
                <span className="text-slate-500">
                  &nbsp;&nbsp;{"}"});
                </span>
              </p>

              <p>
                <span className="mr-5 text-slate-700">06</span>
                <span className="text-lime-300">
                  &nbsp;&nbsp;return total;
                </span>
              </p>

              <p>
                <span className="mr-5 text-slate-700">07</span>
                <span className="text-slate-500">{"}"}</span>
              </p>

            </div>

          </div>


          {/* AI Response */}
          <div className="bg-[#0a0c10] p-5">

            <div className="mb-5 flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-lime-300/10 text-lime-300">
                ✦
              </div>

              <div>
                <p className="text-xs font-semibold">
                  DevMentor AI
                </p>

                <p className="text-[9px] text-slate-600">
                  Context-aware mentor
                </p>
              </div>

            </div>


            {/* User question */}
            <div className="rounded-lg border border-white/5 p-4">

              <p className="text-[10px] text-slate-600">
                YOU
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Explain what this function does.
              </p>

            </div>


            {/* AI answer */}
            <div className="mt-3 rounded-lg border border-lime-300/10 bg-lime-300/[0.03] p-4">

              <p className="text-[10px] font-medium text-lime-300">
                DEVMentor AI
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                This function calculates the total price
                of all items. It loops through each item
                and adds its price to the running total.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductPreview;