import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Play, CheckCircle2, Video, Link as LinkIcon, Volume2, ArrowRight, Sparkles, Star, BarChart3, Layers, Zap, Smartphone, MousePointerClick, Split, ShieldCheck, Linkedin, Youtube, Instagram, Twitter, Facebook } from 'lucide-react';

interface HomeProps {
  onStartCreate: (url?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartCreate }) => {
  const [urlInput, setUrlInput] = useState('');

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-dark relative overflow-hidden text-slate-50">
      
      {/* Background Aurora Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main Top Radial */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-aurora-main opacity-60 blur-[100px]"></div>
        {/* Secondary Glows */}
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[-20%] w-[60vw] h-[60vh] bg-blue-900/10 blur-[100px]"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-36 pb-20 px-4 text-center">
            {/* Announcement Bar */}
            <div className="flex justify-center mb-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-1 py-1 pr-4 hover:bg-white/10 transition-colors cursor-pointer">
                     <span className="bg-brand-purple text-white text-[10px] font-bold px-2 py-1 rounded-full">NEW</span>
                     <span className="text-sm text-white/90">Introducing the world's first AI Ad Library</span>
                     <ArrowRight className="w-3 h-3 text-white/50" />
                </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 drop-shadow-2xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                AI Ads that win.
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-3 font-medium max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Winning video ads, made and tested for you.
            </p>
            <p className="text-lg text-indigo-200/70 mb-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                (yes, it's really that simple)
            </p>

            <div className="flex flex-col items-center gap-6 mb-20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <Button variant="creatify" onClick={() => onStartCreate()}>
                    START FOR FREE
                </Button>
                
                <div className="flex items-center gap-6 text-xs font-medium text-indigo-200/60 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-purple" /> No credit card required
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className="flex text-white"><Star className="w-3 h-3 fill-white" /><Star className="w-3 h-3 fill-white" /><Star className="w-3 h-3 fill-white" /><Star className="w-3 h-3 fill-white" /><Star className="w-3 h-3 fill-white/50" /></div> 
                        Rated 4.7/5 on G2
                    </span>
                </div>
            </div>

        {/* Video Carousel */}
        <div className="w-full overflow-x-auto pb-8 hide-scrollbar relative mask-fade-sides animate-fade-in" style={{animationDelay: '0.5s'}}>
             <div className="flex gap-6 px-20 min-w-max mx-auto justify-center">
                {[
                    { title: "THE NEW SILHOUETTE.", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80" },
                    { title: "was just my reality until...", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" },
                    { title: "Introducing the Nova", img: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=400&q=80" },
                    { title: "NEW", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80" },
                    { title: "OH, WOW.", img: "https://images.unsplash.com/photo-1529139574466-a302c27560a0?auto=format&fit=crop&w=400&q=80" },
                    { title: "Perfume", img: "https://images.unsplash.com/photo-1594068935971-7d7762f747c5?auto=format&fit=crop&w=400&q=80" }
                ].map((item, idx) => (
                    <div key={idx} className="relative w-[220px] h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer hover:-translate-y-3 transition-all duration-300 hover:shadow-brand-purple/20">
                        <img src={item.img} alt="Ad" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                        <div className="absolute bottom-5 left-5 text-white font-bold text-xl leading-none uppercase font-serif tracking-wide">
                            {item.title}
                        </div>
                        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                            <Volume2 className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </section>

      {/* FEATURE BLOCKS */}
      <section className="py-20 px-4 space-y-12 max-w-7xl mx-auto relative z-10">
          
          {/* 1. AI AVATAR SECTION - Peachy Gradient */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#ffedd5] via-[#ffcccc] to-[#fca5a5] p-8 md:p-16 overflow-hidden relative shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                  
                  {/* Text Content */}
                  <div className="text-left order-2 lg:order-1">
                      <div className="inline-flex items-center gap-2 text-purple-700 font-bold tracking-wider text-xs uppercase mb-4 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">
                          <Sparkles className="w-3 h-3" /> Avatar Creation
                      </div>
                      <h3 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">AI Avatar</h3>
                      <p className="text-slate-700 text-lg mb-8 leading-relaxed font-medium">
                          Create expressive AI avatars that speak, emote, and move naturally. Choose from our curated avatar library, design a custom avatar, or bring your own. Perfect for ads, content, and more.
                      </p>
                      
                      <Button variant="creatify" onClick={() => onStartCreate()} className="shadow-xl shadow-purple-900/10">
                          CREATE YOUR AVATAR
                      </Button>
                  </div>

                  {/* Right Visual - Avatar Grid */}
                  <div className="order-1 lg:order-2 relative h-[400px] lg:h-[500px] flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 w-full max-w-md transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 ease-out">
                           {[
                               "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                               "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
                               "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
                               "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
                               "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
                               "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                           ].map((src, i) => (
                               <div key={i} className={`rounded-2xl overflow-hidden shadow-lg border-4 border-white ${i % 2 === 0 ? 'translate-y-4' : '-translate-y-4'}`}>
                                   <img src={src} alt="Avatar" className="w-full h-full object-cover aspect-[3/4]" />
                               </div>
                           ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* 2. PRODUCT VIDEO SECTION - Dark Purple Gradient */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#2e1065] to-[#4c1d95] p-8 md:p-16 overflow-hidden relative shadow-2xl border border-white/10">
               {/* Background decorative elements */}
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    
                    {/* Left Visual - Product Collage */}
                    <div className="relative h-[400px] lg:h-[500px]">
                        <div className="absolute top-[10%] left-[10%] w-56 h-72 bg-white rounded-2xl shadow-2xl p-2 transform -rotate-12 z-10 hover:scale-105 transition-transform duration-300">
                            <img src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-black shadow-sm">
                                RADIANT GLOW
                            </div>
                        </div>
                        <div className="absolute top-[20%] right-[10%] w-48 h-64 bg-[#fff1f2] rounded-2xl shadow-2xl p-2 transform rotate-6 z-20 hover:scale-105 transition-transform duration-300">
                            <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover rounded-xl" />
                        </div>
                         <div className="absolute bottom-[10%] left-[25%] w-64 h-48 bg-[#f0fdf4] rounded-2xl shadow-2xl p-2 transform -rotate-3 z-30 hover:scale-105 transition-transform duration-300">
                            <img src="https://images.unsplash.com/photo-1556228720-19de77d08619?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 text-purple-200 font-bold tracking-wider text-xs uppercase mb-4 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                          <Video className="w-3 h-3" /> Ad Creation
                        </div>
                        <h3 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Product Video</h3>
                        <p className="text-purple-100/80 text-lg mb-8 leading-relaxed">
                            Turn any product image into cinematic product shots, helping brands create stunning on-brand content faster, cheaper, and at scale.
                        </p>
                        
                        <Button variant="creatify" onClick={() => onStartCreate()}>
                            CREATE A PRODUCT VIDEO
                        </Button>
                    </div>
               </div>
          </div>

          {/* 3. ADMAX SECTION - Orange/Pink Sunset Gradient */}
          <div className="rounded-[2.5rem] bg-gradient-to-r from-[#fdba74] via-[#fca5a5] to-[#e879f9] p-8 md:p-16 overflow-hidden relative shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
                   {/* Content */}
                   <div className="lg:col-span-2">
                      <div className="inline-flex items-center gap-2 text-blue-700 font-bold tracking-wider text-xs uppercase mb-4 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">
                          <BarChart3 className="w-3 h-3" /> All-in-one Performance Suite
                      </div>
                      <h3 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">AdMax</h3>
                      <p className="text-slate-800 text-lg mb-8 leading-relaxed font-medium">
                          From idea to optimization—automatically AdMax finds top creative trends, including what's working for competitors, generates video variants, and runs structured AI tests. Tweak visuals, voice, CTA, format—then launch and track results in one place.
                      </p>
                      
                      <Button variant="creatify" onClick={() => onStartCreate()}>
                          SEE HOW ADMAX WORKS
                      </Button>
                   </div>

                   {/* Silhouette Visuals */}
                   <div className="lg:col-span-3 h-[400px] relative flex items-end justify-center lg:justify-end">
                        {/* Abstract crowd silhouettes using CSS blend modes or simple shapes */}
                        <div className="absolute bottom-0 right-0 w-full h-full flex items-end justify-end gap-0 opacity-90 mix-blend-multiply">
                            <img src="https://illustrations.popsy.co/amber/surr-hitchhiking.svg" className="h-[350px] w-auto transform translate-y-10" alt="Silhouette" />
                             <img src="https://illustrations.popsy.co/amber/surr-party.svg" className="h-[300px] w-auto transform translate-y-5 -ml-20" alt="Silhouette" />
                             <img src="https://illustrations.popsy.co/amber/surr-standing.svg" className="h-[380px] w-auto transform translate-y-10 -ml-20" alt="Silhouette" />
                        </div>
                   </div>
              </div>
          </div>

      </section>

      {/* SUPPORT TEAMS SECTION */}
      <section className="py-20 bg-black/20 relative z-10">
           <div className="max-w-7xl mx-auto px-4">
               <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-16">Support fast-moving teams</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                       {
                           icon: <Layers className="w-8 h-8 text-cyan-400" />,
                           title: "Creative Teams",
                           desc: "Skip studio shoots, generate assets instantly",
                           gradient: "from-blue-900/40 to-slate-900/40"
                       },
                       {
                           icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
                           title: "Performance Marketers",
                           desc: "Launch 20+ creatives/day, test ROAS quickly",
                           gradient: "from-purple-900/40 to-slate-900/40"
                       },
                       {
                           icon: <Zap className="w-8 h-8 text-pink-400" />,
                           title: "Business Owners",
                           desc: "Produce ad-ready videos in minutes, without added headcount.",
                           gradient: "from-pink-900/40 to-slate-900/40"
                       }
                   ].map((item, idx) => (
                       <div key={idx} className={`bg-gradient-to-b ${item.gradient} border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:border-white/20 transition-colors group`}>
                           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] border border-white/5">
                               {item.icon}
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                           <p className="text-indigo-200/60 text-lg">{item.desc}</p>
                       </div>
                   ))}
               </div>
           </div>
      </section>

      {/* HOW ADMAX WORKS */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-20">How AdMax works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Card 1: Get Inspired (Dark) */}
               <div className="bg-[#0f0c29] border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col h-[500px] relative overflow-hidden group hover:border-brand-purple/50 transition-colors">
                    <div className="relative z-10 mb-8">
                        <div className="w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">1</div>
                        <h3 className="text-3xl font-bold text-white mb-2">Get Inspired</h3>
                        <p className="text-slate-400">Find what wins.</p>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs">Explore top-performing ads across your category or competitors by hook, selling point, and visuals.</p>
                    </div>
                    {/* Mock UI - Video Feed */}
                    <div className="absolute bottom-0 right-0 w-[80%] h-[60%] bg-slate-900 rounded-tl-2xl border-t border-l border-white/10 p-4 grid grid-cols-3 gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {[1,2,3,4,5,6].map(n => (
                            <div key={n} className="bg-slate-800 rounded-lg h-full w-full overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                    <div className="h-2 w-12 bg-white/30 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
               </div>

               {/* Card 2: Create Winning Ads (Light Gradient) */}
               <div className="bg-gradient-to-br from-[#ffedd5] to-[#fff7ed] border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col h-[500px] relative overflow-hidden group">
                    <div className="relative z-10 mb-8">
                        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg">2</div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Create Winning Ads</h3>
                        <p className="text-slate-600 font-bold">From link to launch - instantly.</p>
                         <p className="text-sm text-slate-500 mt-2 max-w-xs">Turn any URL or static asset into a scroll-stopping video ads. Customize with music, avatars, or voiceovers.</p>
                    </div>
                    {/* Mock UI - Editor */}
                    <div className="absolute bottom-0 right-0 w-[85%] h-[60%] bg-white rounded-tl-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-4 flex flex-col border-t border-l border-slate-100">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            </div>
                            <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                        </div>
                        <div className="flex gap-4 h-full">
                            <div className="w-1/3 bg-slate-50 rounded-lg border border-slate-100"></div>
                            <div className="flex-1 bg-brand-purple/5 rounded-lg border border-dashed border-brand-purple/20 flex items-center justify-center">
                                <Video className="text-brand-purple/40 w-8 h-8" />
                            </div>
                        </div>
                    </div>
               </div>

               {/* Card 3: Launch and Test (Gradient) */}
               <div className="bg-gradient-to-br from-[#e0e7ff] to-[#fae8ff] border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col h-[500px] relative overflow-hidden group">
                   <div className="relative z-10 mb-8">
                        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg">3</div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Launch and Test</h3>
                        <p className="text-slate-600 font-bold">Test everything with rigor.</p>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs">Run creative tests across video variants. Discover what works by format, tone, or audience—automatically.</p>
                    </div>
                    {/* Mock UI - AB Test Cards */}
                     <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] flex justify-center gap-4">
                         <div className="w-32 h-48 bg-white rounded-xl shadow-xl p-2 transform -rotate-6 translate-y-2 hover:translate-y-0 transition-transform duration-300">
                             <div className="bg-slate-100 w-full h-24 rounded-lg mb-2"></div>
                             <div className="h-2 w-16 bg-slate-100 rounded mb-1"></div>
                             <div className="h-2 w-10 bg-slate-100 rounded"></div>
                             <div className="mt-4 flex justify-between text-[10px] font-bold text-green-500">
                                 <span>A</span> <span>4.2% CTR</span>
                             </div>
                         </div>
                         <div className="w-32 h-48 bg-white rounded-xl shadow-xl p-2 transform rotate-6 hover:translate-y-0 transition-transform duration-300 z-10 border-2 border-green-400">
                             <div className="bg-slate-100 w-full h-24 rounded-lg mb-2"></div>
                             <div className="h-2 w-16 bg-slate-100 rounded mb-1"></div>
                             <div className="h-2 w-10 bg-slate-100 rounded"></div>
                              <div className="mt-4 flex justify-between text-[10px] font-bold text-green-600">
                                 <span>B</span> <span>6.8% CTR</span>
                             </div>
                         </div>
                     </div>
               </div>

               {/* Card 4: Learn and Optimize (White) */}
               <div className="bg-white border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col h-[500px] relative overflow-hidden group">
                   <div className="relative z-10 mb-8">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Learn and Optimize</h3>
                        <p className="text-slate-600 font-bold">Know what's working—and why.</p>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs">Get real-time insights on ROAS, CPA, and other key metrics. Spot fatigue and rapidly improve campaigns.</p>
                    </div>
                    {/* Mock UI - Dashboard Table */}
                     <div className="absolute bottom-0 inset-x-0 h-[50%] bg-slate-50 border-t border-slate-200 p-6 flex flex-col gap-3 group-hover:h-[55%] transition-all">
                         <div className="flex justify-between items-center mb-2">
                             <div className="font-bold text-slate-800 text-sm">Campaign Performance</div>
                             <div className="text-xs text-slate-400">Last 7 Days</div>
                         </div>
                         {[1,2,3].map(i => (
                             <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-100 shadow-sm">
                                 <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 bg-slate-200 rounded"></div>
                                     <span className="text-slate-600 font-medium">Ad_Variant_0{i}</span>
                                 </div>
                                 <span className="text-green-600 font-bold">+$1,20{i}.00</span>
                             </div>
                         ))}
                     </div>
               </div>
          </div>
      </section>

      {/* TRUST & AWARDS SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Investors */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl flex flex-col justify-between min-h-[320px]">
                <div>
                    <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed">
                        We've raised $23M from the best in the industry such as WndrCo, Kindred Ventures, and NFDG.
                    </p>
                    <div className="flex items-center gap-3 opacity-80 grayscale hover:grayscale-0 transition-all">
                        <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full" title="WndrCo"></div>
                        <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold" title="Kindred">K</div>
                        <div className="h-8 w-16 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold" title="NFDG">NFDG</div>
                    </div>
                </div>
                <a href="#" className="text-brand-purple font-bold text-xs flex items-center gap-2 uppercase tracking-widest mt-8 group">
                    Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                </a>
            </div>
            
            {/* Card 2: G2 Badges */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl flex flex-col justify-between min-h-[320px]">
                <div>
                    <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed">
                        We've earned 40+ badges and hold a 4.7/5 rating on G2.
                    </p>
                    <div className="flex gap-2">
                        {[1,2,3].map(i => (
                             <div key={i} className="w-12 h-16 bg-gradient-to-b from-red-400 to-orange-500 rounded-sm relative flex items-center justify-center p-0.5">
                                 <div className="bg-white w-full h-full flex flex-col items-center justify-center text-[8px] font-bold text-center leading-tight p-1">
                                     <span className="text-orange-500">G2</span>
                                     <span className="text-slate-900 mt-1">LEADER</span>
                                     <span className="text-slate-400 text-[6px]">2025</span>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
                <a href="#" className="text-brand-purple font-bold text-xs flex items-center gap-2 uppercase tracking-widest mt-8 group">
                    Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                </a>
            </div>

            {/* Card 3: Press */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl flex flex-col justify-between min-h-[320px]">
                <div>
                     <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed">
                        We've been featured and recognized by leading publications like Fast Company, Bloomberg, and TechCrunch.
                    </p>
                    <div className="flex items-center gap-4 opacity-80 grayscale hover:grayscale-0 transition-all">
                        <div className="bg-black text-white text-xl font-serif italic px-1 font-bold">FC</div>
                        <div className="text-green-600 font-bold tracking-tighter">TechCrunch</div>
                        <div className="font-bold text-slate-900">Bloomberg</div>
                    </div>
                </div>
                 <a href="#" className="text-brand-purple font-bold text-xs flex items-center gap-2 uppercase tracking-widest mt-8 group">
                    Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                </a>
            </div>
        </div>
      </section>

      {/* PLATFORMS & COMPLIANCE */}
      <section className="px-4 max-w-7xl mx-auto relative z-10 mb-32">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Platforms (2/3 width) */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-xl flex flex-col justify-between">
                 <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Compatible with Platforms</h3>
                    <p className="text-slate-500 text-lg mb-10 max-w-md">Works with Meta, TikTok, Youtube, Snap, Amazon and more.</p>
                    <div className="flex gap-6 flex-wrap items-center opacity-70 grayscale-[100%] hover:grayscale-0 transition-all duration-500">
                        <Facebook className="w-8 h-8 text-blue-600" />
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">Tik</div>
                        <Linkedin className="w-8 h-8 text-blue-700" />
                        <Youtube className="w-8 h-8 text-red-600" />
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center"><div className="w-4 h-4 bg-white rounded-full border-2 border-black"></div></div>
                        <span className="font-bold text-slate-800 flex items-center gap-1">amazon <span className="text-orange-500">►</span></span>
                    </div>
                 </div>
                  <a href="#" className="text-brand-purple font-bold text-xs flex items-center gap-2 uppercase tracking-widest mt-12 group">
                    Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                 </a>
              </div>
              
              {/* Compliance (1/3 width) */}
              <div className="bg-white rounded-[2rem] p-10 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Compliance</h3>
                    <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                        Enterprise-grade security and compliance — including <strong className="text-slate-900">SOC 2 Type II</strong>. Your data stays protected and under your control.
                    </p>
                    {/* SOC Badge */}
                    <div className="w-20 h-20 bg-[#2e1065] rounded-full flex flex-col items-center justify-center text-white shadow-lg border-4 border-[#4c1d95]">
                        <div className="text-[8px] uppercase tracking-wider opacity-70">Powered by</div>
                        <div className="font-bold text-sm">Vanta</div>
                        <ShieldCheck className="w-4 h-4 mt-1 text-green-400" />
                    </div>
                  </div>
                   <a href="#" className="text-brand-purple font-bold text-xs flex items-center gap-2 uppercase tracking-widest mt-8 group">
                     Download <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                  </a>
              </div>
           </div>
      </section>
      
      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] pt-24 pb-12 border-t border-white/5 relative z-10 text-slate-300">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                  
                  {/* Left Brand Column */}
                  <div className="lg:col-span-4 space-y-8">
                      <div className="flex items-center gap-2 font-bold text-2xl text-white">
                          <Sparkles className="w-6 h-6 text-brand-purple fill-current" />
                          creatify
                      </div>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
                          Generate engaging video ads for your products from any URL
                      </p>
                      
                      {/* Socials */}
                      <div className="flex gap-4">
                          {[Linkedin, Instagram, Youtube, Twitter, Facebook].map((Icon, i) => (
                              <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                                  <Icon className="w-5 h-5" />
                              </a>
                          ))}
                      </div>

                      {/* Partners */}
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                           <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded text-xs font-medium text-white">
                               <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div> Snapchat Marketing Partner
                           </div>
                           <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded text-xs font-medium text-white">
                               <div className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center font-bold text-[8px]">T</div> TikTok App Center
                           </div>
                      </div>

                       {/* Investors */}
                       <div className="flex gap-4 pt-2">
                            <div className="text-xs font-bold tracking-widest text-white/60 uppercase">AI GRANT</div>
                            <div className="text-xs font-bold tracking-widest text-white/60 uppercase flex items-center gap-1"><div className="w-2 h-2 bg-green-500"></div> NVIDIA</div>
                       </div>

                       {/* Product Hunt Badge */}
                       <div className="bg-white text-orange-600 border border-orange-200 rounded-lg p-2 w-fit flex items-center gap-3 shadow-lg">
                            <div className="flex flex-col items-center justify-center px-2 border-r border-orange-100">
                                <div className="text-xs font-bold uppercase text-orange-400">Product Hunt</div>
                                <div className="text-xl font-bold">#1</div>
                            </div>
                            <div className="text-xs font-medium text-slate-600 pr-2">
                                Product of the Day
                            </div>
                       </div>
                  </div>

                  {/* Right Links Columns */}
                  <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                      
                      {/* Column 1: Features */}
                      <div>
                          <h4 className="text-white font-bold text-lg mb-6">Features</h4>
                          <ul className="space-y-3">
                              {['All Features', 'All Tools', 'URL to Video', 'AI Avatar', 'Asset Generator', 'Product Video', 'BYOA Avatar', 'DYOA Avatar', 'Veo 3 Ads', 'Batch Mode', 'Text to Speech', 'AI Script Writer', 'AI Editing', 'API'].map(item => (
                                  <li key={item}><a href="#" className="text-sm hover:text-brand-purple transition-colors">{item}</a></li>
                              ))}
                          </ul>
                      </div>

                      {/* Column 2: Use Cases */}
                      <div>
                          <h4 className="text-white font-bold text-lg mb-6">Use Cases</h4>
                          <ul className="space-y-3">
                              {['eCommerce', 'Apps', 'Games', 'DTC Brands', 'Agencies', 'UGC', 'TikTok', 'Real Estate', 'Instagram', 'Facebook', 'YouTube', 'Snapchat', 'Shopify', 'Create AI Avatar', 'OTT & CTV', 'Lead Generation'].map(item => (
                                  <li key={item}><a href="#" className="text-sm hover:text-brand-purple transition-colors">{item}</a></li>
                              ))}
                          </ul>
                      </div>

                      {/* Column 3: Company */}
                      <div>
                          <h4 className="text-white font-bold text-lg mb-6">Company</h4>
                          <ul className="space-y-3">
                              {['Blog', 'Pricing', 'About Us', 'Case Studies', 'Learning Center', 'Become an Affiliate', 'Contact Us', 'Careers', 'AI Ethics'].map(item => (
                                  <li key={item}><a href="#" className="text-sm hover:text-brand-purple transition-colors">{item}</a></li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                  <div>Creatify Lab • Copyright © 2025</div>
                  <div className="flex gap-6">
                      <a href="#" className="hover:text-white transition-colors">Terms of service</a>
                      <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
                      <a href="#" className="hover:text-white transition-colors">Moderation policy</a>
                  </div>
              </div>
          </div>
      </footer>

    </div>
  );
};