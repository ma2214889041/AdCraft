import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { analyzeProductImage, analyzeProductUrl, generateSellingPoints, generateVideoAd, generateAIProductScene } from '../services/adService';
import { ScrapedProduct, ProductAsset, AdConfig, GenerationStatus } from '../types';
import { Search, Globe, ArrowRight, ArrowLeft, CheckCircle2, Plus, Image as ImageIcon, Wand2, Sparkles, LayoutTemplate, Download, Video, Play, Loader2, Star, Upload } from 'lucide-react';

export const ImageAds: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0: Input (URL or File), 1: Config
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'url' | 'file'>('file'); // Default to file upload
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [scrapedData, setScrapedData] = useState<ScrapedProduct | null>(null);
  const [isRegeneratingPoints, setIsRegeneratingPoints] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Scene Generation State
  const [showSceneGenerator, setShowSceneGenerator] = useState(false);
  const [scenePrompt, setScenePrompt] = useState('');
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);

  // Video State
  const [previewMode, setPreviewMode] = useState<'images' | 'video'>('images');
  const [videoStatus, setVideoStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Config State
  const [config, setConfig] = useState<AdConfig>({
    productName: '',
    productDescription: '',
    sellingPoints: ['', '', ''],
    brandColor: '#6366f1',
    promo: {
      enabled: true,
      originalPrice: '$0.00',
      promoPrice: '$0.00',
      discountText: 'Free Shipping'
    },
    templateId: 'modern'
  });

  const [assets, setAssets] = useState<ProductAsset[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      setInputMode('file');
    }
  };

  const handleAnalyze = async () => {
    // Validate input based on mode
    if (inputMode === 'url' && !urlInput.trim()) return;
    if (inputMode === 'file' && !uploadedFile) return;

    setStatus(GenerationStatus.ANALYZING);

    try {
      let data: ScrapedProduct;

      // Use appropriate analysis method based on input mode
      if (inputMode === 'file' && uploadedFile) {
        console.log('📸 Analyzing uploaded product image with Gemini Vision...');
        data = await analyzeProductImage(uploadedFile);
      } else {
        console.log('🔗 Analyzing product URL...');
        data = await analyzeProductUrl(urlInput);
      }

      setScrapedData(data);
      setAssets(data.images);

      // Pre-fill config with AI analyzed data
      setConfig(prev => {
          // Calculate a discount if price is available
          const priceStr = data.price || "$59.99";
          const numPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 59.99;
          const promoNum = (numPrice * 0.8).toFixed(2);

          return {
            ...prev,
            productName: data.title,
            productDescription: data.description,
            sellingPoints: data.sellingPoints || ['', '', ''],
            promo: {
                ...prev.promo,
                originalPrice: priceStr,
                promoPrice: `$${promoNum}`
            }
          };
      });

      // If no selling points returned, try generating them
      if (!data.sellingPoints || data.sellingPoints.length === 0) {
         try {
             const points = await generateSellingPoints(data.title, data.description);
             setConfig(prev => ({ ...prev, sellingPoints: points }));
         } catch (err) {
             console.error("Failed to generate backup selling points", err);
         }
      }

      setStatus(GenerationStatus.IDLE);
      setStep(1);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleRegeneratePoints = async () => {
    if (!config.productName && !config.productDescription) return;
    setIsRegeneratingPoints(true);
    try {
        const points = await generateSellingPoints(config.productName, config.productDescription);
        setConfig(prev => ({ ...prev, sellingPoints: points }));
    } catch (error) {
        console.error(error);
    } finally {
        setIsRegeneratingPoints(false);
    }
  };

  const handleGenerateVideo = async () => {
    const selectedImage = assets.find(a => a.selected) || assets[0];
    if (!selectedImage) return;

    setVideoStatus(GenerationStatus.GENERATING_VIDEO);
    try {
        const videoUri = await generateVideoAd(selectedImage.url, config.productDescription);
        setGeneratedVideoUrl(videoUri);
        setVideoStatus(GenerationStatus.COMPLETED);
    } catch (e) {
        console.error(e);
        setVideoStatus(GenerationStatus.ERROR);
    }
  };

  const handleGenerateScene = async () => {
      const selectedImage = assets.find(a => a.selected) || assets[0];
      if (!selectedImage || !scenePrompt) return;
      
      setIsGeneratingScene(true);
      try {
          const newImageUrl = await generateAIProductScene(selectedImage.url, scenePrompt);
          const newAsset: ProductAsset = {
              id: `ai-${Date.now()}`,
              url: newImageUrl,
              selected: true
          };
          // Add to assets and select it
          setAssets(prev => [newAsset, ...prev.map(a => ({...a, selected: false}))]);
          setShowSceneGenerator(false);
          setScenePrompt('');
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingScene(false);
      }
  };

  const toggleAssetSelection = (id: string) => {
    setAssets(prev => prev.map(a => 
      a.id === id ? { ...a, selected: !a.selected } : a
    ));
  };

  const selectedAssets = assets.filter(a => a.selected);

  // --- RENDER STEP 0: FILE UPLOAD OR URL INPUT ---
  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-20 text-center">
         <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3" /> AI Ad Generator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Upload product image or share <span className="text-brand-purple">product link</span>
            </h1>
            <p className="text-slate-400 mb-8">
                AI-powered product analysis using Google Gemini Vision
            </p>
         </div>

         <div className="max-w-2xl mx-auto space-y-6">
            {/* Mode Switcher */}
            <div className="flex gap-2 p-1 bg-surface/50 rounded-lg border border-white/10 w-fit mx-auto">
                <button
                    onClick={() => setInputMode('file')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                        inputMode === 'file'
                            ? 'bg-brand-purple text-white'
                            : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Image
                </button>
                <button
                    onClick={() => setInputMode('url')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                        inputMode === 'url'
                            ? 'bg-brand-purple text-white'
                            : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Globe className="w-4 h-4 inline mr-2" />
                    Product URL
                </button>
            </div>

            {/* File Upload Mode */}
            {inputMode === 'file' && (
                <div className="space-y-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed border-white/20 rounded-xl p-12 bg-surfaceHighlight/20 hover:bg-surfaceHighlight/30 hover:border-brand-purple/50 transition-all cursor-pointer group"
                    >
                        {uploadedFile ? (
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-brand-purple/20 text-brand-purple rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{uploadedFile.name}</p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setUploadedFile(null);
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto group-hover:bg-brand-purple/20 transition-colors">
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-purple transition-colors" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Click to upload product image</p>
                                    <p className="text-sm text-slate-400">PNG, JPG, JPEG up to 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full h-12"
                        onClick={handleAnalyze}
                        isLoading={status === GenerationStatus.ANALYZING}
                        disabled={!uploadedFile}
                    >
                        {status === GenerationStatus.ANALYZING ? 'Analyzing with AI...' : 'Analyze Product Image'}
                    </Button>
                </div>
            )}

            {/* URL Input Mode */}
            {inputMode === 'url' && (
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => {
                                setUrlInput(e.target.value);
                                setInputMode('url');
                            }}
                            placeholder="e.g. amazon.com/dp/B08... or shopify.com/products/..."
                            className="w-full h-14 pl-12 pr-4 bg-surfaceHighlight/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                    </div>

                    <div className="flex justify-center gap-4 mb-4">
                        <div className="w-8 h-8 bg-white rounded-full p-1 opacity-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="w-full h-full object-contain" alt="Amazon"/>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-full p-1 opacity-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" className="w-full h-full object-contain" alt="Shopify"/>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-full p-1 opacity-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" className="w-full h-full object-contain" alt="eBay"/>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12"
                        onClick={handleAnalyze}
                        isLoading={status === GenerationStatus.ANALYZING}
                        disabled={!urlInput.trim()}
                    >
                        {status === GenerationStatus.ANALYZING ? 'Analyzing URL...' : 'Analyze Product URL'}
                    </Button>
                </div>
            )}

            {status === GenerationStatus.ERROR && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                        Analysis failed. Please try again or use a different {inputMode === 'file' ? 'image' : 'URL'}.
                    </p>
                </div>
            )}
         </div>
      </div>
    );
  }

  // --- RENDER STEP 1: CONFIG & GENERATION ---
  return (
    <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Set Up Your Image Ads</h1>
                <p className="text-slate-400 text-sm">Fill in product info and we'll generate the copy and visuals.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-5 space-y-8 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* 1. Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Brand / Product Name</label>
                        <input 
                            type="text"
                            value={config.productName}
                            onChange={(e) => setConfig({...config, productName: e.target.value})}
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-brand-purple outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Product Description</label>
                        <textarea 
                            value={config.productDescription}
                            onChange={(e) => setConfig({...config, productDescription: e.target.value})}
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white h-32 resize-none focus:border-brand-purple outline-none"
                        />
                    </div>
                </div>

                {/* 2. Asset Selection */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                         <label className="block text-xs font-bold text-slate-400 uppercase">Select Images ({selectedAssets.length})</label>
                         <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">Tips: Choose 3-5 images</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <button className="aspect-square bg-surface border border-white/10 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Plus className="w-6 h-6 mb-2" />
                            <span className="text-xs">Add assets</span>
                        </button>
                        {assets.map(asset => (
                            <div 
                                key={asset.id} 
                                onClick={() => toggleAssetSelection(asset.id)}
                                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${asset.selected ? 'border-brand-purple' : 'border-transparent hover:border-white/20'}`}
                            >
                                <img src={asset.url} className="w-full h-full object-cover" alt="asset"/>
                                {asset.selected && (
                                    <div className="absolute top-1 right-1 bg-brand-purple text-white rounded-full p-0.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Magic Scene Generator */}
                    <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-3">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowSceneGenerator(!showSceneGenerator)}>
                            <div className="flex items-center gap-2 text-sm font-bold text-brand-purple">
                                <Star className="w-4 h-4 fill-current" /> Magic Scene
                            </div>
                            <span className="text-xs text-brand-purple hover:underline">{showSceneGenerator ? 'Hide' : 'Generate new'}</span>
                        </div>
                        
                        {showSceneGenerator && (
                            <div className="mt-3 space-y-3 animate-fade-in">
                                <input 
                                    type="text" 
                                    placeholder="e.g. on a marble kitchen counter with sunlight"
                                    value={scenePrompt}
                                    onChange={(e) => setScenePrompt(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-purple outline-none"
                                />
                                <Button 
                                    size="sm" 
                                    className="w-full"
                                    onClick={handleGenerateScene}
                                    isLoading={isGeneratingScene}
                                    disabled={!scenePrompt}
                                >
                                    Generate AI Image
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mt-3">
                        <button onClick={() => setAssets(assets.map(a => ({...a, selected: true})))} className="text-xs bg-surface border border-white/10 px-3 py-1.5 rounded text-slate-300 hover:bg-white/5">Select all</button>
                        <button onClick={() => setAssets(assets.map(a => ({...a, selected: false})))} className="text-xs bg-surface border border-white/10 px-3 py-1.5 rounded text-slate-300 hover:bg-white/5">Unselect all</button>
                    </div>
                </div>

                {/* 3. Advanced Settings */}
                <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-white">Selling Points (AI Generated)</label>
                        <Wand2 className="w-4 h-4 text-brand-purple" />
                    </div>
                    <div className="space-y-3">
                        {config.sellingPoints.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xs text-slate-500">{idx + 1}</div>
                                <input 
                                    type="text" 
                                    value={point}
                                    onChange={(e) => {
                                        const newPoints = [...config.sellingPoints];
                                        newPoints[idx] = e.target.value;
                                        setConfig({...config, sellingPoints: newPoints});
                                    }}
                                    className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-purple outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Promo Info */}
                <div className="border-t border-white/10 pt-6">
                     <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-white">Promotional Info</label>
                        <div 
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${config.promo.enabled ? 'bg-brand-purple' : 'bg-slate-600'}`}
                            onClick={() => setConfig({...config, promo: {...config.promo, enabled: !config.promo.enabled}})}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${config.promo.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </div>
                    {config.promo.enabled && (
                        <div className="space-y-4 bg-surface/50 p-4 rounded-lg border border-white/5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Original Price</label>
                                    <input type="text" value={config.promo.originalPrice} onChange={(e) => setConfig({...config, promo: {...config.promo, originalPrice: e.target.value}})} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white"/>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Promo Price</label>
                                    <input type="text" value={config.promo.promoPrice} onChange={(e) => setConfig({...config, promo: {...config.promo, promoPrice: e.target.value}})} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Offer Text</label>
                                <div className="flex flex-wrap gap-2">
                                    {['50% off', 'Free shipping', 'Buy 1 Get 1'].map(tag => (
                                        <button 
                                            key={tag} 
                                            onClick={() => setConfig({...config, promo: {...config.promo, discountText: tag}})}
                                            className={`text-xs px-3 py-1 rounded-full border ${config.promo.discountText === tag ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/10'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT COLUMN: PREVIEW & RESULTS */}
            <div className="lg:col-span-7 bg-black/40 rounded-2xl border border-white/10 p-6 flex flex-col">
                 <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                     <div className="flex items-center gap-4">
                         <button 
                            onClick={() => setPreviewMode('images')}
                            className={`font-bold flex items-center gap-2 text-sm transition-colors ${previewMode === 'images' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                         >
                             <LayoutTemplate className="w-4 h-4" /> Image Ads
                         </button>
                         <div className="h-4 w-px bg-white/10"></div>
                         <button 
                            onClick={() => setPreviewMode('video')}
                            className={`font-bold flex items-center gap-2 text-sm transition-colors ${previewMode === 'video' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                         >
                             <Video className="w-4 h-4" /> Video Ad
                             {generatedVideoUrl && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                         </button>
                     </div>
                     <div className="flex gap-2">
                         {previewMode === 'images' && (
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleRegeneratePoints}
                                disabled={isRegeneratingPoints}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isRegeneratingPoints ? 'animate-spin' : ''}`}/> Regenerate
                            </Button>
                         )}
                         <Button size="sm" className="bg-white text-black hover:bg-slate-200"><Download className="w-4 h-4 mr-2"/> Export All</Button>
                     </div>
                 </div>
                 
                 {/* Canvas / Preview Area */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                    
                    {previewMode === 'images' ? (
                        <div className="grid grid-cols-2 gap-4">
                             {selectedAssets.length === 0 ? (
                                 <div className="col-span-2 h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-xl">
                                     <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                                     Select images to generate previews
                                 </div>
                             ) : (
                                selectedAssets.slice(0, 4).map((asset, idx) => (
                                    <div key={idx} className="relative aspect-[4/5] bg-white rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                                         {/* AD COMPOSITION */}
                                         <img src={asset.url} className="absolute inset-0 w-full h-full object-cover" alt="ad-preview" />
                                         
                                         {/* Overlay Gradient */}
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                         
                                         {/* Top Badge */}
                                         {config.promo.enabled && (
                                             <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                                 {config.promo.discountText}
                                             </div>
                                         )}

                                         {/* Content */}
                                         <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                             <h4 className="font-bold text-xl leading-tight mb-1 drop-shadow-md">
                                                {config.sellingPoints[idx % config.sellingPoints.length] || config.productName}
                                             </h4>
                                             <div className="flex items-center gap-3 mt-2">
                                                 {config.promo.enabled ? (
                                                     <>
                                                        <span className="text-2xl font-bold text-yellow-400">{config.promo.promoPrice}</span>
                                                        <span className="text-sm text-white/70 line-through decoration-red-500">{config.promo.originalPrice}</span>
                                                     </>
                                                 ) : (
                                                    <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full uppercase">Shop Now</button>
                                                 )}
                                             </div>
                                         </div>

                                         {/* Logo Placeholder */}
                                         <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur rounded-full border border-white/20"></div>
                                         
                                         {/* Hover Actions */}
                                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                             <Button size="sm">Edit</Button>
                                             <Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button>
                                         </div>
                                    </div>
                                ))
                             )}
                        </div>
                    ) : (
                        // VIDEO PREVIEW MODE
                        <div className="h-full flex flex-col items-center justify-center">
                            {!generatedVideoUrl ? (
                                <div className="text-center max-w-sm mx-auto p-6 border border-white/10 rounded-2xl bg-surface/50">
                                    <div className="w-16 h-16 bg-brand-purple/20 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Video className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Turn Image into Video</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Use Google Veo to animate your selected product image into a cinematic commercial.
                                    </p>
                                    <Button 
                                        onClick={handleGenerateVideo}
                                        isLoading={videoStatus === GenerationStatus.GENERATING_VIDEO}
                                        className="w-full"
                                    >
                                        {videoStatus === GenerationStatus.GENERATING_VIDEO ? 'Generating...' : 'Generate Video Ad'}
                                    </Button>
                                    
                                    {videoStatus === GenerationStatus.ERROR && (
                                        <p className="text-red-400 text-xs mt-3">Generation failed. Please try again.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full max-w-sm mx-auto relative group">
                                     <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20 relative">
                                         <video 
                                            ref={videoRef}
                                            src={generatedVideoUrl}
                                            className="w-full h-full object-cover"
                                            controls
                                            autoPlay
                                            loop
                                         />
                                         {/* Simple overlays if needed, but Veo video usually speaks for itself */}
                                     </div>
                                     <div className="flex gap-3 mt-4 justify-center">
                                         <Button size="sm" onClick={() => window.open(generatedVideoUrl, '_blank')}>
                                            <Download className="w-4 h-4 mr-2" /> Download
                                         </Button>
                                         <Button size="sm" variant="outline" onClick={() => setGeneratedVideoUrl(null)}>
                                            Generate New
                                         </Button>
                                     </div>
                                </div>
                            )}
                        </div>
                    )}
                 </div>
            </div>

        </div>
    </div>
  );
};

function RefreshCw(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
    )
}